FROM node:18-alpine

# Install pnpm and nodemon
RUN npm install -g pnpm nodemon

WORKDIR /app

# Copy only lockfile and manifest
COPY pnpm-lock.yaml package.json ./

# Install all deps including devDependencies
RUN pnpm install

# Copy the rest of the code (will be overridden by volume in docker-compose)
COPY . .

# Expose backend port
EXPOSE 3000

# Start with nodemon for hot reload
CMD ["nodemon", "src/index.ts"]
