import { Request, Response } from "express";
import prisma from "../prisma/client";

export const getToDos = async (req: Request, res: Response) => {
  try {
    const todos = await prisma.toDo.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    res.json(todos);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener To-Dos" });
  }
};
