import storage from 'store'
// import expirePlugin from 'store/plugins/expire'
import { login, logout, getUserInfo, getUserManageUserList, changeUserDisabled } from '@/api/user'
import { ACCESS_TOKEN } from '@/store/mutation-types'

// storage.addPlugin(expirePlugin)
// const defaultRoles = ['jmxf_property_supervisor_role']
const defaultRoles = ['supervisor']
const state = {
  sysAllDictItems: {},
  userInfo: {},
  token: '',
  roles: [],
  userRoleList: {
    pageNo: 1,
    pageSize: 10,
    total: 0,
    list: []
  }
  // roles: defaultRoles
  // roles: defaultRoles // 默认物业监管人员
}

const mutations = {
  SET_SYSALLDICTITEMS: (state, payload) => {
    state.sysAllDictItems = payload
  },
  SET_USERINFO: (state, payload) => {
    state.userInfo = payload
  },
  SET_TOKEN: (state, payload) => {
    state.token = payload
  },
  SET_ROLES: (state, payload) => {
    state.roles = payload
  },
  SET_USER_ROLE_LIST: (state, payload) => {
    state.userRoleList = payload
  }
}

const actions = {
  getUserInfo({ commit }) {
    return new Promise((resolve, reject) => {
      getUserInfo().then(res => {
        if (res && res.success) {
          const { result = {} } = res || {}
          commit('SET_USERINFO', result)
          let roles = defaultRoles
          if (result.departRoles && result.departRoles.length) {
            if (result.departRoles[0].contains('supervisor_role')) {
              roles = defaultRoles
            } else {
              roles = ['operator']
            }
          }
          commit('SET_ROLES', roles)
          resolve(result)
        }
      }).catch(error => {
        reject(error)
      })
    })
  },
  login({ commit }, payload) {
    return new Promise((resolve, reject) => {
      login(payload).then(res => {
        if (res && res.success) {
          commit('SET_SYSALLDICTITEMS', res.result.sysAllDictItems)
          commit('SET_USERINFO', res.result.userInfo)
          commit('SET_TOKEN', res.result.token)
          let roles = defaultRoles
          if (res.result.departRoles && res.result.departRoles.length) {
            if (res.result.departRoles[0].contains('supervisor_role')) {
              roles = defaultRoles
            } else {
              roles = ['operator']
            }
          }
          commit('SET_ROLES', roles)
          storage.set(ACCESS_TOKEN, res.result.token)
          resolve(res)
          // storage.set(ACCESS_TOKEN, res.result.token, new Date().getTime() + 30 * 60 * 1000)
        }
      }).catch(error => {
        reject(error)
      })
    })
  },
  logout({ commit }) {
    return new Promise((resolve, reject) => {
      logout().then(res => {
        commit('SET_TOKEN', '')
        commit('SET_USERINFO', {})
        storage.remove(ACCESS_TOKEN)
        resolve()
        // window.location.href = '/login'
      }).catch(error => {
        reject(error)
      })
    })
  },
  getUserManageUserList({ commit }, { payload }) {
    getUserManageUserList(payload).then(res => {
      if (res && res.success) {
        const { current, total, size, records = [] } = res.result || {}
        commit('SET_USER_ROLE_LIST', {
          pageNo: current,
          total,
          pageSize: size,
          list: records
        })
      }
    })
  },
  changeUserDisabled(_, { payload: { id } }) {
    return changeUserDisabled(id)
  }
}

const user = {
  namespaced: true,
  state,
  mutations,
  actions
}

export default user
