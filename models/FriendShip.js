// models/FriendShip.js
import { Schema, model } from "mongoose";

const FriendShipSchema = new Schema(
  {
    user1: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    user2: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false }, // solo createdAt
  }
);

// Índice único para evitar duplicados (amistad bidireccional)
FriendShipSchema.index({ user1: 1, user2: 1 }, { unique: true });

const FriendShip = model("FriendShip", FriendShipSchema);
export default FriendShip;
