import { Task } from '@prisma/client';
import { Context } from '../context';
import { CreateTaskInput, TaskId, UpdateTaskInput } from '../dto/task.dto';
import { TaskCount } from '../types/task';
import { taskService } from '../services/task.service';

const taskResolvers = {
  Query: {
    tasks: async (_: any, __: any, context: Context): Promise<Task[]> => {
      return taskService.getTasks(context.user.userId);
    },
    taskCount: async (
      _: any,
      __: any,
      context: Context
    ): Promise<TaskCount> => {
      return taskService.getTaskCount(context.user.userId);
    },
  },

  Mutation: {
    createTask: async (
      _: any,
      args: CreateTaskInput,
      context: Context
    ): Promise<Task> => {
      return taskService.createTask(args.content, context.user.userId);
    },
    updateTask: async (
      _: any,
      args: UpdateTaskInput,
      context: Context
    ): Promise<Task> => {
      return taskService.updateTask(args.id, args.content, context.user.userId);
    },
    deleteTask: async (
      _: any,
      args: TaskId,
      context: Context
    ): Promise<Task> => {
      return taskService.deleteTask(args.id, context.user.userId);
    },
    completeTask: async (
      _: any,
      args: TaskId,
      context: Context
    ): Promise<Task> => {
      return taskService.completeTask(args.id, context.user.userId);
    },
    uncompleteTask: async (
      _: any,
      args: TaskId,
      context: Context
    ): Promise<Task> => {
      return taskService.uncompleteTask(args.id, context.user.userId);
    },
  },
};

export default taskResolvers;
