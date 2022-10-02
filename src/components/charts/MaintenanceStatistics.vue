<template>
<div class="maintenance-statistics-wrap">
  <div class="header">
    <div class="title">待处理维保统计</div>
  </div>
  <a-spin :spinning="deviceRepairInfo.loading">
    <div class="content">
      <div id="ms_sl"></div>
    </div>
  </a-spin>
</div>
</template>

<script>
import { reactive, computed, onMounted, onUpdated, watch } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import * as echarts from 'echarts/core'
import { LegendComponent } from 'echarts/components'
import { PieChart } from 'echarts/charts'
import { CanvasRenderer } from 'echarts/renderers'
let _myChart = null
const _option = {
  color: ['#71E8FF', '#58EDB6', '#88A2F7'],
  series: [
    {
      name: '访问来源',
      type: 'pie',
      radius: '50%',
      data: [
        {
          value: 0,
          name: '应急维保',
          label: {
            rich: {
              a_set: {
                fontSize: '0.16rem',
                color: '#71E8FF',
                fontWeight: '700'
              }
            }
          }
        },
        {
          value: 0,
          name: '预约维保',
          label: {
            rich: {
              a_set: {
                fontSize: '0.16rem',
                color: '#58EDB6',
                fontWeight: '700'
              }
            }
          }
        },
        {
          value: 0,
          name: '例行维保',
          label: {
            rich: {
              a_set: {
                fontSize: '0.16rem',
                color: '#88A2F7',
                fontWeight: '700'
              }
            }
          }
        }
      ],
      label: {
        normal: {
          show: true,
          formatter: '{a_set|{c}个}\n{c_set|{b}}\n',
          rich: {
            c_set: {
              fontSize: '0.12rem',
              color: '#fff'
            }
          }
        }
      },
      itemStyle: {
        borderWidth: 1,
        borderColor: '#312A52'
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
    const store = useStore()
    const router = useRouter()
    const state = reactive({
      date: 1
    })
    const pieChartClick = (evt) => {
      const { name } = evt.data || {}
      console.log(name) // name: '应急维保', value: 123
      let type = ''
      if (name === '应急维保') {
        type = 0
      } else if (name === '预约维保') {
        type = 1
      } else if (name === '例行维保') {
        type = 2
      }
      router.push({ path: '/maintenance_manage', query: { type } })
    }
    onMounted(() => {
      echarts.use([LegendComponent, PieChart, CanvasRenderer])
      const chartDom = document.getElementById('ms_sl')
      _myChart = echarts.init(chartDom)
      store.dispatch('monitor/getDeviceRepairGroupInfo')
      _option.series[0].data[0].value = store.state.monitor.deviceRepairInfo.emergency
      _option.series[0].data[1].value = store.state.monitor.deviceRepairInfo.appointment
      _option.series[0].data[2].value = store.state.monitor.deviceRepairInfo.routine
      _option && _myChart.setOption(_option)
      _myChart.on('click', pieChartClick)
    })
    onUpdated(() => {
      _option.series[0].data[0].value = store.state.monitor.deviceRepairInfo.emergency
      _option.series[0].data[1].value = store.state.monitor.deviceRepairInfo.appointment
      _option.series[0].data[2].value = store.state.monitor.deviceRepairInfo.routine
      _option && _myChart.setOption(_option)
    })
    watch(
      () => props.time,
      () => {
        store.dispatch('monitor/getDeviceRepairGroupInfo')
      }
    )
    return {
      state,
      deviceRepairInfo: computed(() => store.state.monitor.deviceRepairInfo),
      getDeviceRepairGroupInfo: () => { store.dispatch('monitor/getDeviceRepairGroupInfo') },
      pieChartClick
    }
  }
}
</script>

<style lang="less" scoped>
.maintenance-statistics-wrap {
  width: 3.74rem;
  height: 2.24rem;
  .header {
    color: #fff;
    height: 0.4rem;
    margin-bottom: 0.06rem;
    background: url(../../assets/images/monitor/bg-title-3.png) no-repeat center;
    background-size: 3.74rem 0.4rem;
  }
  .title {
    font-size: 0.16rem;
    line-height: 0.4rem;
    font-weight: bold;
    margin-left: 0.16rem;
  }
  .content {
    width: 3.74rem;
    height: 1.78rem;
    background: url(../../assets/images/monitor/bg-maintenance-st.png) no-repeat center;
    background-size: 3.74rem 1.78rem;
    #ms_sl {
      width: 100%;
      height: 100%;
      padding-top: 0.16rem;
      overflow: hidden;
    }
  }
}
</style>
