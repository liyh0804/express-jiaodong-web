import request from '@/utils/request'
import axios from 'axios'
import storage from 'store'
import { ACCESS_TOKEN } from '@/store/mutation-types'

// 根据月份获取当月汇总巡检结果
export function getPatrolCheckSummaryByMonth(params) {
  return request.get('/firefighting-system/bizDeviceCheck/summaryByMonth', { params })
}

// 根据日期获取当天巡检记录
export function getPatrolCheckListByDate(params) {
  return request.get('/firefighting-system/bizDeviceCheck/listByDay', { params })
}

export function downOpen(params) {
  const token = storage.get(ACCESS_TOKEN)
  return axios({
    method: 'get', // 设置请求方式
    url: `/api/firefighting-system/bizDeviceCheck/exportDayXls?selDay=${params.selDay}`,
    // data: { ...params },
    headers: {
      'Content-Type': 'application/json',
      'X-Access-Token': token
    },
    responseType: 'blob'
  })
}
