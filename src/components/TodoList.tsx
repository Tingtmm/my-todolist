import { Todo, UpdateTodoRequest } from '@/lib/types'
import TodoItem from './TodoItem'

interface TodoListProps {
  todos: Todo[]
  onToggleTodo: (id: number) => Promise<void>
  onUpdateTodo: (id: number, updates: UpdateTodoRequest) => Promise<void>
  onDeleteTodo: (id: number) => Promise<void>
}

export default function TodoList({ todos, onToggleTodo, onUpdateTodo, onDeleteTodo }: TodoListProps) {
  if (todos.length === 0) {
    return (
      <div className="task-list">
        <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
          暂无任务
        </div>
      </div>
    )
  }

  return (
    <div className="task-list">
      <ul>
        {todos.map(todo => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={onToggleTodo}
            onUpdate={onUpdateTodo}
            onDelete={onDeleteTodo}
          />
        ))}
      </ul>
    </div>
  )
} 