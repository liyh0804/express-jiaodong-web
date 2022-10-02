<template>
<div class="total-checkup-wrap">
  <div class="header" :time="time">
    <div class="title">全面体检</div>
    <a class="btn" @click="getTotalCheckupInfo">立即体检</a>
  </div>
  <a-spin :spinning="totalCheckup.loading">
    <div class="content">
      <div class="word">{{totalCheckup.scoreName}}</div>
      <div id="total-check-sl"></div>
    </div>
  </a-spin>
</div>
</template>

<script>
import { onMounted, computed, onUpdated, watch } from 'vue'
import { useStore } from 'vuex'
import * as echarts from 'echarts/core'
import { LegendComponent } from 'echarts/components'
import { RadarChart } from 'echarts/charts'
import { CanvasRenderer } from 'echarts/renderers'

let _myChart = null
const _option = {
  color: ['#42D4A6'],
  // xAxis: {
  //   splitArea: {
  //     areaStyle: {
  //       color: ['red']
  //     }
  //   }
  // },
  radar: {
    indicator: [
      { name: '火警', max: 100 },
      { name: '故障', max: 100 },
      { name: '维保', max: 100 },
      { name: '在岗', max: 100 },
      { name: '隐患', max: 100 }
    ],
    splitArea: {
      show: false,
      areaStyle: {
        color: 'rgba(255, 255, 255, 0.4)' // 图表背景的颜色
      }
    },
    name: {
      textStyle: {
        padding: [-10, -12],
        color: '#fff'
      }
    }
  },
  series: [{
    name: '全面体检数据',
    type: 'radar',
    data: [
      {
        value: [100, 100, 100, 100, 100],
        lineStyle: {
          width: 2
        }
      }
    ]
  }]
}

export default {
  props: {
    time: {
      type: Number,
      default: new Date().getTime()
    }
  },
  setup(props, context) {
    const store = useStore()

    onMounted(() => {
      store.dispatch('monitor/getTotalCheckupInfo')
      echarts.use([LegendComponent, RadarChart, CanvasRenderer])
      const checkupDom = document.getElementById('total-check-sl')
      _myChart = echarts.init(checkupDom)
      _option.series[0].data[0].value = store.state.monitor.totalCheckup.value
      if (store.state.monitor.totalCheckup.score === 'A') {
        _option.color = ['#42D4A6']
        _option.series[0].data[0].areaStyle = { color: '#42D4A6' }
      } else if (store.state.monitor.totalCheckup.score === 'B') {
        _option.color = ['#71E8FF']
        _option.series[0].data[0].areaStyle = { color: '#71E8FF' }
      } else {
        _option.color = ['#FDD665']
        _option.series[0].data[0].areaStyle = { color: '#FDD665' }
      }
      _option && _myChart.setOption(_option)
    })

    watch(
      () => props.time,
      () => {
        store.dispatch('monitor/getTotalCheckupInfo')
      }
    )
    onUpdated(() => {
      _option.series[0].data[0].value = store.state.monitor.totalCheckup.value
      if (store.state.monitor.totalCheckup.score === 'A') {
        _option.color = ['#42D4A6']
        _option.series[0].data[0].areaStyle = { color: '#42D4A6' }
      } else if (store.state.monitor.totalCheckup.score === 'B') {
        _option.color = ['#71E8FF']
        _option.series[0].data[0].areaStyle = { color: '#71E8FF' }
      } else {
        _option.color = ['#FDD665']
        _option.series[0].data[0].areaStyle = { color: '#FDD665' }
      }
      _option && _myChart.setOption(_option)
    })

    return {
      totalCheckup: computed(() => store.state.monitor.totalCheckup),
      getTotalCheckupInfo: () => store.dispatch('monitor/getTotalCheckupInfo')
    }
  }
}
</script>

<style lang="less" scoped>
.total-checkup-wrap {
  width: 3.74rem;
  height: 3.04rem;
  .header {
    color: #fff;
    height: 0.4rem;
    margin-bottom: 0.06rem;
    background: url(../../assets/images/monitor/bg-title-3.png) no-repeat center;
    background-size: 3.74rem 0.4rem;
    .title {
      float: left;
      font-size: 0.16rem;
      line-height: 0.4rem;
      font-weight: bold;
      margin-left: 0.16rem;
    }
    .btn {
      float: right;
      width: 0.96rem;
      height: 0.4rem;
      text-align: center;
      background: url(../../assets/images/monitor/bg-btn1.png) no-repeat center;
      background-size: 0.96rem 0.4rem;
      border: 0;
      font-size: 0.14rem;
      color: #fff;
      line-height: 0.4rem;
    }
  }
  .content {
    position: relative;
    width: 3.74rem;
    height: 2.58rem;
    background: url(../../assets/images/monitor/bg-total-checkup.png) no-repeat center;
    background-size: 3.74rem 2.58rem;
    #total-check-sl {
      width: 100%;
      height: 100%;
      padding-top: 0.12rem;
      margin: 0 auto;
      overflow: hidden;
    }
    .word {
      position: absolute;
      text-align: center;
      left: calc(50% - 0.13rem);
      top: calc(50% - 0.13rem);
      z-index: 1;
      font-size: 0.26rem;
      color: #fff;
      font-weight: 700;
    }
  }
}
</style>
