import prisma from "../../prisma/client";

export const getAllTodos = async () => {
  return await prisma.toDo.findMany({
    select: {
      id: true,
      title: true,
      description: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

export const createTodo = async (data: { title: string; description?: string; userId: number }) => {
  return await prisma.toDo.create({
    data: {
      title: data.title,
      description: data.description,
      user: {
        connect: { id: data.userId },
      },
    },
  });
};
