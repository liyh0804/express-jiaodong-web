<template>
  <div style="width: 208px">
    <a-menu
      :default-selected-keys="state.selectedKeys"
      :default-open-keys="state.openKeys"
      mode="inline"
      theme="dark"
      class="sider-menu"
      :inline-collapsed="collapsed"
    >
      <template v-for="item in list" :key="item.path">
        <template v-if="!item.children && !item.hidden">
          <a-menu-item :key="item.path">
            <router-link :to="item.path">
              <i class="iconfont" :class="item.meta.icon"></i>
              <!-- <template #icon>
              {{ item.meta.icon }}
                <i class="iconfont icon-{{item.meta.icon}}"></i>
              </template> -->
              {{ item.meta.title }}
            </router-link>
          </a-menu-item>
        </template>
        <template v-else>
          <sub-menu v-if="!item.hidden" :menu-info="item" :key="item.path" />
        </template>
      </template>
    </a-menu>
  </div>
</template>
<script>
import { defineComponent, ref, computed, reactive } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import SubMenu from './SubMenu.vue'

export default defineComponent({
  name: 'SiderMenu',
  setup() {
    const collapsed = ref(false)
    const store = useStore()
    const route = useRoute()
    let list = store.state.permission.addRouters || []
    list = list.length ? list[0].children : []
    const currentPath = route.path
    const parentRoute = list.find(item => currentPath.includes(item.path))
    const state = reactive({
      selectedKeys: [route.path],
      openKeys: [parentRoute.path]
    })

    return {
      list: computed(() => {
        return store.state.permission.addRouters.length ? store.state.permission.addRouters[0].children : []
      }),
      collapsed,
      state
    }
  },

  components: {
    'sub-menu': SubMenu
  }
})
</script>

<style lang="less" scoped>
.sider-menu {
  background: transparent;
}
i.iconfont {
  font-size: 20px;
  vertical-align: middle;
  margin-right: 2px;
}
</style>
