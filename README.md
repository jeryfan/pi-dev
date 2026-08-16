# pi-dev

个人 pi 开发工具包，统一管理扩展、技能、提示模板和第三方包。安装一次，所有 pi 项目共享同一套环境。

## 项目结构

```
pi-dev/
├── extensions/          # 自定义扩展
│   ├── clear-command.ts # /clear 命令，快速新建会话
│   ├── exit-command.ts  # /exit 命令，退出 pi
│   └── clean-command.ts # /clean 命令，清理 pi 全局资源
├── skills/              # 本地技能（当前为空，预留）
├── prompts/             # 提示模板（当前为空，预留）
├── themes/              # 主题（当前为空，预留）
├── scripts/
│   └── setup-skills.js  # postinstall：同步全局配置、安装外部 git skills
├── package.json         # pi-package 配置
├── mcp.json             # MCP 服务器配置，同步到 ~/.pi/agent/mcp.json
├── global/AGENTS.md     # 通用行为准则，同步到 ~/.pi/agent/AGENTS.md
├── AGENTS.md            # 本项目上下文（供 agent 阅读，不同步）
├── biome.json           # Biome 格式化与 lint 配置
└── README.md            # 本文件
```

## 包含能力

### Extensions

| 能力 | 来源 | 说明 |
|------|------|------|
| 会话管理 | [pi-rewind](https://github.com/nicobailon/pi-rewind) | 会话保存、分支管理 |
| 网页搜索/抓取 | [pi-web-access](https://github.com/nicobailon/pi-web-access) | `web_search`、`fetch_content`、`code_search` |
| 浏览器自动化 | [pi-playwright](https://github.com/guwidoe/pi-playwright) | 操作浏览器、截图、填表、自动化测试 |
| Chrome 控制 | [pi-chrome](https://github.com/tianrendong/pi-chrome) | 控制你的真实 Chrome 实例，复用登录态 |
| MCP 工具桥接 | [pi-mcp-adapter](https://github.com/nicobailon/pi-mcp-adapter) | 接入 MCP 服务器，如 chrome-devtools-mcp |
| 工作流技能 | [pi-superpowers](https://github.com/coctostan/pi-superpowers) | Brainstorming / Planning / TDD / Debug / Review |
| 状态栏 | [statusline-pi](https://github.com/luongnv89/pi-extensions) | 底部显示目录、git 分支、改动、context、模型 |
| 上下文管理 | [context-mode](https://github.com/mksglu/context-mode) | 沙箱执行、FTS5 知识库、意图搜索 |
| Subagent 编排 | [pi-subagents](https://github.com/nicobailon/pi-subagents) | 并行/链式 subagent、异步执行 |
| 目标跟踪 | [pi-agent-goal](https://github.com/KristjanPikhof/Pi-Agent-Goal) | Codex 风格 `/goal` 长期目标工作流 |
| 自定义命令 | `extensions/` | `/clear`、`/exit`、`/clean` |
| 计划模式 | [@narumitw/pi-plan-mode](https://github.com/narumiruna/pi-extensions) | Codex 风格 `/plan`：只读探索、结构化计划、导出实施 |

### Skills

| 能力 | 来源 | 说明 |
|------|------|------|
| UI/UX 设计 | [ui-ux-pro-max](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) | 外部 git skill，风格、配色、布局 |
| 前端设计 | [frontend-design](https://github.com/anthropics/claude-code/tree/main/plugins/frontend-design) | Anthropic 官方，避免 AI slop 审美 |
| 上下文管理 | context-mode/skills | ctx_* 工具使用指南 |
| Subagent 使用 | pi-subagents/skills | subagent 编排指南 |
| 浏览器自动化 | [@playwright/cli](https://github.com/microsoft/playwright-cli)/skills | CLI + skill，token 高效浏览器自动化 |
| 工作流技能 | pi-superpowers/skills | 头脑风暴、计划、TDD、调试、审查 |

## 安装

```bash
pi install git:github.com/jeryfan/pi-dev
```

## 本地调试

```bash
pi install /Users/fanjunjie/Documents/repositories/personal/pi-dev
```

## 项目级安装

```bash
pi install -l git:github.com/jeryfan/pi-dev
```

## 更新

```bash
pi update git:github.com/jeryfan/pi-dev
```

## 首次使用准备

### 1. 安装 Chromium（浏览器自动化必需）

`pi-playwright` 依赖 Chromium 浏览器，首次使用需手动安装：

```bash
npx playwright install chromium
```

> 只需安装一次，Chromium 会缓存到本地，后续无需重复安装。

### 2. 验证浏览器自动化

启动 pi 后，确认技能已加载：

```
/skill:playwright-browser
```

然后让 agent 执行浏览器操作：

```
打开 https://example.com 并截图
```

截图文件默认保存到 `/tmp/pi-playwright/<session>/`。

### 3. 授权 Chrome 控制

`pi-chrome` 默认需要显式授权才能控制你的 Chrome 浏览器（安全设计）：

```bash
/chrome doctor      # 检查安装状态
/chrome authorize   # 授权当前 pi 会话，默认 15 分钟
```

授权时长可以自定义：

```bash
/chrome authorize 30m      # 授权 30 分钟
/chrome authorize 60       # 授权 60 分钟
/chrome authorize forever  # 当前会话永久授权
```

> 注意：`/chrome authorize` 控制的是你日常使用的真实 Chrome 浏览器，包含登录态和敏感数据。默认 15 分钟是为了防止 agent 在你不知情的情况下长期操作浏览器。关闭 pi 会话后授权失效。

### 4. 使用 MCP 工具

安装 `pi-dev` 后，`pi-mcp-adapter` 会自动读取 `~/.pi/agent/mcp.json` 中同步的配置（如 `chrome-devtools-mcp`）。

调用示例：

```
用 chrome-devtools 打开 https://example.com 并截图
```

查看 MCP 状态：

```
/mcp
/mcp tools
```

### 5. 使用 Goal 模式

```
/goal 实现用户登录功能并添加测试
/goal --start
```

## 常用命令

| 命令 | 作用 |
|------|------|
| `/clear` | 新建会话（同 `/new`） |
| `/exit` | 退出 pi |
| `/clean` | 清理 pi 全局资源（skills、extensions、prompts、themes、configs、sessions） |
| `/plan` | Codex 风格计划模式（@narumitw/pi-plan-mode），只读探索、计划导出 |
| `/goal` | 显示或设置长期目标 |
| `/mcp` | 查看 MCP 状态 |

## 配置说明

- `workflow: "none"` — `pi-web-access` 搜索时不打开浏览器策展器，直接返回文本结果
- 如需开启策展器：`/curator on`
- `mcp.json` 会覆盖同步到 `~/.pi/agent/mcp.json`
- `global/AGENTS.md` 会覆盖同步到 `~/.pi/agent/AGENTS.md`（项目根的 `AGENTS.md` 是本项目上下文，不同步）

## 添加新组件

### Clean 命令

`/clean` 用于清理 pi 全局资源，支持以下选项：

```bash
/clean              # 交互式选择清理范围
/clean --all        # 清理全部（skills、extensions、prompts、themes、configs、sessions）
/clean --dry-run    # 仅预览，不真正删除
/clean --yes        # 跳过确认（慎用）
/clean --configs --sessions   # 同时清理指定范围
```

默认清理范围（不带 `--all` 或具体 `--<scope>` 时）：

- Skills：`~/.agents/skills/` 全局 skill 链接/目录 + `~/.pi/.external-skills/` 外部 git 缓存
- Extensions：`~/.pi/agent/extensions/`
- Prompts：`~/.pi/agent/prompts/`
- Themes：`~/.pi/agent/themes/`

可选范围：

- `--configs`：`~/.pi/agent/mcp.json`、`AGENTS.md`、`settings.json`、`trust.json`、`models.json`
- `--sessions`：`~/.pi/agent/sessions/`

> 注意：`/clean` 会删除全局资源，不会删除当前项目文件。执行前会要求确认（`--yes` 可跳过）。

### 添加 Extension

1. 在 `extensions/` 下创建 `.ts` 文件或子目录
2. 确保 `package.json` 的 `pi.extensions` 包含 `"./extensions"`
3. 重启 pi

### 添加 Skill

#### 本地 Skill

1. 在 `skills/` 下创建子目录，内含 `SKILL.md`
2. 确保 `package.json` 的 `pi.skills` 包含 `"./skills"`
3. 重启 pi

#### npm pi-package Skill

1. `npm install <package>`
2. 在 `package.json` 的 `pi.skills` 中追加 `node_modules/<pkg>/skills`
3. 同时加入 `dependencies` 和 `bundleDependencies`

#### 外部 Git Skill

1. 编辑 `scripts/setup-skills.js`，在 `externalSkills` 数组中添加：
   ```js
   {
     name: 'skill-name',
     repo: 'https://github.com/user/repo.git',
     sourceSubdir: 'path/to/skill/inside/repo',
   }
   ```
2. 运行 `npm run postinstall`
3. 脚本会自动 `git clone` 到 `~/.pi/.external-skills/`，并软链接到 `~/.agents/skills/`
4. 重启 pi

### 添加 Prompt Template

1. 在 `prompts/` 下创建 `.md` 文件
2. pi 会自动从 `prompts/` 目录扫描加载

### 添加 Theme

1. 在 `themes/` 下创建主题文件
2. pi 会自动从 `themes/` 目录扫描加载

## 开发规范

```bash
npm run check      # 检查格式和 lint
npm run check:fix  # 自动修复
npm run format     # 格式化
```

## 依赖管理规范

```json
{
  "dependencies": {
    "pi-rewind": "^0.5.0"
  },
  "bundleDependencies": [
    "pi-rewind"
  ]
}
```

- 用 `^` 版本号允许小版本自动更新
- 加入 `bundleDependencies` 便于离线分发
- 不要使用 `bundledDependencies`，npm 不允许与 `bundleDependencies` 同时存在

### 外部 Git Skill 缓存

- Git 仓库：`~/.pi/.external-skills/<name>/`
- Skill 软链接：`~/.agents/skills/<name>/`

这两个目录**不属于本项目**，不要提交到 git。

## 环境依赖

- Node.js >= 22
- Chromium（由 `npx playwright install chromium` 自动安装）

## Agent 行为规范（必读）

详见 [`global/AGENTS.md`](./global/AGENTS.md)（postinstall 时同步到 `~/.pi/agent/AGENTS.md`，对全局所有项目生效）。核心原则：

- **安全红线不可违反**：未经明确要求不执行 `git commit` / `git push`，破坏性命令先确认。
- **小决策自主，大决策请示**：实现细节自行判断，需求歧义或方案分叉时停下来问。
- **最小实现，精准修改**：每行改动都能追溯到用户需求，不重构没坏的东西。
