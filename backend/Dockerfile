# Sử dụng Node.js 18 Alpine image (nhẹ và bảo mật)
FROM node:18-alpine

# Tạo thư mục làm việc
WORKDIR /app

# Copy package.json và package-lock.json trước để tận dụng Docker cache
COPY package*.json ./

# Cài đặt dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Tạo user không phải root để bảo mật
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Chuyển ownership cho user nodejs
RUN chown -R nodejs:nodejs /app
USER nodejs

# Expose port
EXPOSE 4000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:4000/', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Start the application
CMD ["node", "server.js"]
