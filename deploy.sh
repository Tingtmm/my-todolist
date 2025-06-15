#!/bin/bash

echo "🚀 开始部署 Todo List 应用到 NAS..."

# 创建必需的目录和文件
echo "📁 创建必需的目录和文件..."

# 创建backups目录
if [ ! -d "backups" ]; then
    mkdir -p backups
    echo "✅ 创建 backups 目录"
else
    echo "✅ backups 目录已存在"
fi

# 创建健康检查端点（如果不存在）
if [ ! -f "src/app/api/health/route.ts" ]; then
    mkdir -p src/app/api/health
    echo 'export async function GET() {
  return Response.json({ 
    status: "ok", 
    timestamp: new Date().toISOString(),
    message: "Todo List API is running"
  })
}' > src/app/api/health/route.ts
    echo "✅ 创建健康检查端点"
else
    echo "✅ 健康检查端点已存在"
fi

echo "📋 环境准备完成！"

# 创建必需的目录和文件
echo "📁 创建必需的目录和文件..."

# 创建backups目录
if [ ! -d "backups" ]; then
    mkdir -p backups
    echo "✅ 创建 backups 目录"
else
    echo "✅ backups 目录已存在"
fi

# 创建scripts目录（如果不存在）
if [ ! -d "scripts" ]; then
    mkdir -p scripts
    echo "✅ 创建 scripts 目录"
else
    echo "✅ scripts 目录已存在"
fi

# 创建健康检查端点（如果不存在）
if [ ! -f "src/app/api/health/route.ts" ]; then
    mkdir -p src/app/api/health
    cat > src/app/api/health/route.ts << 'EOF'
export async function GET() {
  return Response.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    message: 'Todo List API is running'
  })
}
EOF
    echo "✅ 创建健康检查端点"
else
    echo "✅ 健康检查端点已存在"
fi

# 设置正确的权限
chmod +x backup.sh 2>/dev/null || echo "⚠️ backup.sh 不存在或已有执行权限"

echo "📋 环境准备完成！"

# 检查是否有Docker权限
if ! docker ps &> /dev/null; then
    echo "⚠️ 检测到Docker权限问题，将使用sudo权限..."
    DOCKER_CMD="sudo docker"
    DOCKER_COMPOSE_CMD="sudo docker-compose"
else
    DOCKER_CMD="docker"
    DOCKER_COMPOSE_CMD="docker-compose"
fi

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
$DOCKER_COMPOSE_CMD down

# 清理旧镜像（可选）
echo "🧹 清理旧镜像..."
$DOCKER_CMD image prune -f

# 构建并启动服务
echo "🔨 构建并启动服务..."
$DOCKER_COMPOSE_CMD up -d --build

# 等待服务启动
echo "⏳ 等待服务启动..."
sleep 10

# 检查服务状态
echo "🔍 检查服务状态..."
$DOCKER_COMPOSE_CMD ps

# 检查健康状态
echo "❤️ 检查应用健康状态..."
sleep 5
curl -f http://localhost:6017/api/health || echo "⚠️ 健康检查失败，请检查日志"

echo "✅ 部署完成！"
echo "🌐 应用访问地址: http://你的NAS-IP:6017"
echo "📊 查看日志: docker-compose logs -f"
echo "🛑 停止服务: docker-compose down" 