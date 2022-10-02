<template>
  <div class="dashboard-wrap">
    <!-- 内容区content begin -->
    <div class="content-wrap">
      <!-- 左侧内容区 begin -->
      <div class="left-ct">
        <!-- 全面体检 start -->
        <div class="position pos1">
          <sl-total-checkup :time="state.timestamp"></sl-total-checkup>
        </div>
        <!-- 全面体检 end -->
        <!-- 维保统计 start -->
        <div class="positon pos2 middle">
          <sl-maintenance-statistics :time="state.timestamp"></sl-maintenance-statistics>
        </div>
        <!-- 维保统计 end -->
        <!-- 高频隐患位置 start -->
        <div class="position pos3">
          <sl-hidden-danger-rank :time="state.timestamp"></sl-hidden-danger-rank>
        </div>
        <!-- 高频隐患位置 end -->
      </div>
      <!-- 左侧内容区 end -->

      <!-- 中间区域 begin -->
      <div class="center-ct">
        <!-- BIM区域 start -->
        <div class="gis-wrap">
          <sl-bim-exhibition-box :width="state.centerWidth" :height="state.centerHeight" :time="state.timestamp"></sl-bim-exhibition-box>
        </div>

        <div class="statistics-wrap">
          <sl-statistics-msg :time="state.timestamp"></sl-statistics-msg>
        </div>
        <!-- BIM区域 end -->
      </div>
      <!-- 中间区域 end -->

      <!-- 右侧内容区 begin -->
      <div class="right-ct flex">
        <div class="position pos1">
          <sl-realtime-monitor :time="state.timestamp"></sl-realtime-monitor>
        </div>
        <div class="position pos2 middle">
          <sl-equipment-online-monitor :rem="state.rem" :time="state.timestamp"></sl-equipment-online-monitor>
        </div>
        <div class="position">
          <sl-danger-trend :time="state.timestamp"></sl-danger-trend>
        </div>
      </div>
      <!-- 右侧内容区 end -->
    </div>
    <!-- 内容区content end -->
  </div>
</template>
<script>

import { reactive, onMounted, onUnmounted } from 'vue'

// import Header from '@/components/Header.vue'
// import NavItems from '@/components/NavItems.vue'
// import UserDropdown from '@/components/UserDropdown.vue'
import StatisticsMsg from '@/components/charts/StatisticMsg.vue'
import TotalCheckup from '@/components/charts/TotalCheckup.vue'
import MaintenanceStatistics from '@/components/charts/MaintenanceStatistics.vue'
import HiddenDangerRanking from '@/components/charts/HiddenDangerRanking.vue'
import RealTimeMonitor from '@/components/charts/RealTimeMonitoring.vue'
import EquipmentOnlineMonitor from '@/components/charts/EquipmentOnlineMonitor.vue'
import DangerTrend from '@/components/charts/DangerTrend.vue'
import BimExhibitionBox from '@/components/bim/BimExhibitionBox.vue'
import { getRem } from '@/utils/tool'

const TIMESTAMP = 15000
let timer = null

export default {
  name: 'Dashboard',
  components: {
    'sl-statistics-msg': StatisticsMsg,
    'sl-total-checkup': TotalCheckup,
    'sl-maintenance-statistics': MaintenanceStatistics,
    'sl-hidden-danger-rank': HiddenDangerRanking,
    'sl-realtime-monitor': RealTimeMonitor,
    'sl-equipment-online-monitor': EquipmentOnlineMonitor,
    'sl-danger-trend': DangerTrend,
    'sl-bim-exhibition-box': BimExhibitionBox
  },

  setup() {
    const state = reactive({
      centerHeight: 0,
      centerWidth: 0,
      rem: 100,
      timestamp: new Date().getTime()
    })

    onMounted(() => {
      setCenterSize()
      timer = setInterval(() => {
        state.timestamp = new Date().getTime()
      }, TIMESTAMP)
    })

    onUnmounted(() => {
      clearInterval(timer)
      timer = null
    })
    // const whdef = 100 / 1920 // 表示1920的设计图,使用100PX的默认值,使用100px只是为了方便计算 其他值都可以
    // // var wH = window.innerHeight;// 当前窗口的高度
    // const wW = window.innerWidth // 当前窗口的宽度
    // const rem = wW * whdef // 以默认比例值乘以当前窗口宽度,得到该宽度下的相应FONT-SIZE值
    const setCenterSize = () => {
      // const whdef = 100 / 1920 // 表示1920的设计图,使用100PX的默认值,使用100px只是为了方便计算 其他值都可以
      // // var wH = window.innerHeight;// 当前窗口的高度
      // const wW = window.innerWidth // 当前窗口的宽度
      // const rem = wW * whdef // 以默认比例值乘以当前窗口宽度,得到该宽度下的相应FONT-SIZE值
      const rem = getRem()
      state.centerHeight = 7.84 * rem
      state.centerWidth = 9.98 * rem
      state.rem = rem
    }
    return {
      state
    }
  }
}
</script>
<style lang="less" scoped>
.dashboard-wrap {
  width: 100%;
  //height: 100%;
  // overflow: hidden;
  min-width: 1280px;
  // background: #1A1B3A url(../assets/images/monitor/bg.png) repeat-y center;
  // background-size: 100% 100%;

  .content-wrap {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    // height: 100%;
    padding: 0.16rem 0.24rem 0.26rem;

    .left-ct {
      float: left;
      width: 3.74rem;
      height: 100%;

      .middle {
        margin: 0.16rem 0;
      }
    }

    .center-ct {
      float: left;
      width: 9.98rem;
      height: 100%;
      margin: 0 0.16rem;

      .gis-wrap {
        width: 100%;
        height: 7.84rem;
        margin-bottom: 0.16rem;
        background: url(../assets/images/monitor/bg-gis.png) no-repeat center;
        background-size: 9.98rem 7.84rem;
      }

      .statistics-wrap {
        width: 100%;
        height: 1.44rem;
      }
    }

    .right-ct {
      float: left;
      width: 4.52rem;
      height: 100%;

      .middle {
        margin: 0.16rem 0;
      }
    }
  }
}
</style>
