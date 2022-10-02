<template>
<div class="hidden-danger-ranking-wrap">
  <div class="header">
    <div class="title">高频隐患位置</div>
    <div class="r-c">
      <a-radio-group default-value="1" @change="({ target }) => getThreatGroupCount(target.value)">
        <a-radio-button value="0">
          <div class="one-row">近1年</div>
        </a-radio-button>
        <a-radio-button value="1">
          <div class="one-row">近30天</div>
        </a-radio-button>
        <a-radio-button value="2">
          <div class="one-row">近24小时</div>
        </a-radio-button>
      </a-radio-group>
    </div>
  </div>
  <a-spin :spinning="threatGroupCount.loading">
    <div class="content">
      <div id="rank-sl"></div>
      <div class="tip-txt" v-if="threatGroupCount.list.length < 10">近{{state.type === '0' ? '1年' : state.type === '2' ? '24小时' : '30天'}} 其他楼层无隐患上报</div>
    </div>
  </a-spin>
</div>
</template>

<script>
import { computed, onMounted, onUpdated, reactive, watch } from 'vue'
import { useStore } from 'vuex'
// import { mapState, mapActions } from 'vuex'
import * as echarts from 'echarts/core'
import { TooltipComponent, GridComponent } from 'echarts/components'
import { BarChart } from 'echarts/charts'
import { CanvasRenderer } from 'echarts/renderers'
// import { onMounted } from '@vue/runtime-core'

let _myChart = null
const color1 = new echarts.graphic.LinearGradient(
  0, 0, 1, 0,
  [
    { offset: 0, color: '#6677F0' },
    { offset: 1, color: '#9FAFF9' }
  ]
)
const color2 = new echarts.graphic.LinearGradient(
  0, 0, 1, 0,
  [
    { offset: 0, color: '#33CC9B' },
    { offset: 1, color: '#8EF9D7' }
  ]
)
const color3 = new echarts.graphic.LinearGradient(
  0, 0, 1, 0,
  [
    { offset: 0, color: '#F7C947' },
    { offset: 1, color: '#FFED9E' }
  ]
)
const colors = [color1, color2, color3]
const _option = {
  grid: {
    left: '8%',
    right: '12%',
    bottom: '10%',
    top: '11%',
    containLabel: true
  },
  xAxis: {
    type: 'value',
    show: false
  },
  yAxis: {
    type: 'category',
    // show: false,
    data: [],
    axisLabel: {
      show: true,
      textStyle: {
        color: '#fff',
        fontSize: '0.12rem'
      }
    },
    max: 9
  },
  axisLine: {
    show: false
  },
  series: [
    {
      name: '统计数据',
      type: 'bar',
      // barCategoryGap: 36,
      // barWidth: 16,
      // barGap: '0%',
      // barCategoryGap: '0%',
      data: [],
      itemStyle: {
        normal: {
          label: {
            show: true,
            position: 'right',
            textStyle: {
              color: '#fff',
              fontSize: '0.12rem'
            }
          }
        }
      }
    }
  ]
}

export default {
  props: {
    time: {
      type: Number,
      default: new Date().getTime()
    }
  },
  setup(props, context) {
    const state = reactive({
      type: 1 // 0 year 1 month 2 day
    })
    const store = useStore()
    onMounted(() => {
      echarts.use([TooltipComponent, GridComponent, BarChart, CanvasRenderer])
      const chartDom = document.getElementById('rank-sl')
      _myChart = echarts.init(chartDom)
      // this.getThreatRanks({ range: this.threatRanks.range })
      store.dispatch('monitor/getThreatGroupCount', { type: state.type })
      const list = store.state.monitor.threatGroupCount.list || []
      _option.yAxis.data = []
      _option.series[0].data = []
      if (list && list.length > 0) {
        const length = list.length
        for (let i = 0; i < 10; i++) {
          _option.series[0].data[9 - i] = {
            value: i < length ? list[i].threatCount : '',
            itemStyle: {
              color: colors[i % 3]
            }
          }
          _option.yAxis.data[9 - i] = i < length ? list[i].floor : ''
        }
      }
      _option && _myChart.setOption(_option)
    })
    onUpdated(() => {
      const list = store.state.monitor.threatGroupCount.list || []
      _option.yAxis.data = []
      _option.series[0].data = []
      if (list && list.length > 0) {
        const length = list.length
        for (let i = 0; i < 10; i++) {
          // _option.series[0].data[length - i - 1].value = list[i].threatCount
          _option.series[0].data[9 - i] = {
            value: i < length ? list[i].threatCount : '',
            itemStyle: {
              color: colors[i % 3]
            }
          }
          _option.yAxis.data[9 - i] = i < length ? list[i].floor : ''
        }
      }
      _option && _myChart.setOption(_option)
    })

    watch(
      () => props.time,
      () => {
        store.dispatch('monitor/getThreatGroupCount', { type: state.type })
      }
    )
    return {
      state,
      threatGroupCount: computed(() => store.state.monitor.threatGroupCount),
      getThreatGroupCount: (type) => {
        state.type = type
        store.dispatch('monitor/getThreatGroupCount', { type })
      }
    }
  }
}
</script>

<style lang="less" scoped>
.hidden-danger-ranking-wrap {
  width: 3.74rem;
  height: 3.84rem;
   .header {
    color: #fff;
    height: 0.4rem;
    margin-bottom: 0.06rem;
    .title {
      float: left;
      width: 1.58rem;
      height: 0.4rem;
      overflow: hidden;
      font-size: 0.16rem;
      line-height: 0.4rem;
      font-weight: bold;
      padding-left: 0.16rem;
      background: url(../../assets/images/monitor/bg-title-1.png) no-repeat center;
      background-size: 1.72rem 0.4rem;
    }
    .r-c {
      float: right;
      // width: 0.96rem;
      height: 0.4rem;
      padding-top: 0.06rem;

      .ant-radio-button-wrapper {
        width: 0.72rem;
        height: 0.28rem;
        font-size: 0.14rem;
        line-height: 0.28rem;
        text-align: center;
        color: #fff;
        padding: 0;
        border: 0;
        background: transparent url(../../assets/images/monitor/btn-unselect.png) no-repeat center;
        background-size: 0.72rem 0.28rem;
        border-radius: 0;
        &.ant-radio-button-wrapper-checked {
          // border: 1px solid red;
          background: transparent url(../../assets/images/monitor/btn-select.png) no-repeat center;
        }
      }
      .ant-radio-button-wrapper:not(:first-child)::before {
        content: '';
        width: 0;
      }
      .ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled) {
        box-shadow: unset;
      }
      .ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled)::before {
        background-color: transparent !important;
        box-shadow: unset;
      }

    }
  }
  .content {
    width: 3.74rem;
    height: 3.38rem;
    background: url(../../assets/images/monitor/bg-danger-rank.png) no-repeat top left;
    background-size: 3.74rem 3.38rem;
    #rank-sl {
      width: calc(100% - 0.12rem);
      height: 100%;
    }
    .tip-txt {
      position: absolute;
      width: 3.74rem;
      font-size: 0.14rem;
      color: #fff;
      margin-top: -0.48rem;
      text-align: center;
    }
  }
}
</style>
