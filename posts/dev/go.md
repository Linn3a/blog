---
title: Go
subtitle: Go
date: 2021-05-05 19:30:00
tags: [dev,Go]

---

# GO

## 入门

### 配置开发环境

1. 安装Golang
2. 配置集成开发环境：vscode // Goland

### 语法

#### 变量声明

1. 显示声明 var 名字 类型 = 值
2. 隐式声明  := 0

> 常量没有类型

#### 循环

只有for

#### switch

不用加break

#### 数组

var a [5]int

#### 切片

长度可变的数组

```go
s := make([]string,3)
// 追加
s = append(s,"d")
s = append(s,"e","f")

// 拆分
s[2:5]
s[:5]
```

#### map

完全无序

```go
m := make(map[string]int)
r,ok := m["unknow"]
//若没有 ok = false
delete(m,"one")
```

#### range

```go
for k,v := range m{
    //k 是key
    //v 是value
}
```

#### 函数

```go
//形参 类型后置
//返回多个值
func exists(m map[string]int,k string)(v string, ok bool){
    v,ok = m[k]
    return v,ok
}
```

#### 指针

改变形参的方法

#### 结构

```go
type user struct {
    name string
    password string
}
// 成员函数
func (u user) checkPassword(password string) bool {
    return u.password == password
}
```

#### 错误处理

返回值加一个 err error

```go
return nil,errors.New("not found")
```

#### 字符串操作

![image-20230505193017386](C:\Users\cos\AppData\Roaming\Typora\typora-user-images\image-20230505193017386.png)

##### 字符串格式化

用v限制长度

![image-20230505193054707](C:\Users\cos\AppData\Roaming\Typora\typora-user-images\image-20230505193054707.png)

#### JSON处理 

``` go
import {
    "encoding/json"
    "fmt"
}

type userInfo struct {
    Name string
    Age int `json:"age"`
    Hobby []string
}
buf,err := json.Marshal(a)
```

处理请求：定义一个完全一致的结构体 然后反序列化 从 json 到结构

> https://oktools.net/json2go

#### 时间

<img src="C:\Users\cos\AppData\Roaming\Typora\typora-user-images\image-20230505194811686.png" alt="image-20230505194811686" style="zoom:67%;" />

#### 数字解析

<img src="C:\Users\cos\AppData\Roaming\Typora\typora-user-images\image-20230505194920552.png" alt="image-20230505194920552" style="zoom:67%;" />

## 实战

#### 生成代码

请求：

> http://curlconverter.com/#go

用 go func

可以理解成开启一个子进程

开销小，可以轻松处理很多并发

## 工程实践

### 语言进阶

#### 并发 & 并行

##### Goroutine

协程：更轻量的线程，一次可以创建上万个协程

```go
go func(j int) {
    hello(j)
}(i)
```

##### CSP

协程可以通信 

##### Chanel

 

### 依赖管理

### 测试

### 项目实战

## GORM

![image-20230505202739726](C:\Users\cos\AppData\Roaming\Typora\typora-user-images\image-20230505202739726.png)