---
title: A Detailed Explanation of PPO -- Part 1 👆
subtitle: From Policy Gradient to PPO 🙌
date: 2024-10-18 16:26:43
tags: [dl, rl]
series: 1
cover: /blog/images/ppo_cover.png
---
# A Detailed Explanation of PPO —— Part 1 👆

## 01. Importance Sampling

Previously, reinforcement learning methods often adopted the on-policy approach. ==To ensure that the currently learning agent is consistent with the exploring agent, it is usually necessary to use the new agent to explore the environment again after each parameter update, save the data, and then conduct the next round of parameter updates.==

In contrast, we can use the off-policy method to learn the policy. The remarkable advantage is that we can use the initial agent to explore the environment and try to collect enough interaction data for learning **in one go**.
So, how can we ensure that the old interaction data can serve the new agent? Here, we need to use the idea of **importance sampling**.

### Importance Sampling

Suppose there are distributions $p$, $q$, and there is an expectation

$$\mathbb E_{x\sim p}[f(x)]=\int f(x)p(x)dx=\int f(x)\frac{p(x)}{q(x)}q(x)\\=\mathbb E_{x\sim q}[f(x)\frac{p(x)}{q(x)}]$$

So, as long as we multiply by the importance of weight $\frac{p(x)}{q(x)}$, we can calculate the expectation under the current distribution using the data from another distribution.

It should be noted that after multiplying by the importance weight, the expectations under the two distributions remain the same, but the variances are different. We have:

$$\mathbb{var}_{x\sim p}[f(x)]=\mathbb E_{x\sim p}[f(x)^2]-(\mathbb E_{x\sim p}[f(x)])^2$$

$$\mathbb{var}_{x\sim q}[f(x)\frac{p(x)}{q(x)}]=\mathbb E_{x\sim q}[(f(x)\frac{p(x)}{q(x)})^2]-(\mathbb E_{x\sim q}[f(x)\frac{p(x)}{q(x)}])^2\\=\mathbb E_{x\sim p}[f(x)^2\frac{p(x)}{q(x)}]-(\mathbb E_{x\sim p}[f(x)])^2$$

The first terms of the two variances are different. So, if the number of samples is too small, ==due to the difference in variances, the expectation calculated from the sampled data may not be consistent with the true expectation==

### How to Transfer Importance Sampling to Reinforcement Learning?

According to Policy gradient:

$$\nabla \overline R_{\theta}=\mathbb E_{\tau \sim p_{\theta}(\tau)}[R(\tau)\nabla\log p_{\theta}(\tau)]$$

If we add importance sampling and the parameters of the reference agent which denoted $\theta'$

We have:

$$\nabla \overline R_{\theta}=\mathbb E_{\tau \sim p_{\theta’}(\tau)}[R(\tau)\frac{p_{\theta}(x)}{p_{\theta'}(x)}\nabla\log p_{\theta}(\tau)]$$

> [!info] Importance Weight
> The importance weight is the ratio of probability distributions, and it corresponds to the subscript of the expectation mentioned before.
> So we need to multiply by $\frac{p_{\theta}(x)}{p_{\theta'}(x)}$

In practice, we usually do not use the entire trajectory but update the weight using each state-action pair, that is

$$\mathbb E_{(s_t,a_t)\sim \pi_{\theta}}[A^{\theta}(s_t,a_t)\nabla\log p_\theta(a_t|s_t)]$$

Using importance sampling, this formula is equivalent to:

$$\mathbb E_{(s_t,a_t)\sim \pi_{\theta'}}[\frac{p_\theta(s_t,a_t)}{p_\theta'(s_t,a_t)}A^{\theta}(s_t,a_t)\nabla\log p_\theta(a_t|s_t)]$$

$P_\theta(a_t|a_t)$ is the output of the policy

According to the Bayes' formula $P(s_t,a_t) = p(a_t|s_t)p(s_t)$

So:

$$\mathbb E_{(s_t,a_t)\sim \pi_{\theta'}}[\frac{p_\theta(a_t|s_t)p_\theta(s_t)}{p_{\theta'}(a_t|s_t)p_{\theta'}(s_t)}A^{\theta}(s_t,a_t)\nabla\log p_\theta(a_t|s_t)]$$

Because:

- The state is usually independent of the action, that is, it is independent of the parameters $\theta$.
- The probability of the state is difficult to estimate.

So we assume that $p_\theta(s_t) = p_{\theta'}(s_t)$ and omit this term.
We get:

$$\mathbb E_{(s_t,a_t)\sim \pi_{\theta'}}[\frac{p_\theta(a_t|s_t)}{p_{\theta'}(a_t|s_t)}A^{\theta}(s_t,a_t)\nabla\log p_\theta(a_t|s_t)]$$

Using the gradient to infer the objective function, since

$$\nabla f(x)=f(x)\nabla\log f(x)$$

According to Policy Gradient, the formula above is the gradient of objective function. To infer the objective function, we can take $A^{\theta}(s_t,a_t)$, $p_{\theta'}(a_t|s_t)$ as constants (The value of A^{\theta} is determined by environment). And we can regard $p_{\theta}(a_t|s_t)$ as $f(x)$. We get the objective function:

$$J_{\theta'}(\theta) = \mathbb E_{(s_t,a_t)\sim \pi_{\theta'}}[\frac{p_\theta(a_t|s_t)}{p_{\theta'}(a_t|s_t)}A^{\theta}(s_t,a_t)]$$

## 02. Proximal Policy Optimization (PPO)

As mentioned before, after multiplying by the importance weight, the original distributions are not completely the same. If the two distributions differ too much or the variance is too large, the effect of importance sampling will not be very good.
==The main idea of PPO is to add a constraint to make the distance between the two distributions not too large. It is easy to think that we can add a **KL divergence** as a regularization term here==

> [!info] KL Divergence
> The physical meaning of KL divergence: the distance between the predicted distribution and the true distribution.
>
> $$D(p||q)=H(p,q)-H(p)\\=-\sum p(x)\log(q(x)) + \sum p(x)\log (p(x))\\=-\sum p(x)\log \frac{q(x)}{p(x)}$$
>
> The reason we use KL divergence here instead of directly regularizing the parameters is that we are measuring the distance of actions, not the distance of parameters.

After adding the constraint:

$$J_{PPO}^{\theta'}=J^{\theta'}(\theta)-\beta KL(\theta,\theta')$$

$$J_{\theta'}(\theta) = \mathbb E_{(s_t,a_t)\sim \pi_{\theta'}}[\frac{p_\theta(a_t|s_t)}{p_{\theta'}(a_t|s_t)}A^{\theta}(s_t,a_t)]$$

There is also an article with a similar idea: **Trust Region Policy Optimization (TRPO)**. The objectve function of TRPO is:

$$J_{TRPO}^{\theta'}=\mathbb E_{(s_t,a_t)\sim \pi_{\theta'}}[\frac{p_\theta(a_t|s_t)}{p_{\theta'}(a_t|s_t)}A^{\theta}(s_t,a_t)],~KL(\theta,\theta')<\delta$$

However, this kind of constraint is difficult to handle in gradient-based optimization methods. To solve this, there are two variants of PPO, namely PPO-Penalty based on the penalty term and PPO-Clip based on clipping.

###  PPO-Penalty

That is:

$$J_{PPO1}^{\theta^k}=J^{\theta^k}(\theta)-\beta KL(\theta,\theta^k)$$

$$J_{\theta^k}(\theta) \approx \sum\limits_{(s_t,a_t)}\frac{p_\theta(a_t|s_t)}{p_{\theta^k}(a_t|s_t)}A^{\theta}(s_t,a_t)$$

In the original paper, the value of $\beta$ can be modified, and it is also called the adaptive PPO penalty.

If $KL>KL_{max}$, it means that the latter term does not impose much constraint, and we increase $\beta$ .

If $KL<KL_{max}$, it means that the constraint imposed by the latter term is too large, and we decrease $\beta$.

### PPO-Clip

Instead of introducing KL divergence, we directly constrain the value of the importance weight.
Clip the importance weight so that

$$1-\epsilon \le \frac{p_{\theta}(a_t|s_t)}{p_{\theta'}(a_t|s_t)}\le 1+\epsilon$$

So:

$$J_{PPO2}^{\theta^k}=\sum\limits_{(s_t,a_t)}\min(\frac{p_\theta(a_t|s_t)}{p_{\theta^k}(a_t|s_t)}A^{\theta}(s_t,a_t),clip(\frac{p_\theta(a_t|s_t)}{p_{\theta^k}(a_t|s_t)},1-\epsilon,1+\epsilon)A^{\theta}(s_t,a_t))$$

> [!summary] Takeway
>
> PPO aims to address the problem of ==importance sampling's ineffectiveness when distributions differ much==. It does so by adding a KL - divergence as a regularization term. There are two PPO variants: PPO - Penalty, which adaptively adjusts the value based on KL - divergence, and PPO - Clip, which directly ==clips the importance weight==.

## Reference

[1] Qi Wang, Yiyuan Yang, Ji Jiang，Easy RL: Reinforcement Learning Tutorial，Posts & Telecom Press，<https://github.com/datawhalechina/easy-rl>, 2022.
