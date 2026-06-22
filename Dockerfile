FROM node:24-slim AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME/bin:$PATH"
RUN corepack enable
RUN apt-get update && apt-get install -y python3 g++ make protobuf-compiler

FROM base AS prod

WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install

COPY . ./
RUN mkdir -p ./app/proto
RUN pnpm run proto
RUN pnpm run build

FROM base
COPY --from=prod /app/node_modules /app/node_modules
COPY --from=prod /app/.output /app/.output
EXPOSE 3000
CMD ["pnpm", "/app/.output/server/index.mjs"]
