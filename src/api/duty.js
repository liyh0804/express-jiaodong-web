import request from '@/utils/request'
import axios from 'axios'
import storage from 'store'
import { ACCESS_TOKEN } from '@/store/mutation-types'

// 获取历史值班查岗记录
export function getDutyHistoryList(params) {
  return request.get(`/firefighting-system/bizDuty/listByTime?from=${params.from || ''}&to=${params.to || ''}&pageNo=${params.pageNo}&pageSize=${params.pageSize}`).then(res => res)
}

// 导出历史值班查岗记录
// export function exportDutyHistoryList(params) {
//   return request.get(`/firefighting-system/bizDuty/listByTimeExport?from=${params.from}&to=${params.to}`).then(res => res)
// }
export function exportDutyHistoryList(params) {
  const token = storage.get(ACCESS_TOKEN)
  return axios({
    method: 'get', // 设置请求方式
    url: '/api/firefighting-system/bizDuty/listByTimeExport',
    data: { ...params },
    headers: {
      'Content-Type': 'application/json',
      'X-Access-Token': token
    },
    responseType: 'blob'
  })
}

// 配置查岗频率
export function configDutyRate(params) {
  return request.post('/firefighting-system/bizDutyConfig/set', { ...params }).then(res => res)
}

// 获取配置查岗频率
export function getConfigDutyRate() {
  return request.get('/firefighting-system/bizDutyConfig/get').then(res => res)
}

// 手动
export function manualDuty(params) {
  return request.post('/firefighting-system/bizDuty/manual').then(res => res)
}
