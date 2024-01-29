---
title: ssh：connect to host github.com port 22
subtitle: 解决一次git报错 ✅
date: 2024-01-30 20:33:00
tags: [dev, git]
series: 2
---

记一次报错信息:

```
ssh: connect to host github.com port 22: Connection timed out
fatal: Could not read from remote repository.

Please make sure you have the correct access rights and the repository exists.
```

解决：全知全能的Stackoverflow 🙏（）, [参考链接](https://stackoverflow.com/questions/15589682/ssh-connect-to-host-github-com-port-22-connection-timed-out)

在 `~/.ssh/config`文件中添加

```yaml
Host github.com
 Hostname ssh.github.com
 Port 443
```

更改ssh端口为443即可
