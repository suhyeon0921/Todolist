export interface CreateTaskInput {
  content: string;
}

export interface UpdateTaskInput {
  id: number;
  content: string;
}

export interface TaskId {
  id: number;
}
