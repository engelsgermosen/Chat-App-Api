import { Router } from "express";
import { AddFriend } from "../controllers/friendShipController.js";

const FriendShipRoute = Router();

FriendShipRoute.post("/", AddFriend);

export default FriendShipRoute;
