import express from "express";
import cors from "cors";
import { checkJwt } from "./middleware/checkJwt.js";
import helloRoute from "./routes/hello.js";
import dotenv from "dotenv";

dotenv.config(); // <-- load .env variables

const app = express();
app.use(cors());

app.use("/hello", checkJwt, helloRoute);

const PORT = process.env.BACKEND_PORT || 3001;
app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
