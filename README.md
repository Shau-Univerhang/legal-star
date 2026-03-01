# Bird – 法律学习全栈平台（Bird – Full-Stack Legal Learning Platform）

本项目是一个法律学习平台原型，旨在通过精美的 UI 和强大的后端服务，为用户提供沉浸式的法律学习体验。

## 技术栈介绍

本项目采用现代化的前后端分离架构（虽然物理上在同一个仓库），确保了高性能和良好的开发体验。

### 前端 (Frontend)
- **核心架构**: 多页应用 (MPA) 模式，使用静态 HTML5 页面。
- **样式框架**: **Tailwind CSS**，实现原子化 CSS 样式，确保设计的一致性和响应式布局。
- **脚本语言**: 原生 **JavaScript (ES6+)**，负责页面交互和数据渲染。
- **图标库**: **FontAwesome**，提供丰富的矢量图标。
- **API 集成**: 封装统一的 `api.js` 模块，处理与后端的数据交互和错误处理。

### 后端 (Backend)
- **核心框架**: **Next.js 14** (App Router)，利用其强大的 API Routes 功能构建 RESTful API。
- **运行环境**: **Node.js**。
- **数据库与服务**: **Supabase**
  - **PostgreSQL**: 强大的关系型数据库，存储案例、视频、用户数据。
  - **Authentication**: 提供安全的用户认证系统（邮箱/密码、验证码）。
- **AI 集成**: **Coze API (ByteDance)**，驱动智能法律助手，提供流式对话体验。

---

## ToC端功能特性 (Consumer Features)

本项目面向终端用户（ToC）实现了丰富的功能，覆盖从学习到互动的完整闭环：

### 1. 用户认证体系
- **注册**: 支持邮箱 + 验证码的安全注册流程，确保用户身份真实性。
- **登录**: 提供邮箱 + 密码的传统登录方式。
- **个人中心**: 用户可以管理个人资料（头像、昵称等），查看学习进度。

### 2. 沉浸式案例学习
- **案例库**: 完整的案例浏览页面，支持分页加载。
- **多维筛选**: 支持按“法律领域”（劳动、婚姻、合同等）和“难度等级”筛选案例。
- **智能排序**: 支持按“最新发布”、“最热门”、“难度”对案例进行排序。
- **全局搜索**: 快速检索感兴趣的案例或法律知识点。
- **案例详情**: 深度展示案例背景、判决结果及相关法律条文。

### 3. 视频学习系统
- **今日学习**: 首页推荐每日精选法律视频。
- **视频关联**: 视频与具体案例绑定，实现“看视频懂案例”的直观学习方式。
- **流媒体播放**: 集成视频播放功能，支持流畅的观看体验。

### 4. AI 法律助手
- **智能咨询**: 内置 AI 聊天机器人，基于 Coze 平台的大模型能力。
- **实时对话**: 支持流式响应（Streaming），模拟真实的咨询对话体验。
- **法律问答**: 用户可随时咨询法律问题，AI 提供即时的法律建议和解释。

### 5. 游戏化与社区
- **积分排行榜**: 根据用户的学习时长和活跃度生成排行榜，激励用户学习。
- **知识图谱**: 可视化展示法律知识体系（原型）。
- **互动社区**: 圈子和问答板块，促进用户间的交流与互助。

---

## 目录结构

- `app/`
  - `api/`
    - `cases/route.js`：案件列表接口 `/api/cases`
    - `cases/[id]/route.js`：案件详情接口 `/api/cases/[id]`
    - `videos/route.js`：视频列表接口 `/api/videos`
    - `leaderboard/route.js`：排行榜接口 `/api/leaderboard`
    - `ai/chat/route.js`：AI 对话接口 `/api/ai/chat` (对接 Coze)
  - `page.js`：简单的主页，列出 API 路由和前端入口链接
- `appui/appui/`
  - 一组静态页面：
    - `P-HOME.html`：首页（今日学习视频 + 推荐案例等）
    - `P-CASE_LIST.html`：案例列表页
    - `P-CASE_DETAIL.html`：案例详情页
    - `P-RANKING.html`：排行榜页
    - `P-AI_CHAT.html`：AI 咨询页
    - 以及用户中心、问答、知识图谱等其他页面
  - `api.js`：前端调用后端 API 的统一封装
- `lib/supabase.js`：服务端 Supabase 客户端封装（业务读写用 service role / anon 分工）
- `supabase/schema.sql`：Supabase 数据库建表脚本（`cases`、`videos`、`leaderboard`）
- `.env.local.example`：环境变量示例
- `next.config.js`、`package.json`：Next.js 项目配置

---

## 环境准备

### 1. 安装依赖

在项目根目录（`bird`）执行：

```bash
npm install
```

必须先安装完依赖，后端 API 与 Next.js 才能运行。

### 2. 配置 Supabase 项目与表结构

1. 访问 https://supabase.com，创建一个新项目。
2. 在左侧导航中打开 **SQL Editor**。
3. 将项目中的 `supabase/schema.sql` 内容复制进去并执行（路径：`supabase/schema.sql`）。

该脚本会创建 3 张表：

- `cases`：案例库
- `videos`：视频资源（与案例可关联）
- `leaderboard`：用户积分排行榜

表的主要字段结构如下（简要）：

- `cases`
  - `id`：UUID 主键（自动生成）
  - `slug`：短标识（如 `case-001`），用于 URL/分享
  - `title`：标题
  - `summary`：摘要
  - `description`：完整描述
  - `field`：法律领域（如 `labor`、`marriage`、`contract`、`consumer`）
  - `difficulty`：难度（`beginner` / `intermediate` / `expert`）
  - `tags`：标签数组（`TEXT[]`）
  - `learner_count`：学习人数（用于热门排序）
  - `estimated_minutes`：预计学习时间（分钟）
- `videos`
  - `id`：UUID 主键（自动生成）
  - `title`：视频标题
  - `description`：简介
  - `video_url`：视频链接（例如 MP4、B 站、抖音 H5 等）
  - `thumbnail_url`：封面图
  - `duration_seconds`：时长（秒）
  - `case_id`：关联的案例 `cases.id`
  - `sort_order`：在页面中的排序序号（越小越靠前）
- `leaderboard`
  - `user_id`：用户标识
  - `username`：昵称
  - `avatar_url`：头像
  - `score`：积分
  - `rank_title`：称号
  - `level`：等级

> 提示：`schema.sql` 里还附带了一些示例 `INSERT` 语句，目前是注释掉的，可按需解注释后执行，快速填充一些示例数据。

---

### 3. 设置环境变量

在项目根目录执行：

```bash
cp .env.local.example .env.local
```

然后打开 `.env.local`，设置以下变量：

```bash
NEXT_PUBLIC_SUPABASE_URL=你的_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的_supabase_anon_key
# 可选，但建议配置，用于服务端更高权限的 API 调用
SUPABASE_SERVICE_ROLE_KEY=你的_supabase_service_role_key

# Coze AI 配置 (可选，用于 AI 聊天功能)
COZE_API_BASE_URL=https://api.coze.cn
COZE_API_TOKEN=你的_coze_api_token
COZE_BOT_ID=你的_coze_bot_id
```

这些变量会被后端 API 使用：
- 认证（Auth）使用 `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- 业务表读写（如写入 leaderboard）使用 `SUPABASE_SERVICE_ROLE_KEY`（服务端使用，勿泄露）
- AI 聊天使用 `COZE_API_TOKEN` 和 `COZE_BOT_ID`

---

## 前端与 API 的联动方式

静态页面通过 `appui/appui/api.js` 调用后端 API：

- 配置 API 基础地址：

  ```js
  window.API_BASE = window.API_BASE || '';
  function apiUrl(path) {
    return (window.API_BASE + path).replace(/([^:]\/)\/+/g, '$1');
  }
  ```

  - 如果前端是通过 Next.js 静态资源托管（`/appui/P-HOME.html`）访问的，当前域名就是 API 域名，此时 `window.API_BASE` 默认为空字符串即可。
  - 如果前端用 `file://` 打开，或放在其它域名/端口，就需要在加载 HTML 前手动设置，例如：

    ```html
    <script>
      window.API_BASE = 'http://localhost:3000';
    </script>
    <script src="api.js"></script>
    ```

- 封装的 API 调用函数：

  - `window.fetchCases(opts)`：获取案例列表（分页/筛选）
  - `window.fetchCaseById(id)`：获取单个案例详情（含视频列表）
  - `window.fetchVideos(caseId?)`：获取视频列表（可以按 `caseId` 过滤）
  - `window.fetchLeaderboard(opts)`：获取排行榜
  - `window.auth.login(email, password)`：邮箱+密码登录
  - `window.auth.register(email, password, username?)`：邮箱注册（结合验证码流程）

---

## 认证与用户

- 登录：`POST /api/auth/login`
  - 请求体：`{ email, password }`
  - 返回：`{ user, session }`

- 注册：`POST /api/auth/register`
  - 请求体：`{ email, password, username? }`
  - 开发环境中若配置了 `SUPABASE_SERVICE_ROLE_KEY` 会自动完成邮箱确认并返回 `session`
  - 返回：`{ user, session, requireConfirmation }`

- 邮箱验证码（OTP）：
  - 发送验证码：`POST /api/auth/send-code`，请求体 `{ email }`
  - 校验验证码：`POST /api/auth/verify-code`，请求体 `{ email, token }`
  - 前端注册页流程：先“获取验证码”并校验通过，再提交注册
  - **注意**：建议在 Supabase 后台配置自定义 SMTP（如 Resend）以避免邮件发送速率限制，并确保验证码模版配置正确（使用 `{{ .Token }}`）。
  - 当前注册与登录均仅支持邮箱，不支持手机号

安全提示：
- 切勿把 `SUPABASE_SERVICE_ROLE_KEY` 写入前端或提交到公共仓库
- 生产环境部署时在平台（如 Vercel）配置环境变量

## 更新日志

查看 [CHANGELOG.md](./CHANGELOG.md) 获取最新更新详情。

---

## 前端部署方式

### 方式 A：与 API 同站点托管（推荐开发模式）

1. 构建时会自动将 `appui/appui` 复制到 `public/appui`（脚本见 `scripts/copy-appui.js`）
   - 开发阶段也可手动执行：`npm run copy:appui`
2. 启动开发服务器后，直接访问：
   - `http://localhost:3000/appui/P-HOME.html`（首页）
   - `http://localhost:3000/appui/P-CASE_LIST.html`（案例列表）
   - `http://localhost:3000/appui/P-RANKING.html`（排行榜）
   - `http://localhost:3000/appui/P-LOGIN.html`（邮箱登录）
   - `http://localhost:3000/appui/P-REGISTER.html`（邮箱+验证码注册）
   - `http://localhost:3000/appui/P-AI_CHAT.html`（AI 咨询）

由于静态页面和 API 在同一域名下，`window.API_BASE` 默认为空，就可以直接请求 `/api/...`。

### 方式 B：前后端分站点托管

- 静态 HTML 放在任意 Web 服务器（例如 Nginx、静态空间或本机 `file://` 打开）。
- 在加载 `api.js` 之前手动指定 API 地址：

  ```html
  <script>
    window.API_BASE = 'https://你的后端域名或IP:端口';
  </script>
  <script src="api.js"></script>
  ```

这样前端会把 `fetch` 请求发到你部署的 Next.js 后端。

---

## 启动开发环境

在项目根目录执行：

```bash
npm run dev
```

默认会在 `http://localhost:3000` 启动开发服务器。

- API 测试地址：
  - `GET http://localhost:3000/api/cases` – 案例列表
  - `GET http://localhost:3000/api/cases/case-001` – 某个 id 或 `slug` 的案例详情
  - `GET http://localhost:3000/api/videos` – 视频列表
  - `GET http://localhost:3000/api/leaderboard` – 排行榜
- 认证接口：
  - `POST http://localhost:3000/api/auth/send-code` – 发送邮箱验证码
  - `POST http://localhost:3000/api/auth/verify-code` – 校验邮箱验证码
  - `POST http://localhost:3000/api/auth/register` – 邮箱注册（仅邮箱）
  - `POST http://localhost:3000/api/auth/login` – 邮箱登录（密码）
- AI 接口：
  - `POST http://localhost:3000/api/ai/chat` – AI 对话
- 前端页面（按「方式 A」复制到 `public/` 后）：
  - `http://localhost:3000/appui/P-HOME.html`
  - `http://localhost:3000/appui/P-CASE_LIST.html`
  - 以及其他页面路径（含 `P-LOGIN.html`, `P-REGISTER.html`）

---

## 后端 API 说明

### 1. 案例列表：`GET /api/cases`

支持的查询参数：

- `page`：页码（从 1 开始）
- `pageSize`：每页条数（最大 50）
- `field`：法律领域过滤（如 `labor`, `marriage`, `contract`, `consumer`）
- `difficulty`：难度过滤（`beginner` / `intermediate` / `expert`）
- `sort`：
  - `latest`：按 `created_at` 倒序
  - `popular`：按 `learner_count` 倒序
  - `difficulty`：按难度升序
  - `difficulty_desc`：按难度降序
  - 其他或不传：按 `created_at` 倒序（默认）
- `keyword` 或 `q`：标题/摘要模糊搜索

返回数据结构：

```json
{
  "data": [],
  "total": 0,
  "page": 1,
  "pageSize": 12
}
```

### 2. 案例详情：`GET /api/cases/[id]`

- `id` 可以是：
  - `cases.id`（UUID）
  - 或 `cases.slug`（如 `case-001`）
- 返回数据中会附带该案例的 `videos` 列表，按 `sort_order` 排序。

### 3. 视频列表：`GET /api/videos`

- 可选查询参数：`caseId`
  - 可以是 `cases.id` 或 `cases.slug`
  - 若指定，则只返回属于该案例的视频。

返回视频列表，每条包含：`title`、`description`、`video_url`、`thumbnail_url`、`duration_seconds`、`case_id`、`sort_order` 等。

### 4. 排行榜：`GET /api/leaderboard`

- 查询参数：
  - `limit`：返回条数（最大 100）
  - `offset`：偏移量，用于分页
- 按 `score` 降序返回，并附加计算字段 `rank` 表示当前页内的名次。

---

## 如何修改网页中的视频序列和案例库（简要指引）

### 修改视频序列

1. 在 Supabase 的 `videos` 表中增删改数据：
   - 设置 `title`、`video_url`、`thumbnail_url` 等内容。
   - 使用 `sort_order` 控制视频顺序（数值越小越靠前）。
   - 如需绑定到某个案例，在 `case_id` 填入该案例的 `cases.id`。
2. 首页「今日学习视频」默认取 `GET /api/videos` 返回列表的第一条（`sort_order` 最小的视频）。

### 修改案例库

1. 在 Supabase 的 `cases` 表中增删改数据：
   - 设置 `slug`、`title`、`summary`、`description`、`field`、`difficulty`、`tags` 等字段。
2. 案例列表页通过 `/api/cases` 分页加载，支持：
   - 按 `field`、`difficulty` 筛选
   - 按 `sort`（最新 / 最热门 / 难度）排序
   - 按 `keyword` 搜索标题和摘要
3. 想要某个案例在「热门」排序模式下更靠前，可以提高它的 `learner_count` 数值。

---

## 说明

UI 和样式全部来自 `appui/appui` 下的静态文件；构建脚本会复制到 `public/appui` 以便统一托管。本项目提供数据 API 与认证能力（邮箱+密码、邮箱验证码），你可以在 Supabase 中维护案例库、视频资源和用户数据，而无需频繁修改前端 HTML。
