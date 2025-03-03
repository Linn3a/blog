---
title: Utilizing RL for Post Training Phase of Large Language Models (3)
subtitle: "Extension of classic RL Algorithms: REINFORCE++"
date: 2025-02-28 16:26:43
tags: [dl, rl]
series: 1
cover: /blog/images/reinforce_cover.png
---

# Utilizing RL for Post Training Phase of Large Language Models (3)

## Method

In conclusion, REINFORCE++ is the original version of REINFORCE plus some tricks in  PPO to enhance training stability and efficiency.

These tricks include:

1. Token-Level KL Penalty

   ![image.png](/blog/images/REINFORCE++%20A%20Simple%20and%20Efficient%20Approach%20for%20Al%200bcdbe51ff494634b31d38fab7b17ba4/image.png)

2. PPO-Clip Integration

   ![image.png](/blog/images/REINFORCE++%20A%20Simple%20and%20Efficient%20Approach%20for%20Al%200bcdbe51ff494634b31d38fab7b17ba4/image%201.png)

   To review PPO, see [PPO blog](https://linn3a.github.io/blog/posts/dl/PPO).

3. Mini-Batch Updates

   Instead of updating after a full-batch (One experience-making)

4. Reward Normalization and Clipping

   - Normalization: Standardizes rewards using z-score normalization to mitigate outliers.
   - Clipping: Constrains reward values within predefined bounds to avoid instability.
   - Scaling: Applies appropriate scaling factors for numerical stability during updates.

5. Advantage Normalization

   ![image.png](/blog/images/REINFORCE++%20A%20Simple%20and%20Efficient%20Approach%20for%20Al%200bcdbe51ff494634b31d38fab7b17ba4/a66fe1df-cd1c-49ef-8e50-5f39462b534c.png)

   where $\mu_A$ and $\sigma_A$ represent the batch mean and standard deviation respectively. Normalization ensures stable gradients and prevents divergence during training.

## Empirical Evaluation & Analysis

Compared to PPO:

The biggest difference between these two models is that REINFORCE++ does not need a critic model. 

In the actor-critic-style RL algorithm, the critic model (value model) is introduced to estimate state-value so that we can estimate advantage. But in REINFORCE++, the advantage is calculated by the normalized advantage within a batch.

It saves much training time compared to PPO.

Experimental results:

![image.png](/blog/images/REINFORCE++%20A%20Simple%20and%20Efficient%20Approach%20for%20Al%200bcdbe51ff494634b31d38fab7b17ba4/image%202.png)

## Reference

[1] Hu, Jian. "REINFORCE++: A Simple and Efficient Approach for Aligning Large Language Models." *arXiv preprint arXiv:2501.03262* (2025).
