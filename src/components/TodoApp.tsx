'use client'

import { useState } from 'react'
import { useTodos } from '@/hooks/useTodos'
import { TodoStatus } from '@/lib/types'
import TodoTabs from './TodoTabs'
import TodoList from './TodoList'
import TodoForm from './TodoForm'

export default function TodoApp() {
  const { todos, loading, error, stats, addTodo, updateTodo, deleteTodo, toggleTodo } = useTodos()
  const [activeTab, setActiveTab] = useState<TodoStatus>('all')

  const filteredTodos = todos.filter(todo => {
    switch (activeTab) {
      case 'pending':
        return !todo.completed
      case 'completed':
        return todo.completed
      default:
        return true
    }
  })

  if (loading) {
    return (
      <div className="container">
        <div className="header">
          <h1>我的任务清单</h1>
        </div>
        <div className="tip">
          <p>加载中...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container">
        <div className="header">
          <h1>我的任务清单</h1>
        </div>
        <div className="tip">
          <p style={{ color: 'red' }}>错误: {error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      {/* 1.标题栏 */}
      <div className="header">
        <h1>我的任务清单</h1>
      </div>
      
      {/* 2.提醒事项 */}
      <div className="tip">
        <p>高效管理您的日常任务</p>
      </div>
      
      {/* 3.搜索栏 */}
      <TodoForm onAddTodo={addTodo} />
      
      {/* 4.选项查看栏 */}
      <TodoTabs 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        stats={stats}
      />
      
      {/* 5.任务列表 */}
      <TodoList 
        todos={filteredTodos}
        onToggleTodo={toggleTodo}
        onUpdateTodo={updateTodo}
        onDeleteTodo={deleteTodo}
      />
    </div>
  )
} 