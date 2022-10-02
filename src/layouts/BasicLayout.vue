<template>
  <div id="basicLayout" class="basic-layout">
    <section class="container">
      <aside class="sider-wrap">
        <logo />
        <SiderMenu />
      </aside>
      <section class="content-sect">
        <div class="header-wrap">
          <Header />
        </div>
        <div class="content-wrap">
          <router-view></router-view>
        </div>
      </section>
    </section>
    <a-drawer
      class="basic-layout-drawer"
      placement="right"
      :width="400"
      :closable="false"
      :visible="state.visible"
      :after-visible-change="afterVisibleChange"
      @close="onClose">
      <template #title>
        <div class="drawer-title">
          <h1>建筑管理 - 即墨市服装批发市场</h1>
          <a href="javascript:;" @click="onClose">
            <i class="iconfont icon-close"></i>
          </a>
        </div>
      </template>
    </a-drawer>
  </div>
</template>

<script>
import { reactive } from 'vue'
import SiderMenu from './SiderMenu.vue'
import Header from './Header.vue'
import { BasicLogo as Logo } from '@/components'

export default {
  name: 'BasicLayout',
  components: {
    SiderMenu,
    Logo,
    Header
  },
  setup() {
    const state = reactive({
      visible: false
    })
    const onClose = () => {
      state.visible = false
    }
    return {
      state,
      onClose
    }
  }
}
</script>

<style lang="less">
  @import "./BasicLayout.less";
</style>
