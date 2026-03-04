import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middlewares/error.middleware";
import authRoutes from "./routes/auth.routes";
import taskRoutes from "./routes/task.routes";
import helmet from "helmet";

export const app = express();

app.use(helmet({
  crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
  crossOriginResourcePolicy: { policy: "cross-origin" },
}));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

app.use(cors({ origin: "https://synctask-web.vercel.app", credentials: true }));

app.use(express.json());
app.use(cookieParser());

app.use("/auth", authRoutes);
app.use("/tasks", taskRoutes);

app.get("/", (req, res) => {
  res.send("API Running");
});

app.use(errorHandler);

export default app;