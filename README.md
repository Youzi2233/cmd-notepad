# cmd-notepad

因为本人经常在自己电脑频繁切换公司和自己的 `git config`中的 `user.name、user.email、http.proxy` 等，所以写了这个脚本，方便切换。当然你可以自由的保存你常用的一些命令。

## 下载

```bash
npm i cmd-notepad -g
```

## 使用

### 查看命令

```bash
cmds --help
```

### 生成配置命令文件，根据配置文件初始化

```bash
cmds gs
```

> 该命令会基于全局脚本配置在当前目录生成一个配置文件，配置文件名为`cmdList.json`，其中最外层是脚本名称，里面`main`是脚本执行命令，不同的脚本以逗号分割，onDestroy 是切换脚本或者删除脚本以后会执行的命令

默认是这样：

```json
{
  "example": {
    "main": "echo man",
    "onDestroy": "echo manba out"
  },
  "company-gitConfig": {
    "main": "git config --global user.name XXXX, git config --global user.email XXXX",
    "onDestroy": ""
  },
  "myself-gitConfig": {
    "main": "git config --global user.name XXXX, git config --global user.email XXXX, git config --global http.proxy 127.0.0.1:XXXX",
    "onDestroy": "git config --global --unset http.proxy"
  }
}
```

修改`cmdList.json`，将 XXXX 替换为你自己的信息，可以删除也可以改名最外层 key，然后执行初始化命令，以便将配置应用到全局

> 注意不是说改了当前目录的配置文件就生效，你可以理解为命令备份，只需要把生成的配置文件拷贝在另一个电脑某一个目录下，执行下面的命令就可以同步了

继续在当前目录下执行以下命令，会在当前目录查找`cmdList.json`文件，然后根据配置文件初始化全局脚本

```bash
cmds init
```

可以查看脚本

```bash
cmds ls
```

### 添加脚本

> 看各自爱好，上面一种方式和当前都可以进行添加脚本

```bash
cmds add
```

### 执行脚本

```bash
cmds run
```

选择一个脚本执行

### 删除脚本

```bash
cmds remove <脚本名称>
```
