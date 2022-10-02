<template>
<div class="drawer-wrapper" :style="{left: distance + 'px'}">
  <ul>
    <li>
      <a href="#">监控台</a>
    </li>
    <li>
      <a href="#">火警</a>
    </li>
    <li>
      <a href="#">故障</a>
    </li>
    <li>
      <a href="#">隐患</a>
    </li>
    <li>
      <a href="#">智能监控系统</a>
    </li>
    <li>
      <a href="#">维保</a>
    </li>
    <li>
      <a href="#">巡检</a>
    </li>
    <li>
      <a href="#">值班查岗</a>
    </li>
  </ul>
</div>
</template>

<script>
export default {
  data () {
    return {
      interval: null,
      distance: -200
    }
  },
  mounted () {
    document.addEventListener('mousemove', this.mouseMove)
  },
  unmounted () {
    document.removeEventListener('mousemove')
  },
  methods: {
    mouseMove (evt) {
      const clientX = evt.clientX
      if (clientX < 50 && this.distance < 0) {
        this.interval = setInterval(this.moveDrawer(0), 1000)
      }
      if (clientX >= 50 && this.distance !== -200) {
        this.interval = setInterval(this.moveDrawer(-200), 30)
      }
    },
    moveDrawer (iTarget) {
      clearInterval(this.interval)
      this.interval = null
      const speed = iTarget === 0 ? 2 : -2
      console.log(`---- ${iTarget} ----- ${speed}`)
      if (this.distance === iTarget) {
        clearInterval(this.interval)
        this.interval = null
      } else {
        this.distance = this.distance + speed
        this.interval = setInterval(this.moveDrawer(iTarget), 30)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.drawer-wrapper {
  position: absolute;
  width: 200px;
  height: 100%;
  // left: 0;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 1;
}
</style>
