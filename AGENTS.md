# pi-dev — 个人 pi 开发工具包

本项目是作者的 pi 编码代理个人开发环境，统一管理扩展、技能、提示模板和第三方包。

## 项目结构

```
pi-dev/
├── .pi/                 # 项目级 pi 配置（开发时自动加载）
│   ├── extensions/      # 自定义扩展（TypeScript）
│   ├── skills/          # 本地技能（按需放置）
│   ├── prompts/         # 提示模板（Markdown）
│   └── themes/          # 主题（可选）
├── scripts/
│   └── setup-skills.js  # postinstall：自动安装外部 git skills
├── package.json         # pi-package 配置
└── AGENTS.md            # 本文件
```

## 包含能力

| 能力 | 来源 | 类型 | 加载方式 |
|------|------|------|---------|
| 会话管理 | `pi-rewind` | pi-package / extension | `pi.extensions` |
| 网页搜索/抓取 | `pi-web-access` | pi-package / extension | `pi.extensions` |
| 浏览器自动化 | `pi-playwright` | pi-package / skill | `pi.skills` |
| 工作流技能 | `pi-superpowers` | pi-package / skill+extension | `pi.skills` + `pi.extensions` |
| UI/UX 设计智能 | `ui-ux-pro-max` | 外部 git skill | `~/.agents/skills/` 全局扫描 |

## 添加新组件

### 添加 Extension

1. 在 `.pi/extensions/` 下创建 `.ts` 文件
2. 在 `package.json` 的 `pi.extensions` 中追加路径（开发时 pi 也会自动扫描 `.pi/extensions/`）：
   ```json
   "extensions": [
     "./.pi/extensions",
     "./.pi/extensions/my-new-ext.ts",
     "..."
   ]
   ```
3. 重启 pi

### 添加 Skill

#### 方式一：本地 Skill（随项目）

1. 在 `.pi/skills/` 下创建子目录，内含 `SKILL.md`
2. 确保 `package.json` 的 `pi.skills` 包含 `"./.pi/skills"`
3. 重启 pi

#### 方式二：npm pi-package Skill（推荐标准包）

1. `npm install <package>`
2. 在 `package.json` 的 `pi.skills` 中追加 `node_modules/<pkg>/skills`
3. 同时加入 `dependencies` 和 `bundledDependencies`

#### 方式三：外部 Git Skill（非标准仓库）

1. 编辑 `scripts/setup-skills.js`，在 `externalSkills` 数组中添加：
   ```js
   {
     name: 'skill-name',
     repo: 'https://github.com/user/repo.git',
     sourceSubdir: 'path/to/skill/inside/repo',  // 省略表示根目录
   }
   ```
2. 运行 `npm run postinstall` 或 `node scripts/setup-skills.js`
3. 脚本会自动 `git clone` 到 `~/.pi/.external-skills/`，并软链接到 `~/.agents/skills/`
4. 重启 pi，agent 自动扫描加载

### 添加 Prompt Template

1. 在 `.pi/prompts/` 下创建 `.md` 文件
2. pi 会自动从 `.pi/prompts/` 目录扫描加载

### 添加 Theme

1. 在 `.pi/themes/` 下创建主题文件
2. pi 会自动从 `.pi/themes/` 目录扫描加载

## 依赖管理规范

### 标准 pi-package（npm 包）

```json
{
  "dependencies": {
    "pi-rewind": "^0.5.0",
    "pi-web-access": "^0.10.7"
  },
  "bundledDependencies": [
    "pi-rewind",
    "pi-web-access"
  ]
}
```

- 用 `^` 版本号允许小版本自动更新
- 加入 `bundledDependencies` 便于离线分发

### 外部 Git Skill 的缓存

外部 skills 缓存位置：
- **Git 仓库**：`~/.pi/.external-skills/<name>/`
- **Skill 软链接**：`~/.agents/skills/<name>/`

这两个目录**不属于本项目**，不要提交到 git。

## 常用命令

```bash
# 本地调试安装
pi install /path/to/pi-dev

# 全局安装（推荐）
pi install git:github.com/jeryfan/pi-dev

# 更新
pi update git:github.com/jeryfan/pi-dev

# 安装 Chromium（浏览器自动化必需，只需一次）
npx playwright install chromium

# 手动更新外部 skills
npm run postinstall
```

## 首次使用准备

1. 安装本包：`pi install git:github.com/jeryfan/pi-dev`
2. 安装 Chromium：`npx playwright install chromium`
3. 重启 pi，确认启动消息头显示所有扩展和技能

## 注意事项

- `pi-web-access` 默认配置 `workflow: "none"`（在 `~/.pi/web-search.json`），搜索时不打开浏览器策展器
- `pi-playwright` 默认无头模式，需要可视化时加 `--headed`
- 外部 skills 通过 `~/.agents/skills/` 全局共享，所有 pi 项目都能复用
