import { createRouter, createWebHashHistory } from 'vue-router'

// 领导端
const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/home',
      name: 'home',
      component: () => import('../views/home/index.vue'),
      meta: {
        name: '镜岭水库'
      }
    },
    {
      path: '/fundManagement',
      name: 'fundManagement',
      component: () => import('../views/leader/fundManagement/index.vue'),
      meta: {
        name: '资金管理'
      }
    },
    {
      path: '/scheduleManagement',
      name: 'scheduleManagement',
      component: () => import('../views/leader/scheduleManagement/index.vue'),
      meta: {
        name: '进度管理'
      }
    },
    {
      path: '/immigrantPortrait',
      name: 'immigrantPortrait',
      component: () => import('../views/leader/immigrantPortrait/index.vue'),
      meta: {
        name: '移民画像'
      }
    },
    {
      path: '/feedback',
      name: 'feedback',
      component: () => import('../views/leader/feedback/index.vue'),
      meta: {
        name: '信息反馈'
      }
    },
    {
      path: '/feedbackDetail',
      name: 'feedbackDetail',
      component: () => import('../views/leader/feedback/detail.vue'),
      meta: {
        name: '详情'
      }
    },
    {
      path: '/fillComments',
      name: 'fillComments',
      component: () => import('../views/leader/feedback/fillComments.vue'),
      meta: {
        name: '填写意见'
      }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/login/phoneLogin.vue'),
      meta: {
        name: '登录'
      }
    }
  ]
})
const whiteList = ['/login'] // 不重定向白名单
router.beforeEach(async (to, from, next) => {
  if (whiteList.indexOf(to.path) != -1 || sessionStorage.getItem('h5token')) {
    next()
  } else {
    next({ path: '/login' })
  }
  console.log(from)
})
export default router
