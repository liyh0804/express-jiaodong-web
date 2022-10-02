import { createRouter, createWebHistory } from 'vue-router'
import { constantRouterMap, asyncRouterMap } from './router.config'

console.log(asyncRouterMap)

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes: constantRouterMap
})

export default router

// import { createRouter, createWebHistory } from 'vue-router'
// // import Home from '../views/Home.vue'
// import { constantRouterMap, asyncRouterMap } from './router.config'
// import NProgress from 'nprogress'
// import 'nprogress/nprogress.css'
// import { Layout } from 'ant-design-vue'

// // NProgress.configure({
// //   easing: 'ease',
// //   speed: 500,
// //   showSpinner: false,
// //   trickleSpeed: 200,
// //   minimum: 0.3
// // })

// const routes = [
//   {
//     path: '/',
//     redirect: to => {
//       return {
//         path: '/dashboard',
//         query: { ...to.params }
//       }
//     }
//   },
//   {
//     path: '/dashboard',
//     name: 'Dashboard',
//     component: () => import(/* webpackChunkName: "dashboard" */ '../views/Dashboard.vue'),
//     meta: {
//       title: '中控台',
//       Layout
//     }
//   },
//   {
//     path: '/issue_manage/:type',
//     name: 'IssueManage',
//     component: () => import(/* webpackChunkName: "issue_manage" */ '../views/IssueManage.vue'),
//     props: true,
//     meta: {
//       title: '问题故障处理',
//       Layout
//     }
//   },
//   {
//     path: '/inteli_monitor_sys',
//     name: 'InteliMonitorSys',
//     component: () => import(/* webpackChunkName: "inteli_monitor_sys" */ '../views/InteliMonitorSys.vue'),
//     meta: {
//       title: '智能监控系统',
//       Layout
//     }
//   },
//   {
//     path: '/maintenance_manage',
//     name: 'MaintenanceManage',
//     component: () => import(/* webpackChunkName: "maintenance_manage" */ '../views/repair_service/index.vue'),
//     meta: {
//       title: '维保管理',
//       Layout
//     }
//   },
//   {
//     path: '/patrol_check',
//     name: 'PatrolCheck',
//     component: () => import(/* webpackChunkName: "patrol_check" */ '../views/PatrolCheck.vue'),
//     meta: {
//       title: '巡检',
//       Layout
//     }
//   },
//   {
//     path: '/duty_check',
//     name: 'DutyCheck',
//     component: () => import(/* webpackChunkName: "Duty_check" */ '../views/DutyCheck.vue'),
//     meta: {
//       title: '值班查岗',
//       Layout
//     }
//   },
//   {
//     path: '/about',
//     name: 'About',
//     // route level code-splitting
//     // this generates a separate chunk (about.[hash].js) for this route
//     // which is lazy-loaded when the route is visited.
//     component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
//     meta: {
//       title: '关于',
//       Layout
//     }
//   },
//   {
//     path: '/monitor',
//     name: 'monitor',
//     component: () => import(/* webpackChunkName: "monitor" */ '../views/Monitor.vue'),
//     meta: {
//       title: '监控中心',
//       Layout
//     }
//   },
//   {
//     path: '/login',
//     name: 'login',
//     component: () => import(/* webpackChunkName: "login" */ '../views/Login.vue'),
//     meta: {
//       title: '登录页面',
//       single: true
//     }
//   },
//   {
//     path: '/gis/geoManager',
//     name: 'geoManager',
//     component: () => import(/* webpackChunkName: "geoManager" */ '../views/gis/geoManager.vue'),
//     meta: {
//       title: '地图geo数据管理',
//       single: true
//     }
//   }
// ]

// console.log(constantRouterMap)
// console.log(routes)

// const router = createRouter({
//   history: createWebHistory(process.env.BASE_URL),
//   routes: asyncRouterMap
// })

// router.beforeEach((to, from, next) => {
//   NProgress.start()
//   if (to.meta && to.meta.title) {
//     let title = to.meta.title
//     if (to.path.includes('/issue_manage/')) {
//       const { type } = to.params || {}
//       title = type === 'fire' ? '火警' : type === 'breakdown' ? '故障' : type === 'hidden_trouble' ? '隐患' : title
//     }
//     document.title = `智慧消防平台(grandhonor.com)-${title}`
//   }
//   next()
// })

// router.afterEach(() => {
//   NProgress.done()
// })

// export default router
