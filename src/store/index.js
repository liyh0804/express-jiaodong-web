import { createStore } from 'vuex'
// 监控台数据
import monitor from './modules/monitor'
// 用户信息相关
import user from './modules/user'
// 火警、故障、隐患相关
import issue from './modules/issue'
// 消息管理
import message from './modules/message'
// bim相关
import bim from './modules/bim'
// 维保相关
import maintenance from './modules/maintenance'
// 值班查岗相关
import duty from './modules/duty'
// 设备相关
import device from './modules/device'
// 巡检相关
import patrol from './modules/patrol'

// 单位管理相关
import area from './modules/area'

// permission 相关
import permission from './modules/permission'

import getters from './getters'

// import { RootStateTypes } from './types/root-types'

// gis相关
import gis from './modules/gis'

export default createStore({
  modules: {
    monitor,
    user,
    permission,
    issue,
    message,
    bim,
    maintenance,
    duty,
    device,
    patrol,
    gis,
    area
  },
  state: {
    lang: 'zh-CN'
  },
  mutations: {},
  actions: {},
  getters
})
