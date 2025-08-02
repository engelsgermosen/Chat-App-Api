import User from "../models/User.js";
import FriendShip from "../models/FriendShip.js";
import mongoose from "mongoose";
import { instance } from "../socket.js";
import fs from "fs";
import path from "path";
import { projectRoot } from "../utils/helpers/path.js";

export const GetAll = async (req, res) => {
  const response = await User.find();

  if (response.length == 0) {
    return res.status(204).json({ success: true, message: "No users" });
  }

  return res.status(200).json({
    success: true,
    message: "Show users",
    data: response,
    count: response.length,
  });
};

export const GetNonFriends = async (req, res) => {
  try {
    const myId = new mongoose.Types.ObjectId(req.params.id);

    // 1) Recupera tus relaciones
    const rels = await FriendShip.find({
      $or: [{ user1: myId }, { user2: myId }],
    }).lean();
    // 2) Extrae los IDs de tus amigos
    const friendIds = rels.map((r) =>
      r.user1.equals(myId) ? r.user2 : r.user1
    );

    // 3) Busca usuarios que NO estén en friendIds ni sean tú
    const nonFriends = await User.find({
      _id: { $nin: [...friendIds, myId] },
    });

    return res.status(200).json({
      success: true,
      message: "Personas que no son amigos",
      data: nonFriends,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error interno" });
  }
};

export const GetFriends = async (req, res) => {
  try {
    // 1) Convierte tu parámetro a ObjectId
    const myId = new mongoose.Types.ObjectId(req.params.id);

    // 2) Recupera todas las relaciones en las que participas
    const rels = await FriendShip.find({
      $or: [{ user1: myId }, { user2: myId }],
    }).lean();

    // 3) Extrae los IDs de tus amigos
    const friendIds = rels.map((r) =>
      r.user1.equals(myId) ? r.user2 : r.user1
    );

    // 4) Busca usuarios cuyos _id esten EN friendIds
    const friends = await User.find({
      _id: { $in: friendIds },
    }).lean();

    // 5) Responde con la lista de amigos
    return res.status(200).json({
      success: true,
      message: "Lista de mis amigos",
      data: friends,
    });
  } catch (error) {
    console.error("Error en GetFriends:", error);
    return res.status(500).json({
      success: false,
      message: "Error interno al obtener amigos",
    });
  }
};

export const DeleteFriends = async (req, res) => {
  try {
    // 1) Convierte tu parámetro a ObjectId
    const myId = new mongoose.Types.ObjectId(req.params.id);

    console.log(myId);

    const fs = await FriendShip.findOneAndDelete({
      $or: [{ user1: myId }, { user2: myId }],
    }).lean();

    const user1 = fs.user1.toString();
    const user2 = fs.user2.toString();
    console.log(user1);
    const io = instance;
    io.to(user1).emit("friendDeleted", { friendId: user2 });
    io.to(user2).emit("friendDeleted", { friendId: user1 });

    console.log(user1);

    // 5) Responde con la lista de amigos
    return res.status(204).json({
      success: true,
      message: "Eliminado",
    });
  } catch (error) {
    console.error("Error en GetFriends:", error);
    return res.status(500).json({
      success: false,
      message: "Error interno al obtener amigos",
    });
  }
};

export const getProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select("name email avatar").lean();
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Usuario no encontrado" });
    }
    return res.json({ success: true, data: user });
  } catch (err) {
    console.error("Error en getProfile:", err);
    return res.status(500).json({ success: false, message: "Error interno" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, password, avatarImg } = req.body;
    const updates = { name };

    // Si envían nueva password, la hasheamos
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updates.password = await bcrypt.hash(password, salt);
    }

    let img = "";
    const oldImage = avatarImg;
    console.log(oldImage);
    // Si subieron avatar, multer habrá puesto req.file
    if (req.file) {
      const mImage = req.file;
      const avatar = "/" + path.relative("public", mImage.path);
      const pathDelete = path.join(projectRoot, "public", oldImage);
      await fs.unlink(pathDelete, (err) => {
        if (err) console.log("Error deleting a image: " + err.message);
      });
      updates.avatar = avatar;
    } else {
      updates.avatar = oldImage;
    }

    const user = await User.findByIdAndUpdate(id, updates, { new: true })
      .select("name email avatar")
      .lean();

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Usuario no encontrado" });
    }

    return res.json({ success: true, data: user });
  } catch (err) {
    console.error("Error en updateProfile:", err);
    return res.status(500).json({ success: false, message: "Error interno" });
  }
};
