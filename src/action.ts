import inquirer from "inquirer";
import { CopyFileToPath, isPathExist, RemoveScript, ResetDestroy, RunScript, ValidateCMDList, WriteToFile } from "./utils";
import cmdList from "../cmdList.json";
import fs from "fs";
import chalk from "chalk";
import { CMDLISTNAME, CMDLISTPATH, CMDLISTPATH_USER } from "./common";
import type { CMDListType } from "./typing";

/**
 * cmds ls
 */
export const onLs = () => {
  const _cmdList: CMDListType = cmdList;
  console.log(chalk.blue(Object.keys(_cmdList).join("\n")));
};

/**
 * cmds run
 */
export const onRun = async () => {
  const _cmdList: CMDListType = cmdList;
  const result = await inquirer.prompt([
    {
      type: "list",
      name: "name",
      message: "请选择脚本",
      choices: Object.keys(_cmdList),
    },
  ]);
  RunScript(result.name);
};

/**
 * cmds add
 */
export const onAdd = async () => {
  const _cmdList: CMDListType = cmdList;
  //命令行交互工具
  const result = await inquirer.prompt([
    {
      type: "input",
      name: "cmdName",
      message: "请输入脚本名称",
      validate(cmdName) {
        const keys = Object.keys(_cmdList);
        if (keys.includes(cmdName)) {
          return `${cmdName}脚本已存在`;
        }
        if (!cmdName.trim()) {
          return "脚本名称不能为空";
        }
        return true;
      },
    },
    {
      type: "input",
      name: "main",
      message: "请输入脚本内容",
      validate(mainScript) {
        if (!mainScript.trim()) {
          return "脚本内容不能为空";
        }
        return true;
      },
    },
    {
      type: "input",
      name: "onDestroy",
      message: "请输入切换或删除脚本之后执行的脚本内容，为空不执行",
    },
  ]);
  const { cmdName, main, onDestroy } = result;
  _cmdList[cmdName] = {
    main,
    onDestroy,
  };
  WriteToFile(_cmdList, CMDLISTPATH);
  console.log(chalk.blue("添加完成"));
};

/**
 * cmds remove
 */
export const onRemove = (name: string) => {
  RemoveScript(name);
};

/**
 * cmds gs
 */
export const onGs = async () => {
  // 将全局的cmdList.json文件复制到用户当前目录
  CopyFileToPath(CMDLISTPATH, CMDLISTPATH_USER);
  console.log(chalk.green(`已在当前目录生成${CMDLISTNAME}文件`));
};

/**
 * cmds init
 */
export const onInit = async () => {
  // 检查当前目录下是否有cmdList.json文件
  if (!isPathExist(CMDLISTPATH_USER)) {
    console.error(chalk.red(`当前目录下没有${CMDLISTNAME}文件`));
    return;
  }
  const errorPrint = () => {
    console.error(chalk.red(`出错！请检查${CMDLISTNAME}文件内容`));
  };
  const content = fs.readFileSync(CMDLISTPATH_USER, "utf-8");
  try {
    const contentJson = JSON.parse(content);
    if (!ValidateCMDList(contentJson)) {
      errorPrint();
      return;
    }
    // 将cmdList.json文件复制到当前目录
    CopyFileToPath(CMDLISTPATH_USER, CMDLISTPATH);
    ResetDestroy();
    console.log(chalk.green("初始化成功"));
  } catch {
    errorPrint();
  }
};
