import { getAllGisGeoJSon } from '@/api/gis'

const state = {}

const mutations = {}

const actions = {
  getAllGisGeoJSon: ({ commit }, payload) => {
    return getAllGisGeoJSon(payload)
  }
}
const gis = {
  namespaced: true,
  state,
  mutations,
  actions
}

export default gis
