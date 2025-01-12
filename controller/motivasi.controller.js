import { where } from "sequelize";
import Motivasi from "../model/motivasi.model.js";
import User from "../model/user.model.js";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

export const postMotivasi = async (req, res) => {
  const storage = getStorage();
  try {
    const gambar = req.file;
    const { iduser, isi_motivasi } = req.body;

    if (!iduser || !isi_motivasi) {
      return res.status(400).json({
        status: false,
        message: "Semua data wajib diisi.",
      });
    }

    let fileUrl = null;

    // **Kondisi 1: Ada file gambar**
    if (gambar) {
      const fileRef = ref(
        storage,
        `vigenesia/motivasi/${Date.now()}-${gambar.originalname}`
      );
      const uploadResult = await uploadBytes(fileRef, gambar.buffer);
      fileUrl = await getDownloadURL(uploadResult.ref);
    }

    // Simpan data ke database
    const motivasi = await Motivasi.create({
      iduser,
      isi_motivasi,
      link_gambar: fileUrl, // Bisa null jika tidak ada gambar
      tanggal_input: new Date().toISOString(),
      tanggal_update: new Date().toISOString(),
    });

    res.status(201).json({
      status: true,
      message: "Motivasi berhasil diunggah.",
      data: motivasi,
    });
  } catch (error) {
    console.error("Error:", error);

    // Hapus file jika terjadi kesalahan
    if (req.file) {
      const fileRef = ref(storage, `vigenesia/motivasi/${req.file.filename}`);
      await deleteObject(fileRef).catch((err) => {
        console.error("Gagal menghapus file:", err);
      });
    }

    res.status(500).json({
      status: false,
      message: "Terjadi kesalahan, silakan coba lagi.",
    });
  }
};

export const getMotivasi = async (req, res) => {
  const { iduser, tanggal_input } = req.query;

  try {
    // Ambil data motivasi berdasarkan filter
    const motivasiData = await Motivasi.findAll({
      where: {
        ...(iduser && { iduser }), // Filter berdasarkan iduser jika ada
        ...(tanggal_input && { tanggal_input }), // Filter berdasarkan tanggal_input jika ada
      },
      order: [["tanggal_input", "DESC"]], // Urutkan berdasarkan tanggal_input terbaru
    });

    if (motivasiData.length > 0) {
      // Ambil data user secara manual
      const userIds = [
        ...new Set(motivasiData.map((motivasi) => motivasi.iduser)),
      ]; // Ambil iduser unik
      const users = await User.findAll({
        where: {
          iduser: userIds,
        },
        attributes: [
          "iduser",
          "nama",
          "avatar_link",
          "email",
          "profesi",
          "is_active",
          "created",
          "updated",
        ], // Kolom yang diperlukan
      });

      // Buat mapping iduser ke data user
      const userMap = users.reduce((map, user) => {
        map[user.iduser] = user; // Pemetaan iduser ke user
        return map;
      }, {});

      // Gabungkan data motivasi dengan user
      const result = motivasiData.map((motivasi) => {
        const motivasiObj = motivasi.toJSON();
        motivasiObj.user = userMap[motivasi.iduser] || null; // Tambahkan data user jika ada
        return motivasiObj;
      });

      return res.status(200).json({
        status: true,
        message: "Data berhasil diambil",
        data: result,
      });
    } else {
      return res.status(404).json({ message: "No data found" }); // Jika tidak ada data
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" }); // Menangani error server
  }
};

export const updateMotivasi = async (req, res) => {
  const clientIp = req.ip; // Dapatkan IP klien

  const { iduser, idmotivasi } = req.query;
  const { isi_motivasi, link_gambar } = req.body;
  const gambar = req.file;
  const storage = getStorage();

  try {
    const motivasi = await Motivasi.findOne({
      where: { id: idmotivasi, iduser: iduser },
    });
    if (!motivasi) {
      return res.status(404).json({
        status: false,
        message: "Data tidak ditemukan",
      });
    }

    if (gambar) {
      const fileRef = ref(
        storage,
        `vigenesia/motivasi/${Date.now()}-${gambar.originalname}`
      );
      const uploadResult = await uploadBytes(fileRef, gambar.buffer);
      const fileUrl = await getDownloadURL(uploadResult.ref);
      try {
        if (motivasi.link_gambar?.length > 0) {
          const oldFileRef = ref(storage, motivasi.link_gambar);
          await deleteObject(oldFileRef);
        }
      } catch (_) {

      } finally {
        motivasi.link_gambar = fileUrl;
      }
    } else if (link_gambar === "") {
      try {
        const oldFileRef = ref(storage, motivasi.link_gambar);
        await deleteObject(oldFileRef);
        console.log(`File lama '${motivasi.link_gambar}' berhasil dihapus.`);
      } catch (error) {
        console.log(`Exception: ${error}`);
      } finally {
        motivasi.link_gambar = "";
      }
    }

    motivasi.isi_motivasi = isi_motivasi;
    await motivasi.save();

    // Ambil data user terkait
    const user = await User.findOne({
      where: { iduser: iduser },
      attributes: [
        "iduser",
        "nama",
        "avatar_link",
        "email",
        "profesi",
        "is_active",
        "created",
        "updated",
      ],
    });

    // Bentuk respons dengan struktur seperti getMotivasi
    const result = {
      ...motivasi.toJSON(),
      user: user || null, // Tambahkan data user jika ada
    };

    return res.status(200).json({
      status: true,
      message: "Data berhasil diperbaharui",
      data: result,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
      status: false,
    });
  }
};

export const deleteMotivasi = async (req, res) => {
  const { idmotivasi, iduser } = req.query;

  try {
    if (!idmotivasi || !iduser) {
      return res.status(400).json({
        status: false,
        message: "idmotivasi dan iduser harus disertakan.",
      });
    }

    // Cari motivasi berdasarkan idmotivasi
    const motivasi = await Motivasi.findOne({
      where: { id: idmotivasi },
    });

    if (!motivasi) {
      return res.status(404).json({
        status: false,
        message: "Motivasi tidak ditemukan.",
      });
    }

    // Cek apakah iduser yang meminta sesuai dengan iduser di motivasi
    if (motivasi.iduser !== parseInt(iduser)) {
      return res.status(403).json({
        status: false,
        message: "Anda tidak berhak menghapus motivasi ini.",
      });
    }

    // Jika ada gambar, hapus file dari Firebase Storage
    if (motivasi.link_gambar) {
      const storage = getStorage();
      const fileRef = ref(
        storage,
        `motivasi/${motivasi.link_gambar.split("/").pop()}`
      );
      await deleteObject(fileRef).catch((err) => {
        console.error("Gagal menghapus file:", err);
      });
    }

    // Hapus motivasi dari database
    await motivasi.destroy();

    res.status(200).json({
      status: true,
      message: "Motivasi berhasil dihapus.",
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      status: false,
      message: "Terjadi kesalahan, silakan coba lagi.",
    });
  }
};
