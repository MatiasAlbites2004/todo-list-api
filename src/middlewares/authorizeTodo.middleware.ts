import { Request, Response, NextFunction } from "express";
import * as todoService from "../services/todo.service";
import { AuthRequest } from "./auth.middleware";
import { StatusCodes } from "http-status-codes";

export const authorizeTodo = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const todoId = Number(req.params.id);
    const userId = req.user!.id;

    const todo = await todoService.getTodoById(todoId);

    if (!todo) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: "ToDo not found" });
    }

    if (todo.userId !== userId) {
      return res
        .status(StatusCodes.FORBIDDEN)
        .json({ error: "You are not authorized to modify this ToDo" });
    }

    next();
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Authorization error" });
  }
};
