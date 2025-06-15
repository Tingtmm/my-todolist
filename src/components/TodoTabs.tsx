import { TodoStatus, TodoStats } from '@/lib/types'

interface TodoTabsProps {
  activeTab: TodoStatus
  onTabChange: (tab: TodoStatus) => void
  stats: TodoStats
}

export default function TodoTabs({ activeTab, onTabChange, stats }: TodoTabsProps) {
  return (
    <div className="tab-list">
      <div className="box">
        <button 
          className={`all-list item ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => onTabChange('all')}
        >
          全部 <span>{stats.total}</span>
        </button>
        <button 
          className={`pending-list item ${activeTab === 'pending' ? 'active' : ''}`}
          onClick={() => onTabChange('pending')}
        >
          待完成 <span>{stats.pending}</span>
        </button>
        <button 
          className={`completed-list item ${activeTab === 'completed' ? 'active' : ''}`}
          onClick={() => onTabChange('completed')}
        >
          已完成 <span>{stats.completed}</span>
        </button>
      </div>
    </div>
  )
}