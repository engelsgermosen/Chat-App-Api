import { Router } from "express";
import {
  GetAll,
  GetNonFriends,
  GetFriends,
  DeleteFriends,
  getProfile,
  updateProfile,
} from "../controllers/userController.js";

const UserRoute = Router();

UserRoute.get("/", GetAll);
UserRoute.get("/:id/nofriends", GetNonFriends);
UserRoute.get("/:id/friends", GetFriends);
UserRoute.delete("/:id/friend", DeleteFriends);
UserRoute.get("/:id/perfil", getProfile);
UserRoute.put("/:id/perfil", updateProfile);

export default UserRoute;
