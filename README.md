## 私事

* 博客代码重构：搜索、归档分类、列表筛选不分router
* react-admin 升级最新版本
* ~~发npm包模版升级最新版本~~
* hooks!
* ~~滑动拼图验证码 快搞啊~~

## 任务

* ~~首页组件重构~~
* ~~银榜和主板的交易数据不同，获取数据需处理~~
* ~~市场轮询改socket~~
* ~~价格精度全部都要换~~
* ~~n/a~~
* ~~深度图隐藏后不再更新，出现时立即更新一次~~
* ~~多语言~~
* ~~nuxt.js browserHistory发布后路由是否可行(不行，还是要后端设置所有路由返回index.html)~~

## 学习

* Three.js 例子源码学习

## 总是记不住的东西

* rel="nofollow me noopener noreferrer" // a标签防钓鱼
* scroll-behavior: smooth; // 浏览器原生平滑滚动
* (123456789.123).toLocaleString('en-US'); // "123,456,789.123"
* new Intl.NumberFormat().format(123456789.123); // "123,456,789.123"
* pointer-events: none/auto; // 是否响应鼠标事件
* white-space:nowrap;overflow:hidden;text-overflow:ellipsis; // ...
* user-select: none;
* text-align-last
* ::placeholder // 修改placeholder的样式

## 缓存
```
强缓存：
Expires: Date; // 强缓存 http/1.0 服务器时间与本地时间
Cache-Control: max-age=12312312; // 强缓存 最大过期时间与本地时间对比

协商缓存：
Last-Modified： 最后修改时间
ETag: 文件唯一标识
如果强缓存过期，浏览器会在Request请求头中加入两个字段：If-Moified-Since（值对应Last-Modified）和If-None-Match（值对应ETag）字段

服务器自行判断，如果有新的修改，返回200和新内容
如果没有修改，则返回304，告诉浏览器虽然过期但可以继续使用，并且重新已本次的响应头设置缓存

启发缓存
如果响应头中没有能够确定缓存的字段，浏览器会根据Date和Last-Modified的差值的10%作为缓存时间
```
