// socket.js
/**
 * @param {import("socket.io").Server} io
 */
import ChatMessage from "./models/ChatMessage.js";

export let instance;
export function configureSockets(io) {
  instance = io;
  io.on("connection", (socket) => {
    console.log("🟢 Cliente conectado:", socket.id);

    socket.on("joinRoom", ({ room }) => {
      if (!room) {
        console.warn(`joinRoom sin room válido de ${socket.id}`);
        return;
      }
      socket.join(room);
      console.log(`Socket ${socket.id} se unió a la sala ${room}`);
    });

    // 2) (Opcional) salir de la sala
    socket.on("leaveRoom", ({ room }) => {
      socket.leave(room);
      console.log(`Socket ${socket.id} salió de la sala ${room}`);
    });

    socket.on("chatMessage", async ({ room, message }) => {
      try {
        // Guardar en BD
        const msgDoc = await ChatMessage.create({
          room,
          from: message.from,
          to: message.to,
          text: message.text,
        });

        // Enviar a todos los sockets en esa sala
        socket.to(room).emit("chatMessage", msgDoc);
      } catch (err) {
        console.error("Error guardando mensaje:", err);
      }
    });

    socket.on("disconnect", (reason) => {
      console.log("🔴 Cliente desconectado:", socket.id, reason);
    });
  });
}
