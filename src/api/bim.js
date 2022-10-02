import request from '@/utils/request'

// 获取区域事件表内容
export function getAreaEventsList(params) {
  return request.get('/firefighting-system/bizAreaEvents/list', { params }).then(res => res)
}

// 获取楼层企业单位自动完成接口
export function queryAutocompleteList(params) {
  return request.get('/firefighting-system/bizBimCompany/queryAutocompleteList', { params }).then(res => res)
}

// 获取楼层统计信息接口 接入设备总数  电气火灾预警  火警  监测设备异常  故障
export function getFloorSecurityInfo(params) {
  return request.get('/firefighting-system/common/getFloorSecurityInfo', { params }).then(res => res)
}

// 获取区域信息
export function queryAreaById(params) {
  return request.get('/firefighting-system/bizArea/queryById', { params }).then(res => res)
}

// 获取所属区域中带有位置信息的设备列表
export function queryHasPoslistByAreaId(params) {
  return request.get('/firefighting-system/device/queryHasPoslistByAreaId', { params }).then(res => res)
}

// 获取所属楼体(区域)中指定status带有位置信息的设备列表
export function queryHasPoslistByParentAreaIdAndStatus(params) {
  let url = '/firefighting-system/device/queryHasPoslistByParentAreaIdAndStatus'
  if (params.status) {
    url += '?status=' + params.status
  }
  delete params.status
  return request.get(url, { params }).then(res => res)
}
