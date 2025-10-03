# Hướng dẫn Docker cho dự án Quản lý nhân viên

## 📋 Yêu cầu hệ thống

- Docker Desktop đã được cài đặt
- Docker Compose đã được cài đặt (thường đi kèm với Docker Desktop)

## 🚀 Cách chạy dự án với Docker

### 1. Clone và chuẩn bị dự án

```bash
# Di chuyển vào thư mục dự án
cd Quan-li-nhan-vien

# Tạo file .env cho backend (nếu chưa có)
cp backend/.env.example backend/.env
```

### 2. Chạy toàn bộ ứng dụng với Docker Compose

```bash
# Build và chạy tất cả services
docker-compose up --build

# Hoặc chạy ở background
docker-compose up --build -d
```

### 3. Truy cập ứng dụng

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:4000
- **MongoDB**: localhost:27017

## 🛠️ Các lệnh Docker hữu ích

### Quản lý containers

```bash
# Xem trạng thái containers
docker-compose ps

# Dừng tất cả services
docker-compose down

# Dừng và xóa volumes (cẩn thận - sẽ mất data)
docker-compose down -v

# Xem logs
docker-compose logs
docker-compose logs backend
docker-compose logs frontend
docker-compose logs mongodb
```

### Build riêng lẻ từng service

```bash
# Build chỉ backend
docker-compose build backend

# Build chỉ frontend
docker-compose build frontend

# Rebuild và restart một service
docker-compose up --build backend
```

### Debug và troubleshooting

```bash
# Vào trong container backend
docker-compose exec backend sh

# Vào trong container frontend
docker-compose exec frontend sh

# Vào trong MongoDB container
docker-compose exec mongodb mongosh
```

## 🔧 Cấu hình Environment Variables

### Backend (.env)

```env
NODE_ENV=production
PORT=4000
MONGO_URI=mongodb://admin:password123@mongodb:27017/employee_management?authSource=admin
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

### Frontend

Environment variables được cấu hình trong docker-compose.yml:

```yaml
environment:
  - NODE_ENV=production
  - NEXT_PUBLIC_API_URL=http://localhost:4000
```

## 📁 Cấu trúc Docker Files

```
Quan-li-nhan-vien/
├── docker-compose.yml          # Orchestrate tất cả services
├── backend/
│   ├── Dockerfile              # Build backend container
│   └── .dockerignore           # Ignore files khi build
├── frontend/
│   ├── Dockerfile              # Build frontend container
│   └── .dockerignore           # Ignore files khi build
└── mongodb-init/               # MongoDB initialization scripts (optional)
```

## 🐛 Troubleshooting

### Lỗi thường gặp:

1. **Port đã được sử dụng**

   ```bash
   # Kiểm tra port đang sử dụng
   netstat -tulpn | grep :3000
   netstat -tulpn | grep :4000

   # Thay đổi port trong docker-compose.yml nếu cần
   ```

2. **MongoDB connection failed**

   ```bash
   # Kiểm tra MongoDB container
   docker-compose logs mongodb

   # Restart MongoDB
   docker-compose restart mongodb
   ```

3. **Build failed**

   ```bash
   # Xóa cache và build lại
   docker-compose build --no-cache
   ```

4. **Permission denied**
   ```bash
   # Fix permissions (Linux/Mac)
   sudo chown -R $USER:$USER .
   ```

## 🔄 Development vs Production

### Development mode

```bash
# Chạy với hot reload (cần mount volumes)
docker-compose -f docker-compose.dev.yml up
```

### Production mode

```bash
# Chạy production build
docker-compose up --build
```

## 📊 Monitoring

```bash
# Xem resource usage
docker stats

# Xem logs real-time
docker-compose logs -f

# Health check
curl http://localhost:4000/
curl http://localhost:3000/
```

## 🧹 Cleanup

```bash
# Xóa tất cả containers, networks, images
docker-compose down --rmi all --volumes --remove-orphans

# Xóa unused Docker resources
docker system prune -a
```
