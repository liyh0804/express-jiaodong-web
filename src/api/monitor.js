import request from '@/utils/request'

export function getTotalCheckupInfo() {
  return request.get('/firefighting-system/bizDevice/list').then(res => res)
}

// 获取设备在线状态信息
export function getDeviceGroupStatus() {
  return request.get('/firefighting-system/device/getDeviceGroupStatus').then(res => res)
}

// 获取今日火警相关统计数据
export function getTodayPrecessInfo() {
  return request.get('/firefighting-system/fireAlarm/getTodayPrecessInfo').then(res => res)
}

// 获取今日故障相关统计数据
export function getTodayFaultPrecessInfo() {
  return request.get('/firefighting-system/fault/getTodayPrecessInfo').then(res => res)
}

// 获取今日隐患相关统计数据
export function getTodayThreatPrecessInfo() {
  return request.get('/firefighting-system/threat/getTodayPrecessInfo').then(res => res)
}

// 全面体检
export function getSecurityCheckData() {
  return request.get('/firefighting-system/common/getSecurityCheckData').then(res => res)
}

// 楼层隐患排名
export function getThreatGroupCount(type = 1) {
  return request.get(`/firefighting-system/threat/getThreatGroupCount?type=${type}`).then(res => res)
}

// 火警、故障、隐患走势
export function getSecurityAlarmTend(type = 1) {
  return request.get(`/firefighting-system/common/getSecurityAlarmTend?type=${type}`).then(res => res)
}

// 待处理维保接口
export function getDeviceRepairGroupInfo() {
  return request.get('/firefighting-system/bizDeviceRepair/getDeviceRepairGroupInfo').then(res => res)
}
