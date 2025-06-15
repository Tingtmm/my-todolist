import { TodoStats as TodoStatsType } from '@/lib/types'

interface TodoStatsProps {
  stats: TodoStatsType
}

export default function TodoStats({ stats }: TodoStatsProps) {
  return (
    <div className="statistic">
      <div className="total item">
        总计：<span>{stats.total}</span>
      </div>
      <div className="pending item">
        待完成：<span>{stats.pending}</span>
      </div>
      <div className="completed item">
        已完成：<span>{stats.completed}</span>
      </div>
    </div>
  )
} 