---
title: Echarts
subtitle: Echarts
date: 2021-03-29 16:00:00
tags: [dev]
---

# Echarts

## 引入

```shell
yarn add echarts
yarn add echarts-for-react
```

> [!abstract] `sudo rm -rf` is *dangerous*!
> Although this simple command can help you easily remove a folder, this command should be used with extra care.


> [!note] `sudo rm -rf` is *dangerous*!
> Although this simple command can help you easily remove a folder, this command should be used with extra care.

> [!info] `sudo rm -rf` is *dangerous*!
> Although this simple command can help you easily remove a folder, this command should be used with extra care.


> [!todo] `sudo rm -rf` is *dangerous*!
> Although this simple command can help you easily remove a folder, this command should be used with extra care.


> [!example] `sudo rm -rf` is *dangerous*!
> Although this simple command can help you easily remove a folder, this command should be used with extra care.

> [!success] `sudo rm -rf` is *dangerous*!
> Although this simple command can help you easily remove a folder, this command should be used with extra care.

> [!question] `sudo rm -rf` is *dangerous*!
> Although this simple command can help you easily remove a folder, this command should be used with extra care.

> [!answer] `sudo rm -rf` is *dangerous*!
> Although this simple command can help you easily remove a folder, this command should be used with extra care.

> [!warning] `sudo rm -rf` is *dangerous*!
> Although this simple command can help you easily remove a folder, this command should be used with extra care.


> [!failure] `sudo rm -rf` is *dangerous*!
> Although this simple command can help you easily remove a folder, this command should be used with extra care.

> [!danger] `sudo rm -rf` is *dangerous*!
> Although this simple command can help you easily remove a folder, this command should be used with extra care.

> [!bug] `sudo rm -rf` is *dangerous*!
> Although this simple command can help you easily remove a folder, this command should be used with extra care.

> [!quote] `sudo rm -rf` is dangerous!
> Although this simple command can help you easily remove a folder, this command should be used with extra care.


## 使用

```js
import ReactEcharts from "echarts-for-react"
import echarts from "echarts";
```

配置option[^1]

```js
const option: ECOption = {
    title: {
        text: 'ECharts 入门示例'
      },
      tooltip: {},
      legend: {
        data: ['销量']
      },
      xAxis: {
        data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
      },
      yAxis: {},
      series: [
        {
          name: '销量',
          type: 'bar',
          data: [5, 20, 36, 10, 10, 20]
        }
      ]
};
```

渲染：

```js
  return (
            <ReactEcharts option={Option}/>
        )
```

[^1]: [Echarts](https://echarts.apache.org/zh/index.html)