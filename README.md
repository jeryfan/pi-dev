# pi-dev

个人 pi 开发工具包 —— 通过 `pi install` 在任意环境同步我的常用开发技能、提示模板和扩展。

## 目的

作为开发者，我每天都在不同机器和项目中工作：
- 公司 MacBook
- 个人电脑
- 远程服务器
- 临时借用的设备

在不同环境中，pi 的默认行为无法体现我的开发习惯和技术偏好。这个包把**我的开发助手配置**打包成可安装的 pi 包，让我在任何地方都能一键获得一致的 AI 辅助体验。

## 解决的问题

- ✅ 跨设备同步开发技能和提示模板
- ✅ 统一代码审查标准和重构风格
- ✅ 保持架构设计偏好（技术栈、设计原则）一致
- ✅ 随用随装，更新后全环境同步

## 安装

### 方法 1：从 GitHub 安装（推荐）

```bash
pi install git:github.com/fanjunjie/pi-dev
```

### 方法 2：本地路径安装（开发调试）

```bash
pi install /Users/fanjunjie/Documents/repositories/personal/pi-dev
```

### 方法 3：项目级安装（团队共享）

```bash
# 在项目根目录执行，安装到 .pi/settings.json
pi install -l git:github.com/fanjunjie/pi-dev
```

## 更新

```bash
# 更新单个包
pi update git:github.com/fanjunjie/pi-dev

# 或更新所有包
pi update
```

## 项目结构

```
pi-dev/
├── package.json              # pi 包声明（入口）
├── skills/                   # 技能定义
│   ├── code-review/          # 多维度代码审查
│   ├── refactor/             # 代码重构专家
│   └── architect/            # 系统架构设计
├── prompts/                  # 提示模板
│   ├── clean-code.md         # Clean Code 评审
│   └── api-design.md         # API 设计评审
├── extensions/               # 自定义扩展（预留）
└── themes/                   # 主题（预留）
```

## 包含资源

### Skills

| Skill | 触发方式 | 说明 |
|-------|----------|------|
| `code-review` | pi 自动识别代码审查场景 | 从正确性、可读性、性能、安全性等 6 个维度审查代码 |
| `refactor` | pi 自动识别重构需求 | 遵循小步重构原则，提供提取、简化、消除重复等策略 |
| `architect` | pi 自动识别架构讨论 | 系统架构设计，偏好 Python/FastAPI + React + PostgreSQL 技术栈 |

### Prompts

| Prompt | 使用场景 |
|--------|----------|
| `clean-code` | 提交代码前请求 clean code 评审 |
| `api-design` | 设计 REST API 时请求评审 |

## 使用示例

安装后，pi 会自动加载这些资源。在日常对话中直接描述需求即可：

```
用户: 帮我审查这段代码
pi: [自动触发 code-review skill，输出多维度审查结果]

用户: 这个 API 设计合理吗？
pi: [自动触发 api-design prompt，输出评审意见]

用户: 帮我设计一个电商系统的订单模块
pi: [自动触发 architect skill，按技术栈偏好输出架构方案]
```

## 自定义与扩展

这是一个**活的工具包** —— 我会根据工作需求不断添加新的技能和提示模板。

### 添加新 Skill

```bash
mkdir skills/my-new-skill
cat > skills/my-new-skill/SKILL.md << 'EOF'
# 我的新技能

这里是 skill 的说明...
EOF
```

### 添加新 Prompt

```bash
cat > prompts/my-prompt.md << 'EOF'
# 提示标题

这里是提示内容...
EOF
```

### 推送到 GitHub 同步

```bash
git add .
git commit -m "feat: add new skill"
git push origin main
```

然后在其他机器执行：

```bash
pi update
```

## 技术栈偏好

这个包体现我的技术选择：

- **后端**: Python / FastAPI / Go
- **前端**: React / Next.js / TypeScript
- **数据库**: PostgreSQL / Redis
- **基础设施**: Docker / Kubernetes / AWS
- **原则**: KISS / YAGNI / SOLID / DDD

## 许可

MIT
