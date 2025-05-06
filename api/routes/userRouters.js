import express from "express";
import { userControllers } from "../controllers/userControllers.js";
import { authUser } from "../../middlewares/auth.js";
const router = express.Router();

router.post("/auth/register", userControllers.register);
router.post("/auth/cookie/login", userControllers.login);
router.post("/auth/logout", userControllers.logout);
router.get("/public-profile/:userId", userControllers.publicProfile);
router.get("/auth/profile", authUser, userControllers.getProfile);

export default router;
