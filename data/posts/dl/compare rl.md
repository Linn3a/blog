---
title: Comparison of Some Commonly Used RL Algorithms
subtitle: "包括 PPO, RLOO, GRPO, REINFORCE++，和一些伪代码实现"
date: 2025-03-14 19:16:43
tags: [dl, rl]
series: 1
---

# Comparison of Some Commonly Used RL Algorithms

从 deepseek 🐳 公布 [r1 technical report](https://arxiv.org/abs/2501.12948) 后，rl 在 reasoning 方面的应用逐渐受到关注。prm 已经是过去式，rule based reward 才是唯一的出路。 所以说，要想不落后于时代，人人都需要懂得一点 rl。在这篇文章中，博主将比较一些在reasoning训练中常用的rl算法，包括PPO, RLOO, GRPO, REINFORCE++。

而且对博主本人来说，代码比公式更好懂，所以我会用伪代码来解释这些算法。😎
> 伪代码实现主要参考 OpenRLHF 和 VeRl

## Background：在 LLM 里我们怎么使用 RL

其实不管什么算法，在rl里使用的基本步骤都是
1. generate experience
   
   我们维护一个experience replay buffer。在每个step，首先做actor用采样，得到policy model 和 ref model对应的logits，然后用reward model打分得到reward，最后估计advantage
2. 训练policy model
   
   用估计的advantage来更新policy model
3. (optional) 更新critic model
   
   用td error来更新critic model

## Comparison

其实这几个方法都在训练的时候用了 ppo-clip，所以区别其实在generate experience的时候。

## Advantage Estimation

### PPO

PPO用GAE估计advantage （你可以在[PPO blog](https://linn3a.github.io/blog/posts/dl/GAE)中找到我对GAE的解释）

简单来说 GAE是一个对 $\delta$(TD residual)的加权和，权重是$\lambda$和$\gamma$，$\lambda$是加权求和的权重，$\gamma$是 td-k 中的 discount factor

当然，因为 $\delta$ 用到了 value，所以在ppo中我们需要用到一个 critic model

伪代码实现如下：

```python
# 1. scalar reward => reward of each step

# compute kl
kl = log_prob - log_prob_ref

reward = torch.zeros_like(kl)
reward[eos_index] = scalar_reward
reward = reward - kl_penalty * kl

# 2. compute advantage

# get value
value = critic(sequences, action_mask)

# gae

# delta_i = r_i + gamma * V(s_{i+1}) - V(s_i) 
# A(s_i, a_i) = delta_i + gamma * lambda * delta_{i+1} + gamma^2 * lambda^2 * delta_{i+2} + ...

# compute from end of sequence
last_item = 0
last_value = 0
advantages_reversed = []

for t in reversed(range(response_length)):
    nextvalues = values[:, t + 1] if t < response_length - 1 else 0.0
    delta = rewards[:, t] + gamma * nextvalues - values[:, t]
    last_item = delta + gamma * lambda_ * last_item
    advantages_reversed.append(last_item)
advantages = torch.stack(advantages_reversed[::-1], dim=1)
returns = advantages + values
```

### RLOO

非常好的RLOO讲解可以在 [🤗](https://huggingface.co/blog/putting_rl_back_in_rlhf_with_rloo) 这里找到

在GAE的原论文里其实提到，有很多种估计advantage的方法，除了用 critic model 估计 value，还可以用 组间的 baseline 替代 value

RLOO 的 baseline 设置是 leave one out，即用组内除了该样本之外的所有样本的平均值作为baseline

![alt text](/blog/images/compare_rl/image.png)

代码实现上请参考

```python
# 1. scalar reward => reward of each step

# compute kl
kl = log_prob - log_prob_ref

rewards = torch.zeros_like(kl)
rewards[:,eos_index] = scalar_reward
reward = reward - kl_penalty * kl

# 2. compute rloo reward

rewards = torch.cat(rewards)
rewards = rewards.reshape(-1, args.n_samples_per_prompt).to(device="cuda")
baseline = (rewards.sum(-1, keepdim=True) - rewards) / (args.n_samples_per_prompt - 1)
rewards = rewards - baseline
rewards = rewards.flatten().chunk(len(experiences))

# 3. convert to advantage
# use accumulated reward 
accumulated_return = torch.zeros(reward.size(0))
returns = torch.zeros_like(reward)

for t in reversed(range(reponse_length)):
    accumulated_reward = reward[:,t] + gamma * accumulated_reward
    returns[:, t] = accumulated_reward 
```


> [!note] 补充
>
> 虽然原论文里说RLOO是把整个sequence视作一个action，但是从各个框架的代码实现来说，还是会把advantag分到每个token上，这样在算loss的时候就沿用policy gradient，把每个token的advantage 和 logp乘起来

### GRPO

GRPO 是由 Deepseek 提出的一种 RL 算法，它和 RLOO 一样，用 baseline 取代了 critic model

[DeepseekMath](https://arxiv.org/abs/2402.03300) 比较了 GRPO 和 PPO 的算法区别：

![alt text](/blog/images/compare_rl/image-1.png)

GRPO 用 group normalized reward 作为 baseline，reward - baseline 就是 advantage

并且在算 loss 中的 kl penalty时，GRPO 用 unbiased kl estimator 计算 kl，即 $r - 1 - logr$, 其中 $r=\log\frac{p_{ref}}{p}$

伪代码实现如下，其实和RLOO差不多：

```python
# 1. scalar reward => reward of each step

# compute kl
kl = log_prob - log_prob_ref

rewards = torch.zeros_like(kl)
rewards[;, eos_index] = scalar_reward
reward = reward - kl_penalty * kl

# 2. compute group normalized reward

rewards = rewards.reshape(-1, args.n_samples_per_prompt)
rewards = (rewards - rewards.mean(-1, keepdim=True)) / (rewards.std(-1, keepdim=True) + 1e-9)
rewards = rewards.reshape(-1).chunk(len(experiences))

# 3. convert to advantage
# use accumulated reward 
accumulated_return = torch.zeros(reward.size(0))
returns = torch.zeros_like(reward)

for t in reversed(range(reponse_length)):
    accumulated_reward = reward[:,t] + gamma * accumulated_reward
    returns[:, t] = accumulated_reward 
```

### REINFORCE++

和 grpo 更像，只是没有组的概念，直接对整个 batch 做 normalization

```python
# 1. scalar reward => reward of each step

# compute kl
kl = log_prob - log_prob_ref

rewards = torch.zeros_like(kl)
rewards[;, eos_index] = scalar_reward
reward = reward - kl_penalty * kl

# 2. compute group normalized reward
# list => tensor
rewards = torch.cat(rewards)
rewards = (rewards - rewards.mean(-1, keepdim=True)) / (rewards.std(-1, keepdim=True) + 1e-9)
# tensor => list
rewards = rewards.reshape(-1).chunk(len(experiences))

# 3. convert to advantage
# use accumulated reward 
accumulated_return = torch.zeros(reward.size(0))
returns = torch.zeros_like(reward)

for t in reversed(range(reponse_length)):
    accumulated_reward = reward[:,t] + gamma * accumulated_reward
    returns[:, t] = accumulated_reward 
```

