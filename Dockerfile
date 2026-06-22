FROM oven/bun:1-debian AS build

RUN apt-get update && apt-get install -y python3 g++ make protobuf-compiler

WORKDIR /app
COPY package.json bun.lock ./
RUN mkdir -p ./app/proto
RUN bun install --frozen-lockfile --production

COPY . ./
RUN bun run proto
RUN bun run build

EXPOSE 3000
CMD ["bun", ".output/server/index.mjs"]
