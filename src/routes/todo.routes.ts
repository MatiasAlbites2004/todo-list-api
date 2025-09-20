import { Router } from "express";
import * as todoController from "../controllers/todo.controller";

const router = Router();

router.get("/to-do", todoController.getToDos);
router.post("/to-do", todoController.createToDo);

export default router;
