import prisma from "../../prisma/client";

export const getAllTodosByUser = async (userId: number) => {
  return await prisma.toDo.findMany({
    where: { userId },
    select: {
      id: true,
      title: true,
      description: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

export const createTodo = async (data: {
  title: string;
  description?: string;
  userId: number;
}) => {
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

export const getTodoById = async (id: number) => {
  return await prisma.toDo.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      description: true,
      userId: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

export const updateTodo = async (
  id: number,
  data: { title?: string; description?: string }
) => {
  return await prisma.toDo.update({
    where: { id },
    data: {
      title: data.title,
      description: data.description,
      updatedAt: new Date(),
    },
  });
};

export const deleteTodo = async (id: number) => {
  return await prisma.toDo.delete({
    where: { id },
  });
};
