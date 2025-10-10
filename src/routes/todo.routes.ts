import express from "express";
import {
  getToDos,
  createToDo,
  updateToDo,
  deleteToDo,
} from "../controllers/todo.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = express.Router();

router.use(authenticate);

router.get("/", getToDos);

router.post("/", createToDo);

router.put("/:id", updateToDo);

router.delete("/:id", deleteToDo);

export default router;
