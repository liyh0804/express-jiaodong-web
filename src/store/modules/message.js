import { getBoxMessageCount } from '@/api/message'

const state = {
  boxMessageCount: {
    realAlarmCount: 0,
    fireAlarmCount: 0,
    faultCount: 0,
    threatCount: 0
  }
}

const mutations = {
  SET_BOX_MESSAGE_COUNT: (state, payload) => {
    state.boxMessageCount = payload
  }
}

const actions = {
  getBoxMessageCount({ commit }) {
    getBoxMessageCount().then((res) => {
      if (res && res.success) {
        const { result = {} } = res
        commit('SET_BOX_MESSAGE_COUNT', result)
      }
    })
  }
}

const message = {
  namespaced: true,
  state,
  mutations,
  actions
}

export default message
