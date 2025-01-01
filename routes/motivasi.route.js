import express from "express"
import { deleteMotivasi, getMotivasi, postMotivasi, updateMotivasi } from "../controller/motivasi.controller.js";
import multer from 'multer';

const upload = multer({ limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB

const router = express.Router();

router.post('/', upload.single('gambar'), postMotivasi);
router.put('/', upload.single('gambar'), updateMotivasi);
router.get('/', getMotivasi);
router.delete('/', deleteMotivasi);

export default router;