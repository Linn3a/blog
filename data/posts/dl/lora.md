---
title: Somthing about LoRA
subtitle: 关于LoRA的简单总结
date: 2023-11-11 21:30:00
tags: [dl] 
series: -1
---

> [!summary] 总结
>
> 关于LoRA的非常简单的总结，可能还会有补充。

# 思想

## 优点

一种大模型的微调方法，大幅减少需要调整的参数，也不需要额外的串行层，"no additional inference latency"，可以达到和fine tuning差不多的结果。

## 原理

调参时权重的变化有很低的`instrinsic rank`，所以对参数的调整可以被分解为对两个低秩矩阵的调整

# 实现

## 怎么用

前向过程中$\Delta W=BA$

初始化时将B初始化为0，A随机高斯初始化

$h=W_0x+\frac{\alpha }{r}\Delta Wx=W_0 x+\frac{\alpha}{r}BAx$

$\alpha$是常数，$r$是超参

## 在哪些层使用

transformer层的几个权重矩阵$W_k,W_q,W_v,W_o$



> [!Note] 参考链接
>
> [原论文](https://arxiv.org/pdf/2106.09685.pdf)
>
> [官方实现](https://github.com/microsoft/LoRA/blob/main/loralib/layers.py)
>
> [一篇详尽的讲解](https://zhuanlan.zhihu.com/p/618894919)

