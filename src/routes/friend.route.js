import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { acceptRequestMakeFriend, checkIsFriend, sendRequestMakeFriend } from "../controllers/friend.controller.js";

const router = express.Router();

router.post("/checkFriend/:id", protectRoute, checkIsFriend);
router.post("/sendRequestMakeFriend/:id", protectRoute, sendRequestMakeFriend);
router.post("/acceptRequestMakeFriend/:id", protectRoute, acceptRequestMakeFriend);

export default router