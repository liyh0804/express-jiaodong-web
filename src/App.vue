<template>
  <a-config-provider lang="zhCN">
    <template #renderEmpty>
      <div class="empty-wrap">
        <!-- <img src="./assets/images/monitor/icon-nodata.png"/> -->
        <p>暂无数据</p>
      </div>
    </template>
    <router-view></router-view>
    <!-- <div class="page">
      <div class="header-wrapper" v-if="!$route.meta.single">
        <Header>
          <NavItems/>
          <template v-slot:userInfo>
            <UserDropdown/>
          </template>
        </Header>
      </div>
      <div class="content-wrap">
        <router-view :key="$route.params.type"/>
      </div>
      <draggle-ball v-if="!$route.meta.single"/>
    </div> -->
  </a-config-provider>
</template>

<script>
// import Header from '@/components/Header.vue'
// import NavItems from '@/components/NavItems.vue'
// import UserDropdown from '@/components/UserDropdown.vue'
// import DraggleBall from '@/components/DraggleBall.vue'

export default {
  // components: {
  //   Header,
  //   NavItems,
  //   UserDropdown,
  //   DraggleBall
  // },
  // data() {
  //   return {
  //     centerHeight: 0,
  //     centerWidth: 0,
  //     rem: 100,
  //     layout: false
  //   }
  // },
  // methods: {
  //   setCenterSize() {
  //     const whdef = 100 / 1920 // 表示1920的设计图,使用100PX的默认值,使用100px只是为了方便计算 其他值都可以
  //     // var wH = window.innerHeight;// 当前窗口的高度
  //     const wW = window.innerWidth // 当前窗口的宽度
  //     const rem = wW * whdef // 以默认比例值乘以当前窗口宽度,得到该宽度下的相应FONT-SIZE值
  //     this.centerHeight = 7.84 * rem
  //     this.centerWidth = 9.98 * rem
  //     this.rem = rem
  //   }
  // }
}
</script>

<style lang="less">
// body {
//   background: #23265C url(assets/images/monitor/bg.png) no-repeat;
//   background-size: 100%;
//   min-width: 1280px;
// }

// @media (max-width:1920px){
//   body {
//     background-size: auto;
//   }

// }

// #app {
//   width: 100%;
//   height: 100%;

//   .page {
//     width: 100%;
//     height: 100%;

//     .content-wrap {
//       width: 100%;
//       height: 100%;
//       //padding-bottom: 0.16rem;
//     }
//   }
// }
#app {
  width: 100%;
  height: 100%;
}

.empty-wrap {
  img {
    width: 1.28rem;
  }

  p {
    font-size: 0.16rem;
  }
}

// .ant-popover-placement-top > .ant-popover-content > .ant-popover-arrow, .ant-popover-placement-topLeft > .ant-popover-content > .ant-popover-arrow, .ant-popover-placement-topRight > .ant-popover-content > .ant-popover-arrow {
//   border-right-color: #41477B !important;
//   border-bottom-color: #41477B !important;
// }

// .ant-popover-content .ant-popover-inner {
//   background-color: #41477B;
// }

// /deep/ .ant-modal-footer {
//   background: red !important;
//   border-top: 0 !important;
// }

</style>
<style>
/* @import '/resets.css';
@import '/common.css'; */
</style>
