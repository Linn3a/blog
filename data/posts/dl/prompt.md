---
title: 我做prompt engineer那些年
subtitle: GPT时代必备的prompt技巧 😎
date: 2023-11-13 23:39:00
tags: [dl]
---

> [!summary] 总结
> 
> 介绍了一些书写prompt的技巧。其中一些宝贵的经验来自于吴恩达老师[^1]


# 尽量清晰和明确

1. 使用分割符
   
   用分隔符把`system message`和`user message`分开，这样模型就能更好的区分两者。更通俗的说法，将全局的信息和局部的、当前的信息分开。

   你可以使用的分隔符有

   ```
    triple quotes: """ """
    triple backticks: ``` ```
    triple dashes: --- ---
    angle brackets: <system> <human>
    XML tags: <tag> <tag/>
   ```

2. 明确输出
   
   在你需要的时候，指明输出格式，比如

   ```
   Provide them in JSON format with the following keys: book_id, ...
   ```

   并且，如果你对输出有额外的要求，也要指出，比如
   ```
    The output should be a list of strings, each string being a sentence.
   ```

3. Few-shot prompting 提供成功执行任务的示例
   
    提供一些成功执行任务的示例
    
    ```
     Here are some examples of successful executions of this task:
     ...
    ```
    
    > [!tip] 作弊 🤫
    > 你也可以把不满意的示例放在这里，并且分析这样不对的原因，让你的模型避免不满意的输出。    


# 让模型思考

1. 指明完成该任务所需的步骤
    为模型构造一个“思维链”，让模型知道完成该任务所需的步骤
    
    ``` 
    Your task is to perform the following actions:
    
    - 1. ...
    - 2. ...
    - 3. ...
    ```
2. 当你判断对错时，先“独立思考”
   
   当你用chatGPT来判断一道数学题的对错时，结果总是不那么好。但是如果你先让模型做这道题，得出自己的答案，再与正确答案进行比较，效果就会好很多。
   

# 一个通用模板

```
Your task is to perform the following actions:

1. - balabala
2. - balabala
3. - balabala

Use the following format:

Text: <text to summarize>

Summary:

Translation:

Names:

Output JSON: <JSON with summary and num_names>

Text to summarize: <{text}>
```

[^1]:https://learn.deeplearning.ai/chatgpt-prompt-eng