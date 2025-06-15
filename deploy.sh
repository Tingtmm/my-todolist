#!/bin/bash

echo "🚀 开始部署 Todo List 应用到 NAS..."

# 检查 Docker 和 Docker Compose 是否安装
if ! command -v docker &> /dev/null; then
    echo "❌ Docker 未安装，请先安装 Docker"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose 未安装，请先安装 Docker Compose"
    exit 1
fi

# 停止现有容器
echo "📦 停止现有容器..."
docker-compose down

# 清理旧镜像（可选）
echo "🧹 清理旧镜像..."
docker image prune -f

# 构建并启动服务
echo "🔨 构建并启动服务..."
docker-compose up -d --build

# 等待服务启动
echo "⏳ 等待服务启动..."
sleep 10

# 检查服务状态
echo "🔍 检查服务状态..."
docker-compose ps

# 检查健康状态
echo "❤️ 检查应用健康状态..."
sleep 5
curl -f http://localhost:6017/api/health || echo "⚠️ 健康检查失败，请检查日志"

echo "✅ 部署完成！"
echo "🌐 应用访问地址: http://你的NAS-IP:6017"
echo "📊 查看日志: docker-compose logs -f"
echo "🛑 停止服务: docker-compose down" 