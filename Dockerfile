
FROM oven/bun:latest AS build

RUN apt-get update && apt-get install -y python3 g++ make

WORKDIR /app
COPY package.json package-lock.json ./
RUN mkdir -p ./app/proto
RUN bun install

COPY . ./
RUN bun run proto
RUN bun run build

CMD ["bun", "run", "start"]
EXPOSE 3000/tcp
