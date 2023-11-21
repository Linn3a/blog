---
title: 记录部署博客的经过
subtitle: 用github actions部署nextjs项目，涉及workflow和github page
date: 2023-11-09 00:40:00
tags: [dev]
---



> [!abstract] abstract
>
> 用`github actions`实现nextjs静态博客的部署和持续集成。
>
> 有使用`github pages`和使用服务器两种方法
>
> **更新**：
>
> 在升级为next14后发现原来的workflow脚本跑不了了🫥 所以这是一个更新版 

之前的博客不够轻量，为了满足课程要求加了很多不必要的功能。于是用`next js`写了一个静态的博客，想尝试一些CI/CD的解决方法，让更新不再那么负担。

# 用github page托管

在用github page托管前，你首先需要拥有一个github仓库，像这样：

## 设立一个远程仓库

仓库名一般为`{username}.github.io`

> [!note] note
>
> 仓库名为`{user}.github.io`的仓库，部署的页面会在github pages 的根页面下
>
> 其他repo会部署到`{user}.github.io/{repo}`下

把代码push到远端，你可以用这些命令


```shell
# 连接远程仓库
git remote add origin <url>

git branch -M main

git add <file>
git commit -m"msg"
git pull origin main
git push origin main
```

> [!Tip] Tips
>
> 不会git命令行？看我的博客 [这里应该有一个链接但是我还没有写完]()

现在你已经把代码push到仓库👏 下面我们用Github创建一个workflow文件

## 创建workflow文件

我愿称之为半自动法，请跟我一起操作：

![image-20231121201018.png](/images/image-20231121201018.png)

点击`configure`之后，可以看到github提供了一个nextjs的workflow脚本，但是他不是很适合我们尊贵的next14使用者😐 所以需要做一点个性化修改：

改动一 从51行开始

```shell
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
 		      node-version: "20"
          cache: ${{ steps.detect-package-manager.outputs.manager }}
      - name: Setup Pages
        uses: actions/configure-pages@v3
```
`node-version`改为20



改动二 从78行开始

next14不支持export，build之后会自动生成`./out`文件夹，所以可以在build之后直接部署

```shell
      - name: Build with Next.js
        run: ${{ steps.detect-package-manager.outputs.runner }} next build
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v2
```
删除了以下两行
```
      - name: Static HTML export with Next.js 
        run: ${{ steps.detect-package-manager.outputs.runner }} next export 
```

修改完之后直接commit到`main`分支，然后你就可以在`Actions`看到你的网站在静悄悄的打包部署了😉

----

# 部署到服务器

将代码push到仓库，点击`Actions`，选择`node js`

![image-20231109110919345](/images/image-20231109110919345.png)

选择之后会自动生成workflow/node.js.yml 文件，因为我的依赖管理是yarn不是npm，所以修改脚本为：

```yaml
	# ...
	runs-on: self-hosted
	# ...
	steps:
    - uses: actions/checkout@v3
    - name: Use Node.js ${{ matrix.node-version }}
      uses: actions/setup-node@v3
      with:
        node-version: ${{ matrix.node-version }}
        cache: 'yarn'
   - run: yarn add
   - run: yarn run build --if-present
   - run: yarn test
```

接下来配置self-hosted runner

选择 settings/Runners

![image-20231109112300671](/images/image-20231109112300671.png)

点击`New self-hosted runner`

选择架构

![image-20231109113229263](/images/image-20231109113229263.png)

用服务器运行下面的命令就可以了

> [!Tip] Tips
>
> 如果用根用户运行config脚本，可以会报"must not run with sudo"，除了换用户，也可以用改变环境变量的方式解决[^1]：
>
> ```shell
> export AGENT_ALLOW_RUNASROOT=1
> ```

服务器方：

用nginx映射域名，在配置的work目录寻找build命令的输出，配置为nginx的root，重启nginx服务就可以了

>[!failure] failure
>
>这一套流程看起来无比简单，但是实践中遇到了莫大的困难、、、因为服务器通过github下载依赖，在没有代理的情况下非常非常非常慢 基本上没有成功的时候、

   


[^1]: https://github.com/microsoftDocs/azure-devops-docs/issues/4373
