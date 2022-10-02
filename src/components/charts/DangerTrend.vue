<template>
  <div class="danger-trend-wrap">
    <div class="header">
      <div class="title">火警/故障/隐患走势</div>
      <div class="r-c">
        <a-radio-group default-value="1" @change="({ target }) => getSecurityAlarmTend(target.value)">
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
    <a-spin :spinning="issueTrend.loading">
      <div class="content">
        <div id="trend-sl"></div>
      </div>
    </a-spin>
  </div>
</template>

<script>
import { reactive, computed, onMounted, onUpdated, watch, nextTick } from 'vue'
import { useStore } from 'vuex'
import * as echarts from 'echarts/core'
import { ToolboxComponent, TooltipComponent, GridComponent, LegendComponent } from 'echarts/components'
import { LineChart } from 'echarts/charts'
import { CanvasRenderer } from 'echarts/renderers'

let _myChart = null
const _option = {
  tooltip: {
    trigger: 'axis'
  },
  legend: {
    top: '8%',
    right: '4%',
    textStyle: {
      fontSize: 12,
      color: '#fff'
    },
    data: ['火警', '故障', '隐患']
  },
  grid: {
    left: '4%',
    right: '4%',
    bottom: '4%',
    containLabel: true
  },
  colors: ['#71E8FF', '#FDD665', '#58EDB6'],
  xAxis: {
    type: 'category',
    boundaryGap: false,
    axisLabel: {
      textStyle: {
        color: 'rgba(255, 255, 255, 0.4)',
        fontSize: 12
      }
    },
    data: []
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      name: '火警',
      type: 'line',
      stack: '总量',
      itemStyle: {
        normal: {
          lineStyle: {
            color: '#71E8FF'
          },
          color: '#71E8FF'
        }
      },
      data: []
    },
    {
      name: '故障',
      type: 'line',
      stack: '总量',
      itemStyle: {
        normal: {
          lineStyle: {
            color: '#FDD665'
          },
          color: '#FDD665'
        }
      },
      data: []
    },
    {
      name: '隐患',
      type: 'line',
      stack: '总量',
      itemStyle: {
        normal: {
          lineStyle: {
            color: '#58EDB6'
          },
          color: '#58EDB6'
        }
      },
      data: []
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
  setup(props) {
    const state = reactive({
      type: 1
    })
    const store = useStore()
    onMounted(() => {
      store.dispatch('monitor/getSecurityAlarmTend', { type: state.type })
      echarts.use([
        ToolboxComponent,
        TooltipComponent,
        GridComponent,
        LegendComponent,
        LineChart,
        CanvasRenderer
      ])
      const chartDom = document.getElementById('trend-sl')
      nextTick()
      _myChart = echarts.init(chartDom)
      const fireList = store.state.monitor.issueTrend.fireList || []
      const faultList = store.state.monitor.issueTrend.faultList || []
      const threatList = store.state.monitor.issueTrend.threatList || []
      _option.xAxis.data = null
      _option.xAxis.data = fireList.map((item) => item.index)
      _option.series[0].data = null
      _option.series[0].data = fireList.map(item => item.count)
      _option.series[1].data = null
      _option.series[1].data = faultList.map(item => item.count)
      _option.series[2].data = null
      _option.series[2].data = threatList.map(item => item.count)
      _option && _myChart.setOption(_option)
    })
    onUpdated(() => {
      nextTick()
      const fireList = store.state.monitor.issueTrend.fireList || []
      const faultList = store.state.monitor.issueTrend.faultList || []
      const threatList = store.state.monitor.issueTrend.threatList || []
      _option.xAxis.data = null
      _option.xAxis.data = fireList.map((item) => item.index)
      _option.series[0].data = null
      _option.series[0].data = fireList.map(item => item.count)
      _option.series[1].data = null
      _option.series[1].data = faultList.map(item => item.count)
      _option.series[2].data = null
      _option.series[2].data = threatList.map(item => item.count)
      _option && _myChart.setOption(_option)
    })

    watch(
      () => props.time,
      () => {
        store.dispatch('monitor/getSecurityAlarmTend', { type: state.type })
      }
    )
    return {
      state,
      issueTrend: computed(() => store.state.monitor.issueTrend),
      getSecurityAlarmTend: (type) => {
        state.type = type
        store.dispatch('monitor/getSecurityAlarmTend', { type })
      }
    }
  }
}
</script>

<style lang="less" scoped>
.danger-trend-wrap {
  width: 4.52rem;
  height: 3.04rem;
  .header {
    color: #fff;
    height: 0.4rem;
    margin-bottom: 0.06rem;
    .title {
      float: left;
      width: 2.36rem;
      height: 0.4rem;
      overflow: hidden;
      font-size: 0.16rem;
      line-height: 0.4rem;
      font-weight: bold;
      padding-left: 0.16rem;
      background: url(../../assets/images/monitor/bg-title-1.png) no-repeat
        center;
      background-size: 2.4rem 0.4rem;
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
        background: transparent
          url(../../assets/images/monitor/btn-unselect.png) no-repeat center;
        background-size: 0.72rem 0.28rem;
        border-radius: 0;
        &.ant-radio-button-wrapper-checked {
          background: url(../../assets/images/monitor/btn-select.png) no-repeat center;
        }
      }
      .ant-radio-button-wrapper:not(:first-child)::before {
        content: "";
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
    width: 4.52rem;
    height: 2.58rem;
    background: url(../../assets/images/monitor/bg-content-right.png) no-repeat
      top left;
    background-size: 4.52rem 2.58rem;
    #trend-sl {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
