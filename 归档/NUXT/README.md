# ViewFin-WEB-RightBTC2018-NUXT

## 项目介绍

该项目为域名 rightbtc.com 的源代码,使用 nuxt.js 框架。

## 项目架构

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

其中 package 中 script 命令中 MY_ENV 为环境变量，通过改变环境变量来联调当前环境

    "devProd": "MY_ENV=szzc nuxt",

环境变量对应表

```
test --> qa 环境 --> 域名：tulipex.space --> 分支： test
rc --> rc 环境 --> 域名：btchft.com --> 分支： rc
prod --> 生产环境 （需要翻墙） --> rightbtc.com --> 分支： prod
szzc --> 生产环境小域名  --> szzc.io --> 分支：szzc
rightbtccc --> 生产环境小域名 --> rightbtc.cc --> 分支： rightbtccc
btcright --> 生产环境小域名（准备用于 tulipex 使用） --> btcright.pro --> btcright
```

另外环境变量对应的配置文件需要改两个文件中的配置

> common/config.js 在各个配置中增加对应的配置

> package.json 在 script 中新增对应的命令

由于本项目 cookie 是跟域名绑定的（为了和 otc 互通），所以需要在本机绑定 host 如下：

```
127.0.0.1 dev.tulipex.space
127.0.0.1 dev.otc.tulipex.space
127.0.0.1 dev.btchft.com
127.0.0.1 dev.otc.btchft.com
127.0.0.1 dev.rightbtc.com
127.0.0.1 dev.otc.rightbtc.com
127.0.0.1 dev.szzc.io
127.0.0.1 dev.otc.szzc.io
127.0.0.1 dev.rightbtc.cc
127.0.0.1 dev.otc.rightbtc.cc
127.0.0.1 dev.btcright.pro
127.0.0.1 dev.otc.btcright.pro
```

访问方式为，

rightbtc: dev.tulipex.space:4000

otc: dev.otc.tulipex.space:3000

本地开发环境 build 后查看

```
npm run build${环境变量} 如：builddev
npm run publish${环境变量}
or
yarn build${环境变量}
yarn publish${环境变量}
```

访问方式和本地访问一样。

### 分支说明

如上所述，为了配合 jinkens 发布闭环，前端项目通过切换分支代码来发布对应分支环境，环境变量与分支名称对应。

另外 develop 为固定本地开发分支，test 为 qa 测试分支。
release 中的分支为生产环境备份分支。

### 代码提交流程

- 开发流程应为每个人从 develop 分支切出自己的独立分支，通常使用自己独立的名字（例如自己的名字等）。
- 功能完成后合并到 develop 分支，合并时务必要**先拉后提！！** **先拉后提！！** **先拉后提！！**（为了避免产生多条记录，方便查找记录），同时需要保证 develop 上的代码为最新代码，由团队 leader 检查通过后可合并到 test 分支，然后使用[发布工具](http://deploy.szzc.io)发布测试环境内容并通知测试。
- 阶段性 test 测试通过后，统一合并到 rc 分支，通知测试已合并，让测试通知运维发布 rc 环境。
- **上线前务必保证 rc 环境代码为此次发布的所有功能**，rc 环境测试通过后，上线前只做一步，经测试同意，rc 代码合并到 prod（**谨慎合并**）。
- 于项目有小域名，讲 rc 环境合并到 prod 后，为保证项目代码一致性。需要把 prod 分支的代码 合并到各个小域名中。**务必把所有冲突都在 rc 环境之前解决**。
- 另外，提交代码务必带上说明，说明大概修改内容。
- 已发布版本稳定后，需要在该版本的 prod 分支的位置打上版本号 tag，方法为：右键->标签->输入需要编写的版本号->确定。
- 多余的分支会定期清理。请务必管理好自己的分支，要和 devlop 保持为最新为佳。

### 紧急修复线上问题

- 紧急修复线上问题请在 prod 分支上拉去 hotfix 分支，修改完成后合并 rc 环境测试，测试通过后从 prod 分支合并各个小域名，发布上线。
- 发布上线后将 hotfix 分支内容合并到 develop，通过 develop 分支正向合并到需要的分支，**切忌逆向合并**
