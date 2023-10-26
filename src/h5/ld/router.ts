import { createRouter, createWebHashHistory } from 'vue-router'

// 移民端用户
const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'index',
      component: () => import('../views/index.vue'),
      redirect: '/home',
      children: [
        {
          path: '/home',
          name: 'home',
          component: () => import('../views/home/index.vue'),
          meta: {
            name: '镜岭水库'
          }
        },
        {
          path: '/roam',
          name: 'roam',
          component: () => import('../views/roam/index.vue'),
          meta: {
            name: '库区漫游'
          }
        },
        {
          path: '/garden',
          name: 'garden',
          component: () => import('../views/garden/index.vue'),
          meta: {
            name: '美丽家园'
          }
        },
        {
          path: '/mine',
          name: 'mine',
          component: () => import('../views/mine/index.vue'),
          meta: {
            name: '我的'
          }
        }
      ]
    },
    {
      path: '/announcementDetail',
      name: 'announcementDetail',
      component: () => import('../views/announcement/detail/index.vue'),
      meta: {
        name: '通知公告详情'
      }
    },
    {
      path: '/announcement',
      name: 'announcement',
      component: () => import('../views/announcement/index.vue'),
      meta: {
        name: '通知公告'
      }
    },
    {
      path: '/policies',
      name: 'policies',
      component: () => import('../views/policies/index.vue'),
      meta: {
        name: '政策法规'
      }
    },
    {
      path: '/policiesDetail',
      name: 'policiesDetail',
      component: () => import('../views/policies/detail/index.vue'),
      meta: {
        name: '政策详情'
      }
    },
    {
      path: '/planEffect',
      name: 'planEffect',
      component: () => import('../views/planEffect/index.vue'),
      meta: {
        name: '安置点名称'
      }
    },
    {
      path: '/situation',
      name: 'situation',
      component: () => import('../views/detail/index.vue'),
      meta: {
        name: '水库概况'
      }
    },
    {
      path: '/homesickness',
      name: 'homesickness',
      component: () => import('../views/homesickness/index.vue'),
      meta: {
        name: '我的乡愁'
      }
    },
    {
      path: '/homesicknessDetail',
      name: 'homesicknessDetail',
      component: () => import('../views/detail/index.vue'),
      meta: {
        name: '详情'
      }
    },
    {
      path: '/deliver',
      name: 'deliver',
      component: () => import('../views/homesickness/deliver/index.vue'),
      meta: {
        name: '投稿'
      }
    },
    {
      path: '/bindPhone',
      name: 'bindPhone',
      component: () => import('../views/user/bindPhone/index.vue'),
      meta: {
        name: '手机号绑定'
      }
    },
    {
      path: '/modifyPhoneNumber',
      name: 'modifyPhoneNumber',
      component: () => import('../views/user/modifyPhoneNumber/index.vue'),
      meta: {
        name: '修改手机号码'
      }
    },
    {
      path: '/familyMember',
      name: 'familyMember',
      component: () => import('../views/user/familyMember/index.vue'),
      meta: {
        name: '家庭成员'
      }
    },
    {
      path: '/announcement',
      name: 'announcement',
      component: () => import('../views/announcement/index.vue'),
      meta: {
        name: '通知公告'
      }
    },
    {
      path: '/announcementDetail',
      name: 'announcementDetail',
      component: () => import('../views/announcement/detail/index.vue'),
      meta: {
        name: '通知公告详情'
      }
    },
    {
      path: '/policies',
      name: 'policies',
      component: () => import('../views/policies/index.vue'),
      meta: {
        name: '政策法规'
      }
    },
    {
      path: '/policiesDetail',
      name: 'policiesDetail',
      component: () => import('../views/policies/detail/index.vue'),
      meta: {
        name: '政策详情'
      }
    },
    {
      path: '/appearance',
      name: 'appearance',
      component: () => import('../views/appearance/index.vue'),
      meta: {
        name: '水库面貌'
      }
    },
    {
      path: '/homesickness',
      name: 'homesickness',
      component: () => import('../views/homesickness/index.vue'),
      meta: {
        name: '我的乡愁'
      }
    },
    {
      path: '/homesicknessDetail',
      name: 'homesicknessDetail',
      component: () => import('../views/detail/index.vue'),
      meta: {
        name: '详情'
      }
    },
    {
      path: '/deliver',
      name: 'deliver',
      component: () => import('../views/homesickness/deliver/index.vue'),
      meta: {
        name: '投稿'
      }
    },
    {
      path: '/situation',
      name: 'situation',
      component: () => import('../views/detail/index.vue'),
      meta: {
        name: '水库概况'
      }
    },
    {
      path: '/planEffect',
      name: 'planEffect',
      component: () => import('../views/planEffect/index.vue'),
      meta: {
        name: '安置点名称'
      }
    },
    {
      path: '/phoneLogin',
      name: 'phoneLogin',
      component: () => import('../views/login/phoneLogin.vue'),
      meta: {
        name: '登录'
      }
    }
  ]
})

export default router
