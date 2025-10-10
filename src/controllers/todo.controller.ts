import { Request, Response } from "express";
import * as todoService from "../services/todo.service";
import { StatusCodes } from "http-status-codes";
import { createTodoSchema } from "../schemas/todo.schema";
import { AuthRequest } from "../middlewares/auth.middleware";

export const getToDos = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const todos = await todoService.getAllTodosByUser(userId);

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

export const updateToDo = async (req: AuthRequest, res: Response) => {
  try {
    const todoId = Number(req.params.id);
    const userId = req.user!.id;
    const { title, description } = req.body;

    const todo = await todoService.getTodoById(todoId);
    if (!todo) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: "To-Do not found" });
    }

    if (todo.userId !== userId) {
      return res.status(StatusCodes.FORBIDDEN).json({ error: "Not authorized to update this To-Do" });
    }

    const updatedTodo = await todoService.updateTodo(todoId, { title, description });
    res.status(StatusCodes.OK).json(updatedTodo);
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Error updating To-Do" });
  }
};

export const deleteToDo = async (req: AuthRequest, res: Response) => {
  try {
    const todoId = Number(req.params.id);
    const userId = req.user!.id;

    const todo = await todoService.getTodoById(todoId);
    if (!todo) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: "To-Do not found" });
    }

    if (todo.userId !== userId) {
      return res.status(StatusCodes.FORBIDDEN).json({ error: "Not authorized to delete this To-Do" });
    }

    await todoService.deleteTodo(todoId);
    res.status(StatusCodes.NO_CONTENT).send();
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Error deleting To-Do" });
  }
};
