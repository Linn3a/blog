---
title: A Detailed Explanation of PPO -- Part 2 ✌️
subtitle: Determine the advantage estimation method in PPO 🧮
date: 2025-02-27 16:26:43
tags: [dl, rl]
series: 1
cover: /blog/images/gae_cover.png
---
# A Detailed Explanation of PPO —— Part 2

## Preliminaries

In Policy Gradient, we estimate the gradient of policy as

$$
g=\mathbb E[\sum\limits_{t=0}^\infty \Psi_t\nabla\log p_{\theta}(a_t|s_t)]
$$

This depicts the advantage of the current <action, state> pair

![image.png](/blog/images/High-Dimensional%20Continuous%20Control%20Using%20Generali%209a9132716a734b6eaa5545f6b92a8ede/image.png)

We talk about an **undiscounted problem** where the discount factor is absorbed into the reward function. So Equation 2 is the return of **Reinforce** and Equation 6 is equal with the common format of TD residual.

The factor $\gamma$ is introduced to **reduce the variance** of each $\Psi_t$. Due to the presence of randomness, the results of each sampling of future rewards will be different, and the further the rewards are in the future, the stronger the randomness (probabilities are multiplied cumulatively). Therefore, applying $\gamma$ to penalize distant rewards can reduce this randomness, which means reducing the variance. Of course, since the ground truth is the sum of rewards, this approach also introduces bias.  

![image.png](/blog/images/High-Dimensional%20Continuous%20Control%20Using%20Generali%209a9132716a734b6eaa5545f6b92a8ede/image%201.png)

It is easy to verify that the following expressions are $\gamma-just$ advantage estimator for $\hat A_t$ (can provide an unbiased estimation of $g^\gamma$)

![image.png](/blog/images/High-Dimensional%20Continuous%20Control%20Using%20Generali%209a9132716a734b6eaa5545f6b92a8ede/image%202.png)

## Advantage function estimation

As we know, $r_t + \gamma V^{\pi,\gamma}(S_{t+1})-V^{\pi,\gamma}(s_t)$ is TD residual. When value function is correct, TD residual is an unbiased estimation of $g^\gamma$. But in practical situation, $V$ is a learnable estimator of $V^{\pi,\gamma}$, yielding bias estimates of $g^{\gamma}$.

We can define TD-k return $\hat R^k_t$, which is the extension of TD residual, combines actual rewards and estimated returns.

$$
\hat R^k_t=r_t+\gamma r_{t+1}+...+\gamma^{(k-1)}r_{r+k-1}+\gamma^kV(s_{t+k})
$$

$$
\hat A^k_t=\hat R^k_t-V(s_t)=-V(s_t)+\sum\limits_{l=0}^{k-1}\gamma^lr_{t+l} + \gamma^kV(s_{t+k})\\=\delta_t+\gamma \delta_{t+1} + ... + \gamma^k \delta_{t+k}
$$

If k is small, the bias is high because the advantage estimation is based on fewer steps and thus depends heavily on the accuracy of the value function. On the other hand, if k is large, the variance can be high because the advantage estimation involves summing up many noisy rewards.

In order to balance the bias-variance trade-off in the advantage estimation, GAE defines the advantage function as an exponential moving average of k-step advantages, with weights $(1 − \lambda)\lambda^{(k−1)}$

- Weights

  If we have correct value function, the $\hat A^k_t$ is the same for any $t$, so we can regard the sum as an arithmetic sequence which sums up to $\frac{1}{1-\lambda}$ , so we multiple $1-\lambda$ to normalize.

$$
\hat A^{GAE(\gamma,\lambda)}_t=(1-\lambda)(\hat A^{(1)}_t + \lambda \hat A^{(2)}_t+\lambda^2 \hat A^{(3)}_t+...)\\
=(1-\lambda)(\delta_t+\lambda(\delta_t+\gamma\delta_{t+1})+\lambda^2(\delta_t + \gamma\delta_{t+1}+\gamma^2\delta_{t+2})+...)\\
=(1-\lambda)((1+\lambda+\lambda^2 + ...)\delta_t+\gamma(\lambda+\lambda^2 + ...)\delta_{t+1}+...)\\
=(1-\lambda)(\frac{1}{1-\lambda}\delta_t+\frac{\gamma\lambda}{1-\lambda}\delta_{t+1}+...)\\
=\sum\limits_{l=0}^\infty(\gamma\lambda)^l\delta_{t+l}
$$

There are 2 notable special cases of this formula:

![image.png](/blog/images/High-Dimensional%20Continuous%20Control%20Using%20Generali%209a9132716a734b6eaa5545f6b92a8ede/image%203.png)

![image.png](/blog/images/High-Dimensional%20Continuous%20Control%20Using%20Generali%209a9132716a734b6eaa5545f6b92a8ede/image%204.png)

## References
[1] Schulman, John, et al. "High-dimensional continuous control using generalized advantage estimation." arXiv preprint arXiv:1506.02438 (2015).

[2] Zheng, Rui, et al. "Secrets of rlhf in large language models part i: Ppo." arXiv preprint arXiv:2307.04964 (2023).