import express from "express";
import { getUploadSignature, deleteCloudinaryImage } from "../controllers/coudinary.controller.js";

const router = express.Router();

router.get("/signature",  getUploadSignature);
router.post("/delete", deleteCloudinaryImage);

export default router;