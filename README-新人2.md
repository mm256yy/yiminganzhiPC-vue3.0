## 说明

本文档便于新人接手项目，能快速理解项目构造，除了本文档，项目下的 md 文件也需要熟读

## 项目简介

git 地址

https://zdwp.coding.net/p/migrate/d/migrate-web/git

pc 项目为 vite+vue 多页应用，分别有四个入口，如下所示：

- admin.html 为后台管理系统
- index.html 为 c 端用户系统
- h5.html 为 h5c 端，独立项目，不可与 pc 项目混合使用组件/方法等
- ld.html 为 h5 领导端

四个平台是统一一个发布系统

## 各端访问链接

- 测试环境域名：https://r7r-ai.zdwp.net/
- 线上环境域名：https://ym.zhym.net.cn/

==各端完整链接==

- 后台管理系统： https://ym.zhym.net.cn/admin.html#/

==经常出现有人链接里没带 admin.html 访问出现样式错乱的问题，前端注意纠正==

- C 端用户平台 https://ym.zhym.net.cn/index.html#/

- H5 用户端 https://ym.zhym.net.cn/h5.html#/

- H5 领导端 https://ym.zhym.net.cn/ld.html#/

## 分支说明

> 任何 功能/bugfix 分支名称都须为 `feature/xxxx`，单个功能一个分支，不要长期使用一个分支。

- 运作流程

功能开发好或者 bug 修复后，在`ecoding` 上提交合并请求，走==测试环境发布流程==，上到测试环境进行验证，验证通过，需要发布的，走==线上发布流程==进行上线

- 注意

修改 bug 或者开发新功能都是在 `env/production`分支上切一个功能分支 `feature/xxx`，而不是`master`

## 代码发布

发布系统均为自动构建，触发分支提交就会自动构建，部署在 docker 环境，由项目技术负责人管理

- ==测试环境发布流程==

**对应构建分支为：master**

由个人开发者在 ecoding 上提交一个合并请求 mr，由前端负责人 review 后，进行合并操作

- ==线上环境发布流程==

**对应构建分支为：env/production**

由前端负责人合并代码到构建分支，注意不是走 mr

例如：需要上线的分支 feature/xxxx

feature/xxxx ----> env/production

这一步合并要在==本地完成==，可用命令行/vscode/其他工具 完成合并提交，会自动触发线上构建

- 其他

* 前端负责人拥有代码管理权限
* 任何针对线上环境的操作都要谨慎
* 甲方明确要求的，代码规范必须遵守

## 文件梳理

- `src/router/index`: 固定路由配置

  > 所有业务相关的页面路由都为==后台管理系统==配置产生，有权限限制，开发时可在此暂时配置，提交 mr 后需要自己在后台配置自己的页面

- `src/print`: pdf 生成打印模块

  - pad 端和 pc 端的 pdf 生成技术方案为 ==pdfmake==,

    - 文档地址：https://pdfmake.github.io/docs/0.3/

    - 预览链接：http://pdfmake.org/playground.html

  - 项目文件说明：

    - src/print/index: 导出口/入口
    - src/print/template: 所有生成 pdfmake 相关配置文件的模块
    - src/print/common: 存放公共内容
    - src/print/core: 核心处理类
    - src/print/config: 配置文件

  - 生成 pdf 的业务组件为 `src/views/Workshop/components/Print`, 可参考

- `src/views/Workshop`: C 端用户页面存放
- `src/views`：去除 Workshop 文件夹，为后台管理系统页面
- `src/h5`: 两个 h5 端的项目文件，注意此为独立于 pc 的，不要与 pc 项目混用

- `src/views/Workshop/AssetEvaluation`: 资产评估 列表 + 填报 页面
- `src/views/Workshop/ImmigrantImplement`: 移民实施 列表 + 填报 页面

- `src/views/Workshop/DataFill`: 实物调查 填报 页面

==文件名中带有 `eva` 的为资产评估相关模块== ==文件名中带有 `imp` 的为移民实施相关模块==

==注意== 各个端的文件不要混乱，前端 codeReview 时重点关注

## 路由配置

- 登录 mg-admin 账号，在 ==系统管理/菜单管理== 页面，点击添加

  - `$`为用户平台的标识，具体看项目里的逻辑处理
  - 路径配置 是有父子关联的

- 路由配置好后，可登录 项目管理 角色，为单个项目下的用户添加菜单
  > 每个项目都有 项目管理 角色
