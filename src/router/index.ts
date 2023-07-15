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
        component: () => import('@/views/Workshop/Home/Index.vue'),
        meta: {
          title: '用户首页',
          icon: 'ant-design:home-outlined'
        }
      },
      {
        path: 'adminHome',
        name: 'adminHome',
        component: () => import('@/views/Workshop/Home/AdminIndex.vue'),
        meta: {
          title: '工作台', // 用于领导端
          icon: 'ant-design:home-outlined'
        }
      },
      {
        path: 'adminSecondHome',
        name: 'adminSecondHome',
        component: () => import('@/views/Workshop/Home/AdminSecondIndex.vue'),
        meta: {
          title: '工作台', // 领导端二级首页
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
          title: '新闻详情',
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
