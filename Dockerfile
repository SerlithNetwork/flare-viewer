
FROM oven/bun:latest AS build

WORKDIR /app
COPY package.json package-lock.json ./
RUN bun install

COPY . ./
RUN bun run build

CMD ["bun", "run", "start"]
EXPOSE 3000/tcp
