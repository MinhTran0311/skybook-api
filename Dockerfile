# Stage 1: Development dependencies
FROM node:20-alpine AS development

# Create app directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev dependencies)
RUN npm ci

# Copy the rest of the application
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the application
RUN npm run build

# Stage 2: Production dependencies
FROM node:20-alpine AS production-deps

WORKDIR /usr/src/app

COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy Prisma schema
COPY prisma ./prisma/

# Generate Prisma client
RUN npx prisma generate

# Stage 3: Production build
FROM node:20-alpine AS production

# Set NODE_ENV
ENV NODE_ENV=production

WORKDIR /usr/src/app

# Copy production dependencies
COPY --from=production-deps /usr/src/app/node_modules ./node_modules
COPY --from=production-deps /usr/src/app/prisma ./prisma

# Copy built application
COPY --from=development /usr/src/app/dist ./dist
COPY --from=development /usr/src/app/package*.json ./

# Expose port
EXPOSE 3000

# Command to run the application
CMD ["node", "dist/main"] 