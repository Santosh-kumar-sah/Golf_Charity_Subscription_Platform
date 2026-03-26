import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { authRoutes } from "./routes/authRoutes.js";
import { errorMiddleware } from "./middleware/errorMiddleware.js";
import { scoreRoutes } from "./routes/scoreRoutes.js";
import { adminRoutes } from "./routes/drawRoutes.js";
import { adminUserRoutes } from "./routes/adminUserRoutes.js";
import { adminCharityRoutes } from "./routes/adminCharityRoutes.js";
import {userRoutes} from "./routes/userRoutes.js";
import { winnerRoutes } from "./routes/winnerRoutes.js";
import { subscriptionRouter } from "./routes/subscriptionRoutes.js";
import { reportRoutes } from "./routes/reportRoutes.js";
dotenv.config();

const app = express();

app.use(cors({
  origin:  process.env.FRONTEND_URL, // frontend
  credentials: true
}));

// app.use(cors());

app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/scores", scoreRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/admin", adminUserRoutes);
app.use("/api/v1/admin", adminCharityRoutes);

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/winner", winnerRoutes);

app.use("/api/v1/subscriptions", subscriptionRouter);

app.use("/api/v1/admin/reports", reportRoutes);

app.use(errorMiddleware);
export { app };