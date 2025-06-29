import express from "express";
import { getMe, logIn, logOut, signUp } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.post("/sign_up", signUp);
router.post("/log_in", logIn);
router.post("/log_out", logOut);
router.get("/get_me",protectRoute, getMe);

export default router;

