import { getDutyHistoryList, exportDutyHistoryList, configDutyRate, getConfigDutyRate, manualDuty } from '@/api/duty'

const state = {
  dutyList: {
    list: [],
    pageNo: 1,
    pageSize: 14,
    total: 0
  }
}

const mutations = {
  SET_DUTY_LIST: (state, payload) => {
    state.dutyList = payload
  }
}

const actions = {
  // 获取历史值班查岗记录
  getDutyHistoryList({ commit }, payload) {
    getDutyHistoryList(payload).then(res => {
      if (res && res.success) {
        const {
          current,
          total,
          size,
          records = []
        } = res.result || {}
        commit('SET_DUTY_LIST', {
          pageNo: current,
          pageSize: size,
          total,
          list: records || []
        })
      }
    })
  },
  // 导出历史值班查岗记录
  exportDutyHistoryList(_, payload) {
    exportDutyHistoryList(payload).then(res => {
      console.log(res)
    })
  },
  // 设置值班查岗频次
  configDutyRate(_, payload) {
    return configDutyRate(payload)
  },
  getConfigDutyRate(_, payload) {
    return getConfigDutyRate(payload)
  },
  manualDuty(_, payload) {
    return manualDuty(payload)
  }
}

const duty = {
  namespaced: true,
  state,
  mutations,
  actions
}

export default duty
