import express from "express"
import { getUserData, userLogin, userRegister, userUpdate_avatar, userUpdate_data } from "../controller/user.controller.js";
import multer from 'multer';


const router = express.Router();
const upload = multer({ limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB

router.get('/', getUserData);
router.post('/register', userRegister)
router.post('/login', userLogin)
router.put('/update/avatar', upload.single('avatar'), userUpdate_avatar);
router.put('/update/data', upload.single('avatar'), userUpdate_data);

export default router;