import {
  getAreaEventsList,
  queryAutocompleteList,
  getFloorSecurityInfo,
  queryAreaById,
  queryHasPoslistByAreaId,
  queryHasPoslistByParentAreaIdAndStatus
} from '@/api/bim'
import { getFloorList } from '@/api/cameras'

const state = {
  areaEvents: {
    list: [],
    pageNo: 1,
    pageSize: 20,
    total: 0,
    loading: true
  },
  autocomplete: {
    list: [],
    loading: true
  },
  floorSecurityInfo: {
    /****
     *接入社保总数
     */
    deviceCount: 0,
    /***
     * 火警
     */
    fireAlarmCount: 0,
    /***
     * 故障
     */
    faultCount: 0,
    /***
     * 电器火灾预警
     */
    elcFireCount: 0,
    /***
     * 监测设备异常
     */
    deviceErrorCount: 0,
    loading: true
  },
  floors: {
    list: [],
    loading: true
  }
}

const mutations = {
  SET_REQ_STATUS: (state, {
    loading = false,
    name
  }) => {
    state[name].loading = loading
  },
  SET_AE_DATA: (state, payload) => {
    if (payload.list && payload.list.length > 0) {
      payload.list.map((item, index) => {
        item._index = (index + 1)
      })
    }
    state.areaEvents = payload
  },
  SET_AC_DATA: (state, payload) => {
    state.autocomplete = payload
  },
  SET_FSI_DATA: (state, payload) => {
    state.floorSecurityInfo = payload
  },
  SET_F_DATA: (state, payload) => {
    state.floors = payload
  }
}

const actions = {
  getAreaEventsList: ({ commit }, payload) => {
    return getAreaEventsList(payload)
    // commit('SET_REQ_STATUS', {
    //   name: 'areaEvents',
    //   loading: true
    // })
    // getAreaEventsList(payload).then(res => {
    //   if (res && res.success) {
    //     const {
    //       current,
    //       pages,
    //       size,
    //       total,
    //       records = []
    //     } = res.result || {}
    //     commit('SET_AE_DATA', {
    //       pageNo: current,
    //       pageSize: size,
    //       total,
    //       list: records,
    //       pages,
    //       loading: false
    //     })
    //   } else {
    //     commit('SET_REQ_STATUS', {
    //       name: 'areaEvents',
    //       loading: false
    //     })
    //   }
    // })
  },

  queryAutocompleteList: ({ commit }, payload) => {
    commit('SET_REQ_STATUS', {
      name: 'autocomplete',
      loading: true
    })
    queryAutocompleteList(payload).then(res => {
      console.log(res)
      if (res && res.success) {
        commit('SET_AC_DATA', {
          list: res.result,
          loading: false
        })
      } else {
        commit('SET_REQ_STATUS', {
          name: 'autocomplete',
          loading: false
        })
      }
    })
  },

  getFloorSecurityInfo: ({ commit }, payload) => {
    commit('SET_REQ_STATUS', {
      name: 'floorSecurityInfo',
      loading: true
    })
    getFloorSecurityInfo(payload).then(res => {
      if (res && res.success) {
        commit('SET_FSI_DATA', {
          deviceCount: res.result.deviceCount,
          fireAlarmCount: res.result.fireAlarmCount,
          faultCount: res.result.faultCount,
          elcFireCount: res.result.elcFireCount,
          deviceErrorCount: res.result.deviceErrorCount,
          loading: false
        })
      } else {
        commit('SET_REQ_STATUS', {
          name: 'floorSecurityInfo',
          loading: false
        })
      }
    })
  },

  getFloorList: ({ commit }, payload) => {
    commit('SET_REQ_STATUS', {
      name: 'floors',
      loading: true
    })
    getFloorList(payload).then(res => {
      if (res && res.success) {
        commit('SET_F_DATA', {
          list: res.result,
          loading: false
        })
      } else {
        commit('SET_REQ_STATUS', {
          name: 'floors',
          loading: false
        })
      }
    })
  },

  queryAreaById: ({ commit }, payload) => {
    return queryAreaById(payload)
  },
  queryHasPoslistByAreaId: ({ commit }, payload) => {
    return queryHasPoslistByAreaId(payload)
  },
  queryHasPoslistByParentAreaIdAndStatus: ({ commit }, payload) => {
    return queryHasPoslistByParentAreaIdAndStatus(payload)
  }
}

const bim = {
  namespaced: true,
  state,
  mutations,
  actions
}

export default bim
