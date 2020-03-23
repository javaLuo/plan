## 事情

* 研究拖拽布局
* three 地球数据迁移效果
* http知识
- 套利程序
- 博客静态化
- 专升本复习小程序

- 移动端适配
- 交易页order不同选择调不同接口，现在还没接口，socket也需要有判断
- 借款要加一个同意协议 V
- 等balanceG接口好了，全面开始资产页面各数据处理，划转，借还处理
- 杠杆：资产页图表缺接口，风险缺接口，order历史页缺接口

- hooks改写
- typescript研究
- grid 实践


## 学习

- vue-cli typescript
- typescript
- react hooks具体实践
- react-admin升antd4.0


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

18. github改了密码，重置sourcetree密码
```
WIN:
删除 C:\Users\用户\用户名\AppData\Local\Atlassian\password
sourcetree重新提交会弹出登录框
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

## 过渡的坑
```
像vue-transition-group这样的列表过渡组件
在窗口非激活状态（最小化，电脑休眠等）时，浏览器为了节约性能，会停止setTimeout/setInterval/requestAnimationFrame以及页面dom的渲染
如果此时数据仍然在更新（比如socket不会停止），则列表中的dom会越来越多，不需要的dom不会被浏览器清除

```

## vscode 配置
```
{
  "editor.tabSize": 2, // tab相当于2个空格
  /**
   * vetur插件设置 用于vue template格式化
   * https://github.com/vuejs/vetur
   */
  "vetur.format.defaultFormatter.html": "js-beautify-html",
  "vetur.format.defaultFormatterOptions": {
    "js-beautify-html": {
      "wrap_attributes": "force-aligned" //属性强制折行对齐
    }
  },
  /** Eslint设置 **/
  "eslint.validate": [
    // 检查以下类型的文件
    "javascript",
    "javascriptreact",
    "vue",
    "html",
    {
      "language": "html",
      "autoFix": false
    },
    {
      "language": "vue",
      "autoFix": false
    }
  ],
  "eslint.autoFixOnSave": false, //保存时自动格式化
  "javascript.implicitProjectConfig.experimentalDecorators": true,
  /**
   * prettier设置
   * https://prettier.io/docs/en/options.html
   */
  "prettier.singleQuote": false, //使用单引号而不是双引号
  "prettier.jsxBracketSameLine": true, // 标签闭合处是否不换行
  "prettier.printWidth": 400, // 多少个字符换行
  "prettier.tabWidth": 2, // tab的宽度
  "prettier.semi": true, // 是否自动在语句末尾加分号
  "prettier.trailingComma": "all", // 是否自动加尾逗号（none不，es5自动加兼容es5, all尽可能都加）
  "prettier.bracketSpacing": true, // 大括号之间是否有空格
  "prettier.arrowParens": "avoid",
  "explorer.confirmDragAndDrop": false,
  "workbench.startupEditor": "welcomePage",
  "breadcrumbs.enabled": true,
  "editor.formatOnSave": true,
  "diffEditor.ignoreTrimWhitespace": true,
  "diffEditor.renderSideBySide": true,
  "javascript.updateImportsOnFileMove.enabled": "always",
  "vsicons.dontShowNewVersionMessage": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": false
  } // 箭头函数只有一个参数时是否加括号（always加，avoid不加）
}
```
