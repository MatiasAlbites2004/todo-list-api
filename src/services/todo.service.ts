import prisma from "../prisma/client";

export const getAllTodos = async () => {
  return await prisma.toDo.findMany({
    select: {
      title: true,
      description: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

export const createTodo = async (data: { title: string; description?: string }) => {
  return await prisma.toDo.create({
    data: {
      title: data.title,
      description: data.description, 
    },
  });
};
