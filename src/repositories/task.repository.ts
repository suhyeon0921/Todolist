import { PrismaClient, Task } from '@prisma/client';

const prisma = new PrismaClient();

export const findTasksByUserId = async (userId: number): Promise<Task[]> => {
  return prisma.task.findMany({
    where: { userId, deletedAt: null },
    include: { user: true },
  });
};

export const countTasksByUserId = async (
  userId: number,
  isDone?: boolean
): Promise<Number> => {
  return prisma.task.count({
    where: { userId, isDone, deletedAt: null },
  });
};

export const findTaskByIdAndUserId = async (
  id: number,
  userId: number
): Promise<Task | null> => {
  return prisma.task.findFirst({
    where: { id, userId, deletedAt: null },
  });
};

export const createTask = async (data: {
  content: string;
  userId: number;
}): Promise<Task> => {
  return prisma.task.create({
    data,
  });
};

export const updateTask = async (
  id: number,
  data: { content?: string; isDone?: boolean; deletedAt?: Date }
): Promise<Task> => {
  return prisma.task.update({
    where: { id },
    data,
    include: { user: true },
  });
};
