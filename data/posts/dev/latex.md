---
title: 不定期更新的Latex小妙招
subtitle: 很高兴你也喜欢写论文 🥣
date: 2024-02-02 01:33:00
tags: [dev, latex, tips]
series: 6
cover: /blog/images/latex.jpg
---

> [!abstract] abstract
>
> 好记性不如烂笔头（好吧这里也没有笔、），不定期放一些latex小妙招，方便自己查阅。 

# 不带编号的section

```latex
\section{带编号的section}

\section*{不带编号的section}
```

## 不带编号，但上toc

[参考](https://www.latexstudio.net/archives/3602.html) [真正的原创 💢](https://liam0205.me/2015/04/10/how-to-list-unnumbered-section-in-the-table-of-contents/)

- 法一： 单独加一行toc
 
    ```latex
    \addcontentsline{toc}{section}{不带编号的section}
    \tableofcontents
    ```
- 法二：新写一个命令

    ```latex
   \documentclass{ctexart}
    \usepackage{tocloft}
    \makeatletter
    \newcommand\specialsectioning{\par
        \setcounter{section}{0}%
        \setcounter{subsection}{0}%
        \renewcommand\thesection{\relax}%
        \def\@seccntformat##1{\@nameuse{the##1}}%
        \addtocontents{toc}{\def\cftsecnumwidth{0pt}}}
    \makeatother
    \begin{document}
    \tableofcontents
    \section{正常编号的章节标题}
    \specialsectioning
    \section{不编号的章节标题}
    \end{document}
    ```

# 在论文中添加算法

```latex
\usepackage{algorithm}

\begin{algorithm}
    \caption{算法标题}
    \label{alg:algorithm-label}
    \begin{algorithmic}[1]
        \REQUIRE 输入
        \ENSURE 输出
        \STATE 算法描述
    \end{algorithmic}
\end{algorithm}
```

# 图片嵌入段落中

```latex
\begin{wrapfigure}[lineheight]{position}{width}
  ...
\end{wrapfigure}
```

> [!example] 示例
>
> 使用方式及示例来自[overleaf 🍃](https://www.overleaf.com/learn/latex/Wrapping_text_around_figures)
>
> ```latex
> \begin{wrapfigure}{r}{0.5\textwidth}
>   \begin{center}
>     \includegraphics[width=0.48\textwidth]{birds}
>   \end{center}
>   \caption{Birds}
>  \label{fig:birds}
> \end{wrapfigure}
> ```
>