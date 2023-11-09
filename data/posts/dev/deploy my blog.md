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
> 有使用服务器和使用`github pages`两种方法

之前的博客不够轻量，为了满足课程要求加了很多不必要的功能。于是用`next js`写了一个静态的博客，想尝试一些CI/CD的解决方法，让更新不再那么负担。

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

> [!note] note
>
> 如果用根用户运行config脚本，可以会报"must not run with sudo"，除了换用户，也可以用改变环境变量的方式解决[^1]：
>
> ```shell
> export AGENT_ALLOW_RUNASROOT=1
> ```

服务器方：

用nginx映射域名，在配置的work目录寻找build命令的输出，配置为nginx的root，重启nginx服务就可以了

# 用github page托管

非常非常简单：

1. repo名应当为`用户名.github.io`
2. 修改`next.config.js`

```javascript
/** @type {import('next').NextConfig} */

module.exports = {
  output: 'export',
};
```

3. 在settings/pages选择`Github Actions`

   ![image-20231109113623596](/images/image-20231109113623596.png)

   然后选择nextjs，等待部署就可以访问了
   
   

[^1]: https://github.com/microsoftDocs/azure-devops-docs/issues/4373
