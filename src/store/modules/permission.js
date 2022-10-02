import { asyncRouterMap, constantRouterMap } from '@/router/router.config'
import { cloneDeep } from 'lodash'

/**
 * 过滤账户是否拥有某一个权限，并将菜单从加载列表移除
 * @param {*} permission
 * @param {*} route
 */
function hasPermission(permission, route) {
  if (route.meta && route.meta.permission) {
    let flag = false
    const len = permission.length
    for (let i = 0; i < len; i ++) {
      flag = route.meta.permission.includes(permission[i])
      if (flag) {
        return true
      }
    }
    return false
  }
  return true
}

/**
 * 单账户多角色时，使用该方法可以过滤角色不存在的菜单
 * @param {*} roles
 * @param {*} route
 */
// function hasRole(roles, route) {
//   if (route.meta && route.meta.roles) {
//     return route.meta.roles.includes(roles.id)
//   } else {
//     return true
//   }
// }

function filterAsyncRouter(routerMap, roles) {
  const accessedRouters = routerMap.filter(route => {
    // if (hasPermission(roles.permissionList, route)) {
    if (hasPermission(roles, route)) {
      if (route.children && route.children.length) {
        route.children = filterAsyncRouter(route.children, roles)
      }
      return true
    }
    return false
  })
  return accessedRouters
}

const permission = {
  namespaced: true,
  state: {
    routers: constantRouterMap,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
    }
  },
  actions: {
    generateRoutes({ commit }, payload) {
      return new Promise(resolve => {
        const { roles } = payload || {}
        const routerMap = cloneDeep(asyncRouterMap)
        const accessedRouters = filterAsyncRouter(routerMap, roles)
        commit('SET_ROUTERS', accessedRouters)
        resolve()
      })
    }
  }
}

export default permission
