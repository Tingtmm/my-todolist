import { useState } from 'react'
import { Edit, Trash2, Check, X } from 'lucide-react'
import { Todo, UpdateTodoRequest } from '@/lib/types'

interface TodoItemProps {
  todo: Todo
  onToggle: (id: number) => Promise<void>
  onUpdate: (id: number, updates: UpdateTodoRequest) => Promise<void>
  onDelete: (id: number) => Promise<void>
}

export default function TodoItem({ todo, onToggle, onUpdate, onDelete }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState(todo.text)

  const formatDate = (date: Date) => {
    return `创建于 ${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`
  }

  const handleEdit = () => {
    setIsEditing(true)
    setEditText(todo.text)
  }

  const handleSave = async () => {
    if (editText.trim() === '') {
      setEditText(todo.text)
      setIsEditing(false)
      return
    }

    await onUpdate(todo.id, { text: editText.trim() })
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditText(todo.text)
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave()
    } else if (e.key === 'Escape') {
      handleCancel()
    }
  }

  return (
    <li className="task">
      <div className="task-main">
        <button 
          className={`check-btn ${todo.completed ? 'done' : ''}`}
          onClick={() => onToggle(todo.id)}
        />
        
        {isEditing ? (
          <input
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onKeyDown={handleKeyDown}
            className="edit-input"
            autoFocus
          />
        ) : (
          <span className={`task-text ${todo.completed ? 'done' : ''}`}>
            {todo.text}
          </span>
        )}
        
        <div className={`operation-area ${isEditing ? 'editing' : ''}`}>
          {isEditing ? (
            <>
              <button onClick={handleSave}>
                <Check size={16} />
              </button>
              <button onClick={handleCancel}>
                <X size={16} />
              </button>
            </>
          ) : (
            <>
              <button onClick={handleEdit}>
                <Edit size={16} />
              </button>
              <button onClick={() => onDelete(todo.id)}>
                <Trash2 size={16} />
              </button>
            </>
          )}
        </div>
      </div>
      <div className="task-time">
        {formatDate(todo.createdAt)}
      </div>
    </li>
  )
} 