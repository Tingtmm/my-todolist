import { useState, useEffect, useCallback } from 'react'
import { Todo, TodoStats, CreateTodoRequest, UpdateTodoRequest } from '@/lib/types'

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 获取统计信息
  const getStats = useCallback((): TodoStats => {
    const total = todos.length
    const completed = todos.filter(todo => todo.completed).length
    const pending = total - completed
    return { total, pending, completed }
  }, [todos])

  // 获取所有待办事项
  const fetchTodos = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('/api/todos')
      if (!response.ok) {
        throw new Error('Failed to fetch todos')
      }
      const data = await response.json()
      setTodos(data.map((todo: Todo) => ({
        ...todo,
        createdAt: new Date(todo.createdAt),
        updatedAt: new Date(todo.updatedAt)
      })))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }, [])

  // 添加待办事项
  const addTodo = useCallback(async (text: string) => {
    try {
      const request: CreateTodoRequest = { text }
      const response = await fetch('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request)
      })
      
      if (!response.ok) {
        throw new Error('Failed to create todo')
      }
      
      const newTodo = await response.json()
      setTodos(prev => [{
        ...newTodo,
        createdAt: new Date(newTodo.createdAt),
        updatedAt: new Date(newTodo.updatedAt)
      }, ...prev])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    }
  }, [])

  // 更新待办事项
  const updateTodo = useCallback(async (id: number, updates: UpdateTodoRequest) => {
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      })
      
      if (!response.ok) {
        throw new Error('Failed to update todo')
      }
      
      const updatedTodo = await response.json()
      setTodos(prev => prev.map(todo => 
        todo.id === id 
          ? {
              ...updatedTodo,
              createdAt: new Date(updatedTodo.createdAt),
              updatedAt: new Date(updatedTodo.updatedAt)
            }
          : todo
      ))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    }
  }, [])

  // 删除待办事项
  const deleteTodo = useCallback(async (id: number) => {
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) {
        throw new Error('Failed to delete todo')
      }
      
      setTodos(prev => prev.filter(todo => todo.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    }
  }, [])

  // 切换完成状态
  const toggleTodo = useCallback(async (id: number) => {
    const todo = todos.find(t => t.id === id)
    if (todo) {
      await updateTodo(id, { completed: !todo.completed })
    }
  }, [todos, updateTodo])

  useEffect(() => {
    fetchTodos()
  }, [fetchTodos])

  return {
    todos,
    loading,
    error,
    stats: getStats(),
    addTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
    refetch: fetchTodos
  }
}