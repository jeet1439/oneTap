import express from "express";
import { getMe, getUserById, updateProfile, updateBleId, addFeaturedPhoto, deleteFeaturedPhoto, searchUsers, getRecommendedUsers, deleteAccount, getProfileStats,
} from "../controllers/user.controller.js";

import { verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();



router.get("/me", verifyToken, getMe);
router.get("/me/stats", verifyToken, getProfileStats);

router.get("/:id", verifyToken, getUserById);

router.put("/profile", verifyToken, updateProfile);

router.put("/ble-id", verifyToken, updateBleId);

router.delete("/", verifyToken, deleteAccount);


router.post("/photos", verifyToken, addFeaturedPhoto);

router.delete("/photos/:photoId", verifyToken, deleteFeaturedPhoto);


router.get("/search", verifyToken, searchUsers);

router.get("/recommended", verifyToken, getRecommendedUsers);

export default router;