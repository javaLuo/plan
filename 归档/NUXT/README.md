### 资源目录

资源目录 `assets` 用于组织未编译的静态资源如 `LESS`、`SASS`、 `Image` 或 `JavaScript`。

- 图片大小不超过 200k
- 图片名称通过`-`中划线进行分割，分类-名称
- css 统一使用 scss
- 图标，统一使用字体图标，使用[阿里图标](http://www.iconfont.cn/)作为管理

### 组件目录

组件目录 `components` 用于组织应用的 Vue.js 组件。Nuxt.js 不会扩展增强该目录下 Vue.js 组件，即这些组件不会像页面组件那样有 `asyncData` 方法的特性。

- 组件文件夹命名方式均为大驼峰，内部为 index.vue，组件内部尽量和外部内容进行分离

### 布局目录

布局目录 `layouts` 用于组织应用的布局组件。

_该目录名为 Nuxt.js 保留的，不可更改。_

- 可以同时建立多个 layout，使用时只需要在内增加`layout: 'silverLayout'`属性即可。
- 命名规则统一使用小驼峰

### 中间件目录

`middleware` 目录用于存放应用的中间件。中间件会在先匹配布局再匹配页面执行。

- 命名规则统一使用小驼峰

### 页面目录

页面目录 `pages` 用于组织应用的路由及视图。Nuxt.js 框架读取该目录下所有的 `.vue` 文件并自动生成对应的路由配置。

_该目录名为 Nuxt.js 保留的，不可更改。_

- 命名规则和组件规则一样使用大驼峰命名，内部页面使用小驼峰命名。

### 插件目录

插件目录 `plugins` 用于组织那些需要在 `根vue.js应用` 实例化之前需要运行的 Javascript 插件。

- 命名规则统一使用小驼峰

### 静态文件目录

静态文件目录 `static` 用于存放应用的静态文件，此类文件不会被 Nuxt.js 调用 Webpack 进行构建编译处理。
服务器启动的时候，该目录下的文件会映射至应用的根路径 `/` 下。改目录存放不经常改变的静态资源。

**举个例子:** /static/robots.txt 映射至 /robots.txt

_该目录名为 Nuxt.js 保留的，不可更改。_

### Store 目录

`store` 目录用于组织应用的 [Vuex 状态树](http://vuex.vuejs.org) 文件。
Nuxt.js 框架集成了 [Vuex 状态树](http://vuex.vuejs.org) 的相关功能配置，在 `store` 目录下创建一个 `index.js` 文件可激活这些配置。

_该目录名为 Nuxt.js 保留的，不可更改。_

- 各个模块状态统一存放在 modules 文件夹目录下
- 各个模块统一内部有三个文件： index.js、api.js、type.js，分别存放逻辑代码、api 接口代码、常量代码。

### nuxt.config.js 文件

`nuxt.config.js` 文件用于组织 Nuxt.js 应用的个性化配置，以便覆盖默认配置。

_该文件名为 Nuxt.js 保留的，不可更改。_

### package.json 文件

`package.json` 文件用于描述应用的依赖关系和对外暴露的脚本接口。

_该文件名为 Nuxt.js 保留的，不可更改。_

#### 安装教程

```
npm install
or
yarn
```

#### 使用说明

本地开发环境

```
npm run dev
or
yarn dev
```

项目支持直连 qa 环境、rc 环境、生产环境数据联调，具体命令为

```
npm run devProd
or
yarn devProd
```


本地开发环境 build 后查看

```
npm run build${环境变量} 如：builddev
npm run publish${环境变量}
or
yarn build${环境变量}
yarn publish${环境变量}
```

