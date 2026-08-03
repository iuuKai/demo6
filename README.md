# monorepo-demo6

基于 pnpm workspace + Turbo 的单域名多应用 Monorepo 模板，部署到 Vercel。

一个 Vercel 项目，一个域名，同时承载多个前端应用（SPA / SSG）和 Serverless API。子应用相互独立，各自有独立的构建工具和路由，但共享同一个部署单元。

## 技术栈

| 层面 | 选型 |
|------|------|
| 包管理 | pnpm workspace |
| 构建编排 | Turbo（并行构建 + 缓存） |
| 部署 | Vercel（单项目，Root Directory 为仓库根目录） |
| API | Vercel Serverless Functions（Express） |
| 本地开发 | Express 代理服务器（ahome） |

## 目录结构

```
monorepo-demo6/
├── api/                    # Vercel Serverless Functions
│   ├── [...path].js        # catch-all 入口，处理所有 /api/*
│   └── _user.js            # 用户模块（下划线前缀，不注册为独立 Function）
├── apps/                   # 子应用（演示项目）
│   ├── ahome/              # 本地开发代理服务器 + 首页
│   ├── astro-ssg/          # Astro SSG
│   ├── hexo-ssg/           # Hexo SSG
│   ├── next-ssg/           # Next.js SSG
│   ├── nuxt4-ssg/          # Nuxt SSG
│   ├── react-spa/          # React SPA (Vite)
│   ├── vanilla-spa/        # 原生 JS SPA
│   ├── vitepress-ssg/      # VitePress SSG
│   ├── vue3-spa/           # Vue 3 SPA (Vite)
│   ├── vuepress-ssg/       # VuePress SSG
│   └── webpack-ejs-mpa/    # Webpack EJS MPA
├── packages/
│   └── shared/             # 共享包（端口配置、应用列表等）
├── turbo.json              # Turbo 任务配置
├── vercel.json             # Vercel 部署配置
└── pnpm-workspace.yaml     # pnpm workspace 配置
```

apps 下的子应用均为演示项目，展示不同技术栈在统一架构下的接入方式。实际使用时替换为你自己的应用即可。

## 与 monorepo-template2 的区别

本项目在 [monorepo-template2](../monorepo-template2) 基础上升级改造，核心变化如下：

### 1. 构建方式：builds 数组 → Turbo

| | template2 | demo6 |
|--|-----------|-------|
| vercel.json | `builds` 数组逐个声明 `@vercel/static-build` | `buildCommand: "pnpm turbo run build"` |
| 构建调度 | Vercel 逐个构建，无缓存 | Turbo 并行构建 + 本地缓存 |
| 产物路径 | Vercel 自动处理 `distDir` | 需在 rewrites 中手动指定输出目录 |

template2 的 `builds` 数组写法已被 Vercel 标记为 legacy。demo6 改用 Turbo 统一构建，好处是：

- 构建日志集中，输出有序
- 本地开发也能用 `turbo run build` 复用同一套构建流程
- Turbo 缓存避免重复构建未改动的应用

代价是 rewrites 的 destination 必须写明每个应用的实际输出目录（`dist/`、`out/`、`.output/public/` 等），因为 Vercel 不再替你处理 `distDir` 映射。

### 2. API 架构：Express 整体部署 → Serverless Functions

| | template2 | demo6 |
|--|-----------|-------|
| 入口 | `apps/express-api/src/app.js`（`@vercel/node`） | `api/[...path].js`（Vercel 零配置 Functions） |
| 职责 | Express 同时处理 API + 静态资源 + 404 兜底 | Express 只处理 API |
| 静态资源 | Express `express.static()` 托管 | vercel.json rewrites 直接映射文件 |

template2 用一个 Express 应用包揽所有请求（API、首页、静态资源、404）。这种方式在本地开发很方便，但部署到 Vercel 后所有请求都要经过 Serverless Function，包括纯静态资源，增加了不必要的冷启动开销。

demo6 拆分了职责：

- 纯静态资源（HTML/CSS/JS/图片）由 Vercel CDN 直接返回，不走 Function
- API 请求由 `api/` 目录下的 Serverless Function 处理
- 首页和导航由 `ahome` 应用提供，也是纯静态

### 3. 共享包

template2 没有共享包，各应用配置分散。demo6 引入 `packages/shared`（`@repo/shared`），集中管理端口配置和应用列表，本地开发代理服务器和前端导航页面共用同一份数据。

### 4. 本地开发

template2 的 Express 服务器同时承担「页面服务」和「API 服务」两个角色。demo6 把这两个角色拆开：

- `ahome` 应用作为本地开发入口（端口 3000），提供首页 + 代理转发到各子应用
- API 在生产环境走 Vercel Serverless Functions，本地开发时子应用直接请求各自端口

## 关键设计决策

### 为什么所有 API 只用一个 Function？

Vercel 的 `api/` 目录约定：每个非下划线前缀的文件/目录都会被注册为独立的 Serverless Function。`[...path].js` 是 catch-all 路由，匹配 `/api/*` 下的所有路径。

实测发现 Vercel 的 catch-all 在 `api/` 根目录下**只支持单层路径匹配**：

```
/api/user       → 命中 [...path].js
/api/user/all   → 404（不会路由到 catch-all）
```

这意味着如果要支持多层路径，要么为每个模块建子目录（`api/user/[...path].js`、`api/admin/[...path].js`），每个模块成为独立 Function；要么用 vercel.json rewrite 把所有 `/api/*` 统一转发给单个 Function。

本项目选择后者——在 vercel.json 中配置：

```json
{
  "source": "/api/:path*",
  "destination": "/api/[...path]"
}
```

原因：

- 单 Function 只有一次冷启动，多个 Function 各自独立冷启动
- Vercel Hobby 计划有 Function 数量限制
- 模块拆分在代码层面做，不需要额外的 Function 开销

### 单 Function 如何模块化？

用下划线前缀（`_`）命名模块文件。Vercel 会忽略 `api/` 目录下以 `_` 开头的文件，不将其注册为独立 Function，仅作为模块被 import。

```
api/
├── [...path].js    # 唯一的 Function，处理所有 /api/*
└── _user.js        # 用户模块（不注册为 Function）
```

`[...path].js` 静态导入各模块并挂载到 Express：

```javascript
import userRoutes from './_user.js'
app.use('/user', userRoutes)
```

新增模块只需两步：

1. 创建 `_xxx.js`，导出 Express Router
2. 在 `[...path].js` 加 `import` 和 `app.use`

需要注意的是，Vercel 的 bundler 必须能在构建时静态解析 import。不能用 `fs.readdirSync` + 动态 `import()` 的方式按需加载——打包器无法追踪运行时动态引入的依赖，会导致模块缺失。

### catch-all 的 URL 解析问题

Vercel rewrite 到 `[...path]` 后，Function 收到的 `req.url` 格式与直接访问不同。rewrite 会把匹配的路径段放到查询参数 `...path` 中，而不是 URL 路径里。`[...path].js` 中的中间件需要处理这种情况：

```javascript
app.use((req, res, next) => {
  const rawUrl = req.url
  if (rawUrl.includes('...path=')) {
    // rewrite 模式：从查询参数还原路径
    const u = new URL(rawUrl, 'http://localhost')
    const matchedPath = u.searchParams.get('...path')
    if (matchedPath) {
      req.url = '/' + matchedPath + ...
    }
  } else if (rawUrl.startsWith('/api/')) {
    // 直接访问模式：去掉 /api 前缀
    req.url = rawUrl.slice(4)
  }
  next()
})
```

### Permissions-Policy 与 SPA 路由报错

Vercel 默认在响应头中设置 `Permissions-Policy: unload=()`，禁止页面使用 `unload` 事件。SPA 在路由切换时浏览器会触发 `unload`，导致 Chrome DevTools 出现 `[Violation] Permissions policy violation: unload is not allowed in this document` 警告。

虽然只是警告不影响功能，但作为开源模板不应有控制台噪音。在 vercel.json 中覆盖默认策略，不限制 `unload`：

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Permissions-Policy",
          "value": "fullscreen=(), geolocation=(), microphone=(), camera=()"
        }
      ]
    }
  ]
}
```

### vercel.json rewrite 规则编写

每个应用通常需要 2-3 条 rewrite 规则，各自职责不同：

| 规则 | 作用 | 示例 |
|------|------|------|
| `(/?)` → `index.html` | 根路径（兼容带/不带斜杠） | `/react-spa` 和 `/react-spa/` 都返回入口 HTML |
| `:path*.:ext` → `:path*.:ext` | 精确匹配静态资源 | 只有 `.js`/`.css` 等带扩展名的请求才匹配 |
| `:path*` → `index.html` | SPA fallback | 路由刷新不 404，返回入口 HTML 由前端路由处理 |

不要用 `(.*)` + `$1` 正则捕获来压缩规则数量。虽然看起来更简洁，但根路径请求（`/app` 或 `/app/`）拼接后缺少文件名，Vercel 不知道该返回哪个文件。`(/?)` + `:path*` 的写法语义明确，且能正确处理所有边界情况。

rewrite 规则的顺序原则：**精确匹配在前，通配在后**。Vercel 按顺序匹配第一条命中的规则，如果通配规则在前，会拦截掉本该走精确匹配的请求。

### 各应用构建产物目录

Turbo 构建后各应用的输出目录不同，vercel.json 的 destination 需要对应：

| 应用 | 构建工具 | 输出目录 |
|------|----------|----------|
| astro-ssg | Astro | `dist/` |
| hexo-ssg | Hexo | `public/` |
| next-ssg | Next.js | `out/` |
| nuxt4-ssg | Nuxt | `.output/public/` |
| react-spa | Vite | `dist/` |
| vanilla-spa | 无（纯静态） | 原目录 |
| vitepress-ssg | VitePress | `docs/.vitepress/dist/` |
| vue3-spa | Vite | `dist/` |
| vuepress-ssg | VuePress | `docs/.vuepress/dist/` |
| webpack-ejs-mpa | Webpack | `dist/` |

turbo.json 的 `outputs` 需要覆盖所有这些路径：

```json
"outputs": ["dist/**", "public/**", "out/**", ".output/**", "docs/**/dist/**"]
```

注意：每个应用的 `package.json` 必须有 `build` 脚本，Turbo 才会执行构建。VitePress / VuePress 的默认脚本是 `docs:build`，需要改名为 `build`，否则 Turbo 跳过该应用，部署后访问 404。

### Nuxt 必须用 generate 而非 build

`nuxt build` 产出 SSR 产物（`.output/server/`），`nuxt generate` 产出 SSG 产物（`.output/public/`）。本项目不支持 SSR，Nuxt 应用的 `build` 脚本必须是 `nuxt generate`。

## 快速开始

### 环境要求

- Node.js >= 18
- pnpm >= 10

### 克隆并安装

```bash
git clone <your-repo-url>
cd monorepo-demo6
pnpm install
```

### 本地开发

本地开发由 ahome 应用（端口 3000）作为入口，提供首页导航并将请求代理到各子应用的开发服务器。

**推荐方式：分终端启动**

终端 1 — 启动入口服务器：

```bash
pnpm --filter ahome dev
```

终端 2、3... — 按需启动要开发的子应用：

```bash
pnpm --filter astro-ssg dev       # Astro
pnpm --filter react-spa dev       # React (Vite)
pnpm --filter vue3-spa dev        # Vue 3 (Vite)
pnpm --filter next-ssg dev        # Next.js
pnpm --filter nuxt4-ssg dev       # Nuxt
pnpm --filter vitepress-ssg dev   # VitePress
pnpm --filter vuepress-ssg dev    # VuePress
pnpm --filter hexo-ssg server     # Hexo
pnpm --filter webpack-ejs-mpa dev # Webpack
```

vanilla-spa 是纯静态应用，无构建步骤，ahome 会直接服务其源文件，不需要单独启动。

访问 `http://localhost:3000` 即可看到首页导航，点击各应用卡片会代理到对应端口。

**一键启动所有应用**

```bash
pnpm -r dev
```

这会并行启动所有应用，包括 ahome。应用较少时方便，应用多了可能占用较多资源和终端输出，建议按需启动。

### 部署到 Vercel

1. 将仓库推送到 GitHub
2. 在 [Vercel](https://vercel.com) 创建新项目，导入该 GitHub 仓库
3. **关键步骤：Root Directory 手动改为 `./`**

   Vercel 会自动检测到 `apps/` 下各子目录的 `package.json`，默认选中的是某个子目录。必须手动改为仓库根目录，否则 `vercel.json` 和 `turbo.json` 不会被识别。

4. 其他配置无需手动设置，`vercel.json` 已声明：

   ```json
   {
     "buildCommand": "pnpm turbo run build",
     "installCommand": "pnpm install --no-frozen-lockfile",
     "outputDirectory": "."
   }
   ```

5. 点击 Deploy

构建流程：

```
pnpm install --no-frozen-lockfile
  → pnpm turbo run build（并行构建所有有 build 脚本的应用）
  → Vercel 读取 vercel.json rewrites 处理路由
  → api/ 目录注册为 Serverless Functions
```

## 常见问题

**Q: 部署后某个应用 404？**

检查该应用的 `package.json` 是否有 `build` 脚本。Turbo 只执行 `build` 任务，`docs:build` 等自定义名称不会被触发。

**Q: 部署后 API 404？**

确认 `api/` 目录下有 `[...path].js`，且 vercel.json 中有 `/api/:path*` → `/api/[...path]` 的 rewrite 规则。模块文件必须以 `_` 开头，否则会被 Vercel 注册为独立 Function，导致 catch-all 无法匹配。

**Q: SPA 路由刷新 404？**

该应用的 rewrites 需要有 `:path*` → `index.html` 的 fallback 规则。没有这条规则时，直接访问子路由（如 `/react-spa/about`）Vercel 会找不到对应文件而返回 404。

**Q: VitePress / VuePress 构建产物路径不对？**

这两个工具的输出目录在 `docs/.vitepress/dist/` 和 `docs/.vuepress/dist/` 下，不是项目根目录的 `dist/`。vercel.json 的 destination 需要写完整路径。

## License

MIT
