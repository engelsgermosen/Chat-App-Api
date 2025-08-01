import "./utils/LoadEnvConfig.js";
import "./utils/DbConnection.js";
import express from "express";
import morgan from "morgan";
import { projectRoot } from "./utils/helpers/path.js";
import AuthRouter from "./routes/authRoute.js";
import FriendShipRoute from "./routes/friendShipRoute.js";
import UserRoute from "./routes/userRoute.js";
import ChatRouter from "./routes/chatRoute.js";
import path from "path";
import { ValidateToken } from "./middlewares/jwt.js";
import cors from "cors";
import multer from "multer";
import { userImage } from "./utils/helpers/multerStorages.js";
import { Server } from "socket.io";
import { configureSockets } from "./socket.js";

const app = express();

app.set("port", process.env.PORT || 3000);

//middleares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded());
app.use(express.static(path.join(projectRoot, "public")));
app.use(morgan("dev"));

//Config multer
app.use(
  multer({
    storage: userImage,
  }).single("avatar")
);

//routes
app.use("/api/auth", AuthRouter);
app.use("/api/user", ValidateToken, UserRoute);
app.use("/api/friendShip", ValidateToken, FriendShipRoute);
app.use("/api/chat", ValidateToken, ChatRouter);

//Listening port
const server = app.listen(app.get("port"), () => {
  console.log(`Server runing in port: ${app.get("port")}`);
});

//Create webSocketServer
const io = new Server(server, {
  path: "/socket.io",
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

//Delegate the work os webSockets
configureSockets(io);
