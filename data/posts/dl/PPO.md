---
title: 👆文详解PPO 
date: 2024-10-18 16:26:43
tags: [dl,rl]
series: 1
cover: /blog/images/ppo_cover.png
---
# 👆文详解PPO

## 01. 重要性采样（Importance Sampling）

之前的强化学习方法常常采用on-policy方法，为了保证当前学习的agent和探索的agent一致，通常要在每次更新参数后用新的agent再次探索环境，保存数据，以进行下一轮参数更新。
与之相对的，我们可以用off-policy方法来学习策略。显著的好处是，可以用初始的agent探索环境，尽量**一次性**收集足够多的交互数据用于学习。
那么，如何保证旧的交互数据可以服务于新的agent呢？这里需要用到**重要性采样**的思想。
### 重要性采样

假设有分布 $p$, $q$，有期望

$$\mathbb E_{x\sim p}[f(x)]=\int f(x)p(x)dx=\int f(x)\frac{p(x)}{q(x)}q(x)\\=\mathbb E_{x\sim q}[f(x)\frac{p(x)}{q(x)}]$$

所以说，只要乘重要性权重$$\frac{p(x)}{q(x)}$$
就可以用另一个分布的数据计算当前分布下的期望

需要注意的是，乘上重要性权重后，两个分布下的期望保持不变，但是方差不同，有：
$$\mathbb{var}_{x\sim p}[f(x)]=\mathbb E_{x\sim p}[f(x)^2]-(\mathbb E_{x\sim p}[f(x)])^2$$

$$\mathbb{var}_{x\sim q}[f(x)\frac{p(x)}{q(x)}]=\mathbb E_{x\sim q}[(f(x)\frac{p(x)}{q(x)})^2]-(\mathbb E_{x\sim q}[f(x)\frac{p(x)}{q(x)}])^2\\=\mathbb E_{x\sim p}[f(x)^2\frac{p(x)}{q(x)}]-(\mathbb E_{x\sim p}[f(x)])^2$$

两个反差的第一项是不同的 所以如果采样次数过少，由于方差有差别，根据收集到的数据计算的期望可能和真实期望不一致

### 怎么把重要性采样迁移到强化学习？

策略梯度：
$$\nabla \overline R_{\theta}=\mathbb E_{\tau \sim p_{\theta}(\tau)}[R(\tau)\nabla\log p_{\theta}(\tau)]$$

如果加上重要性采样，参考的agent参数为$\theta'$
有：
$$\nabla \overline R_{\theta}=\mathbb E_{\tau \sim p_{\theta’}(\tau)}[R(\tau)\frac{p_{\theta}(x)}{p_{\theta'}(x)}\nabla\log p_{\theta}(\tau)]$$

> [!info] 重要性权重
> 重要性权重是概率分布的比值，和前面期望的角标是对应的
> 所以要乘$\frac{p_{\theta}(x)}{p_{\theta'}(x)}$

实践中，通常不是用整个trajectory，而是用每一个state-action对来更新权重，即
$$\mathbb E_{(s_t,a_t)\sim \pi_{\theta}}[A^{\theta}(s_t,a_t)\nabla\log p_\theta(a_t|s_t)]$$
用重要性采样：
$$\mathbb E_{(s_t,a_t)\sim \pi_{\theta'}}[\frac{p_\theta(s_t,a_t)}{p_\theta'(s_t,a_t)}A^{\theta}(s_t,a_t)\nabla\log p_\theta(a_t|s_t)]$$

因为$P_\theta(a_t|a_t)$ 就是policy的输出
所以用贝叶斯
$P(s_t,a_t) = p(a_t|s_t)p(s_t)$
所以：
$$\mathbb E_{(s_t,a_t)\sim \pi_{\theta'}}[\frac{p_\theta(a_t|s_t)p_\theta(s_t)}{p_{\theta'}(a_t|s_t)p_{\theta'}(s_t)}A^{\theta}(s_t,a_t)\nabla\log p_\theta(a_t|s_t)]$$

因为：
- 状态通常和动作无关，即为与参数无关
- 状态的概率难以估计
所以假设 $p_\theta(s_t) = p_{\theta'}(s_t)$，省去这一项
得到：
$$\mathbb E_{(s_t,a_t)\sim \pi_{\theta'}}[\frac{p_\theta(a_t|s_t)}{p_{\theta'}(a_t|s_t)}A^{\theta}(s_t,a_t)\nabla\log p_\theta(a_t|s_t)]$$

用梯度反推目标函数，由于
$$\nabla f(x)=f(x)\nabla\log f(x)$$
把 $\theta'$ 相关的都看作常数，得到目标函数：
$$J_{\theta'}(\theta) = \mathbb E_{(s_t,a_t)\sim \pi_{\theta'}}[\frac{p_\theta(a_t|s_t)}{p_{\theta'}(a_t|s_t)}A^{\theta}(s_t,a_t))$$
## 02. 近端策略优化（PPO）

前面说过了，乘上重要性权重后原来的分布并不是完全等同的。如果两个分布相差过大，或者方差过大，重要性采样的效果就不会很好
ppo的主要思想就是增加一个约束，以使得两个分布距离不大，很容易想到这里增加的分布是KL散度

> [!info] KL散度
> KL散度的物理意义：预测分布 与 真实分布的距离
> 
> $$D(p||q)=H(p,q)-H(p)\\=-\sum p(x)\log(q(x)) + \sum p(x)\log (p(x))\\=-\sum p(x)\log \frac{q(x)}{p(x)}$$
> 
> 这里用kl散度 而不是直接对参数求正则 原因是衡量的是action的距离，而不是参数的距离

加上约束之后：
$$J_{PPO}^{\theta'}=J^{\theta'}(\theta)-\beta KL(\theta,\theta')$$

$$J_{\theta'}(\theta) = \mathbb E_{(s_t,a_t)\sim \pi_{\theta'}}[\frac{p_\theta(a_t|s_t)}{p_{\theta'}(a_t|s_t)}A^{\theta}(s_t,a_t)]$$

思路相同的还有一篇文章：信任区域策略优化（trust region policy optimization, TRPO）

$$J_{TRPO}^{\theta'}=\mathbb E_{(s_t,a_t)\sim \pi_{\theta'}}[\frac{p_\theta(a_t|s_t)}{p_{\theta'}(a_t|s_t)}A^{\theta}(s_t,a_t)],~KL(\theta,\theta')<\delta$$

但是这种约束在基于梯度的优化方法中是很难处理的

PPO有两种变种，分别是基于惩罚项的 PPO-Penalty 和基于裁剪的 PPO-Clip
### PPO-Penalty
即：

$$J_{PPO1}^{\theta^k}=J^{\theta^k}(\theta)-\beta KL(\theta,\theta^k)$$

$$J_{\theta^k}(\theta) \approx \sum\limits_{(s_t,a_t)}\frac{p_\theta(a_t|s_t)}{p_{\theta^k}(a_t|s_t)}A^{\theta}(s_t,a_t)$$

原论文中 $\beta$ 值是可以修改的 也称为adaptive PPO penalty

若$KL>KL_{max}$  就说明后面这项没有造成什么约束 增大 $\beta$

若$KL<KL_{max}$  就说明后面这项没有造成的约束过大 减小 $\beta$
### PPO-Clip
不引入kL散度，而是直接约束重要性权重的值
裁剪重要性权重，使得
$$1-\epsilon \le \frac{p_{\theta}(a_t|s_t)}{p_{\theta'}(a_t|s_t)}\le 1+\epsilon$$
所以：

$$J_{PPO2}^{\theta^k}=\sum\limits_{(s_t,a_t)}\min(\frac{p_\theta(a_t|s_t)}{p_{\theta^k}(a_t|s_t)}A^{\theta}(s_t,a_t),clip(\frac{p_\theta(a_t|s_t)}{p_{\theta^k}(a_t|s_t)},1-\epsilon,1+\epsilon)A^{\theta}(s_t,a_t))$$
