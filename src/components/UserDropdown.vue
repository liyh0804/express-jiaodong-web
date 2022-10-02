<template>
  <a-dropdown class="user-dropdown-wrap" :trigger="['click']">
    <a class="ant-dropdown-link" @click="e => e.preventDefault()">
      <img class="usericon" src="../assets/images/monitor/user-ico.png" alt="user-icon">
      <span class="username">{{userInfo.realname || userInfo.username}}</span>
      <img class="dropdown" src="../assets/images/monitor/dropdown.png" alt="dropdown">
      <!-- <a-icon type="down" /> -->
    </a>
    <template v-slot:overlay>
      <a-menu>
        <a-menu-item key="0">
          <div class="logout-wrap" @click="logout">
            退出登录
          </div>
        </a-menu-item>
      </a-menu>
      </template>
    </a-dropdown>
</template>
<script>
import { computed, onMounted } from 'vue'
import { useStore } from 'vuex'
export default {
  setup() {
    const store = useStore()
    onMounted(() => {
      store.dispatch('user/getUserInfo')
    })
    return {
      userInfo: computed(() => store.state.user.userInfo),
      logout: () => store.dispatch('user/logout')
    }
  }
}
</script>

<style lang="less" scoped>
.user-dropdown-wrap {
  display: block;
  a.ant-dropdown-link {
    display: block;
  }
  img.usericon {
    width: 0.48rem;
    height: 0.48rem;
    margin-right: 0.12rem;
    vertical-align: middle;
  }
  .username {
    font-size: 0.22rem;
    line-height: 0.48rem;
    color: #fff;
    vertical-align: middle;
    // margin: 0 0.04rem 0 0.12rem;
  }
  img.dropdown {
    width: 0.16rem;
    height: 0.16rem;
    margin-left: 0.04rem;
    margin-top: -0.04rem;
  }
}
.logout-wrap {
  // background: red;
  float: right;
  width: 1.2rem;
  height: 0.48rem;
  border-radius: 4px;
  background-color: #41477B;
  text-align: center;
  // margin-top: 0.06rem;
  font-size: 0.16rem;
  color: #fff;
  line-height: 0.48rem;
}
.ant-dropdown-menu {
  background-color: transparent;
  padding: 0;
}
/deep/ .ant-dropdown-menu-item:hover, .ant-dropdown-menu-submenu-title:hover {
  background-color: transparent;
}
.ant-dropdown-menu-item, .ant-dropdown-menu-submenu-title {
  background-color: transparent;
}
</style>
