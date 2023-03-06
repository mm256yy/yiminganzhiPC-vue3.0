# 移民安置管理平台工作平台

该代码库为移民安置管理平台的工作平台 web 仓库，使用了 Vue3, Typescript, Element-Plus 的技术栈。该项目的初始脚手架参考了 [element-plus-admin](https://element-plus-admin-doc.cn/)

## 技术参考

- [node](http://nodejs.org/) 和 [git](https://git-scm.com/) - 项目开发环境
- [Vite](https://vitejs.dev/) - 熟悉 vite 特性
- [Vue3](https://v3.vuejs.org/) - 熟悉 Vue 基础语法
- [TypeScript](https://www.typescriptlang.org/) - 熟悉 `TypeScript` 基本语法
- [Es6+](http://es6.ruanyifeng.com/) - 熟悉 es6 基本语法
- [Vue-Router-Next](https://next.router.vuejs.org/) - 熟悉 vue-router 基本使用
- [Element-Plus](https://element-plus.org/) - element-plus 基本使用
- [Mock.js](https://github.com/nuysoft/Mock) - mockjs 基本语法

## 安装和使用

该项目使用 [pnpm](https://pnpm.io/zh/), 如果还没有安装请先 [安装](https://pnpm.io/zh/installation)。

- 获取代码

```bash
git clone https://e.coding.net/zdwp/migrate/migrate-web.git
```

- 安装依赖

```bash
cd migrate-web

pnpm install

```

- 运行

```bash
pnpm run dev
```

- 打包

```bash
pnpm run build:pro
```

## Git 贡献提交规范

该项目启用了强制的 git 提交规范，提交时请遵守，具体可参考 [这里](https://zdwp.coding.net/p/dev-doc/d/doc/git/tree/master/dev-corp/commit.md)

下面是一些提交类型的说明。

- `feat` 新功能
- `fix` 修补 bug
- `docs` 文档
- `style` 格式、样式(不影响代码运行的变动)
- `refactor` 重构(即不是新增功能，也不是修改 BUG 的代码)
- `perf` 优化相关，比如提升性能、体验
- `test` 添加测试
- `build` 编译相关的修改，对项目构建或者依赖的改动
- `ci` 持续集成修改
- `chore` 构建过程或辅助工具的变动
- `revert` 回滚到上一个版本
- `workflow` 工作流改进
- `mod` 不确定分类的修改
- `wip` 开发中
- `types` 类型

分支规范：

目前走的是 gitlabFlow, 分为 功能分支`feature/xxx` 和 `master`

个人功能不要直接提交 master，一定是单独的分支

合并走 `mergeRequest`，会有审核阶段

## 账号

管理员账号: mg-admin Ymaz@2023dl

项目经理账号：mg-project Ymaz@2023dl

普通用户账号：mg-user Ymaz@2023dl

## 代码命名规范

#### 页面/组件

都为大驼峰命名规则 例如：登录 Login/Index.vue

⚠️ 注意：Workshop 文件夹内为用户平台页面 区别于后台管理系统，具体详看代码

#### 代码级别

类型命名：大驼峰 + `Type`后缀 例如：UserInfoType

接口命名：动词 + 大驼峰 + `Api`后缀 例如：GetUserInfoApi / AddUserItemApi
