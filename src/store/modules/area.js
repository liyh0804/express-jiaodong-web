import { getAreaTree, addAreaTree, editAreaTree, deleteAreaTree, getAreaCompanyList } from '@/api/area'

const state = {
  areas: {
    total: 0,
    pageNo: 1,
    pageSize: 10,
    list: []
  }
}

const mutations = {
  SET_AREA_COMPANY_LIST: (state, payload) => {
    state.areas = payload
  },
  SET_REQ_STATUS: (state, {
    loading = false,
    name
  }) => {
    state[name].loading = loading
  }
}

const actions = {
  getAreaCompanyList: ({ commit }, { payload }) => {
    getAreaCompanyList(payload).then(res => {
      if (res && res.success) {
        const { current, total, size, records = [] } = res || {}
        commit('SET_AREA_COMPANY_LIST', {
          pageNo: current,
          pageSize: size,
          total,
          list: records
        })
      }
    })
  },
  getAreaTree: ({ commit }, payload) => {
    return getAreaTree(payload)
    // commit('SET_REQ_STATUS', {
    //   name: 'areaTree',
    //   loading: true
    // })
    // getAreaTree(payload).then(res => {
    //   console.log(res)
    //   if (res && res.success) {
    //     commit('SET_TREE_DATA', {
    //       list: [res.result],
    //       loading: false
    //     })
    //   } else {
    //     commit('SET_REQ_STATUS', {
    //       name: 'areaTree',
    //       loading: false
    //     })
    //   }
    // })
  },
  addAreaTree: ({ commit }, payload) => {
    return addAreaTree(payload)
  },
  editAreaTree: ({ commit }, payload) => {
    return editAreaTree(payload)
  },
  deleteAreaTree: ({ commit }, payload) => {
    return deleteAreaTree(payload)
  }
}

const area = {
  namespaced: true,
  state,
  mutations,
  actions
}

export default area
