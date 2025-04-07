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
  - [ディレクトリ構成](#ディレクトリ構成)
  - [基本的な機能](#基本的な機能)
  - [参考情報と目標](#参考情報と目標)
- [クイックスタート](#クイックスタート)
  - [前提条件](#前提条件)
  - [セットアップ](#セットアップ)
  - [外部データベースの使用](#外部データベースの使用)
- [開発](#開発)
  - [単一のパッケージを使用](#単一のパッケージを使用)
  - [shadcnコンポーネントの追加](#shadcnコンポーネントの追加)
  - [better-authプラグインの追加](#better-authプラグインの追加)
  - [スクリプト一覧](#スクリプト一覧)
- [コンテナ化 (Docker/Podman)](#コンテナ化-dockerpodman)
- [デプロイ](#デプロイ)
  - [コンテナを使用](#コンテナを使用)
  - [主要なプラットフォームの使用](#主要なプラットフォームの使用)
- [その他のノート](#その他のノート)
  - [Tanstack Router](#tanstack-router)
  - [Server API Artificial Delays](#server-api-artificial-delays)
  - [Environment Variables](#environment-variables)

## About

### ディレクトリ構成

以下はTK Stackのすべてのコンポーネントの概要です:

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

[pnpm-workspace.yaml](pnpm-workspace.yaml) ですべてのカタログ依存関係を確認できます

### 基本的な機能

以下の機能はデフォルトで実装されています:

- ログイン/登録 (使用 [better-auth の電子メール/パスワード](https://www.better-auth.com/docs/authentication/email-password) 認証プロバイダー)
- テーマ (ダーク/ライトモード使用 [next-themes](github.com/pacocoursey/next-themes))
- web/server 統合 ([trpc](https://trpc.io/docs/quickstart) API 例: 投稿の作成/一覧表示)

[live demo](https://rtstack.nktnet.uk) でこれらの機能を確認できます

### 参考情報と目標

TK Stack の多くの側面は [t3-oss/create-t3-turbo](https://github.com/t3-oss/create-t3-turbo) から派生しています  
ただし、以下の優先事項があります:

- [tanstack router](https://tanstack.com/router/latest) (web) + [hono](https://hono.dev) (server) instead of [nextjs](https://nextjs.org) (fullstack)
- [better auth](https://www.better-auth.com) for authentication instead [auth.js (next auth)](https://authjs.dev)
- [valibot](https://valibot.dev) for input validation instead of [zod](https://zod.dev)
- [tanstack form](https://tanstack.com/form/latest) instead of [react-hook-form](https://react-hook-form.com)
- using `.env` in each application/package instead of globally, as per [turborepo's recommendations](https://turbo.build/repo/docs/crafting-your-repository/using-environment-variables#best-practices)

このリポジトリは、依存関係とツールの最新リリースを一貫して採用することを目指しています  
例えば:

- react v19
- tailwindcss v4 & shadcn-ui (canary)
- trpc v11
- eslint v9
- pnpm v10

## クイックスタート

### 前提条件

以下のツールがシステムにインストールされていることを確認してください:

1. [node](https://nodejs.org/en/download) (バージョン 22+)
1. [pnpm](https://pnpm.io/installation) (バージョン 10+)
1. [postgres](https://www.postgresql.org) データベース, 以下のツールを使用して簡単に実行できます:
   - [docker](https://docs.docker.com/engine/install) and [docker-compose](https://docs.docker.com/compose)
   - [podman](https://podman.io/docs/installation) and [podman-compose](https://github.com/containers/podman-compose)
   - [supabase](https://supabase.com)'s free tier cloud database

### セットアップ

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

### 単一のパッケージを使用

[`pnpm --filter=<name>`](https://pnpm.io/filtering) (`<name>` は定義されている `package.json` の各パッケージ)

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

### shadcnコンポーネントの追加

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

### better-authプラグインの追加

better-auth プラグインを統合する場合、例えば

- [admin](https://better-auth.vercel.app/docs/plugins/admin)
- [organization](https://better-auth.vercel.app/docs/plugins/organization)

次のようにします:

1. プラグインのそれぞれのドキュメントに従って、auth パッケージのサーバーとクライアントのファイルを変更します

2. 次のコマンドを実行します:

   ```bash
   pnpm auth:schema:generate
   ```

   インタラクティブモードに入り、`y` を押して [packages/db/src/schemas/auth.ts](packages/db/src/schemas/auth.ts) を上書きします

3. すべての lint エラーを修正します。例えば:

   ```bash
   pnpm format:fix
   pnpm lint:fix
   ```

4. 新しいスキーマをデータベースにプッシュします

   ```bash
   pnpm db:push
   ```

5. 時々、型推論がすぐに IDE では機能しません (例えば VSCode で)。これは次のコマンドを実行することで解決できます:

   ```bash
   pnpm clean && pnpm install
   ```

   followed by a restarting your TS Server or reloading VSCode.

[better-auth-admin-organization-plugins](https://github.com/nktnet1/rt-stack/tree/better-auth-admin-organization-plugins) ブランチで例を確認できます。

### スクリプト一覧

すべてのスクリプトは [package.json](package.json) と [turbo.json](turbo.json) で定義されています:

```bash
pnpm clean                  # remove all .cache, .turbo, dist, node_modules

pnpm typecheck              # report typescript issues

pnpm format                 # report prettier issues
pnpm format:fix             # auto-fix prettier issues

pnpm lint                   # report eslint issues
pnpm lint:fix               # auto-fix eslint issues

pnpx codemod pnpm/catalog   # migrate dependencies to pnpm-workspace.yaml
```

## コンテナ化 (Docker/Podman)

`web` と `server` の両方のアプリケーションはコンテナ化されています。次のコマンドを実行してこれを確認できます:

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

次のリンクをブラウザで開くことができます:

- <http://localhost:8085>

これらのコンテナは本番モードで実行されています。詳細については、次のファイルを参照してください:

- [compose.yaml](compose.yaml)
- [apps/server/Dockerfile](apps/server/Dockerfile)
- [apps/web/Dockerfile](apps/web/Dockerfile)
- [apps/web/nginx.conf](apps/web/nginx.conf)

## デプロイ

> [!TIP]
> RT Stack の [live demo](https://rtstack.nktnet.uk) は現在次のサービスでデプロイされています:
>
> - vercel の web フロントエンド
> - fly.io のサーバーバックエンドと postgres データベース

### コンテナを使用

docker デプロイをサポートする任意のサービスにアプリケーションをデプロイできます。

docker compose (see [compose.yaml](compose.yaml)) もオプションですが、これはスケール時には本番環境には適していません。ただし、次のようなものと組み合わせることができます:

- 逆プロキシとロードバランサー (例: [Traefik](https://github.com/traefik/traefik) や [Caddy](https://github.com/caddyserver/caddy))
  [Traefik](https://github.com/traefik/traefik) や [Caddy](https://github.com/caddyserver/caddy)
- コンテナオーケストレーションプラットフォーム (例: [Docker Swarm](https://docs.docker.com/engine/swarm) や [Kubernetes](https://kubernetes.io))

私は、[Hetzner](https://www.hetzner.com) などの仮想プライベートサーバー (VPS) をセットアップすることをお勧めします。
そして、次のようなセルフホスタブルな PaaS ソフトウェアを使用して、デプロイの複雑さを自動的に処理します:
mentioned above for you - these includes:

- Coolify
  - <https://github.com/coollabsio/coolify>
  - <https://www.coolify.io>
- Dokploy
  - <https://github.com/Dokploy/dokploy>
  - <http://dokploy.com>

Note: **web** アプリの場合、`PUBLIC_SERVER_URL` 変数は実行時の環境変数ではなく  
ビルド時に (docker build引数として) 使用されます  

また、**server** アプリの `PUBLIC_WEB_URL` と **web** アプリの `PUBLIC_SERVER_URL` は  
インターネットからアクセス可能な URL に設定する必要があります  
例: `https://mycompany.com` と `https://api.mycompany.com`  
開発時には `http://localhost:8085` のようになります  

### 主要なプラットフォームの使用

**web** アプリケーションは Vite で動作するシンプルな React 静的サイトで  
GitHub/GitLab ページ、Vercel や Netlify などのプラットフォームに簡単にデプロイできます  
すべての主要なプラットフォームのデプロイガイドについては [vite ドキュメント](https://vite.dev/guide/static-deploy) を参照してください  

**server** アプリケーションは [hono](https://hono.dev) と[NodeJS ランタイム](https://hono.dev/docs/getting-started/nodejs)  を使用してます
また、他のランタイムに変更することもできます  
例: [Netlify](https://hono.dev/docs/getting-started/netlify#_4-deploy) のデプロイガイドを参照してください  

Note: ウェブフロントエンドとサーバーバックエンドを異なるドメインにデプロイする場合は、 [better-auth設定](https://www.better-auth.com/docs/integrations/hono#cross-domain-cookies)を調整する必要がります
AppleのSafariブラウザはサードパーティCookieをサポートしていないため、プロキシによる回避策がなければ認証は期待通りに機能しません。

シンプルに保つためには、フロントエンドとバックエンドを同じルートドメイン上でサブドメインを変えてホストすることをお勧めします  
例: `example.com` または `web.example.com` でフロントエンドを提供し、
  バックエンドは `api.example.com` でホストします  

## その他のノート

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
