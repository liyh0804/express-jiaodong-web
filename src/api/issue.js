import request from '@/utils/request'
import axios from 'axios'
import storage from 'store'
import { ACCESS_TOKEN } from '@/store/mutation-types'
// 获取今日故障相关统计数据
export function getIssueList(params) {
  return request.post('/firefighting-system/common/getSecurityAlarmList', { ...params }).then(res => res)
}

export function exportSecurityAlarmList(params) {
  const token = storage.get(ACCESS_TOKEN)
  return axios({
    method: 'post', // 设置请求方式
    url: '/api/firefighting-system/common/exportSecurityAlarmList',
    data: { ...params },
    headers: {
      'Content-Type': 'application/json',
      'X-Access-Token': token
    },
    responseType: 'blob'
  }).then(res => res)
  // return axios.post('/firefighting-system/common/exportSecurityAlarmList', { ...params }, { responseType: 'blob' }).then(res => res)
}
