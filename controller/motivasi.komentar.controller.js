import { validationResult } from "express-validator";
import Motivasi from "../model/motivasi.model.js";
import KomentarMotivasi from "../model/motivasi.komentar.model.js";
import User from "../model/user.model.js";

export const postKomentarDiPostinganMotivasi = async (req, res) => {
    const {idmotivasi, iduser} = req.query;
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ status: false, message: 'Provide complete user info to add.', errors: errors.array() });
        }

        const {komentar} = req.body;

        if (!idmotivasi || !iduser || !komentar){
            return res.status(400).json({ status: false, message: 'Provide complete user info to add.' });
        }
        
        const motivasi = await Motivasi.findByPk(idmotivasi);
        if (!motivasi){
            return res.status(404).json({status: false, message: 'Postingan tidak ditemukan'});
        }

        const user = await User.findByPk(iduser);
        if (!user) {
            return res.status(404).json({ status: false, message: 'User tidak ditemukan' });
        }

        const komentarBaru = await KomentarMotivasi.create({
            iduser,
            idmotivasi,
            komentar
        });

        return res.status(201).json({status: true, message: 'Komentar berhasil ditambahkan', data: {
            komentar: {
                id: komentarBaru.id,
                iduser: komentarBaru.iduser,
                idmotivasi: komentarBaru.idmotivasi,
                komentar: komentarBaru.komentar
            },
            pengguna: {
                iduser : user.id,
                nama: user.nama,
                avatar_link: user.avatar_link
            }
        }})
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server Error' }); // Menangani error server
    }
}

export const getKomentarDiPostinganMotivasi = async (req, res) => {
    const { idmotivasi } = req.query;
    try {
        // Validasi idmotivasi
        if (!idmotivasi) {
            return res.status(400).json({ status: false, message: 'ID motivasi is required.' });
        }

        // Mencari postingan motivasi
        const motivasi = await Motivasi.findByPk(idmotivasi);
        if (!motivasi) {
            return res.status(404).json({ status: false, message: 'Postingan tidak ditemukan' });
        }

        // Mencari semua komentar yang terkait dengan motivasi
        const komentarList = await KomentarMotivasi.findAll({
            where: { idmotivasi },
            attributes: {
                exclude: ['iduser']
            },
            include: {
                model: User,
                as: 'user',
                attributes: ['iduser', 'nama', 'avatar_link'], 
            },
            order: [['updatedAt', 'DESC']]
        });

        if (komentarList.length === 0) {
            return res.status(404).json({ status: false, message: 'Tidak ada komentar untuk postingan ini' });
        }

        return res.status(200).json({
            status: true,
            message: 'Komentar berhasil diambil',
            data: komentarList
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server Error' }); // Menangani error server
    }
};

export const deleteKomentar = async (req, res) => {
    const { iduser, idkomentar } = req.query;

    try {
        // Validasi input
        if (!iduser || !idkomentar) {
            return res.status(400).json({
                status: false,
                message: "ID user dan ID komentar harus disertakan.",
            });
        }

        // Cari komentar berdasarkan ID
        const komentar = await KomentarMotivasi.findByPk(idkomentar);

        if (!komentar) {
            return res.status(404).json({
                status: false,
                message: "Komentar tidak ditemukan.",
            });
        }

        // Validasi bahwa komentar dibuat oleh pengguna yang sesuai
        if (komentar.iduser != iduser) {
            return res.status(401).json({
                status: false,
                message: "Unauthorized. Anda tidak memiliki izin untuk menghapus komentar ini.",
            });
        }

        // Hapus komentar
        await komentar.destroy();

        return res.status(200).json({
            status: true,
            message: "Komentar berhasil dihapus.",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: false,
            message: "Terjadi kesalahan pada server.",
        });
    }
};

export const updateKomentar = async (req, res) => {
    const { iduser, idkomentar } = req.query;
    const { isi_komentar } = req.body;

    try {
        // Validasi input
        if (!iduser || !idkomentar || !isi_komentar) {
            return res.status(400).json({
                status: false,
                message: "ID user, ID komentar, dan isi komentar harus disertakan.",
            });
        }

        // Cari komentar berdasarkan ID
        const komentar = await KomentarMotivasi.findByPk(idkomentar);

        if (!komentar) {
            return res.status(404).json({
                status: false,
                message: "Komentar tidak ditemukan.",
            });
        }

        // Validasi bahwa komentar dibuat oleh pengguna yang sesuai
        if (komentar.iduser != iduser) {
            return res.status(401).json({
                status: false,
                message: "Unauthorized. Anda tidak memiliki izin untuk memperbarui komentar ini.",
            });
        }

        // Perbarui isi komentar
        komentar.komentar = isi_komentar;
        await komentar.save();

        return res.status(200).json({
            status: true,
            message: "Komentar berhasil diperbarui.",
            data: {
                id: komentar.id,
                iduser: komentar.iduser,
                idmotivasi: komentar.idmotivasi,
                komentar: komentar.komentar,
                updatedAt: komentar.updatedAt,
            },
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: false,
            message: "Terjadi kesalahan pada server.",
        });
    }
};
    