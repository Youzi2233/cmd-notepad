const fs = require("fs");
const { execSync } = require("child_process");
const chalk = require("chalk");
const path = require("path");

const cmdList = require("../cmdList.json");
const destroyScript = require("../destroyScript.json");

/**
 * 执行命令
 * @param {string} cmd
 */
const RunExec = (cmd) => {
  if (cmd.startsWith("echo")) {
    console.log(cmd.replace("echo ", ""));
    return;
  }
  try {
    execSync(cmd);
  } catch (e) {
    console.log(chalk.red(e));
  }
};

/**
 * 执行脚本
 * @param {string} scName
 */
const RunScript = (scName) => {
  if (!scName) {
    return;
  }
  // 执行脚本之前先执行上一个需要销毁的脚本
  if (destroyScript.current) {
    RunExec(destroyScript.current);
  }
  const scriptObj = cmdList[scName];
  const scriptContent = scriptObj.main;
  const scripts = scriptContent.split(",");
  let idx = 0;
  while (idx !== scripts.length) {
    RunExec(scripts[idx].trim());
    idx++;
  }
  console.log(chalk.green("执行成功"));
  // 记录需要销毁的脚本
  destroyScript.current = scriptObj.onDestroy ?? "";
  try {
    fs.writeFileSync(path.join(__dirname, "../destroyScript.json"), JSON.stringify(destroyScript, null, 4));
  } catch (e) {
    console.log(chalk.red(e));
  }
};

/**
 * 移除脚本
 * @param {string} scName
 */
const RemoveScript = (scName) => {
  if (!cmdList[scName]) {
    console.log(chalk.red(`没有这个脚本 ${scName}`));
    return;
  }
  try {
    delete cmdList[scName];
    fs.writeFileSync(path.join(__dirname, "../cmdList.json"), JSON.stringify(cmdList, null, 4));
    console.log(chalk.red.green("移除成功"));
  } catch (e) {
    console.log(chalk.red(e));
  }
};

module.exports = {
  RunScript,
  RemoveScript,
  RunExec,
};
