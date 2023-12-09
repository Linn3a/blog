---
title: 在linux环境下安装nodejs
subtitle: 在ubuntu安装nodejs
date: 2023-12-09 11:33:00
tags: [dev]
series: 2
cover: /images/node.png
---

> [!abstract] abstract
>
> 在ubuntu中安装nodejs和yarn

#  下载node

参考官方仓库[^1]


1.Download and import the Nodesource GPG key

```shell
sudo apt-get update
sudo apt-get install -y ca-certificates curl gnupg
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | sudo gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg
```



2. Create deb repository

```
NODE_MAJOR=20
echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_$NODE_MAJOR.x nodistro main" | sudo tee /etc/apt/sources.list.d/nodesource.list
```

> `NODE_MAJOR` 是指明node版本的,可以根据需要修改
>
> ```shell
> NODE_MAJOR=16
> NODE_MAJOR=18
> NODE_MAJOR=20
> NODE_MAJOR=21
> ```

3. update and install

```shell
sudo apt-get update
sudo apt-get install nodejs -y
```

4. test

``` shell
nodejs -v
```

# 下载yarn

直接用npm,需要用sudo

```shell
sudo npm install --global yarn
```

测试

```shell
yarn -v
```




[^1]:https://github.com/nodesource/distributions
