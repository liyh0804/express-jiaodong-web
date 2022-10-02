import storage from 'store'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import notification from 'ant-design-vue/es/notification'
import router from './router'
import store from './store'
import { setDocumentTitle, domTitle } from '@/utils/domUtil'
import { ACCESS_TOKEN } from '@/store/mutation-types'

NProgress.configure({ showSpinner: false }) // nprogress config

const allowList = ['login', 'register', 'registerResult']
const loginRoutePath = '/user/login'
const defaultRoutePath = '/dashboard'

router.beforeEach((to, from, next) => {
  NProgress.start()
  to.meta && to.meta.title !== 'undefined' && setDocumentTitle(`${to.meta.title} - ${domTitle}`)
  // has token
  if (storage.get(ACCESS_TOKEN)) { // 用户已经登录
    if (to.path === loginRoutePath) {
      next({ path: defaultRoutePath })
      NProgress.done()
    } else {
      // 检测 登录用户的roles是否为null
      if (store.getters.roles.length === 0) {
        // 获取用户角色权限
        store.dispatch('user/getUserInfo').then(res => {
          // const roles = res && res.departRoles
          // const roles = store.state.user.roles
          let roles = ['supervisor']
          if (res.departRoles && res.departRoles.length) {
            if (res.departRoles[0].contains('supervisor_role')) {
              roles = ['supervisor']
            } else {
              roles = ['operator']
            }
          }
          store.dispatch('permission/generateRoutes', { roles }).then(() => {
            // 根据roles权限生成可访问的路由表
            // 动态添加可访问的路由表
            store.getters.addRouters.forEach(r => {
              router.addRoute(r)
            })
            // 请求带有redirect重定向时，登录自动重定向到该地址
            const redirect = decodeURIComponent(from.query.redirect || to.path)
            if (to.path === redirect) {
              next({ ...to, replace: true })
            } else {
              next({ path: redirect })
            }
          }) // generate route
        }).catch(() => {
          notification.error({
            message: '错误',
            description: '请求用户信息失败，请重试'
          })
          // 失败时，调用logout，清空历史保留信息
          store.dispatch('user/logout').then(() => {
            next({ path: loginRoutePath, query: { redirect: to.fullPath } })
            NProgress.done()
          }).catch(error => {
            console.log(error)
            next({ path: loginRoutePath, query: { redirect: to.fullPath } })
            NProgress.done()
          })
        })
      } else { // 存在用户role，直接按照点击跳转
        next()
      }
    }
  } else {
    if (allowList.includes(to.name)) {
      // 免登录名单，直接进入
      next()
    } else {
      next({ path: loginRoutePath, query: { redirect: to.fullPath } })
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})
