const getters = {
  token: state => state.user.token,
  roles: state => state.user.roles,
  userInfo: state => state.user.userInfo,
  addRouters: state => state.permission.addRouters
}

export default getters
