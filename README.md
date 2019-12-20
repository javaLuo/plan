## 事情

* 加tslint☑️
* 相册☑️
* 博客代码重构：搜索功能,卡片，底部链接换https，底部重新设计☑️
* 归档/about me☑️
* 实验一下FLIP ☑️
* 研究拖拽布局
* three 地球数据迁移效果
* 建模- 眼睛，头部，上身，管道，周围场景，巨型飞船
* http知识
* 蝌蚪游戏研究

## 学习

- vue-cli typescript
- typescript
- create-react-app typescript

## 文档

https://www.css88.com/book/css/ CSS文档<br/>
http://616pic.com/ 图片网 可下载<br/>
https://developers.google.com/search/docs/guides/search-gallery?hl=zh-cn 谷歌搜索增强 <br/>
https://www.paperplane.app/blog/print-css-basics/ css控制打印时的一些特定样式 <br/>
## 总是记不住的东西

1. a标签防钓鱼
```js
rel="nofollow me noopener noreferrer"
```
2. 浏览器原生平滑滚动
```css
scroll-behavior: smooth; 
```
3. 原生千分位格式化,只支持3位小数
```js
(123456789.123).toLocaleString('en-US'); // 第1种方法 "123,456,789.123"
new Intl.NumberFormat().format(123456789.123); // 第2种方法 "123,456,789.123"
```
4. 是否响应鼠标事件
```css
pointer-events: none/auto;
```
5. 放不下显示省略号
```css
white-space:nowrap;
overflow:hidden;
text-overflow:ellipsis;
```
6. 强制换行
```css
word-break:break-all;
word-wrap:break-word;
```
7. 禁止选取
```css
user-select: none;
```
8. 最后一行两端对齐
```css
text-align-last:justify;
```
9. 修改placeholder的样式
```css
::placeholder
```
10. 鼠标位置相关
```js
e.clientX // 鼠标距离当前窗口左上角的坐标
e.pageX   // 鼠标距离当前窗口包括滚动条已滚动距离的坐标
e.offsetX // 鼠标距离当前所在元素左上角的坐标
```
11. 关闭chrome跨域限制
```node
/** mac 终端执行： */
open -n /Applications/Google\ Chrome.app/ --args --disable-web-security  --user-data-dir=/Users/admin/Documents/MyChromeDevUserData

/** windows 设置chrome快捷方式链接地址 */
--disable-web-security --user-data-dir=C:\MyChromeDevUserData
```
12. 隐藏input[number]的上下选择箭头
```css
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
input[type='number'] {
  -moz-appearance: textfield;
}
```
13. 正则解析URL参数部分
```js
q={};
location.search.replace(/([^?&=]+)=([^&]+)/g,(_,k,v)=>q[k]=v);
console.log(q); // { key: value }
```
14. 数字强制等宽显示
```css
font-variant-numeric: tabular-nums;
```
15.css文字渐变
```css
background-image:-webkit-linear-gradient(bottom,red,#fd8403,yellow); 
-webkit-background-clip:text; 
-webkit-text-fill-color:transparent; 
// https://segmentfault.com/a/1190000017015544
```
16.手动触发弹出安装PWA
```javascript
// 定义一个变量，为了保存event对象
let thisEvent;

/**
  监听beforeinstallprompt这个事件
  如果网站支持PWA且用户没有安装过，则会触发此事件（Chrome地址栏右侧会出现“安装”字样）
  若用户已安装过或已不是首次打开网页，此事件不会触发（即Chrome地址栏右侧没有出现“安装”字样）
**/
window.addEventListener("beforeinstallprompt", e => {
  // 阻止 Chrome 67 之前的版本自动显示提示
  e.preventDefault();
  // 保存这个特殊的e，之后要用
  thisEvent = e;
});
    
// 用户点击按钮时触发此方法
function installApp() {
  thisEvent.prompt(); // 弹出安装提示框
  thisEvent.userChoice.then(res => {
    console.log(res); // 用户点击安装或取消，会返回对应的信息
  });
}

// 页面中写个按钮触发
<button onclick="installApp">安装PWA桌面应用</button>
```
17. 手机自带暗模式媒体查询
```css
@media (prefers-color-scheme: dark) {
  body {
    background-color: #444;
    color: #e4e4e4;
  }
  img {
    filter: grayscale(30%);
  }
}
```
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
