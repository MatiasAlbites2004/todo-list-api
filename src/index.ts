import express from "express";
import todoRoutes from "./routes/todo.routes";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(todoRoutes);

app.listen(PORT, () => {
    console.log(` Server running on http://localhost:${PORT}`);
});
