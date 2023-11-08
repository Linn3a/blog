---
title: React Query
subtitle: React Query
date: 2021-03-29 16:00:00
tags: [dev,React]
---

# React Query

## 发送请求 

```javascript
const {isLoading,data,isError,error} = useQuery({
    // 第一个参数：放唯一标识的queryID
    // 第二个参数：放fetch函数
    // 第三个参数：所有配置项 是一个对象
})
```

###  配置项

#### 发送请求相关

`refetchOnMount` true，false，"always"

`refetchOnWindowsFocus`

`refecthInterval`  只有focus到该页时才定时发送，单位是ms

`refecthIntervalInBackground` 后台刷新

`enable` 设为false 可以用按钮 onClick={refetch} 只会在按了按钮之后fetch一下

#### 回调函数

提供了两项 

`onSuccess`

`onError`

`select`修改data

```javascript
select:(data)=>{
    const superHeroNames = data.res.map(hero => hero.name)\
    return superHeroNames;
}
```

## Mutation

