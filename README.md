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

> 该命令会在当前目录生成一个配置文件，配置文件名为`cmdList.json`，其中最外层是脚本名称，里面`main`是脚本执行命令，不同的脚本以逗号分割，onDestroy 是切换脚本或者删除脚本以后会执行的命令

修改好`cmdList.json`后，执行初始化命令

```bash
cmds init`
```

然后就可以查看除了默认的`example`和其他脚本了

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
