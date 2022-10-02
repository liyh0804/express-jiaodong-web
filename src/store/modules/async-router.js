import { constantRouterMap } from '@/router/router.config'
import { generatorDynamicRouter } from '@/router/generator-routers'

const permission = {
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
    generateRoutes ({ commit }, payload) {
      return new Promise(resolve => {
        const { token } = payload || {}
        generatorDynamicRouter(token).then(routers => {
          commit('SET_ROUTERS', routers)
          resolve()
        })
      })
    }
  }
}
