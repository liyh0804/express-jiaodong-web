import request from '@/utils/request'

// 生成qrcode
export function productQrcode(id) {
  return request.get(`/firefighting-system/device/showDeviceQrCode?id=${id}`)
}

// 下载qrcode
export function downloadQrcode(id) {
  return request.get(`/firefighting-system/device/downloadQrCode?id=${id}`)
}

// 添加 | 编辑 设备子类型
export function addDeviceSubType(params) {
  if (params && params.id) {
    return request.put('/firefighting-system/bizDeviceSubType/edit', { ...params })
  }
  return request.post('/firefighting-system/bizDeviceSubType/add', { ...params })
}

// 批量生成设备二维码
export function batchCreateDeviceQrCode(params) {
  return request.post('/firefighting-system/device/batchCreateQrCode', { ...params })
}

// 批量下载设备二维码
export function batchDownloadDeviceQrCode(params) {
  return request.post('/firefighting-system/device/batchDownloadQrCode', { ...params })
}

// 删除设备子类型
export function deleteDeviceSubType(id) {
  return request.delete(`/firefighting-system/bizDeviceSubType/delete?id=${id}`)
}

// 设备厂家 & 品牌
export function getFactoryBrandList(params) {
  return request.get('/firefighting-system/deviceCompany/list', { params }).then(res => res)
}

// 设备列表查询
export function getDeviceList(params) {
  return request.post('/firefighting-system/device/queryDeviceList', { ...params }).then(res => res)
}

// 添加 | 编辑 设备工厂 & 品牌
export function addDeviceFactoryBrand(params) {
  if (params && params.id) {
    return request.put('/firefighting-system/deviceCompany/edit', { ...params }).then(res => res)
  }
  return request.post('/firefighting-system/deviceCompany/add', { ...params }).then(res => res)
}

// 删除设备工厂 & 品牌
export function deleteDeviceFactory(id) {
  return request.delete(`/firefighting-system/deviceCompany/delete?id=${id}`)
}

// 设备类型分页列表
export function getDeviceTypeList(params) {
  return request.get('/firefighting-system/bizDeviceSubType/list', { params }).then(res => res)
}

// 根据设备类型获取子设备类型
export function getSubTypeListByDeviceType(params) {
  return request.get('/firefighting-system/bizDeviceSubType/getSubTypeListByDeviceType', { params })
}

// 添加 or 保存设备
export function saveDeviceInfo(params) {
  if (params.id) {
    // 编辑
    return request.put('/firefighting-system/device/edit', { ...params })
  }
  return request.post('/firefighting-system/device/saveDevice', { ...params })
}

// 根据设备ID查询设备详情
export function getDeviceDetailById(params) {
  return request.get(`/firefighting-system/device/queryById?id=${params.id}`)
}

// 查询设备详情
export function getDeviceDetailBaseInfo(params) {
  return request.get('/firefighting-system/device/getDeviceDetail_baseInfo', { params }).then(res => res)
}

// 查询设备详情-实时数据
export function getDeviceDetailRealTimeData(params) {
  return request.get('/firefighting-system/device/getDeviceDetail_realTimeData', { params }).then(res => res)
}

// 剩余电流三相电压曲线图
export function getDeviceDetail24HourData(params) {
  return request.get('/firefighting-system/device/getDeviceDetail_24HourData', { params }).then(res => res)
}

// 七天内历史预警
export function getDeviceDetail7DaysAlarms(params) {
  return request.get('/firefighting-system/device/getDeviceDetail_7DaysAlarms', { params }).then(res => res)
}
