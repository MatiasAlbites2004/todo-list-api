import express from "express";
import cors from "cors";
import todoRoutes from "./routes/todo.routes";
import authRoutes from "./routes/auth.routes";
import { config } from "./config/config";

const app = express();

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));


app.use(express.json());

app.use("/todos", todoRoutes);
app.use("/auth", authRoutes);

app.listen(config.port, "0.0.0.0", () => {
  console.log(` Server running on http://3.145.4.227:${config.port}`);
});
