import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { acceptRequestMakeFriend, checkIsFriend, denyRequestMakeFriend, sendRequestMakeFriend } from "../controllers/friend.controller.js";

const router = express.Router();

router.post("/checkFriend/:id", protectRoute, checkIsFriend);
router.post("/sendRequestMakeFriend/:id", protectRoute, sendRequestMakeFriend);
router.post("/acceptRequestMakeFriend/:id", protectRoute, acceptRequestMakeFriend);
router.post("/denyRequestMakeFriend/:id", protectRoute, denyRequestMakeFriend);

export default router