
FROM oven/bun:1.3.0-debian AS build

RUN apt-get update && apt-get install -y python3 g++ make

WORKDIR /app
COPY package.json bun.lock ./
RUN mkdir -p ./app/proto
RUN bun install

COPY . ./
RUN bun run proto
RUN bun run build

CMD ["bun", ".output/server/index.mjs"]
EXPOSE 3000/tcp
