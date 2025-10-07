import express from "express";
import cors from "cors";
import todoRoutes from "./routes/todo.routes";
import authRoutes from "./routes/auth.routes";

const app = express();
const PORT = 3000;

app.use(
  cors({
    origin: "*",
  })
);

app.use(express.json());

app.use("/todos", todoRoutes);
app.use("/auth", authRoutes);

app.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
});
