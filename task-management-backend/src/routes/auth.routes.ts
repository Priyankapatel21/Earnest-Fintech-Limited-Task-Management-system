import { Router } from "express";
import { register, login, refresh, logout, googleAuth , forgotPassword, resetPassword} from "../controllers/auth.controller";
import { protect } from "../middlewares/auth.middleware";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refresh); 
router.post("/google", googleAuth);
router.post("/logout", protect, logout);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;