
FROM ghcr.io/pnpm/pnpm:11
RUN pnpm runtime set node 22 -g

RUN apt-get update && apt-get install -y python3 g++ make

WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN mkdir -p ./app/proto
RUN pnpm install --frozen-lockfile

COPY . ./
RUN pnpm run proto
RUN pnpm run build

CMD ["pnpm", ".output/server/index.mjs"]
EXPOSE 3000/tcp
