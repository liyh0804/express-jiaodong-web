<template>
  <div id="userLayout" class="user-layout-wrapper">
    <!-- <div class="container">
      <div class="user-layout-hd"></div>
      <div class="user-layout-content">
         <router-view />
      </div>
    </div> -->
    <router-view></router-view>
  </div>
</template>

<style lang="less" scoped>
.user-layout-wrapper {
  width: 100%;
  height: 100%;
  min-height: 800px;
  // background: url(../assets/images/monitor/bg.png) no-repeat top center;
  background-size: 100% 100%;
}
</style>
