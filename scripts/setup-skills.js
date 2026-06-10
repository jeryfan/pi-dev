const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const os = require('os');

const home = os.homedir();

// 上游 git 仓库缓存目录（一个设备只需一份）
const externalDir = path.join(home, '.pi', '.external-skills');
// pi 官方全局 skill 扫描目录（pi 自动发现，与 ~/.pi/agent/skills/ 同级）
const globalSkillsDir = path.join(home, '.agents', 'skills');

fs.mkdirSync(externalDir, { recursive: true });
fs.mkdirSync(globalSkillsDir, { recursive: true });

// 配置需要自动安装的非标准 skill（git 仓库）
const externalSkills = [
  {
    name: 'ui-ux-pro-max',
    repo: 'https://github.com/nextlevelbuilder/ui-ux-pro-max-skill.git',
    sourceSubdir: '.claude/skills/ui-ux-pro-max',
  },
];

for (const skill of externalSkills) {
  const clonedDir = path.join(externalDir, skill.name);
  const skillSource = skill.sourceSubdir
    ? path.join(clonedDir, skill.sourceSubdir)
    : clonedDir;
  const skillLink = path.join(globalSkillsDir, skill.name);

  // 1. 克隆或更新上游仓库
  if (fs.existsSync(path.join(clonedDir, '.git'))) {
    try {
      execSync('git pull --depth 1', { cwd: clonedDir, stdio: 'pipe' });
      console.log(`[setup-skills] Updated ${skill.name}`);
    } catch {
      console.log(`[setup-skills] Update skipped for ${skill.name}`);
    }
  } else {
    fs.rmSync(clonedDir, { recursive: true, force: true });
    try {
      execSync(`git clone --depth 1 ${skill.repo} "${clonedDir}"`, { stdio: 'pipe' });
      console.log(`[setup-skills] Cloned ${skill.name}`);
    } catch (err) {
      console.error(`[setup-skills] Failed to clone ${skill.name}:`, err.message);
      continue;
    }
  }

  if (!fs.existsSync(path.join(skillSource, 'SKILL.md'))) {
    console.error(`[setup-skills] ${skill.name}: SKILL.md not found in ${skillSource}`);
    continue;
  }

  // 2. 更新全局 skill 软链接
  if (fs.existsSync(skillLink)) {
    const stat = fs.lstatSync(skillLink);
    if (stat.isSymbolicLink() || stat.isDirectory()) {
      fs.rmSync(skillLink, { recursive: true, force: true });
    } else {
      fs.unlinkSync(skillLink);
    }
  }

  const type = process.platform === 'win32' ? 'junction' : 'dir';
  fs.symlinkSync(skillSource, skillLink, type);
  console.log(`[setup-skills] Linked ${skill.name} → ${skillLink}`);
}
