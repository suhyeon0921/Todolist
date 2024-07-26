import { GraphQLError } from 'graphql';
import { Task } from '@prisma/client';
import { TaskCount } from '../types/task';
import { taskRepository } from '../repositories/task.repository';

class TaskService {
  private static instance: TaskService;

  private constructor() {}

  public static getInstance(): TaskService {
    if (!TaskService.instance) {
      TaskService.instance = new TaskService();
    }
    return TaskService.instance;
  }

  /** 태스크 전체 조회 */
  public async getTasks(userId: number): Promise<Task[]> {
    return taskRepository.findTasksByUserId(userId);
  }

  /** 태스크 개수 조회 */
  public async getTaskCount(userId: number): Promise<TaskCount> {
    const completedTaskCount = await taskRepository.countTasksByUserId(
      userId,
      true
    );
    const totalTaskCount = await taskRepository.countTasksByUserId(userId);

    return { completedTaskCount, totalTaskCount };
  }

  /** 태스크 조회 */
  public async findTask(id: number, userId: number): Promise<Task> {
    const task = await taskRepository.findTaskByIdAndUserId(id, userId);

    if (!task) {
      throw new GraphQLError('태스크를 찾을 수 없거나 작성한 유저가 아닙니다.');
    }

    return task;
  }

  /** 태스크 생성 */
  public async createTask(content: string, userId: number): Promise<Task> {
    return taskRepository.createTask({
      content,
      userId: Number(userId),
    });
  }

  /** 태스크 업데이트 */
  public async updateTask(
    id: number,
    content: string,
    userId: number
  ): Promise<Task> {
    await this.findTask(id, userId);

    return taskRepository.updateTask(id, { content: content });
  }

  /** 태스크 삭제 */
  public async deleteTask(id: number, userId: number): Promise<Task> {
    await this.findTask(id, userId);

    return taskRepository.updateTask(id, { deletedAt: new Date() });
  }

  /** 태스크 완료 */
  public async completeTask(id: number, userId: number): Promise<Task> {
    await this.findTask(id, userId);

    return taskRepository.updateTask(id, { isDone: true });
  }

  /** 태스크 완료 취소 */
  public async uncompleteTask(id: number, userId: number): Promise<Task> {
    await this.findTask(id, userId);

    return taskRepository.updateTask(id, { isDone: false });
  }
}

export const taskService = TaskService.getInstance();
