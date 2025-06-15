export interface Todo {
  id: number;
  text: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type TodoStatus = 'all' | 'pending' | 'completed';

export interface TodoStats {
  total: number;
  pending: number;
  completed: number;
}

export interface CreateTodoRequest {
  text: string;
}

export interface UpdateTodoRequest {
  text?: string;
  completed?: boolean;
} 