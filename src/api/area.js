import request from '@/utils/request'

// 获取单位管理
export function getAreaCompanyList(params) {
  return request.post('/firefighting-system/bizCompany/getCompanyList', { params }).then(res => res)
}

// 获取区域事件表内容
export function getAreaTree(params) {
  return request.get('/firefighting-system/bizServiceArea/tree', { params }).then(res => res)
}

// 添加tree
export function addAreaTree(params) {
  return request.post('/firefighting-system/bizServiceArea/add', params).then(res => res)
}

// 修改tree
export function editAreaTree(params) {
  return request.put('/firefighting-system/bizServiceArea/edit', params).then(res => res)
}

// 修改tree
export function deleteAreaTree(params) {
  return request.delete('/firefighting-system/bizServiceArea/delete', { params }).then(res => res)
}
