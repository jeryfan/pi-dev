# pi-dev

个人 pi 开发工具包。

## 包含能力

| 能力 | 来源 | 说明 |
|------|------|------|
| 会话管理 | [pi-rewind](https://github.com/nicobailon/pi-rewind) | 会话保存、分支管理 |
| 网页搜索/抓取 | [pi-web-access](https://github.com/nicobailon/pi-web-access) | `web_search`、`fetch_content`、`code_search` |
| 浏览器自动化 | [pi-playwright](https://github.com/guwidoe/pi-playwright) | 操作浏览器、截图、填表、自动化测试 |
| Chrome 控制 | [pi-chrome](https://github.com/tianrendong/pi-chrome) | 控制你的真实 Chrome 实例，复用登录态 |

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
