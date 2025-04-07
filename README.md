<table>
  <tr>
    <td>
      <a href="https://rtstack.nktnet.uk" target="_blank">
        <img align="absmiddle" width="40" src="./apps/web/public/favicon.png">
      </a>
    </td>
    <td>
      <h1>
        <a href="https://rtstack.nktnet.uk" target="_blank">TK Stack</a>
      </h1>
    </td>
  </tr>
</table>

モダンで軽量な [turborepo](https://turbo.build/repo/docs) テンプレート  
モジュール化されたコンポーネント、共通設定、コンテナ化されたデプロイ、100% 型安全なフルスタックプロジェクト  

- [About](#about)
  - [Stack overview](#stack-overview)
  - [Base Functionalities](#base-functionalities)
  - [Inspirations & Goals](#inspirations--goals)
- [Quick Start](#quick-start)
  - [Prerequisites](#prerequisites)
  - [Setup](#setup)
  - [Using an External Database](#using-an-external-database)
- [Developing](#developing)
  - [Working with a single package](#working-with-a-single-package)
  - [Adding new shadcn components](#adding-new-shadcn-components)
  - [Adding new better-auth plugins](#adding-new-better-auth-plugins)
  - [Tooling Scripts](#tooling-scripts)
- [Containerisation (Docker/Podman)](#containerisation-dockerpodman)
- [Deployment](#deployment)
  - [Using Containers](#using-containers)
  - [Using Major Platforms](#using-major-platforms)
- [Other Notes](#other-notes)
  - [Tanstack Router](#tanstack-router)
  - [Server API Artificial Delays](#server-api-artificial-delays)
  - [Environment Variables](#environment-variables)

## About

### Stack overview

以下はスタックのすべてのコンポーネントの概要です:

```
apps
  ├─ web
  |   ├─ react (vite)
  |   ├─ tanstack (router, query, form)
  |   └─ tailwindcss
  ├─ server
  |   └─ hono (wrapper for api & auth)
packages
  ├─ api
  |   └─ trpc with valibot
  ├─ auth
  |   └─ better-auth
  ├─ db
  |   └─ drizzle-orm (postgres database)
  ├─ ui
  |   ├─ tailwindcss
  |   └─ shadcn & radix ui
tools
  ├─ eslint
  ├─ prettier
  ├─ tailwind
  └─ typescript
```

[pnpm-workspace.yaml](pnpm-workspace.yaml) ですべてのカタログ依存関係を確認できます。

### 基本的な機能

以下の機能はデフォルトで実装されています:

- ログイン/登録 (使用 [better-auth の電子メール/パスワード](https://www.better-auth.com/docs/authentication/email-password) 認証プロバイダー)
- テーマ (ダーク/ライトモード使用 [next-themes](github.com/pacocoursey/next-themes))
- web/server 統合 ([trpc](https://trpc.io/docs/quickstart) API 例: 投稿の作成/一覧表示)

[live demo](https://rtstack.nktnet.uk) でこれらの機能を確認できます。

### インスピレーションと目標

TK Stack の多くの側面は [t3-oss/create-t3-turbo](https://github.com/t3-oss/create-t3-turbo) から派生しています。ただし、以下の優先事項があります:

- [tanstack router](https://tanstack.com/router/latest) (web) + [hono](https://hono.dev) (server) instead of [nextjs](https://nextjs.org) (fullstack)
- [better auth](https://www.better-auth.com) for authentication instead [auth.js (next auth)](https://authjs.dev)
- [valibot](https://valibot.dev) for input validation instead of [zod](https://zod.dev)
- [tanstack form](https://tanstack.com/form/latest) instead of [react-hook-form](https://react-hook-form.com)
- using `.env` in each application/package instead of globally, as per [turborepo's recommendations](https://turbo.build/repo/docs/crafting-your-repository/using-environment-variables#best-practices)

このプロジェクトは、依存関係とツールの最新リリースを一貫して採用することを目指しています。例えば:

- react v19
- tailwindcss v4 & shadcn-ui (canary)
- trpc v11
- eslint v9
- pnpm v10

## Quick Start

### Prerequisites

以下のツールがシステムにインストールされていることを確認してください:

1. [node](https://nodejs.org/en/download) (バージョン 22+)
1. [pnpm](https://pnpm.io/installation) (バージョン 10+)
1. [postgres](https://www.postgresql.org) データベース, 以下のツールを使用して簡単に実行できます:
   - [docker](https://docs.docker.com/engine/install) and [docker-compose](https://docs.docker.com/compose)
   - [podman](https://podman.io/docs/installation) and [podman-compose](https://github.com/containers/podman-compose)
   - [supabase](https://supabase.com)'s free tier cloud database

### Setup

```bash
# Create a repository using the rt-stack template (replace YOUR_PROJECT)
pnpm dlx create-turbo@latest -m pnpm -e https://github.com/nktnet1/rt-stack YOUR_PROJECT

# Enter the directory or open in your IDE (replace YOUR_PROJECT)
cd YOUR_PROJECT

# Install all dependencies for apps and packages
pnpm install

# Copy .env.example to .env for all applications and the @repo/db package
pnpm env:copy-example

# Start a local postgres instance in the background (e.g. using docker)
docker compose up db --detach

# Push the drizzle schema to your database
pnpm db:push
```

すべてのアプリケーションを開始できます

```bash
pnpm dev
```

デフォルトでは以下の URL にアクセスできます:

- web アプリケーション: <http://localhost:8085>
- バックエンドサーバー: <http://localhost:3035>

### 外部データベースの使用

[supabase](https://supabase.com) などの外部 postgres データベースを使用する場合、ローカル postgres インスタンスを起動する手順をスキップできます。

代わりに、次の環境変数を変更する必要があります:

1. ファイル `apps/server/.env` の `SERVER_POSTGRES_URL`

   - used at runtime by the backend server in `pnpm dev`

1. ファイル `packages/db/.env` の `DB_POSTGRES_URL`
   - `pnpm db:push` でデータベーススキーマの移行に使用されます

## 開発

### 単一のパッケージの操作

[`pnpm --filter=<name>`](https://pnpm.io/filtering) (where `<name>` is
定義されている `package.json` の各パッケージ)。

例:

```bash
# ウェブアプリケーションの nuqs パッケージをインストールします:
pnpm --filter=web install nuqs

# Format only the ui package:
pnpm --filter=@repo/ui format
```

以下のコマンドを使用して、すべてのパッケージ名を取得できます:

```bash
find . -maxdepth 3 -name "package.json" -exec grep '"name":' {} \;
```

### Adding new shadcn components

単一の Shadcn/UI コンポーネントをインストールするには、例えば `button` を使用して次のコマンドを実行します:

```bash
pnpm ui-add button
```

引数を指定せずに TUI を使用してコンポーネントを選択することもできます:

```bash
pnpm ui-add
```

- press `i` to enter interactive mode on startup
- use `j/k` (or arrow keys) to navigate up and down.
- use `<Space>` to toggle select your desired component(s)
- hit `<Enter>` to install all selected components

### 新しい better-auth プラグインの追加

better-auth プラグインを統合する場合、例えば

- [admin](https://better-auth.vercel.app/docs/plugins/admin)
- [organization](https://better-auth.vercel.app/docs/plugins/organization)

次のようにします:

1. Modify the auth package server and client files in accordance with the plugin's
   respective documentations.

2. Run the interactive command:

   ```bash
   pnpm auth:schema:generate
   ```

   Press `i` to enter interactive mode, then `y` to overwrite [packages/db/src/schemas/auth.ts](packages/db/src/schemas/auth.ts).

3. Format and fix all linting issues, e.g. with

   ```bash
   pnpm format:fix
   pnpm lint:fix
   ```

4. Push your new schema to the database

   ```bash
   pnpm db:push
   ```

5. Occasionally, the type inference will not work immediately in your IDE (e.g. in VSCode).
   This can be resolved by running

   ```bash
   pnpm clean && pnpm install
   ```

   followed by a restarting your TS Server or reloading VSCode.

You can find an example in the [better-auth-admin-organization-plugins](https://github.com/nktnet1/rt-stack/tree/better-auth-admin-organization-plugins) branch.

### Tooling Scripts

All scripts are defined in [package.json](package.json) and
[turbo.json](turbo.json):

```bash
pnpm clean                  # remove all .cache, .turbo, dist, node_modules

pnpm typecheck              # report typescript issues

pnpm format                 # report prettier issues
pnpm format:fix             # auto-fix prettier issues

pnpm lint                   # report eslint issues
pnpm lint:fix               # auto-fix eslint issues

pnpx codemod pnpm/catalog   # migrate dependencies to pnpm-workspace.yaml
```

## Containerisation (Docker/Podman)

Both the `web` and `server` applications have been containerised. You can start
see this in action by running the commands:

```bash
# Start all applications
docker compose up --build

# Push the drizzle schema to your database. While you can use `pnpm db:push` on
# the host machine if you have installed all the required dependencies, it is
# also possible to do everything within docker alone.
# Open a second terminal and run the command:
docker compose run --build --rm drizzle

# Upon completion, you will be inside the `drizzle` docker container instead
# of the host machine. It is now possible to push the schema with:
pnpm db:push
```

You can then open the web link below in your browser:

- <http://localhost:8085>

Please note that these containers are run in production mode. For further
details, see

- [compose.yaml](compose.yaml)
- [apps/server/Dockerfile](apps/server/Dockerfile)
- [apps/web/Dockerfile](apps/web/Dockerfile)
- [apps/web/nginx.conf](apps/web/nginx.conf)

## Deployment

> [!TIP]
> The [live demo](https://rtstack.nktnet.uk) of RT Stack is currently deployed to
>
> - vercel for the web frontend
> - fly.io for the server backend and postgres database

### Using Containers

You can deploy applications to any services that supports docker deployment.

Using docker compose (see [compose.yaml](compose.yaml)) is also an option,
although this alone may not be production-ready at scale. However, it can be
paired with

- reverse proxies and load balancers offered by tools like
  [Traefik](https://github.com/traefik/traefik) or
  [Caddy](https://github.com/caddyserver/caddy)
- container orchestration platforms like [Docker Swarm](https://docs.docker.com/engine/swarm) and [Kubernetes](https://kubernetes.io)

Personally, I recommend setting up a Virtual Private Server (e.g. on [Hetzner](https://www.hetzner.com))
and make use of self-hostable PaaS software which automatically handles the complexity of deployment
mentioned above for you - these includes:

- Coolify
  - <https://github.com/coollabsio/coolify>
  - <https://www.coolify.io>
- Dokploy
  - <https://github.com/Dokploy/dokploy>
  - <http://dokploy.com>

Do note that for the **web** application, the `PUBLIC_SERVER_URL` variable
available at build time (as a docker build argument), rather than an environment
variable at runtime.

Also, both the **server** application's `PUBLIC_WEB_URL` and the **web**
application's `PUBLIC_SERVER_URL` needs to be set as internet-accessible URLs
when deployed, e.g. `https://mycompany.com` and `https://api.mycompany.com`,
rather than referencing `http://localhost:8085` like in development.

### Using Major Platforms

The **web** application is a simple React static site powered by Vite, which is
easily deployed to platforms such as GitHub/GitLab pages, Vercel and Netlify.
You can refer to the [vite documentation](https://vite.dev/guide/static-deploy)
for deployment guides on all major platforms.

The **server** application uses the [hono](https://hono.dev) web framework with
the [NodeJS runtime](https://hono.dev/docs/getting-started/nodejs). However,
this can be exchanged with other runtimes before deploying to your chosen
platforms. For example, deploying to Netlify is covered within
[Hono's documentations](https://hono.dev/docs/getting-started/netlify#_4-deploy).

Note that when deploying your web frontend and server backend to two different
domains, you will need to [tweak your better-auth configurations](https://www.better-auth.com/docs/integrations/hono#cross-domain-cookies).
Apple's Safari browser also does not support third party cookies, so auth will
not function as expected without any proxy workarounds.

To keep things simple, it is recommended that you host your frontend and
backend on the same root domain and differ by subdomains. For example, the
frontend can be served at either `example.com` or `web.example.com`, and the
backend hosted at `api.example.com`.

## Other Notes

### Tanstack Router

The following is configured in [vite.config.ts](apps/web/vite.config.ts) web
application:

```ts
TanStackRouterVite({
  routeToken: 'layout',
}),
```

This enables the use of a `layout.tsx` file in each directory similar to NextJS.
You can read more about this
[here](https://github.com/TanStack/router/discussions/1102#discussioncomment-10946603).

Also, it is recommended that you exclude the `routerTree.gen.ts` from your IDE.
For example, in VSCode, you can add the following `.vscode/settings.json` at the
root of your turborepo:

```json
{
  "files.readonlyInclude": {
    "**/routeTree.gen.ts": true
  },
  "files.watcherExclude": {
    "**/routeTree.gen.ts": true
  },
  "search.exclude": {
    "**/routeTree.gen.ts": true
  }
}
```

### Server API Artificial Delays

There is an artificial delay added in development mode to simulate API usage in
real-world environments. You can disable this by removing the `timingMiddleware`
in [./packages/api/src/server/trpc.ts](./packages/api/src/server/trpc.ts)

### Environment Variables

This template was made to follow the the recommendation of

- @tyleralbee in [this turborepo's GitHub discussion](https://github.com/vercel/turborepo/discussions/9458#discussioncomment-11443969)
- @cjkihl in [create-t3-turbo issue #397](https://github.com/t3-oss/create-t3-turbo/issues/397#issuecomment-1630028405)
- turborepo official docs on [environment variables best practices](https://turbo.build/repo/docs/crafting-your-repository/using-environment-variables#best-practices)

In using this template, it is recommended that

1. each application has a local `.env` file instead of a global `.env` at the
   root of your repository
1. packages should be pure, i.e. rely on factory methods and receiving inputs to
   instantiate rather than consuming environment variables directly
   - one exception is the `@repo/db` package, which requires the
     `DB_POSTGRES_URL` variable for schema migration with `pnpm db:push`
1. environment variables are prefixed, e.g. `SERVER_AUTH_SECRET` instead of
   `AUTH_SECRET`. Caching in the app's `turbo.json` can then be configured to
   use wildcards such as:

   ```json
   "tasks": {
      "build": {
        "env": ["SERVER_*"],
      }
    }
   ```

There is also a script that creates a `.env` from `.env.example` of each
app/package, which can be run with:

```bash
# NOTE: This will not overwrite existing local .env files
pnpm env:copy-example

# To reset any modifications to your .env and restore the examples, run:
pnpm env:remove
pnpm env:copy-example
```

It is recommended that any new apps that uses environment variables follow the
example script set in [apps/server/package.json](apps/server/package.json).
