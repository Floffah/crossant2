FROM oven/bun

WORKDIR /usr/src/app

COPY --from=node:18 /usr/local/bin/node /usr/local/bin/node
COPY ./packages ./packages
COPY ./apps ./apps
COPY ./package.json ./
COPY ./bun.lockb ./
COPY ./.env ./
RUN bun install

ENV NODE_ENV production

WORKDIR /usr/src/app/packages/database

RUN mv /usr/src/app/.env /usr/src/app/packages/database/.env
RUN bunx prisma migrate deploy
RUN bunx prisma generate --no-engine

WORKDIR /usr/src/app/apps/bot

CMD [ "bun", "start" ]
