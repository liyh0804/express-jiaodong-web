import {
  getDeviceDetailBaseInfo,
  getDeviceDetailRealTimeData,
  getDeviceDetail24HourData,
  getDeviceDetail7DaysAlarms,
  getDeviceList,
  getFactoryBrandList,
  addDeviceFactoryBrand,
  deleteDeviceFactory,
  getDeviceTypeList,
  addDeviceSubType,
  deleteDeviceSubType,
  batchCreateDeviceQrCode,
  batchDownloadDeviceQrCode,
  getSubTypeListByDeviceType,
  saveDeviceInfo,
  getDeviceDetailById,
  productQrcode,
  downloadQrcode
} from '@/api/device'

const state = {
  DDBaseInfo: {
    deviceType: '',
    deviceModel: '',
    deviceAddress: '',
    deviceId: '',
    deviceBrand: '',
    createDate: '',
    loading: true
  },
  DD7DaysAlarms: {
    list: [],
    loading: true
  },
  deviceList: {
    pageNo: 1,
    pageSize: 10,
    total: 0,
    list: []
  },
  factoryBrandList: {
    pageNo: 1,
    pageSize: 10,
    total: 0,
    list: []
  },
  deviceTypeList: {
    pageNo: 1,
    pageSize: 10,
    total: 0,
    list: []
  },
  subTypeList: [],
  deviceDetail: {}
}

const mutations = {
  SET_DEVICE_LIST: (state, payload) => {
    state.deviceList = payload
  },
  SET_DEVICE_TYPE_LIST: (state, payload) => {
    state.deviceTypeList = payload
  },
  SET_FACTORY_BRAND: (state, payload) => {
    state.factoryBrandList = payload
  },
  SET_SUB_TYPE_LIST: (state, payload) => {
    state.subTypeList = payload
  },
  SET_REQ_STATUS: (state, {
    loading = false,
    name
  }) => {
    state[name].loading = loading
  },
  SET_BI_DATA: (state, payload) => {
    state.DDBaseInfo = payload
  },
  SET_7D_DATA: (state, payload) => {
    state.DD7DaysAlarms = payload
  },
  SET_DEVICE_DETAIL: (state, payload) => {
    state.deviceDetail = payload
  }
}

const actions = {
  downloadQrcode: (_, { payload: { id } }) => {
    return downloadQrcode(id)
  },
  productQrcode: (_, { payload: { id } }) => {
    return productQrcode(id)
  },
  getDeviceDetailById: ({ commit }, { payload }) => {
    return new Promise((resolve, reject) => {
      getDeviceDetailById(payload).then(res => {
        if (res && res.success) {
          commit('SET_DEVICE_DETAIL', res.result)
        }
        resolve(res)
      }).catch(error => {
        reject(error)
      })
    })
  },
  saveDeviceInfo: (_, { payload }) => {
    return saveDeviceInfo(payload)
  },
  getSubTypeListByDeviceType: ({ commit }, { payload }) => {
    getSubTypeListByDeviceType(payload).then(res => {
      if (res && res.success) {
        commit('SET_SUB_TYPE_LIST', res.result || [])
      }
    })
  },
  batchCreateDeviceQrCode: (_, { payload }) => {
    return batchCreateDeviceQrCode(payload)
  },
  batchDownloadDeviceQrCode: (_, { payload }) => {
    return batchDownloadDeviceQrCode(payload)
  },
  deleteDeviceSubType: (_, { payload: { id } }) => {
    return deleteDeviceSubType(id)
  },
  addDeviceSubType: (_, { payload }) => {
    return addDeviceSubType(payload)
  },
  getDeviceTypeList: ({ commit }, { payload }) => {
    getDeviceTypeList(payload).then(res => {
      if (res && res.success) {
        const { result = {} } = res
        const { current, size, total, records = [] } = result || {}
        commit('SET_DEVICE_TYPE_LIST', {
          pageNo: current,
          pageSize: size,
          total,
          list: records
        })
      }
    })
  },
  getFactoryBrandList: ({ commit }, { payload }) => {
    getFactoryBrandList(payload).then((res) => {
      if (res && res.success) {
        const { result = {} } = res
        const { current, size, total, records = [] } = result || {}
        commit('SET_FACTORY_BRAND', {
          pageNo: current,
          pageSize: size,
          total,
          list: records
        })
      }
    })
  },
  getDeviceList: ({ commit }, { payload }) => {
    getDeviceList(payload).then((res) => {
      if (res && res.success) {
        const { result = {} } = res
        const { current, size, total, records = [] } = result || {}
        commit('SET_DEVICE_LIST', {
          pageNo: current,
          pageSize: size,
          total,
          list: records
        })
      }
    })
  },
  addDeviceFactoryBrand: (_, { payload }) => {
    return addDeviceFactoryBrand(payload)
  },
  deleteDeviceFactory: (_, { payload: { id } }) => {
    return deleteDeviceFactory(id)
  },
  getDeviceDetailBaseInfo: ({ commit }, payload) => {
    commit('SET_BI_DATA', {
      deviceType: '',
      deviceModel: '',
      deviceAddress: '',
      deviceId: '',
      deviceBrand: '',
      createDate: '',
      loading: true
    })
    getDeviceDetailBaseInfo(payload).then(res => {
      if (res && res.success) {
        commit('SET_BI_DATA', {
          deviceType: res.result.deviceType,
          deviceModel: res.result.deviceModel,
          deviceAddress: res.result.deviceAddress,
          deviceId: res.result.deviceId,
          deviceBrand: res.result.deviceBrand,
          createDate: res.result.createDate,
          loading: false
        })
      } else {
        commit('SET_REQ_STATUS', {
          name: 'DDBaseInfo',
          loading: false
        })
      }
    })
  },
  getDeviceDetailRealTimeData: ({ commit }, payload) => {
    return getDeviceDetailRealTimeData(payload)
  },
  getDeviceDetail24HourData: ({ commit }, payload) => {
    return getDeviceDetail24HourData(payload)
  },
  getDeviceDetail7DaysAlarms: ({ commit }, payload) => {
    commit('SET_REQ_STATUS', {
      name: 'DD7DaysAlarms',
      loading: true
    })
    getDeviceDetail7DaysAlarms(payload).then(res => {
      if (res && res.success) {
        commit('SET_7D_DATA', {
          list: res.result,
          loading: false
        })
      } else {
        commit('SET_REQ_STATUS', {
          name: 'DD7DaysAlarms',
          loading: false
        })
      }
    })
  }
}

const device = {
  namespaced: true,
  state,
  mutations,
  actions
}

export default device
