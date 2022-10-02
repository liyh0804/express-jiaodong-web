<template>
  <div class="header-wrap">
    <a-breadcrumb class="breakcrumb">
      <a-breadcrumb-item>
        <router-link :to="parentRoute.path">{{ parentRoute.meta.title }}</router-link>
      </a-breadcrumb-item>
      <a-breadcrumb-separator> &nbsp;&nbsp;/&nbsp;&nbsp; </a-breadcrumb-separator>
      <a-breadcrumb-item>{{ currentRoute.meta.title }}</a-breadcrumb-item>
    </a-breadcrumb>
    <div>
      <a class="btn std-btn" href="javascript:;" @click="jumpToMonitorCenter">监控中心</a>
      <avatar-dropdown></avatar-dropdown>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { AvatarDropdown } from '@/components'

export default {
  components: {
    AvatarDropdown
  },
  setup(props, context) {
    const route = useRoute()
    const store = useStore()
    const router = useRouter()
    let list = store.state.permission.addRouters || []
    list = list.length ? list[0].children : []
    const currentPath = route.path
    const parentRoute = list.find(item => currentPath.includes(item.path))
    const jumpToMonitorCenter = () => {
      const role = store.state.user.roles[0]
      router.push({ path: `/monitor/${role}` })
    }
    // const currentRoute = parentRoute.children && parentRoute.children.find(item => item.path === currentPath)
    return {
      currentRoute: computed(() => {
        const currentPath = route.path
        const parentRoute = list.find(item => currentPath.includes(item.path))
        return parentRoute.children && parentRoute.children.find(item => item.path === currentPath)
      }),
      parentRoute,
      jumpToMonitorCenter
    }
  }
}
</script>

<style lang="less" scoped>
.header-wrap {
  display: flex;
  justify-content: space-between;
  padding: 0 24px;
  .breakcrumb {
    font-size: 16px;
    color: #000;
    line-height: 48px;
    a {
      font-weight: 700;
      color: #000;
    }
  }
  .btn {
    display: inline-block;
    width: 88px;
    height: 32px;
    border-radius: 2px;
    text-align: center;
    line-height: 32px;
    background: #6677F0;
    font-size: 14px;
    font-weight: 700;
    color: #fff;
    margin-top: 8px;
    margin-right: 28px;
  }
}
</style>
