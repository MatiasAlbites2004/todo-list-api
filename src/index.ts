import express from "express";
import cors from "cors";
import todoRoutes from "./routes/todo.routes";
import authRoutes from "./routes/auth.routes";
import { config } from "./config/config";

const app = express();

app.use(
  cors({
    origin: "*",
  })
);

app.use(express.json());

app.use("/todos", todoRoutes);
app.use("/auth", authRoutes);

app.listen(config.port, () => {
  console.log(` Server running on http://localhost:${config.port}`);
});
