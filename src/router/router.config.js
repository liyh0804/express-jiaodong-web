import { RouteView } from '@/layouts'

/**
 * 基础路由配置
 * @type {*[]}
 */
export const constantRouterMap = [{
  path: '/',
  component: RouteView,
  redirect: '/home',
  hidden: true,
  children: [{
    path: '/home',
    name: 'home',
    component: () => import(/* webpackChunkName "home" */ '@/views/home/index'),
    meta: { title: '首页' }
  }]
}, {
  path: '/404',
  hidden: true,
  component: () => import(/* webpackChunkName "error" */ '@/views/exception/404')
}]

export const asyncRouterMap = []
