import { Task } from '@prisma/client';
import { prisma } from '../../prisma/prisma';

class TaskRepository {
  private static instance: TaskRepository;

  private constructor() {}

  public static getInstance(): TaskRepository {
    if (!TaskRepository.instance) {
      TaskRepository.instance = new TaskRepository();
    }
    return TaskRepository.instance;
  }

  public async findTasksByUserId(userId: number): Promise<Task[]> {
    return prisma.task.findMany({
      where: { userId, deletedAt: null },
      include: { user: true },
      orderBy: {
        id: 'desc',
      },
    });
  }

  public async countTasksByUserId(
    userId: number,
    isDone?: boolean
  ): Promise<Number> {
    return prisma.task.count({
      where: { userId, isDone, deletedAt: null },
    });
  }

  public async findTaskByIdAndUserId(
    id: number,
    userId: number
  ): Promise<Task | null> {
    return prisma.task.findFirst({
      where: { id, userId, deletedAt: null },
    });
  }

  public async createTask(data: {
    content: string;
    userId: number;
  }): Promise<Task> {
    return prisma.task.create({
      data,
    });
  }

  public async updateTask(
    id: number,
    data: { content?: string; isDone?: boolean; deletedAt?: Date }
  ): Promise<Task> {
    return prisma.task.update({
      where: { id },
      data,
      include: { user: true },
    });
  }
}

export const taskRepository = TaskRepository.getInstance();
