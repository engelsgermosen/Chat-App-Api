import mongoose from "mongoose";
import FriendShip from "../models/FriendShip.js";
import { instance } from "../socket.js";
import User from "../models/User.js";

export const AddFriend = async (req, res) => {
  try {
    const { userId1, userId2 } = req.body;

    const myId1 = new mongoose.Types.ObjectId(userId1);
    const myId2 = new mongoose.Types.ObjectId(userId2);

    const fs = await FriendShip.insertOne({
      user1: myId1,
      user2: myId2,
    });

    const user1 = await User.findOne({ _id: userId1 });
    const user2 = await User.findOne({ _id: userId2 });

    const io = instance;
    io.to(user1._id.toString()).emit("friendAdded", {
      _id: user2._id,
      name: user2.name,
      email: user2.email,
      avatar: user2.avatar,
    });
    io.to(user2._id.toString()).emit("friendAdded", {
      _id: user1._id,
      name: user1.name,
      email: user1.email,
      avatar: user1.avatar,
    });

    return res.status(201).json({ success: true });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error interno al agregar amigo",
    });
  }
};
