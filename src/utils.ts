import fs from "fs";
import { execSync } from "child_process";
import chalk from "chalk";
import cmdList from "../cmdList.json";
import destroyScript from "../destroyScript.json";
import { CMDLISTPATH, DESTROYSCRIPTPATH } from "./common";
import type { CMDListType } from "./typing";

/**
 * 校验文件/路径是否存在
 */
export const isPathExist = (path: string) => {
  return fs.existsSync(path);
};

// 退出程序，由于有catch输出错误信息，需要阻止后续代码执行，这里参考了nrm源码
export const exit = (error?: unknown) => {
  if (error) {
    console.error(chalk.red(error));
  }
  process.exit(1);
};

/**
 * 写入对象到指定路径
 */
export const WriteToFile = (obj: object, path: string) => {
  try {
    fs.writeFileSync(path, JSON.stringify(obj, null, 4));
  } catch (e) {
    exit(e);
  }
};

export const CopyFileToPath = (src: fs.PathLike, dest: fs.PathLike) => {
  try {
    fs.copyFileSync(src, dest);
  } catch (e) {
    exit(e);
  }
};

/**
 * 执行命令
 */
export const RunExec = (cmd: string) => {
  try {
    const result = execSync(cmd);
    console.log(`执行 -> ${cmd}`);
    console.log(result.toString("utf-8"));
  } catch (e) {
    exit(e);
  }
};

/**
 * 执行脚本
 */
export const RunScript = (scName: string) => {
  if (!scName) {
    return;
  }
  const _cmdList: CMDListType = cmdList;
  const _destroyScript = destroyScript;
  // 执行脚本之前先执行上一个需要销毁的脚本
  if (_destroyScript.current) {
    RunExec(_destroyScript.current);
  }
  const scriptObj = _cmdList[scName];
  const scriptContent = scriptObj.main;
  const scripts = scriptContent.split(",");
  let idx = 0;
  while (idx !== scripts.length) {
    const script = scripts[idx].trim();
    RunExec(script);
    idx++;
  }
  console.log(chalk.green("执行完成！"));
  // 记录需要销毁的脚本
  _destroyScript.current = scriptObj.onDestroy ?? "";
  WriteToFile(_destroyScript, DESTROYSCRIPTPATH);
};

/**
 * 重置销毁脚本
 */
export const ResetDestroy = () => {
  const _destroyScript = destroyScript;
  if (!_destroyScript.current) {
    return;
  }
  _destroyScript.current = "";
  WriteToFile(_destroyScript, DESTROYSCRIPTPATH);
};

/**
 * 执行销毁方法，前提是当前指向的销毁脚本和传入一致才会执行
 * 思考了一下，不应该说没有运行过脚本，而remove掉不应该执行销毁脚本
 */
export const RunDestroyScript = (script?: string) => {
  if (!script) {
    return;
  }
  const _destroyScript = destroyScript;
  // 判断传入的script和当前指向的destroyScript是否一致，一致才去销毁
  if (_destroyScript.current === script) {
    RunExec(_destroyScript.current);
    ResetDestroy();
  }
};

/**
 * 移除脚本
 */
export const RemoveScript = (scName: string) => {
  const _cmdList: CMDListType = cmdList;
  if (!_cmdList[scName]) {
    console.log(chalk.red(`没有这个脚本 ${scName}`));
    return;
  }
  const currentDestroyScript = _cmdList[scName].onDestroy;
  delete _cmdList[scName];
  WriteToFile(_cmdList, CMDLISTPATH);
  RunDestroyScript(currentDestroyScript);
  console.log(chalk.red.green("移除成功"));
};

/**
 * 判断对象，强用于TS类型校验
 */
export const isObject = (obj: unknown): obj is Record<string, unknown> => {
  return Object.prototype.toString.call(obj) === "[object Object]";
};

/**
 * 校验对象是否符合CMDListType约束
 */
export const ValidateCMDList = (obj: unknown): obj is CMDListType => {
  if (!isObject(obj)) {
    return false;
  }
  const keys = Object.keys(obj);
  // 空对象也算
  return keys.every((k) => {
    return isObject(obj[k]) && typeof obj[k].main === "string";
  });
};
