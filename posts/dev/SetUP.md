---
title: SetUP
subtitle: SetUP
date: 2021-03-29 16:00:00
tags: [dev,react,vite,tailwindcss]
---

# SetUP

## 前端

### Vite 

```shell
yarn create vite my-vue-app --template vue
```

增加模块

```shell
yarn add antd --save
yarn add @ant-design/pro-components --save
yarn add @ant-design/icons --save 
yarn add styled-components
yarn add axios 
yarn add @tanstack/react-query
yarn add react-router-dom
```

### Tailwindcss

```shell
yarn add -D tailwindcss@latest postcss@latest autoprefixer@latest
```

```shell
npx tailwindcss init -p
```

 `tailwind.config.js` 中加一个content[]

在`index.css`中加上

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

新建文件 `postcss.config.js`

```js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

```cpp
int main(){
    cout<<"hello world!"<<endl;
}
```

