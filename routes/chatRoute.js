// routes/chatRoutes.js
import { Router } from "express";
import ChatMessage from "../models/ChatMessage.js";

const ChatRouter = Router();

/**
 * GET /api/chat/:room/history
 * Devuelve el historial de mensajes ordenado por fecha ascendente
 */
ChatRouter.get("/:room/history", async (req, res) => {
  try {
    const { room } = req.params;
    const messages = await ChatMessage.find({ room })
      .sort({ createdAt: 1 })
      .lean();
    return res.status(200).json({
      success: true,
      data: messages,
    });
  } catch (err) {
    console.error("Error al obtener historial de chat:", err);
    return res.status(500).json({ success: false, message: "Error interno" });
  }
});

export default ChatRouter;
