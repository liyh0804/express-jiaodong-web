<template>
  <div class="el-vue-amap-container">
    <div class="el-vue-amap"></div>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'el-amap',
  props: [
    'center',
    'zoom',
    'mapStyle'
  ],
  data () {
    return {}
  },
  // beforeCreate () {

  // },
  mounted () {
    this.createMap()
  },
  unmounted () {
    this.$amap && this.$amap.destroy()
  },
  methods: {
    createMap () {
      console.log('aaa')
    }
  }
}
</script>

<style lang="less" scoped>
.el-vue-amap-container {
  height: 100%;
  .el-vue-amap {
    height: 100%;
  }
}
</style>
