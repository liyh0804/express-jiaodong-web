<template>
<a-sub-menu v-if="!menuInfo.hidden" class="sider-menu-sub" :key="menuInfo.path">
  <template #icon>
    <i class="iconfont" :class="menuInfo.meta.icon"></i>
  </template>
  <template #title>
    <i class="iconfont" :class="menuInfo.meta.icon"></i>{{ menuInfo.meta.title }}
  </template>
  <template v-for="item in menuInfo.children" :key="item.path">
    <template v-if="!item.children && !item.hidden">
      <a-menu-item :key="item.path">
        <router-link :to="item.path">
          <template #icon>
            <i class="iconfont" :class="item.meta.icon"></i>
          </template>
          {{ item.meta.title }}
        </router-link>
      </a-menu-item>
    </template>
    <template v-else>
      <sub-menu :menu-info="item" :key="item.path" />
    </template>
  </template>
</a-sub-menu>
</template>

<script>

export default {
  name: 'SubMenu',
  props: {
    menuInfo: {
      type: Object,
      default: () => ({})
    }
  }
}
</script>

<style lang="less" scoped>
i.iconfont {
  font-size: 20px;
  vertical-align: middle;
  margin-right: 2px;
}
</style>
