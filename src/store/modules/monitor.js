import {
  getTotalCheckupInfo, getDeviceGroupStatus, getTodayPrecessInfo, getTodayFaultPrecessInfo, getTodayThreatPrecessInfo,
  getSecurityCheckData, getThreatGroupCount, getSecurityAlarmTend, getDeviceRepairGroupInfo
} from '@/api/monitor'

const defaultTodayFireStatistics = {
  fireAlarmWaitToProcess: 0,
  realFireAlarm: 0,
  fireAlarmProcessDone: 0,
  fireAlarmProcessDelay: 0,
  fireAlarmDepartment: 0
}

const defaultFaultStatistics = {
  faultWaitToProcess: 0,
  faultProcessDelay: 0,
  faultProcessDone: 0
}

const defaultThreatStatistics = {
  threatWaitToProcess: 0,
  threatProcessDelay: 0,
  threatProcessDone: 0
}

const defaultRadarIndicator = [
  { type: '火警', max: 100, key: 'fireFighting' },
  { type: '故障', max: 100, key: 'fault' },
  { type: '维保', max: 100, key: 'maintence' },
  { type: '在岗', max: 100, key: 'onduty' },
  { type: '隐患', max: 100, key: 'threat' }
]
const defaultDeviceStatistics = [
  { name: '火灾自动报警系统', offline: 0, online: 0, rate: 100, startColor: '#33CC9B', endColor: '#8EF9D7' },
  { name: '独立式烟感探测器', offline: 0, online: 0, rate: 100, startColor: '#4BD9F4', endColor: '#A9F5FF' },
  { name: '水压探测仪', offline: 0, online: 0, rate: 100, startColor: '#F7C947', endColor: '#FFED9E' },
  { name: '液位监测仪', offline: 0, online: 0, rate: 100, startColor: '#33CC9B', endColor: '#8EF9D7' },
  { name: '可燃气体探测器', offline: 0, online: 0, rate: 100, startColor: '#4BD9F4', endColor: '#A9F5FF' },
  { name: '电气火灾探测器', offline: 0, online: 0, rate: 100, startColor: '#F7C947', endColor: '#FFED9E' }
]
const defaultRadarValue = [0, 0, 0, 0, 0]

const state = {
  totalCheckup: {
    loading: false,
    indicator: defaultRadarIndicator,
    value: defaultRadarValue,
    score: 'A',
    scoreName: '优'
  },
  threatRanks: {
    loading: false,
    range: 'month',
    list: [{
      layerNo: 32,
      threatQuantity: 342
    }, {
      layerNo: 12,
      threatQuantity: 300
    }, {
      layerNo: 2,
      threatQuantity: 256
    }, {
      layerNo: 13,
      threatQuantity: 222
    }, {
      layerNo: 39,
      threatQuantity: 200
    }, {
      layerNo: 1,
      threatQuantity: 128
    }, {
      layerNo: 23,
      threatQuantity: 88
    }, {
      layerNo: 17,
      threatQuantity: 54
    }, {
      layerNo: 6,
      threatQuantity: 12
    }, {
      layerNo: 5,
      threatQuantity: 4
    }]
  },
  deviceGroupStatistics: {
    loading: false,
    list: defaultDeviceStatistics
  },
  todayFireStatistics: {
    loading: false,
    fireAlarmWaitToProcess: 0,
    realFireAlarm: 0,
    fireAlarmProcessDone: 0,
    fireAlarmProcessDelay: 0,
    fireAlarmDepartment: 0
  },
  todayFaultStatistics: {
    loading: false,
    faultWaitToProcess: 0,
    faultProcessDelay: 0,
    faultProcessDone: 0
  },
  todayThreatStatistics: {
    loading: false,
    threatWaitToProcess: 0,
    threatProcessDelay: 0,
    threatProcessDone: 0
  },
  threatGroupCount: {
    list: [],
    loading: false
  },
  issueTrend: {
    loading: false,
    fireList: [],
    faultList: [],
    threatList: []
  },
  deviceRepairInfo: {
    loading: false,
    appointment: 0,
    emergency: 0,
    routine: 0
  }
}

const mutations = {
  SET_TOTAL_CHECKUP: (state, payload) => {
    state.totalCheckup = payload || {}
  },
  SET_REQ_STATUS: (state, { loading = false, name }) => {
    state[name].loading = loading
  },
  SET_MAINTENANCE_STATISTICS: (state, payload) => {
    state.maintenanceStatistics = payload || {}
  },
  SET_THREAT_RANKS: (state, payload) => {
    state.threatRanks = payload
  },
  SET_DEVICE_GROUP_STATUS: (state, payload) => {
    state.deviceGroupStatistics = payload
  },
  SET_TODAY_PROCESS_INFO: (state, payload) => {
    state.todayFireStatistics = payload
  },
  SET_TODAY_FAULT_STA: (state, payload) => {
    state.todayFaultStatistics = payload
  },
  SET_TODAY_THREAT_STA: (state, payload) => {
    state.todayThreatStatistics = payload
  },
  SET_THREAT_GROUP_COUNT: (state, payload) => {
    state.threatGroupCount = payload
  },
  SET_ISSUE_TREND: (state, payload) => {
    state.issueTrend = payload
  },
  SET_DEVICE_REPAIR_INFO: (state, payload) => {
    state.deviceRepairInfo = payload
  }
}

const actions = {
  getTotalCheckupInfo({ commit }) {
    commit('SET_REQ_STATUS', { name: 'totalCheckup', loading: true })
    getSecurityCheckData().then((res) => {
      if (res && res.success) {
        const { alarmAndScore = {}, level = '优' } = res.result || {}
        const value = []
        value.push(alarmAndScore.fire.score)
        value.push(alarmAndScore.threat.score)
        value.push(alarmAndScore.duty.score)
        value.push(alarmAndScore.repair.score)
        value.push(alarmAndScore.fault.score)
        const scoreName = level
        const score = level === '优' ? 'A' : level === '良' ? 'B' : 'C'
        commit('SET_TOTAL_CHECKUP', { value, score, scoreName, loading: false })
      } else {
        commit('SET_REQ_STATUS', { name: 'totalCheckup', loading: false })
      }
    })
  },
  getThreatRanks({ commit }, { range }) {
    console.log(range)
    commit('SET_REQ_STATUS', { name: 'threatRanks', loading: true })
    getTotalCheckupInfo({ range }).then(res => {
      const { success, result = {} } = res || {}
      if (success) {
        commit('SET_THREAT_RANKS', {
          loading: false,
          list: result.list
        })
      } else {
        commit('SET_REQ_STATUS', { name: 'threatRanks', loading: false })
      }
    })
  },
  getDeviceGroupStatus({ commit }) {
    commit('SET_REQ_STATUS', { name: 'deviceGroupStatistics', loading: true })
    getDeviceGroupStatus().then(res => {
      if (res && res.success) {
        const list = []
        const { result = {} } = res || {}
        list.push({ ...result.fireAlarm, startColor: '#33CC9B', endColor: '#8EF9D7' })
        list.push({ ...result.smokeDetector, startColor: '#4BD9F4', endColor: '#A9F5FF' })
        list.push({ ...result.waterPressure, startColor: '#F7C947', endColor: '#FFED9E' })
        list.push({ ...result.liquidLevel, startColor: '#33CC9B', endColor: '#8EF9D7' })
        list.push({ ...result.combustibleGas, startColor: '#4BD9F4', endColor: '#A9F5FF' })
        list.push({ ...result.electricalFire, startColor: '#F7C947', endColor: '#FFED9E' })
        commit('SET_DEVICE_GROUP_STATUS', {
          loading: false,
          list
        })
      } else {
        commit('SET_REQ_STATUS', { name: 'deviceGroupStatistics', loading: false })
      }
    })
  },
  getTodayPrecessInfo({ commit }) {
    commit('SET_REQ_STATUS', { name: 'todayFireStatistics', loading: true })
    getTodayPrecessInfo().then(res => {
      if (res && res.success) {
        const data = res.result || defaultTodayFireStatistics
        commit('SET_TODAY_PROCESS_INFO', {
          loading: false,
          ...data
        })
      } else {
        commit('SET_REQ_STATUS', { name: 'todayFireStatistics', loading: false })
      }
    })
  },
  getTodayFaultPrecessInfo({ commit }) {
    commit('SET_REQ_STATUS', { name: 'todayFaultStatistics', loading: true })
    getTodayFaultPrecessInfo().then(res => {
      if (res && res.success) {
        const data = res.result || defaultFaultStatistics
        commit('SET_TODAY_FAULT_STA', {
          loading: false,
          ...data
        })
      } else {
        commit('SET_REQ_STATUS', { name: 'todayFaultStatistics', loading: false })
      }
    })
  },
  getTodayThreatPrecessInfo({ commit }) {
    commit('SET_REQ_STATUS', { name: 'todayThreatStatistics', loading: true })
    getTodayThreatPrecessInfo().then(res => {
      if (res && res.success) {
        const data = res.result || defaultThreatStatistics
        commit('SET_TODAY_THREAT_STA', {
          loading: false,
          ...data
        })
      } else {
        commit('SET_REQ_STATUS', { name: 'todayThreatStatistics', loading: false })
      }
    })
  },
  // 隐患位置排名
  getThreatGroupCount({ commit }, { type = 1 }) {
    commit('SET_REQ_STATUS', { name: 'threatGroupCount', loading: true })
    getThreatGroupCount(type).then(res => {
      if (res && res.success) {
        const { result = [] } = res || {}
        commit('SET_THREAT_GROUP_COUNT', {
          list: result,
          loading: false
        })
      } else {
        commit('SET_REQ_STATUS', { name: 'threatGroupCount', loading: false })
      }
    })
  },
  // 火警、故障、隐患走势
  getSecurityAlarmTend({ commit }, { type = 1 }) {
    commit('SET_REQ_STATUS', { name: 'issueTrend', loading: true })
    getSecurityAlarmTend(type).then(res => {
      if (res && res.success) {
        const { result = [] } = res || {}
        const fireList = result.filter((item) => {
          return item.type === '火警'
        })
        const faultList = result.filter(item => {
          return item.type === '故障'
        })
        const threatList = result.filter(item => {
          return item.type === '隐患'
        })
        commit('SET_ISSUE_TREND', {
          fireList: fireList[0].list,
          faultList: faultList[0].list,
          threatList: threatList[0].list,
          loading: false
        })
      } else {
        commit('SET_REQ_STATUS', { name: 'issueTrend', loading: false })
      }
    })
  },
  // 待处理维保
  getDeviceRepairGroupInfo({ commit }) {
    commit('SET_REQ_STATUS', { name: 'deviceRepairInfo', loading: true })
    getDeviceRepairGroupInfo().then(res => {
      if (res && res.success) {
        const { result } = res || {}
        commit('SET_DEVICE_REPAIR_INFO', {
          loading: false,
          ...result
        })
      } else {
        commit('SET_REQ_STATUS', { name: 'deviceRepairInfo', loading: false })
      }
    })
  }
}

const monitor = {
  namespaced: true,
  state,
  mutations,
  actions
}

export default monitor
