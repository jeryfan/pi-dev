# pi-dev

个人 pi 开发工具包。

## 包含能力

| 能力 | 来源 | 说明 |
|------|------|------|
| 会话管理 | [pi-rewind](https://github.com/nicobailon/pi-rewind) | 会话保存、分支管理 |
| 网页搜索/抓取 | [pi-web-access](https://github.com/nicobailon/pi-web-access) | `web_search`、`fetch_content`、`code_search` |
| 浏览器自动化 | [pi-playwright](https://github.com/guwidoe/pi-playwright) | 操作浏览器、截图、填表、自动化测试 |

## 安装

```bash
pi install git:github.com/jeryfan/pi-dev
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

## 配置说明

- `workflow: "none"` — `pi-web-access` 搜索时不打开浏览器策展器，直接返回文本结果
- 如需开启策展器：`/curator on`

## 环境依赖

- Node.js >= 20
- Chromium（由 `npx playwright install chromium` 自动安装）
