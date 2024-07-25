import {
  completeTask,
  createTask,
  deleteTask,
  getTaskCount,
  getTasks,
  uncompleteTask,
  updateTask,
} from '../services/task.service';
import { Context } from '../context';
import { CreateTaskInput, TaskId, UpdateTaskInput } from '../dto/task.dto';
import { Task } from '@prisma/client';
import { TaskCount } from '../types/task';

const taskResolvers = {
  Query: {
    tasks: async (_: any, __: any, context: Context): Promise<Task[]> => {
      return getTasks(context.user.userId);
    },
    taskCount: async (
      _: any,
      __: any,
      context: Context
    ): Promise<TaskCount> => {
      return getTaskCount(context.user.userId);
    },
  },

  Mutation: {
    createTask: async (
      _: any,
      args: CreateTaskInput,
      context: Context
    ): Promise<Task> => {
      return createTask(args.content, context.user.userId);
    },
    updateTask: async (
      _: any,
      args: UpdateTaskInput,
      context: Context
    ): Promise<Task> => {
      return updateTask(args.id, args.content, context.user.userId);
    },
    deleteTask: async (
      _: any,
      args: TaskId,
      context: Context
    ): Promise<Task> => {
      return deleteTask(args.id, context.user.userId);
    },
    completeTask: async (
      _: any,
      args: TaskId,
      context: Context
    ): Promise<Task> => {
      return completeTask(args.id, context.user.userId);
    },
    uncompleteTask: async (
      _: any,
      args: TaskId,
      context: Context
    ): Promise<Task> => {
      return uncompleteTask(args.id, context.user.userId);
    },
  },
};

export default taskResolvers;
