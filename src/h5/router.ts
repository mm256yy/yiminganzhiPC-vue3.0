import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('./views/home/index.vue')
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('./views/about/index.vue')
    }
  ]
})

export default router
