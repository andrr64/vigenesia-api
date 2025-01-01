import e from "express";
import { deleteKomentar, getKomentarDiPostinganMotivasi, postKomentarDiPostinganMotivasi, updateKomentar } from "../controller/motivasi.komentar.controller.js";

const router = e.Router();

router.post('/', postKomentarDiPostinganMotivasi);
router.get('/', getKomentarDiPostinganMotivasi);
router.delete('/', deleteKomentar);
router.put('/', updateKomentar);

export default router;