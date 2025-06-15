# Todo List 应用 NAS 部署指南

## 🎯 部署要求

- Docker (版本 20.10+)
- Docker Compose (版本 2.0+)
- 至少 1GB 可用内存
- 至少 2GB 可用磁盘空间

## 🚀 快速部署

### 1. 上传文件到 NAS

将整个 `todolist-nextjs` 文件夹上传到你的 NAS 上。

### 2. 登录 NAS 并进入目录

```bash
cd /path/to/todolist-nextjs
```

### 3. 运行部署脚本

```bash
./deploy.sh
```

### 4. 访问应用

打开浏览器访问: `http://你的NAS-IP:6017`

## 🔧 手动部署步骤

如果自动部署脚本有问题，可以手动执行：

```bash
# 1. 构建并启动服务
docker-compose up -d --build

# 2. 检查服务状态
docker-compose ps

# 3. 查看日志
docker-compose logs -f
```

## 📊 运维命令

### 查看服务状态

```bash
docker-compose ps
```

### 查看实时日志

```bash
docker-compose logs -f
docker-compose logs -f todolist-app  # 只看应用日志
docker-compose logs -f todolist-db   # 只看数据库日志
```

### 重启服务

```bash
docker-compose restart
```

### 停止服务

```bash
docker-compose down
```

### 完全重新部署

```bash
docker-compose down
docker-compose up -d --build
```

## 💾 数据备份

### 自动备份

```bash
./backup.sh
```

### 手动备份

```bash
docker exec todolist-db pg_dump -U todolist -d todolist > backup.sql
```

### 恢复备份

```bash
# 停止应用
docker-compose stop todolist-app

# 恢复数据库
docker exec -i todolist-db psql -U todolist -d todolist < backup.sql

# 重启应用
docker-compose start todolist-app
```

## 🔒 安全建议

1. **修改默认密码**: 在生产环境中修改 `docker-compose.yml` 中的数据库密码
2. **网络访问控制**: 在 NAS 防火墙中只开放必要的端口 (6017)
3. **定期备份**: 建议设置定时任务定期执行 `backup.sh`
4. **定期更新**: 定期拉取最新代码并重新部署

## 🛠️ 故障排除

### 应用无法访问

1. 检查容器状态: `docker-compose ps`
2. 查看应用日志: `docker-compose logs todolist-app`
3. 检查端口占用: `netstat -tuln | grep 6017`

### 数据库连接失败

1. 检查数据库容器: `docker-compose logs todolist-db`
2. 检查数据库健康状态: `docker exec todolist-db pg_isready -U todolist`

### 内存不足

1. 查看容器资源使用: `docker stats`
2. 如果内存不足，可以在 `docker-compose.yml` 中降低资源限制

### 重置数据

```bash
# ⚠️ 警告：这会删除所有数据
docker-compose down -v
docker-compose up -d --build
```

## 📝 配置说明

- **端口**: 6017 (可在 docker-compose.yml 中修改)
- **数据持久化**: PostgreSQL 数据存储在 Docker volume 中
- **备份目录**: `./backups/`
- **日志**: 使用 `docker-compose logs` 查看

## 🔄 更新应用

1. 停止当前服务

```bash
docker-compose down
```

2. 拉取最新代码 (如果从 Git 仓库)

```bash
git pull
```

3. 重新构建并启动

```bash
docker-compose up -d --build
```

## 📞 技术支持

如果遇到问题，请检查：

1. Docker 和 Docker Compose 版本
2. 系统资源是否充足
3. 网络端口是否被占用
4. 日志文件中的错误信息
