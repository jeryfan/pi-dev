const fs = require("node:fs");
const path = require("node:path");
const { execSync } = require("node:child_process");
const os = require("node:os");

const home = os.homedir();

// 上游 git 仓库缓存目录（一个设备只需一份）
const externalDir = path.join(home, ".pi", ".external-skills");
// pi 官方全局 skill 扫描目录（pi 自动发现，与 ~/.pi/agent/skills/ 同级）
const globalSkillsDir = path.join(home, ".agents", "skills");
// pi 全局 agent 配置目录
const piAgentDir = path.join(home, ".pi", "agent");

fs.mkdirSync(externalDir, { recursive: true });
fs.mkdirSync(globalSkillsDir, { recursive: true });
fs.mkdirSync(piAgentDir, { recursive: true });

// 配置需要自动安装的非标准 skill（git 仓库）
// - 单 skill：{ name, repo, sourceSubdir }
// - 同一仓库多 skill：{ name（仓库本地目录名）, repo, skills: [{ name（链接名）, sourceSubdir }] }
const externalSkills = [
  {
    name: "ui-ux-pro-max",
    repo: "https://github.com/nextlevelbuilder/ui-ux-pro-max-skill.git",
    sourceSubdir: ".claude/skills/ui-ux-pro-max",
  },
  {
    name: "frontend-design",
    repo: "https://github.com/anthropics/claude-code.git",
    sourceSubdir: "plugins/frontend-design/skills/frontend-design",
  },
];

// 同步 MCP 配置到全局，使安装 pi-dev 后任意项目都能使用 MCP 工具
function syncMcpConfig() {
  const packageRoot = path.join(__dirname, "..");
  const sourcePaths = [
    path.join(packageRoot, "mcp.json"),
    path.join(packageRoot, ".pi", "mcp.json"),
    path.join(piAgentDir, "mcp.json"),
  ];

  const source = sourcePaths.find((p) => fs.existsSync(p));
  if (!source) {
    console.log("[setup-skills] No mcp.json found, skipping MCP config sync");
    return;
  }

  const target = path.join(piAgentDir, "mcp.json");

  try {
    // 读取 pi-dev 提供的配置
    const newRaw = fs.readFileSync(source, "utf-8");
    const newConfig = JSON.parse(newRaw);

    // 以 pi-dev 中的配置为主，直接覆盖全局配置
    fs.writeFileSync(target, `${JSON.stringify(newConfig, null, 2)}\n`);
    console.log(`[setup-skills] Synced MCP config → ${target}`);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[setup-skills] Failed to sync MCP config:`, message);
  }
}

syncMcpConfig();
syncAgentsMd();

function syncAgentsMd() {
  const packageRoot = path.join(__dirname, "..");
  const source = path.join(packageRoot, "global", "AGENTS.md");
  const target = path.join(piAgentDir, "AGENTS.md");

  if (!fs.existsSync(source)) {
    console.log("[setup-skills] No global/AGENTS.md found, skipping AGENTS.md sync");
    return;
  }

  try {
    fs.copyFileSync(source, target);
    console.log(`[setup-skills] Synced AGENTS.md → ${target}`);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[setup-skills] Failed to sync AGENTS.md:`, message);
  }
}

for (const skill of externalSkills) {
  const clonedDir = path.join(externalDir, skill.name);

  // 规范化同一仓库下的子 skill 列表（单 skill 配置向后兼容）
  const subSkills = skill.skills
    ? skill.skills.map((s) => ({
        name: s.name,
        sourceSubdir: s.sourceSubdir ?? "",
      }))
    : [{ name: skill.name, sourceSubdir: skill.sourceSubdir ?? "" }];

  // 1. 克隆或更新上游仓库
  if (fs.existsSync(path.join(clonedDir, ".git"))) {
    try {
      execSync("git pull --depth 1", { cwd: clonedDir, stdio: "pipe" });
      console.log(`[setup-skills] Updated ${skill.name}`);
    } catch {
      console.log(`[setup-skills] Update skipped for ${skill.name}`);
    }
  } else {
    fs.rmSync(clonedDir, { recursive: true, force: true });
    try {
      execSync(`git clone --depth 1 ${skill.repo} "${clonedDir}"`, {
        stdio: "pipe",
      });
      console.log(`[setup-skills] Cloned ${skill.name}`);
    } catch (err) {
      console.error(
        `[setup-skills] Failed to clone ${skill.name}:`,
        err.message,
      );
      continue;
    }
  }

  // 2. 为每个子 skill 建立/更新全局软链接
  for (const sub of subSkills) {
    const skillSource = sub.sourceSubdir
      ? path.join(clonedDir, sub.sourceSubdir)
      : clonedDir;
    const skillLink = path.join(globalSkillsDir, sub.name);

    if (!fs.existsSync(path.join(skillSource, "SKILL.md"))) {
      console.error(
        `[setup-skills] ${sub.name}: SKILL.md not found in ${skillSource}`,
      );
      continue;
    }

    if (fs.existsSync(skillLink)) {
      const stat = fs.lstatSync(skillLink);
      if (stat.isSymbolicLink() || stat.isDirectory()) {
        fs.rmSync(skillLink, { recursive: true, force: true });
      } else {
        fs.unlinkSync(skillLink);
      }
    }

    const type = process.platform === "win32" ? "junction" : "dir";
    fs.symlinkSync(skillSource, skillLink, type);
    console.log(`[setup-skills] Linked ${sub.name} → ${skillLink}`);
  }
}
