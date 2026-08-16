# pi-dev

个人 pi 工具包（pi-package）：聚合日常开发用的 extensions、skills、prompts、themes，通过 npm 依赖管理第三方 pi 扩展。

## 技术栈

- TypeScript：pi 扩展代码（由 pi 运行时直接加载，无构建步骤）
- Node.js（CommonJS）：`scripts/` 下的同步脚本
- Biome：格式化与 lint（配置见 `biome.json`）
- 无测试框架，验证方式是 `npm run check` + 重启 pi 实测

## 常用命令

```bash
npm install          # 安装依赖并自动触发 postinstall 同步
npm run check        # biome 格式 + lint 检查
npm run check:fix    # 自动修复格式与 lint 问题
npm run postinstall  # 手动触发全局同步（见下方"同步机制"）
```

## 目录结构

```
pi-dev/
├── extensions/          # 自定义 pi 扩展（/clear、/exit、/clean）
├── global/AGENTS.md     # 通用行为准则，同步到 ~/.pi/agent/AGENTS.md
├── scripts/setup-skills.js  # postinstall 同步脚本
├── mcp.json             # MCP 服务器配置，同步到 ~/.pi/agent/mcp.json
├── skills/ prompts/ themes/  # 预留目录（当前为空）
└── package.json         # pi-package 清单（pi 字段声明各组件入口）
```

## 同步机制（改动后必须理解）

`npm run postinstall` 执行 `scripts/setup-skills.js`，做三件事：

1. `global/AGENTS.md` → 覆盖复制到 `~/.pi/agent/AGENTS.md`（对全局所有项目生效）
2. `mcp.json` → 覆盖写入 `~/.pi/agent/mcp.json`
3. 脚本内 `externalSkills` 数组中的 git 仓库 → clone 到 `~/.pi/.external-skills/` 并软链到 `~/.agents/skills/`

因此：

- 修改**通用行为准则**请改 `global/AGENTS.md`，不要改本文件（本文件只在 pi-dev 项目内生效）
- 同步是**覆盖式**的，目标文件的本地手工修改会丢失
- 修改 `global/AGENTS.md` 或 `mcp.json` 后需运行 `npm run postinstall` 生效
- 新增外部 git skill：编辑 `setup-skills.js` 的 `externalSkills` 数组后运行 `npm run postinstall`

## 约定

- 新增扩展：在 `extensions/` 下建 `.ts` 文件或子目录，`package.json` 的 `pi.extensions` 已包含 `./extensions`，重启 pi 生效
- 提交前运行 `npm run check`
- 详细使用说明见 `README.md`
