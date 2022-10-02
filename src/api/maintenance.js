import request from '@/utils/request'
// 获取今日故障相关统计数据
export function getOwnerRepairList(params = {}) {
  return request.get(`/firefighting-system/bizUserFault/getNeedHandleList?pageNo=${params.pageNo}&pageSize=${params.pageSize}`).then(res => res)
}

// 根据类型获取维保列表数据
export function getDeviceRepairList(params = {}) {
  return request.get(`/firefighting-system/bizDeviceRepair/getDeviceRepairList?maintainType=${params.type}&pageNo=${params.pageNo}&pageSize=${params.pageSize}`).then(res => res)
}

// 获取维保公司列表
export function getAllMaintainCompany() {
  return request.get('/firefighting-system/common/getAllMaintainCompany').then(res => res)
}

// 根据code获取枚举类型
export function getDictByCode(code) {
  return request.get(`/firefighting-system/common/getDictByCode?code=${code}`).then(res => res)
}

// 根据维保公司ID获取所有维保人员信息
export function getMaintainUserByCompanyId(companyId) {
  return request.get(`/firefighting-system/common/getMaintainUserByCompanyId?companyId=${companyId}`).then(res => res)
}

// 获取物业人员(根据物业公司)
export function getUserByPropertyId(propertyCompanyId) {
  return request.get(`/firefighting-system/common/getUserByPropertyId?propertyCompanyId=${propertyCompanyId}`).then(res => res)
}

// 获取物业明细工单列表
export function getDevicePropertyRepairList(params) {
  return request.get(`/firefighting-system/bizDevicePropertyRepair/getDevicePropertyRepairList?pageNo=${params.pageNo}&pageSize=${params.pageSize}`).then(res => res)
}

// 提交业主维保记录到物业
export function submitUserFaultToProperty(params) {
  return request.post('/firefighting-system/bizDevicePropertyRepair/submitUserFaultToProperty', { ...params }).then(res => res)
}

// 提交业主维保记录到维保公司人员名下
export function submitUserFaultToMaintain(params) {
  return request.post('/firefighting-system/bizDeviceRepair/submitUserFaultToMaintain', { ...params }).then(res => res)
}
