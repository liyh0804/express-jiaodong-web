import request from '@/utils/request'

// 登录
export function login(params) {
  return request.post('/firefighting-system/sys/loginByPhone', params).then(res => res)
}

// 退出登录
export function logout() {
  return request.get('/firefighting-system/sys/logout2').then(res => res)
}

// 获取用户信息
export function getUserInfo() {
  return request.get('/firefighting-system/sys/getUserInfo').then(res => res)
}

// 获取用户管理 用户列表
export function getUserManageUserList(params) {
  return request.post('/firefighting-system/bizCompany/queryCustomer', { ...params })
}

// 更改用户状态
export function changeUserDisabled(id) {
  return request.get(`/firefighting-system/bizCompany/changeCustomerDisableFlag?id=${id}`)
}
