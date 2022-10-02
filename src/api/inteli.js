import request from '@/utils/request'

export function bizCameraEventList(params) {
  return request.get('/firefighting-system/bizCameraEvent/list', { params })
}

// 获取巡检人员
// /firefighting-system/common/getUserByPropertyID
export function getUserByPropertyID(params) {
  return request.get('/firefighting-system/common/getUserByPropertyId', { params })
}

// /firefighting-system/bizCameraEvent/sceneManualCheck  巡检调试
export function getSceneManualCheck(params) {
  return request.get('/firefighting-system/bizCameraEvent/sceneManualCheck', { params })
}

/// firefighting-system/bizCameraEvent/getPersonSceneCheckResult
// 核实结果
export function getPersonSceneCheckResult(params) {
  return request.get('/firefighting-system/bizCameraEvent/getPersonSceneCheckResult', { params })
}

/// firefighting-system/bizCameraEvent/getPersonSceneCheckResult
// 提交核实结果
export function updateFlowStatus(params) {
  return request.get('/firefighting-system/bizCameraEvent/updateFlowStatus', { params })
}

// 发起维保
/// firefighting-system/bizCameraEvent/submitEventToMaintain
export function submitEventToMaintain(params) {
  return request.get('/firefighting-system/bizCameraEvent/submitEventToMaintain', { params })
}

// 根据枚举code获取枚举类型
export function getDictByCode(params) {
  return request.get('/firefighting-system/common/getDictByCode', { params })
}

// 常用controller接口-获取所有维保公司
export function getAllMaintainCompany(params) {
  return request.get('/firefighting-system/common/getAllMaintainCompany', { params })
}
// 根据维保公司ID获取所有维保人员信息
export function getMaintainUserByCompanyId(params) {
  return request.get('/firefighting-system/common/getMaintainUserByCompanyId', { params })
}
// 物业维修记录-通过id查询
export function getEventProcessDetailList(params) {
  return request.get('/firefighting-system/bizCameraEventProcess/getEventProcessDetailList', { params })
}
