import {
  completeTask,
  createTask,
  deleteTask,
  getTaskCount,
  getTasks,
  uncompleteTask,
  updateTask,
} from '../services/task.service';

const taskResolvers = {
  Query: {
    tasks: async (_parent: any, args: any, context: any) => {
      return getTasks(context, Number(args.userId));
    },
    taskCount: async (_parent: any, args: any, context: any) => {
      return getTaskCount(context, Number(args.userId));
    },
  },

  Mutation: {
    createTask: async (_parent: any, args: any, context: any) => {
      return createTask(context, args);
    },
    updateTask: async (_parent: any, args: any, context: any) => {
      return updateTask(context, args);
    },
    deleteTask: async (_parent: any, args: any, context: any) => {
      return deleteTask(context, args);
    },
    completeTask: async (_parent: any, args: any, context: any) => {
      return completeTask(context, args);
    },
    uncompleteTask: async (_parent: any, args: any, context: any) => {
      return uncompleteTask(context, args);
    },
  },
};

export default taskResolvers;
