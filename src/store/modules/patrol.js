import { getPatrolCheckSummaryByMonth, getPatrolCheckListByDate } from '@/api/patrol'

const state = {
  patrolCheckList: [],
  patrolMonthCheck: {}
}

const mutations = {
  SET_PATROL_CHECK_LIST: (state, payload) => {
    state.patrolCheckList = payload
  },
  SET_PATROL_MONTH_CHECK: (state, payload) => {
    state.patrolMonthCheck = payload
  }
}

const actions = {
  getPatrolCheckListByDate({ commit }, { payload }) {
    getPatrolCheckListByDate(payload).then(res => {
      if (res && res.success) {
        const { result = {} } = res || {}
        commit('SET_PATROL_CHECK_LIST', result.records)
      }
    })
  },
  getPatrolCheckSummaryByMonth({ commit }, { payload }) {
    return getPatrolCheckSummaryByMonth(payload)
  }
}

const patrol = {
  namespaced: true,
  state,
  mutations,
  actions
}

export default patrol
