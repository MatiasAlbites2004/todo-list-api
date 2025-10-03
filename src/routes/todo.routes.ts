import express from "express";
import { getToDos, createToDo } from "../controllers/todo.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = express.Router();

router.get("/", authenticate, getToDos);   
router.post("/", authenticate, createToDo); 

export default router;
