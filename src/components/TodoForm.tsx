import { useState, useRef, useEffect } from 'react'
import { Plus } from 'lucide-react'

interface TodoFormProps {
  onAddTodo: (text: string) => Promise<void>
}

export default function TodoForm({ onAddTodo }: TodoFormProps) {
  const [text, setText] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showError, setShowError] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = async () => {
    if (text.trim() === '') {
      setShowError(true)
      inputRef.current?.focus()
      // 3秒后自动清除错误状态
      setTimeout(() => {
        setShowError(false)
      }, 3000)
      return
    }

    setShowError(false)
    setIsSubmitting(true)
    try {
      await onAddTodo(text.trim())
      setText('')
      // 保持输入框焦点
      setTimeout(() => {
        inputRef.current?.focus()
      }, 0)
    } catch (error) {
      console.error('Failed to add todo:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // 当用户开始输入时清除错误状态
  useEffect(() => {
    if (text.trim() !== '' && showError) {
      setShowError(false)
    }
  }, [text, showError])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit()
    }
  }

  return (
    <div className="search">
      <div className="input-container">
        <input
          ref={inputRef}
          type="text"
          placeholder="添加新任务..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isSubmitting}
          className={showError ? 'error' : ''}
        />
        {showError && (
          <div className="error-message">
            请输入任务内容
          </div>
        )}
      </div>
      <button 
        className="button" 
        onClick={handleSubmit}
        disabled={isSubmitting}
      >
        <Plus size={16} />
        <span>{isSubmitting ? '添加中...' : '添加'}</span>
      </button>
    </div>
  )
}