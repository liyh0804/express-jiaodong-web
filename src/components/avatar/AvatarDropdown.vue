<template>
  <a-dropdown placement="bottomRight" trigger="click">
  <!-- <a-dropdown v-if="currentUser && currentUser.name" placement="bottomRight"> -->
    <span class="gh-avatar">
      <a-avatar size="small" class="gh-icon">
        <template #icon>
          <img src="../../assets/images/monitor/avatar.png" alt="">
        </template>
      </a-avatar>
      <!-- <span>{{ currentUser.name }}</span> -->
      <span>李亚辉</span>
    </span>
    <template #overlay>
      <a-menu class="ant-pro-drop-down menu" :selected-keys="[]">
        <!-- <a-menu-item v-if="menu" key="center" @click="handleToCenter">
          <a-icon type="user" />
          {{ $t('menu.account.center') }}
        </a-menu-item> -->
        <!-- <a-menu-item v-if="menu" key="settings" @click="handleToSettings">
          <a-icon type="setting" />
          {{ $t('menu.account.settings') }}
        </a-menu-item> -->
        <!-- <a-menu-divider v-if="menu" /> -->
        <a-menu-item key="logout" @click="handleLogout">
          <a-icon type="logout" />
          退出登录
        </a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>
  <!-- <span v-else>
    <a-spin size="small" :style="{ marginLeft: 8, marginRight: 8 }" />
  </span> -->
</template>

<script>
import { Modal } from 'ant-design-vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export default {
  name: 'AvatarDropdown',
  props: {
    currentUser: {
      type: Object,
      default: () => null
    },
    menu: {
      type: Boolean,
      default: true
    }
  },
  setup(props, context) {
    const store = useStore()
    const router = useRouter()
    const handleLogout = (e) => {
      const callback = () => {
        router.push({ path: '/user/login' })
      }
      Modal.confirm({
        title: '退出登录',
        content: '您确定要退出登录吗？',
        okText: '确定',
        cancelText: '取消',
        // title: this.$t('layouts.usermenu.dialog.title'),
        // content: this.$t('layouts.usermenu.dialog.content'),
        onOk: () => {
          // return new Promise((resolve, reject) => {
          //   setTimeout(Math.random() > 0.5 ? resolve : reject, 1500)
          // }).catch(() => console.log('Oops errors!'))
          return store.dispatch('user/logout', { callback }).then(() => {
            router.push({ path: '/user/login' })
          })
        },
        onCancel () {}
      })
    }
    return {
      handleLogout
    }
  }
  // methods: {
  //   // handleToCenter () {
  //   //   this.$router.push({ path: '/account/center' })
  //   // },
  //   // handleToSettings () {
  //   //   this.$router.push({ path: '/account/settings' })
  //   // },
  //   handleLogout (e) {
  //     Modal.confirm({
  //       title: '退出登录',
  //       content: '您确定要退出登录吗？',
  //       // title: this.$t('layouts.usermenu.dialog.title'),
  //       // content: this.$t('layouts.usermenu.dialog.content'),
  //       onOk: () => {
  //         // return new Promise((resolve, reject) => {
  //         //   setTimeout(Math.random() > 0.5 ? resolve : reject, 1500)
  //         // }).catch(() => console.log('Oops errors!'))
  //         return this.$store.dispatch('Logout').then(() => {
  //           this.$router.push({ name: 'login' })
  //         })
  //       },
  //       onCancel () {}
  //     })
  //   }
  // }
}
</script>

<style lang="less" scoped>
.gh-avatar {
  padding: 12px;
  margin-right: 40px;
  &:hover {
    background: rgba(0, 0, 0, .025);
  }
  .gh-icon {
    margin-top: -4px;
  }
  span {
    font-size: 14px;
    color: rgba(0, 0, 0, .65);
    margin-left: 8px;
  }
}
.ant-pro-drop-down {
  /deep/ .action {
    margin-right: 8px;
  }
  /deep/ .ant-dropdown-menu-item {
    min-width: 80px;
  }
}
</style>
