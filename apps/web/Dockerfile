FROM node:22-alpine AS build

WORKDIR /app
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable pnpm

COPY package.json ./
COPY pnpm-lock.yaml ./
COPY apps/web/package.json ./apps/web/package.json

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

COPY . ./

RUN pnpm build

# =========================================================================== #

FROM nginx:stable-alpine
WORKDIR /app

COPY apps/web/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/apps/web/dist /usr/share/nginx/html

ENV WEB_PORT=80
ENV WEB_HOST=0.0.0.0
ENV PUBLIC_WEB_URL=http://0.0.0.0:80

EXPOSE 80
