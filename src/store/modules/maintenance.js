import {
  getOwnerRepairList, getAllMaintainCompany, getDictByCode, getMaintainUserByCompanyId, getUserByPropertyId, getDeviceRepairList, getDevicePropertyRepairList,
  submitUserFaultToProperty, submitUserFaultToMaintain
} from '@/api/maintenance'

const state = {
  repairs: {
    total: 0,
    pageNo: 1,
    pageSize: 14,
    list: []
  },
  deviceRepairList: {
    total: 0,
    pageNo: 1,
    pageSize: 14,
    list: []
  },
  devicePropertyRepairList: {
    total: 0,
    pageNo: 1,
    pageSize: 14,
    list: []
  },
  maintainCompany: [],
  maintainType: [],
  maintainUsers: [],
  propertyUsers: []
}

const mutations = {
  SET_OWNER_REPAIRS: (state, payload) => {
    state.repairs = payload
  },
  SET_ALL_MAINTAINCOMPANY: (state, payload) => {
    state.maintainCompany = payload
  },
  SET_MAINTAIN_TYPES: (state, payload) => {
    state.maintainType = payload
  },
  SET_MAINTAIN_USERS: (state, payload) => {
    state.maintainUsers = payload
  },
  SET_PROPERTY_USERS: (state, payload) => {
    state.propertyUsers = payload
  },
  SET_DEVICE_REPAIR_LIST: (state, payload) => {
    state.deviceRepairList = payload
  },
  SET_PROPERTY_REPAIR_LIST: (state, payload) => {
    state.devicePropertyRepairList = payload
  }
}

const actions = {
  // 获取所有业主提报的工单
  getOwnerRepairList({ commit }, payload) {
    getOwnerRepairList(payload).then(res => {
      if (res && res.success) {
        const { result = {} } = res || {}
        const { current, size, total, records = [] } = result || {}
        commit('SET_OWNER_REPAIRS', {
          pageNo: current,
          pageSize: size,
          total,
          list: records
        })
      }
    })
  },
  // 根据类型获取维保工单
  getDeviceRepairList({ commit }, payload) {
    getDeviceRepairList(payload).then(res => {
      if (res && res.success) {
        const { result = {} } = res || {}
        const { current, records = [], total, size } = result || {}
        commit('SET_DEVICE_REPAIR_LIST', {
          pageNo: current,
          pageSize: size,
          total,
          list: records
        })
      }
    })
  },
  // 获取物业工单列表
  getDevicePropertyRepairList({ commit }, payload) {
    getDevicePropertyRepairList(payload).then(res => {
      if (res && res.success) {
        const { result = {} } = res || {}
        const { current, size, total, records = [] } = result || {}
        commit('SET_PROPERTY_REPAIR_LIST', {
          pageNo: current,
          pageSize: size,
          total,
          list: records
        })
      }
    })
  },
  // 获取所有维保公司
  getAllMaintainCompany({ commit }) {
    getAllMaintainCompany().then(res => {
      if (res && res.success) {
        commit('SET_ALL_MAINTAINCOMPANY', res.result || [])
      }
    })
  },
  // 获取维保类型字典树
  getDictByCode({ commit }) {
    getDictByCode('maintenance_type').then(res => {
      if (res && res.success) {
        commit('SET_MAINTAIN_TYPES', res.result)
      }
    })
  },
  // 根据维保公司获取维保人员
  getMaintainUserByCompanyId({ commit }, { companyId }) {
    getMaintainUserByCompanyId(companyId).then(res => {
      if (res && res.success) {
        commit('SET_MAINTAIN_USERS', res.result)
      }
    })
  },
  // 根据物业公司获取物业人员
  getUserByPropertyId({ commit }, { propertyCompanyId }) {
    getUserByPropertyId(propertyCompanyId).then(res => {
      if (res && res.success) {
        commit('SET_PROPERTY_USERS', res.result)
      }
    })
  },
  // 获取所有物业公司信息
  getAllMaintenanceInfo({ commit }) {
    const promise1 = getDictByCode('maintenance_type')
    const promise2 = getAllMaintainCompany()
    Promise.all([promise1, promise2]).then(result => {
      const type = result[0]
      const company = result[1]
      if (type && type.success) {
        commit('SET_MAINTAIN_TYPES', type.result)
      }
      if (company && company.success) {
        commit('SET_ALL_MAINTAINCOMPANY', company.result || [])
        if (company.result && company.result.length) {
          getMaintainUserByCompanyId(company.result[0].id).then(res => {
            if (res && res.success) {
              commit('SET_MAINTAIN_USERS', res.result)
            }
          })
        }
      }
    })
  },
  // 提交业主维保到物业名下
  submitUserFaultToProperty(_, payload) {
    return submitUserFaultToProperty(payload)
  },
  // 提交业主维保到维保公司名下
  submitUserFaultToMaintain(_, payload) {
    return submitUserFaultToMaintain(payload)
  }
}

const maintenance = {
  namespaced: true,
  state,
  mutations,
  actions
}

export default maintenance
