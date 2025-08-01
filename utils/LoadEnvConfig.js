import path from "path";
import { projectRoot } from "./helpers/path.js";
import dotenv from "dotenv";

const envPath = path.join(projectRoot, ".env");
dotenv.config({ path: envPath });
