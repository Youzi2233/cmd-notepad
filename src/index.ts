#!/usr/bin/env node
import { program } from "commander";
import { onAdd, onGs, onInit, onLs, onRemove, onRun } from "./action";
import pkg from "../package.json";

program.version(pkg.version);

program.command("ls").description("查看脚本列表").action(onLs);

program.command("add").description("添加脚本").action(onAdd);

program.command("run").description("选择执行脚本").action(onRun);

program.command("remove <name>").description("移除执行脚本").action(onRemove);

program.command("gs").description("生成脚本集文件").action(onGs);

program
  .command("init")
  .description("根据当前目录下的cmdList.json进行初始化")
  .action(onInit);

program.parse(process.argv);
