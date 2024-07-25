import { GraphQLError } from 'graphql';
import { Task } from '@prisma/client';
import {
  countTasksByUserId,
  createTask as createTaskInRepository,
  findTaskByIdAndUserId,
  findTasksByUserId,
  updateTask as updateTaskInRepository,
} from '../repositories/task.repository';
import { TaskCount } from '../types/task';

/** 태스크 전체 조회 */
export const getTasks = async (userId: number): Promise<Task[]> => {
  return findTasksByUserId(userId);
};

/** 태스크 개수 조회 */
export const getTaskCount = async (userId: number): Promise<TaskCount> => {
  const completedTaskCount = await countTasksByUserId(userId, true);
  const totalTaskCount = await countTasksByUserId(userId);

  return { completedTaskCount, totalTaskCount };
};

/** 태스크 조회 */
const findTask = async (id: number, userId: number): Promise<Task> => {
  const task = await findTaskByIdAndUserId(id, userId);

  if (!task) {
    throw new GraphQLError('태스크를 찾을 수 없거나 작성한 유저가 아닙니다.');
  }

  return task;
};

/** 태스크 생성 */
export const createTask = async (
  content: string,
  userId: number
): Promise<Task> => {
  return createTaskInRepository({
    content,
    userId: Number(userId),
  });
};

/** 태스크 업데이트 */
export const updateTask = async (
  id: number,
  content: string,
  userId: number
): Promise<Task> => {
  await findTask(Number(id), Number(userId));

  return updateTaskInRepository(Number(id), { content: content });
};

/** 태스크 삭제 */
export const deleteTask = async (id: number, userId: number): Promise<Task> => {
  await findTask(Number(id), Number(userId));

  return updateTaskInRepository(Number(id), { deletedAt: new Date() });
};

/** 태스크 완료 */
export const completeTask = async (
  id: number,
  userId: number
): Promise<Task> => {
  await findTask(Number(id), Number(userId));

  return updateTaskInRepository(Number(id), { isDone: true });
};

/** 태스크 완료 취소 */
export const uncompleteTask = async (
  id: number,
  userId: number
): Promise<Task> => {
  await findTask(Number(id), Number(userId));

  return updateTaskInRepository(Number(id), { isDone: false });
};
