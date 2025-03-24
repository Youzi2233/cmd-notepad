#!/usr/bin/env node
const { program } = require("commander");
const inquirer = require("inquirer");
const fs = require("fs");
const pkg = require("../package.json");
const cmdList = require("../cmdList.json");
const path = require("path");
const chalk = require("chalk");

const { RunScript, RemoveScript } = require("./utils.js");

program.version(pkg.version);

program
  .command("ls")
  .description("查看脚本列表")
  .action(() => {
    console.log(chalk.blue(Object.keys(cmdList).join("\n")));
  });

program
  .command("add")
  .description("添加脚本")
  .action(() => {
    //命令行交互工具
    inquirer
      .prompt([
        {
          type: "input",
          name: "cmdName",
          message: "请输入脚本名称",
          validate(cmdName) {
            const keys = Object.keys(cmdList);
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
      ])
      .then((result) => {
        const { cmdName, main, onDestroy } = result;
        cmdList[cmdName] = {
          main,
          onDestroy,
        };
        try {
          fs.writeFileSync(path.join(__dirname, "../cmdList.json"), JSON.stringify(cmdList, null, 4));
          console.log(chalk.blue("添加完成"));
        } catch (e) {
          console.log(chalk.red(e));
        }
      });
  });

program
  .command("run")
  .description("选择执行脚本")
  .action(async () => {
    const result = await inquirer.prompt([
      {
        type: "list",
        name: "name",
        message: "请选择脚本",
        choices: Object.keys(cmdList),
      },
    ]);
    RunScript(result.name);
  });

program
  .command("remove <name>")
  .description("移除执行脚本")
  .action((name) => {
    RemoveScript(name);
  });

program
  .command("gs")
  .description("生成脚本集文件")
  .action(async () => {
    // 将cmdList.json文件复制到当前目录
    fs.copyFileSync(path.join(__dirname, "../cmdList.json"), path.join(process.cwd(), "cmdList.json"));
  });

program
  .command("init")
  .description("根据当前目录下的cmdList.json进行初始化")
  .action(async () => {
    // 检查当前目录下是否有cmdList.json文件
    if (fs.existsSync(path.join(process.cwd(), "cmdList.json"))) {
      // 将cmdList.json文件复制到当前目录
      fs.copyFileSync(path.join(process.cwd(), "cmdList.json"), path.join(__dirname, "../cmdList.json"));
      console.log(chalk.green("初始化成功"));
    } else {
      console.log(chalk.red("当前目录下没有cmdList.json文件"));
    }
  });

program.parse(process.argv);
