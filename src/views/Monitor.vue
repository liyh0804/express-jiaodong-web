<template>
  <!-- <div class="monitor-wrap">
    <sl-sider-drawer />
    <a-row>
      <a-col :span="6">
        <a-row>
          <a-col class="grid" :span="24">
            <div id="echarts"></div>
          </a-col>
        </a-row>
        <a-row>
          <a-col class="grid" :span="24">
            <div class="echarts"></div>
          </a-col>
        </a-row>
      </a-col>
      <a-col :span="12">
        <div class="echarts"></div>
      </a-col>
      <a-col :span="6">
        <a-row>
          <a-col class="grid" :span="24">
            <div class="echarts"></div>
          </a-col>
        </a-row>
        <a-row>
          <a-col class="grid" :span="24">
            <sl-hidden-danger-chart></sl-hidden-danger-chart>
          </a-col>
        </a-row>
      </a-col>
    </a-row>
    <a-row>
      <a-col class="grid" :span="6">
        <div class="echarts"></div>
      </a-col>
      <a-col class="grid" :span="12">
        <div class="echarts"></div>
      </a-col>
      <a-col class="grid" :span="6">
        <div class="echarts"></div>
      </a-col>
    </a-row>
  </div> -->
  <div class="wrapper">
    <div class="header"></div>
    <div class="navitems-wrapper">
      <sl-navitems />
    </div>
    <div class="view-layout">
      <div class="dl col-flex">
        <div class="card"></div>
        <div class="card"></div>
        <div class="card"></div>
      </div>
      <div class="dc col-flex">
        <div class="big-card"></div>
        <div class="middle-card bim-container">
          <sl-statistic-msg />
        </div>
      </div>
      <div class="dr col-flex">
        <div class="card"></div>
        <div class="card"></div>
        <div class="card"></div>
      </div>
    </div>
    <sl-draggle-ball />
  </div>
</template>
<script>
// import * as echarts from 'echarts/core'
// import { BarChart } from 'echarts/charts'
// import { TitleComponent, TooltipComponent, GridComponent, LegendComponent } from 'echarts/components'
// import { CanvasRenderer } from 'echarts/renderers'
import NavItems from '@/components/NavItems.vue'
import DraggleBall from '@/components/DraggleBall.vue'
import StatisticMsg from '@/components/charts/StatisticMsg.vue'
// import SiderDrawer from '@/components/SiderDrawer.vue'
// import HiddenDangerChat from '@/components/charts/HiddenDangerChart.vue'

export default {
  components: {
    'sl-navitems': NavItems,
    'sl-draggle-ball': DraggleBall,
    'sl-statistic-msg': StatisticMsg
    // DatePicker
    // 'sl-sider-drawer': SiderDrawer,
    // 'sl-hidden-danger-chart': HiddenDangerChat

  },
  data () {
    return {
      visible: true,
      placement: 'left'
      // drawerStyle: {
      //   background：rgba(0, 0, 0, 0.4);
      // }
    }
  },
  mounted () {
    // echarts.use([TitleComponent, TooltipComponent, GridComponent, LegendComponent, BarChart, CanvasRenderer])
    // const chartDom = document.getElementById('echarts')
    // const myChart = echarts.init(chartDom)
    // const option = {
    //   title: {
    //     text: 'ECharts 入门示例'
    //   },
    //   tooltip: {},
    //   legend: {
    //     data: ['销量']
    //   },
    //   xAxis: {
    //     data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
    //   },
    //   yAxis: {},
    //   series: [{
    //     name: '销量',
    //     type: 'bar',
    //     data: [5, 20, 36, 10, 10, 20]
    //   }]
    // }
    // option && myChart.setOption(option)
  }
}
</script>
<style lang="less" scoped>
.wrapper {
  // background-color: pink;
  width: 100%;
  height: 100%;
  min-width: 1270px;
  overflow: hidden;
  .header {
    height: 7%;
    border: 1px solid blue;
    background-color: lightblue;
  }
  .navitems-wrapper {
    height: 4%;
    border: 1px solid gray;
    background-color: lightgrey;
  }
  .view-layout {
    display: flex;
    flex-direction: row;
    height: 89%;
    .col-flex {
      display: flex;
      flex-direction: column;
    }
    .dl {
      flex: 6;
      height: 100%;
      background-color: lightgreen;
    }
    .dc {
      // width: 48%;
      flex: 12;
      height: 100%;
      background-color: lightsalmon;
    }
    .dr {
      // width: 24%;
      flex: 6;
      height: 100%;
      background-color: magenta;
    }
    .card {
      flex: 1;
      border: 1px solid red;
    }
    .big-card {
      flex: 3;
      background-color: mediumaquamarine;
    }
    .middle-card {
      flex: 1;
      // background-color: maroon;
    }
  }
}
// .monitor-wrap {
//   background-color: #333333;
//   height: 100%;
//   .grid {
//     height: 33.3%;
//     border-radius: 12px;
//     border: 2px solid #DA8926;
//     background-color: #31251E;
//   }
// }
// .echarts, #echarts {
//   // float: left;
//   display: inline-block;
//   width: 300px;
//   height: 200px;
//   background-color: #f1f1f1;
//   margin-right: 8px;
//   margin-top: 8px;
// }
</style>
