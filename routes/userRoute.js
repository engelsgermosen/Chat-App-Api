import { Router } from "express";
import {
  GetAll,
  GetNonFriends,
  GetFriends,
  DeleteFriends,
} from "../controllers/userController.js";

const UserRoute = Router();

UserRoute.get("/", GetAll);
UserRoute.get("/:id/nofriends", GetNonFriends);
UserRoute.get("/:id/friends", GetFriends);
UserRoute.delete("/:id/friend", DeleteFriends);

export default UserRoute;
