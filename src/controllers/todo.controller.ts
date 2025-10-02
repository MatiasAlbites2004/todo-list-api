import { Request, Response } from "express";
import * as todoService from "../services/todo.service";
import { StatusCodes } from "http-status-codes";
import { createTodoSchema } from "../schemas/todo.schema";
import { AuthRequest } from "../middlewares/auth.middleware";

export const getToDos = async (req: Request, res: Response) => {
  try {
    const todos = await todoService.getAllTodos();
    res.status(StatusCodes.OK).json(todos);
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Error fetching todos" });
  }
};

export const createToDo = async (req: AuthRequest, res: Response) => {
  try {
    const validatedData = createTodoSchema.parse(req.body);

    const userId = req.user!.id;

    const todo = await todoService.createTodo({ ...validatedData, userId });

    res.status(StatusCodes.CREATED).json(todo);
  } catch (error: any) {
    if (error.name === "ZodError") {
      return res.status(StatusCodes.BAD_REQUEST).json({ errors: error.errors });
    }
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Error creating To-Do" });
  }
};
