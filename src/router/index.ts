import { createRouter, createWebHashHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import type { App } from 'vue'
import { Layout, UserLayout } from '@/utils/routerHelper'

export const baseConstantRouterMap: AppRouteRecordRaw[] = [
  {
    path: '/redirect',
    component: Layout,
    name: 'Redirect',
    children: [
      {
        path: '/redirect/:path(.*)',
        name: 'Redirect',
        component: () => import('@/views/Redirect/Redirect.vue'),
        meta: {}
      }
    ],
    meta: {
      hidden: true,
      noTagsView: true
    }
  },
  {
    path: '/login',
    component: () => import('@/views/Login/Login.vue'),
    name: 'Login',
    meta: {
      hidden: true,
      title: '登录',
      noTagsView: true
    }
  },
  {
    path: '/404',
    component: () => import('@/views/Error/404.vue'),
    name: 'NoFind',
    meta: {
      hidden: true,
      title: '404',
      noTagsView: true
    }
  }
]

// 后台管理固定路由
export const adminConstantRouterMap: AppRouteRecordRaw[] = [
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard/home',
    name: 'Root',
    meta: {
      hidden: true
    }
  },
  {
    path: '/dashboard',
    component: Layout,
    redirect: '/dashboard/home',
    name: 'Dashboard',
    meta: { title: '管理首页' },
    children: [
      {
        path: 'home',
        name: 'DashboardHome',
        component: () => import('@/views/Dashboard/Home.vue'),
        meta: {
          title: '管理首页',
          icon: 'ant-design:home-outlined'
        }
      }
    ]
  }
]

// 工作平台固定路由
export const workshopConstantRouterMap: AppRouteRecordRaw[] = [
  {
    path: '/',
    component: Layout,
    redirect: '/workshop/home',
    name: 'Root',
    meta: {
      hidden: true
    }
  },
  {
    path: '/workshop',
    component: UserLayout,
    name: 'RootWorkshop',
    meta: {
      title: '用户首页'
    },
    children: [
      {
        path: 'home',
        name: 'WorkshopHome',
        component: () => import('@/views/Workshop/Home/AdminHome.vue'),
        meta: {
          title: '用户首页',
          icon: 'ant-design:home-outlined'
        }
      },
      // {
      //   path: 'adminHome',
      //   name: 'adminHome',
      //   component: () => import('@/views/Workshop/Home/AdminIndex.vue'),
      //   meta: {
      //     title: '工作台', // 用于领导端
      //     icon: 'ant-design:home-outlined'
      //   }
      // },
      // {
      //   path: 'adminSecondHome',
      //   name: 'adminSecondHome',
      //   component: () => import('@/views/Workshop/Home/AdminSecondIndex.vue'),
      //   meta: {
      //     title: '工作台', // 领导端二级首页
      //     icon: 'ant-design:home-outlined',
      //     hidden: true
      //   }
      // },
      // {
      //   path: 'adminThirdHome',
      //   name: 'adminThirdHome',
      //   component: () => import('@/views/Workshop/Home/AdminThirdIndex.vue'),
      //   meta: {
      //     title: '工作台', // 领导端三级首页
      //     icon: 'ant-design:home-outlined',
      //     hidden: true
      //   }
      // },
      {
        path: 'leaderSide',
        name: 'LeaderSide',
        component: () => import('@/views/Workshop/ExternalLink/LeaderSide.vue'),
        meta: {
          title: '领导工作台', // 外链
          icon: 'ant-design:home-outlined'
        }
      },
      {
        path: 'SmartReport',
        name: 'SmartReport',
        component: () => import('@/views/Workshop/SmartReport/index.vue'),
        meta: {
          title: '领导工作台',
          icon: 'ant-design:home-outlined',
          hidden: true
        },
        children: [
          {
            path: 'fundPeople',
            name: 'fundPeople',
            component: () => import('@/views/Workshop/FundReport/PeasantHousehold.vue'),
            meta: {
              title: '资金管理-居民户报表',
              icon: 'ant-design:home-outlined'
            }
          },
          {
            path: 'proHouseReport',
            name: 'proHouseReport',
            component: () => import('@/views/Workshop/PlacementReport/ProHouseReport.vue'),
            meta: {
              title: '安置意愿-生产安置意愿报表',
              icon: 'ant-design:home-outlined'
            }
          }
          // {
          //   path: 'fundPeople',
          //   name: 'fundPeople',
          //   component: () => import('@/views/Workshop/FundReport/PeasantHousehold.vue'),
          //   meta: {
          //     title: '资金管理-居民户报表',
          //     icon: 'ant-design:home-outlined'
          //   }
          // }
        ]
      },
      {
        path: 'padSide',
        name: 'PadSide',
        component: () => import('@/views/Workshop/ExternalLink/PadSide.vue'),
        meta: {
          title: 'PAD端', // 外链
          icon: 'ant-design:home-outlined'
        }
      },
      {
        path: 'migrateSide',
        name: 'MigrateSide',
        component: () => import('@/views/Workshop/ExternalLink/MigrateSide.vue'),
        meta: {
          title: '移民端', // 外链
          icon: 'ant-design:home-outlined'
        }
      },
      {
        path: 'adminSecondHome',
        name: 'adminSecondHome',
        component: () => import('@/views/Workshop/Home/AdminSecondIndex.vue'),
        meta: {
          title: '工作台', // 领导端二级 大数据分析
          icon: 'ant-design:home-outlined',
          hidden: true
        }
      },
      {
        path: 'adminhomefund',
        name: 'adminhomefund',
        component: () => import('@/views/Workshop/Home/AdminHomeFund.vue'),
        meta: {
          title: '工作台', // 领导端二级 资金管理
          icon: 'ant-design:home-outlined',
          hidden: true
        }
      },
      {
        path: 'adminhomeprogress',
        name: 'adminhomeprogress',
        component: () => import('@/views/Workshop/Home/AdminHomeProgress.vue'),
        meta: {
          title: '工作台', // 领导端二级  进度管理
          icon: 'ant-design:home-outlined',
          hidden: true
        }
      },
      {
        path: 'Feedback',
        name: 'Feedback',
        component: () => import('@/views/Workshop/Feedback/Index.vue'),
        meta: {
          title: '工作台', // 反馈
          icon: 'ant-design:home-outlined',
          hidden: true
        }
      },
      {
        path: 'Project',
        name: 'Project',
        component: () => import('@/views/Project/News/Index.vue'),
        meta: {
          title: '工作台', // 新闻法规
          icon: 'ant-design:home-outlined',
          hidden: true
        }
      },
      {
        path: 'adminThirdHome',
        name: 'adminThirdHome',
        component: () => import('@/views/Workshop/Home/AdminThirdIndex.vue'),
        meta: {
          title: '工作台', // 领导端三级首页
          icon: 'ant-design:home-outlined',
          hidden: true
        }
      },
      {
        path: 'newDetail',
        name: 'newDetail',
        component: () => import('@/views/Workshop/Home/components/newDetail.vue'),
        meta: {
          title: '文章详情',
          hidden: true
        }
      },
      {
        path: 'report',
        name: 'workshopReport',
        component: () => import('@/views/Workshop/Home/Report/Index.vue'),
        meta: {
          title: '通用报告上传',
          hidden: true
        }
      },
      {
        path: 'changeReport',
        name: 'workshopChangeReport',
        component: () => import('@/views/Workshop/Home/ChangeReport/Index.vue'),
        meta: {
          title: '设计变更报告上传',
          hidden: true
        }
      },
      {
        path: 'professionalReport',
        name: 'workshopProfessionalReport',
        component: () => import('@/views/Workshop/Home/ProfessionalReport/Index.vue'),
        meta: {
          title: '专业项目/库底清理报告上传',
          hidden: true
        }
      }
    ]
  },
  {
    path: '/fund',
    component: UserLayout,
    name: 'RootFund',
    meta: {
      title: '资金管理'
    },
    children: [
      {
        path: 'paymentdetail',
        name: 'paymentdetail',
        component: () => import('@/views/Workshop/FundManage/FundPayment/Detail.vue'),
        meta: {
          title: '资金支付详情',
          hidden: false
        }
      },
      {
        path: 'fundpayment',
        name: 'fundpayment',
        component: () => import('@/views/Workshop/FundManage/FundPayment/Index.vue'),
        meta: {
          title: '资金支付',
          hidden: false
        }
      },
      {
        path: 'allocationdetail',
        name: 'allocationdetail',
        component: () => import('@/views/Workshop/FundManage/FundAllocation/Detail.vue'),
        meta: {
          title: '资金预拨详情',
          hidden: false
        }
      },
      {
        path: 'allocation',
        name: 'allocation',
        component: () => import('@/views/Workshop/FundManage/FundAllocation/Index.vue'),
        meta: {
          title: '资金预拨',
          hidden: false
        }
      },
      {
        path: 'entrydetail',
        name: 'entrydetail',
        component: () => import('@/views/Workshop/FundManage/FundEntry/Detail.vue'),
        meta: {
          title: '入账详情',
          hidden: false
        }
      },
      {
        path: 'entry',
        name: 'fundEntry',
        component: () => import('@/views/Workshop/FundManage/FundEntry/Index.vue'),
        meta: {
          title: '资金入账',
          hidden: false
        }
      },
      {
        path: 'capitalPool',
        name: 'capitalPool',
        component: () => import('@/views/Workshop/FundManage/CapitalPool/Index.vue'),
        meta: {
          title: '资金池',
          hidden: false
        }
      },
      {
        path: 'budgetAdjustment',
        name: 'budgetAdjustment',
        component: () => import('@/views/Workshop/FundManage/BudgetAdjustment/Index.vue'),
        meta: {
          title: '概算调整',
          hidden: false
        }
      },
      {
        path: 'budgetReview',
        name: 'budgetReview',
        component: () => import('@/views/Workshop/FundManage/BudgetReview/Index.vue'),
        meta: {
          title: '概算审核',
          hidden: false
        }
      },
      {
        path: 'estimateFilling',
        name: 'estimateFilling',
        component: () => import('@/views/Workshop/FundManage/EstimateFilling/Index.vue'),
        meta: {
          title: '概算填报',
          hidden: false
        }
      },
      {
        path: 'townshipFundEntry',
        name: 'townshipFundEntry',
        component: () => import('@/views/Workshop/FundManage/TownshipFundEntry/Index.vue'),
        meta: {
          title: '乡镇资金入账',
          hidden: false
        }
      },
      {
        path: 'townshipFundEntryCheck',
        name: 'townshipFundEntryCheck',
        component: () => import('@/views/Workshop/FundManage/TownshipFundEntry/DataFill/Index.vue'),
        meta: {
          title: '乡镇资金入账',
          hidden: true
        }
      },
      {
        path: 'paymentApplication',
        name: 'paymentApplication',
        component: () => import('@/views/Workshop/FundManage/PaymentApplication/Index.vue'),
        meta: {
          title: '付款申请',
          hidden: false
        }
      },
      {
        path: 'PaymentReview',
        name: 'PaymentReview',
        component: () => import('@/views/Workshop/FundManage/PaymentReview/Index.vue'),
        meta: {
          title: '付款审核',
          hidden: false
        }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  strict: true,
  routes: baseConstantRouterMap as RouteRecordRaw[],
  scrollBehavior: () => ({ left: 0, top: 0 })
})

export const resetRouter = (): void => {
  const resetWhiteNameList = ['Redirect', 'Login', 'NoFind', 'Root']
  router.getRoutes().forEach((route) => {
    const { name } = route
    if (name && !resetWhiteNameList.includes(name as string)) {
      router.hasRoute(name) && router.removeRoute(name)
    }
  })
}

export const setupRouter = (app: App<Element>) => {
  app.use(router)
}

export default router
