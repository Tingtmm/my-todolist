#!/bin/sh

echo "🚀 启动 Todo List 应用..."

# 等待数据库启动
echo "⏳ 等待数据库连接..."
until nc -z postgres 5432; do
  echo "等待 PostgreSQL 启动..."
  sleep 2
done

echo "✅ 数据库连接成功"

# 运行数据库迁移
echo "🔄 运行数据库迁移..."
npx prisma db push

echo "✅ 数据库迁移完成"

# 启动应用
echo "🎯 启动 Next.js 应用..."
exec node server.js 