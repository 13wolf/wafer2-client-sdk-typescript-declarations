# wafer2-client-sdk 的 typescript 的定义文件

## 安装

1. 通过小程序开发工具建立新的的小程序模板，请选择 TypeScript 模板；
   ![Alt text](/images/1.png "Optional title")

2. 打开命令行输入下面命令  
   `npm install wafer2-client-sdk`
3. 将下载的文件放在 typings 文件夹中,并在 typings/index.d.ts 文件中添加  
   `/// <reference types="wafer2-client-sdk" />`

4. 在需要使用的地方引用就可以了  
   `import * as qcloud from "wafer2-client-sdk";`

   `var qcloud = require('./node_modules/wafer2-client-sdk/index.js');`
5. 由于小程序不支持直接引用

## 声明：本人刚刚开始了解TypeScript，水平有限，有错误请指正
