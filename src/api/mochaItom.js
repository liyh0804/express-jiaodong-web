import request from '@/utils/request'
// 运营列表
export function getDataList(params) {
  return request.get('/firefighting-system/bizOrganizationInfo/list', { params })
}
// 主要枚举值
export function getEnumList(params) {
  return request.get(`/firefighting-system/bizOrganizationInfo/getEnumList?type=${params}`)
}
/**
 * @param {* 服务机构信息表-添加} params
 * @returns
 */
export function add(params) {
  return request.post('/firefighting-system/bizOrganizationInfo/add', params)
}
