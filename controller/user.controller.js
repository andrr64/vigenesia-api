import bcrypt from "bcrypt";
import { validationResult } from "express-validator"; // Untuk validasi input
import User from "../model/user.model.js";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { Op } from "sequelize";

const DEFAULT_AVATAR =
  "https://firebasestorage.googleapis.com/v0/b/andreas-web-cloud-5c228.appspot.com/o/vigenesia%2Favatar%2Fdefault-avatar.jpg?alt=media&token=f8ba79bd-de42-4e36-bad4-c59b92f857b4";

export const filterUserData = (userModel) => {
  return {
    iduser: userModel.iduser,
    nama: userModel.nama,
    email: userModel.email,
    avatar_link: userModel.avatar_link,
    is_active: userModel.is_active,
    profesi: userModel.profesi,
    created: userModel.created,
    updated: userModel.updated,
  };
};

export const userRegister = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: false,
        message: "Provide complete user info to add.",
        errors: errors.array(),
      });
    }

    const { nama, profesi, email, password } = req.body;

    // Validasi jika input tidak kosong
    if (!nama || !profesi || !email || !password) {
      return res
        .status(400)
        .json({ status: false, message: "Provide complete user info to add." });
    }

    // Cek apakah email sudah ada
    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      return res.status(400).json({
        status: false,
        message: "The given email already exists.",
      });
    }

    // Encrypt password dengan bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    // Membuat data user baru
    const newUser = await User.create({
      nama,
      profesi,
      email,
      password: hashedPassword,
      is_active: true,
      created: new Date().toISOString(),
      updated: new Date().toISOString(),
      avatar_link: DEFAULT_AVATAR,
    });

    // Mengirimkan response sukses
    return res.status(201).json({
      status: true,
      message: "The user has been added successfully.",
      data: filterUserData(newUser),
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: "Some problems occurred, please try again.",
    });
  }
};

export const getUserData = async (req, res) => {
  console.log(req);
  
  try {
    const {iduser} = req.query;
    if (!iduser){
      return res.status(402).json({
        status: false,
        message: 'ID User diperlukan'
      });
    }
    const user = await User.findByPk(iduser);
    if (!user){
      return res.status(404).json({
        status: false,
        message: 'Akun tidak ditemukan'
      });
    }
    return res.status(200).json({
      status: true,
      message: 'Sukses',
      data: filterUserData(user)
    })
  } catch (error) {
    return res.status(500).json({
      status: false,
      message:'Internal server error'
    });
  }
}

export const userLogin = async (req, res) => {
  try {
    // Mengambil data email dan password dari request body
    const { email, password } = req.body;

    // Validasi jika email dan password tidak kosong
    if (!email || !password) {
      return res.status(400).json({
        status: false,
        message: "Email dan password harus diisi.",
      });
    }

    // Cari user berdasarkan email
    const user = await User.findOne({ where: { email, is_active: true } });

    if (!user) {
      // Jika tidak ada user dengan email tersebut
      return res.status(400).json({
        status: false,
        message: "Email atau password salah.",
      });
    }

    // Verifikasi password menggunakan bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({
        status: false,
        message: "Email atau password salah.",
      });
    }

    // Jika login berhasil, kirimkan response
    return res.status(200).json({
      status: true,
      message: "User login berhasil.",
      data: filterUserData(user),
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: "Terjadi masalah, coba lagi nanti.",
    });
  }
};

export const userUpdate_avatar = async (req, res) => {
  const storage = getStorage();
  try {
    const avatar = req.file;
    const { iduser } = req.query;

    if (!iduser) {
      return res.status(400).json({
        status: false,
        message: "ID Pengguna tidak valid!",
      });
    }
    if (!avatar) {
      return res.status(400).json({
        status: false,
        message: "Avatar tidak valid!",
      });
    }
    const user = await User.findByPk(iduser);
    if (!user) {
      return res.status(404).json({
        status: false,
        message: "Data pengguna tidak ditemukan",
      });
    }
    const fileRef = ref(
      storage,
      `vigenesia/avatar/${Date.now()}-${avatar.originalname}`
    );
    const uploadResult = await uploadBytes(fileRef, avatar.buffer);
    const fileUrl = await getDownloadURL(uploadResult.ref);

    if (user.avatar_link && user.avatar_link != DEFAULT_AVATAR) {
      const oldRef = ref(storage, user.avatar_link);
      await deleteObject(oldRef);
    }

    // Update user.avatar_link with new URL
    user.avatar_link = fileUrl;
    await user.save(); // Assuming this saves the user object to the database

    res.status(200).json({
      status: true,
      data: fileUrl,
      message: "Avatar berhasil diupdate!",
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, message: "Terjadi kesalahan" });
  }
};

export const userUpdate_data = async (req, res) => {
  try {
    const storage = getStorage();
    const { iduser } = req.query;
    const { email, nama, password_konfirmasi, profesi, password_baru } = req.body;
    const avatar = req.file;

    if (!iduser) {
      return res.status(400).json({
        status: false,
        message: "ID Pengguna tidak valid!",
      });
    }

    // Validasi input
    if (!email || !nama || !password_konfirmasi || !profesi) {
      return res.status(400).json({
        status: false,
        message: "Semua field wajib diisi!",
      });
    }

    const emailUsed = await User.findOne({
      where: {
        email: email,
        iduser: {
          [Op.ne]: iduser, // `iduser` tidak sama dengan pengguna saat ini
        },
      },
    });

    if (emailUsed) {
      return res.status(409).json({
        status: false,
        message: "Email telah digunakan",
      });
    }

    const user = await User.findByPk(iduser);
    if (!user) {
      return res.status(404).json({
        status: false,
        message: "Data pengguna tidak ditemukan!",
      });
    }

    // Validasi password konfirmasi
    const isPasswordValid = await bcrypt.compare(
      password_konfirmasi,
      user.password
    );
    if (!isPasswordValid) {
      return res.status(401).json({
        status: false,
        message: "Password konfirmasi tidak valid!",
      });
    }

    // Update data pengguna
    user.email = email;
    user.nama = nama;
    user.profesi = profesi;
    user.updated = new Date().toISOString(); // Menggunakan format ISO 8601

    // Jika ada password baru, perbarui password
    if (password_baru) {
      const hashedPassword = await bcrypt.hash(password_baru, 10);
      user.password = hashedPassword;
    }
    if (avatar != null && avatar != undefined) {
      const fileRef = ref(storage, `vigenesia/avatar/${Date.now()}`);
      const uploadResult = await uploadBytes(fileRef, avatar.buffer);
      const fileUrl = await getDownloadURL(uploadResult.ref);

      if (user.avatar_link && user.avatar_link != DEFAULT_AVATAR) {
        const oldRef = ref(storage, user.avatar_link);
        await deleteObject(oldRef);
      }
      // Update user.avatar_link with new URL
      user.avatar_link = fileUrl;
    }
    await user.save(); // Menyimpan perubahan ke database

    res.status(200).json({
      status: true,
      message: "Data pengguna berhasil diperbarui!",
      data: filterUserData(user),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: false,
      message: "Terjadi kesalahan saat memperbarui data pengguna!",
    });
  }
};
