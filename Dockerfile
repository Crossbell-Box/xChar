##### BASE
FROM node:20-bullseye-slim as base

RUN apt-get update || : && apt-get install python3 build-essential git -y

RUN npm i -g pnpm

##### DEPS
FROM base as deps

WORKDIR /app

ADD package.json pnpm-lock.yaml* ./

RUN pnpm i

##### BUILD
FROM deps as build

WORKDIR /app

COPY . .
COPY --from=deps /app/node_modules ./node_modules

ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV production
ENV BUILD_STEP=1
RUN pnpm build

##### FINAL
FROM base

ENV NODE_ENV=production
WORKDIR /app

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/next.config.js ./next.config.js

CMD ["pnpm", "start"]
