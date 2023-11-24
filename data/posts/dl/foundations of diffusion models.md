---
title: 傻子也能看懂的Diffusion Models数学基础(1)
subtitle: 数学苦手博主的匠心之作😼 我都能懂相信你也行🤲
date: 2023-11-23 22:00:00
---

> [!abstract] 总结
>
> 本篇文章介绍了扩散模型的数学原理（DDPM）

# 前言

在学习Diffusion Model的时候，最困难的部分就是数学推导。著名的开山之作DDPM中的数学推导跳步很多，非常晦涩。这促成了本文的诞生。

本篇文章会以最通俗易懂的方式详细推导DM的数学原理，之后的文章会讲述SDM等衍生模型的原理，欢迎指正！


# DDPM: Denoising Diffusion Probalilistic Model

用$x_0$表示真实数据，这是从一个分布$q(x_0)$中采样的结果

$\epsilon_0\sim N(0,I)$ 是从高斯分布采样出的噪音

## 前向过程

向$x_0$中添加噪音，此时引入一组参数$\{\beta_t\}$ $\beta_t$是与时间有关的超参数，diffusion相关实现中的scheduler就是用于得到这组参数的

现在$\beta_t$表示了噪音的占比，随着时间增加，噪音的比例应该越来越大

这和扩散现象一致，随着时间增长，散开的越来越快



所以我们表示一步增加噪音为：

$$x_{t}=\sqrt{1-\beta_{t}}x_{t-1}+\sqrt{\beta_t}\epsilon_{t-1}$$

> [!question] 你可能会问
>
> 为什么这里要加根号？
>
> 因为我们都知道这个参数会令方差发生平方倍的变化，这里加根号利于后续化简

对于加噪音的过程，我们可以用重参数化技巧，把它变成一个式子：

为了方便化简 令$\alpha_t=1-\beta_t$

$$x_{t}=\sqrt{1-\beta_{t}}x_{t-1}+\sqrt{\beta_t}\epsilon_{t-1}$$

$$=\sqrt{\alpha_{t}}x_{t-1}+\sqrt{1-\alpha_t}\epsilon_{t-1}$$

$$=\sqrt{\alpha_t}(\sqrt{\alpha_{t-1}}x_{t-2}+\sqrt{1-\alpha_{t-1}}\epsilon_{t-2})+\sqrt{1-\alpha_t}\epsilon_{t-1}$$

$$=\sqrt{\alpha_t\alpha_{t-1}}x_{t-2}+\sqrt{1-\alpha_t\alpha_{t-1}}\epsilon_{t-2}$$

......

$\sqrt{\alpha_t...\alpha_1}x_0+\sqrt{1-(\alpha_t...\alpha_1)}x_1$

令$\overline{\alpha_t}=\prod_1^t\alpha_i$

$x_t=\sqrt{\overline{\alpha_t}}x_0+\sqrt{1-\overline{\alpha_t}}\epsilon$

所以服从的分布是

$q(x_t|x_0)=\mathcal{N}(x_t;\sqrt{\overline{\alpha_t}}x_0),\sqrt{1-\overline{\alpha_t}}I$

## 反向过程

反向过程是给定$x_t$，预测$x_{t-1}$

根据贝叶斯公式

$q(x_{t-1}|x_t,x_0)=\frac{q(x_{t-1}|x_0)}{q(x_t|x_0)}q(x_t|x_{t-1},x_0)$

一个一个看：

$q(x_{t-1}|x_0)\sim \mathcal{N}(\sqrt{\overline{\alpha_{t-1}}}x_0, 1-\overline{\alpha_{t-1}})$

$q(x_{t}|x_0)\sim \mathcal{N}(\sqrt{\overline{\alpha_{t}}}x_0, 1-\overline{\alpha_{t}})$

$q(x_t|x_{t-1},x_0)\sim\mathcal{N}(\sqrt{\alpha_{t}}x_{t-1}, 1-\alpha_t)$

直接算 把高斯分布展开 因为我们想要得到均值 所以可以只关注指数

$q(x_{t-1}|x_t,x_0)\propto exp\{-\frac{1}{2}(\frac{(x_{t-1}-\sqrt{\overline{\alpha_{t-1}}}x_0)^2}{1-\overline{\alpha_{t-1}}}+\frac{(x_{t}-\sqrt{\alpha_{t}}x_{t-1})^2}{1-\alpha_t}-\frac{(x_{t}-\sqrt{\overline{\alpha_{t}}}x_0)^2}{1-\overline{\alpha_{t}}})\}$

目的是在分子配方配出来$(x_{t-1}-\hat{\mu})^2$ $x_0$和$x_t$当成参数

配出来的结果是：

$\mu(x_t,t)=\frac{1-\overline{\alpha_{t-1}}}{1-\overline{\alpha_t}}\sqrt{\alpha_t}x_t+\frac{\sqrt{\overline{\alpha_{t-1}}}\beta_t}{1-\overline{\alpha_t}}x_0$

因为$x_0$可以用$x_t$表示（前面的前向加噪公式）

所以这个均值可以表示为

$\mu(x_t,t)=\frac{1}{\sqrt{\alpha_t}}(x_t-\frac{\beta_t}{\sqrt{1-\overline{\alpha_t}}}\epsilon(x_t,t))$

好好好 这个式子里面只有一个值是我们不知道的🥳 那就是$\epsilon(x_t,t)$  这个浓眉大眼的家伙是前向过程中加入的噪声

<br/>

怎么得到这个噪声？

我们构造一个神经网络来预测他，因此$\epsilon$变为$\epsilon_\theta$，ground truth是前向过程添加的噪声

这个神经网络的损失函数是：

$$||\epsilon-\epsilon_\theta(\sqrt{\overline{\alpha_t}}x_0+\sqrt{1-\overline{\alpha_t}}\epsilon,t)||$$

<br />

而我们想要得到的 $\hat x_{t-1}$ 服从一个高斯分布，其均值为：

$\mu_\theta(x_t,t)=\frac{1}{\sqrt{\alpha_t}}(x_t-\frac{\beta_t}{\sqrt{1-\overline{\alpha_t}}}\epsilon_\theta(x_t,t))$ 