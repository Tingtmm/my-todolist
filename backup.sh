#!/bin/bash

# 数据库备份脚本
BACKUP_DIR="./backups"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="todolist_backup_${DATE}.sql"

echo "🗄️ 开始备份数据库..."

# 创建备份目录
mkdir -p $BACKUP_DIR

# 执行备份
docker exec todolist-db pg_dump -U todolist -d todolist > "$BACKUP_DIR/$BACKUP_FILE"

if [ $? -eq 0 ]; then
    echo "✅ 备份成功: $BACKUP_DIR/$BACKUP_FILE"
    
    # 压缩备份文件
    gzip "$BACKUP_DIR/$BACKUP_FILE"
    echo "📦 备份文件已压缩: $BACKUP_DIR/$BACKUP_FILE.gz"
    
    # 删除7天前的备份文件
    find $BACKUP_DIR -name "todolist_backup_*.sql.gz" -mtime +7 -delete
    echo "🧹 已清理7天前的备份文件"
    
    # 显示当前备份文件
    echo "📋 当前备份文件:"
    ls -lh $BACKUP_DIR/*.gz 2>/dev/null || echo "暂无备份文件"
else
    echo "❌ 备份失败"
    exit 1
fi 