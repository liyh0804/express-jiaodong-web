<template>
  <div class="device-details-div">
    <div class="gh-modal-dialog-header">设备名称-详情</div>
    <a-spin :spinning="state.loading">
      <div class="gh-modal-dialog-body  margin-left-right-parent">
        <div class="device-details-title clearfix">
          设备信息
        </div>
        <div class="device-details-info-box clearfix">
          <div class="item-w1">设备ID：{{ props.deviceId }}</div>
          <div class="item-w1">设备品牌：{{ baseInfo.deviceBrand }}</div>
          <div class="item-w2">安装日期：{{ baseInfo.createDate }}</div>
          <div class="item-w1">设备类型：{{ baseInfo.deviceType }}</div>
          <div class="item-w1">设备型号：{{ baseInfo.deviceModel }}</div>
          <div class="item-w2">设备地址：{{ baseInfo.deviceAddress }}</div>
        </div>
        <div class="device-details-title">
          实时数据<span>数据更新时间：{{ state.realTimeData.time }}</span>
        </div>
        <div class="device-details-info-box clearfix">
          <div class="item-w3">剩余电流：{{ state.realTimeData.leftEValue }}</div>
          <div class="item-w4">参考值：{{ state.realTimeData.leftEReference }}</div>
          <div class="item-w3">B相温度Tb：{{ state.realTimeData.tempBValue }}</div>
          <div class="item-w5">参考值：{{ state.realTimeData.tempBReference }}</div>
          <div class="item-w3">A相温度Tb：{{ state.realTimeData.tempAValue }}</div>
          <div class="item-w4">参考值：{{ state.realTimeData.tempAReference }}</div>
          <div class="item-w3">C相温度Tb：{{ state.realTimeData.tempCValue }}</div>
          <div class="item-w5">参考值：{{ state.realTimeData.tempCReference }}</div>
        </div>
      </div>

      <div class="device-details-charts clearfix">
        <div class="device-details-charts-left">
          <div class="device-details-charts-title">20小时检测曲线</div>
          <div id="js-left-charts-box" class="left-charts-box clearfix">
            <!--            <div id="hidden-danger-el-left1" class="left-charts"></div>-->
            <!--            <div id="hidden-danger-el-left2" class="left-charts"></div>-->
          </div>
        </div>
        <div class="device-details-charts-right">
          <div class="device-details-charts-title">近7天历史预警</div>
          <div class="device-details-7day-box" ref="deviceDetails7dayBox">

            <div v-for="item in alarms.list" :key="item.id">{{ item.msg }}<span>{{ item.timeStr }}</span></div>
          </div>
        </div>
      </div>
    </a-spin>
  </div>
</template>

<script>

import * as echarts from 'echarts/core'
import { LineChart } from 'echarts/charts'
import { onMounted, reactive, ref, onBeforeUnmount, watch, computed } from 'vue'
import { CanvasRenderer } from 'echarts/renderers'
import {
  TooltipComponent, LegendComponent, GridComponent,
  MarkLineComponent
} from 'echarts/components'
import { useStore } from 'vuex'

export default {
  props: {
    deviceId: {
      type: String,
      default: function () {
        return null
      }
    }
  },
  setup(props, context) {
    const store = useStore()
    let realTimeDataLoading = true
    let get24HourDataLoading = true
    const state = reactive({
      list: [{
        id: 0,
        text: 'A相对温度过高A相对温度过高',
        date: '2021-04-21 09:10:02'
      }],
      realTimeData: {
        tempAValue: '',
        tempBReference: '',
        tempCReference: '',
        leftEReference: '',
        tempBValue: '',
        tempAReference: '',
        time: '',
        leftEValue: '',
        tempCValue: ''
      },
      loading: true
    })
    let interval = null
    const deviceDetails7dayBox = ref()
    let myChart1
    let myChart2

    watch(
      () => props.deviceId,
      (count, prevCount) => {
        console.log(count, prevCount)
      }
    )
    let baseInfo = computed(() => store.state.device.DDBaseInfo)
    let alarms = computed(() => store.state.device.DD7DaysAlarms)
    const loadDetailBaseInfo = () => {
      console.log('loadDetail', props.deviceId)
      store.dispatch('device/getDeviceDetailBaseInfo', {
        deviceId: props.deviceId
      })
      store.dispatch('device/getDeviceDetail7DaysAlarms', {
        deviceId: props.deviceId
      })
    }

    onBeforeUnmount(() => {
      if (interval) {
        clearInterval(interval)
        interval = null
      }
      baseInfo = {}
      alarms = {}
      state.realTimeData = {
        tempAValue: '',
        tempBReference: '',
        tempCReference: '',
        leftEReference: '',
        tempBValue: '',
        tempAReference: '',
        time: '',
        leftEValue: '',
        tempCValue: ''
      }
    })

    const loadOverHandler = () => {
      if (!baseInfo.value.loading && !alarms.value.loading && !realTimeDataLoading && !get24HourDataLoading) {
        state.loading = false
        return
      }
      setTimeout(loadOverHandler, 200)
    }

    onMounted(() => {
      echarts.use([GridComponent, MarkLineComponent, LineChart, CanvasRenderer, TooltipComponent, LegendComponent])
      const chartsBox = document.getElementById('js-left-charts-box')
      chartsBox.innerHTML = ''
      const left1Dom = document.createElement('div')
      left1Dom.id = 'hidden-danger-el-left1'
      left1Dom.className = 'left-charts'
      const left2Dom = document.createElement('div')
      left2Dom.id = 'hidden-danger-el-left2'
      left2Dom.className = 'left-charts'

      chartsBox.append(left1Dom)
      chartsBox.append(left2Dom)

      myChart1 = echarts.init(left1Dom)
      myChart2 = echarts.init(left2Dom)

      loadDetailBaseInfo()
      getRealTimeData()
      get24HourData()
      loadOverHandler()
    })

    const data1 = {
      // x: ['10:10:02', '10:15:10', '10:25:20', '10:30:30', '10:35:40'],
      // d: [39, 37, 36, 35, 10]
      x: [],
      d: []
    }

    const data2 = {
      // a: [12, 13, 10, 14, 19, 21, 21],
      // b: [22, 28, 29, 30, 38, 33, 31],
      // c: [60, 49, 34, 46, 19, 35, 41],
      // x: ['10:10:02', '10:15:10', '10:25:20', '10:30:30', '10:35:40']
      a: [],
      b: [],
      c: [],
      x: []
    }

    /***
     * 图标一设置参数
     */
    const myChart1OptionReset = () => {
      const option1 = {
        tooltip: {
          trigger: 'axis'
        },
        grid: {
          top: '25%',
          left: '8%',
          right: '10%',
          bottom: '12%',
          containLabel: true
        },
        xAxis: {
          name: '时间（h）',
          nameLocation: 'center',
          nameGap: 30,
          nameTextStyle: {
            padding: [0, 0, 0, 170]
          },
          type: 'category',
          boundaryGap: false,
          data: data1.x
        },
        yAxis: {
          name: '剩余电流（mA）',
          nameTextStyle: {
            padding: [0, 0, 0, 38]
          },
          min: 0,
          max: 80,
          interval: 20,
          type: 'value',
          boundaryGap: false
        },
        series: [
          {
            type: 'line',
            stack: '总量',
            data: data1.d,
            smooth: true,
            markLine: {
              data: [
                {
                  yAxis: state.realTimeData.leftEReference.replace(/[^0-9.]/ig, '')
                }
              ]
            }
          }
        ]
      }
      console.log(option1)
      myChart1.clear()
      myChart1.setOption(option1)
    }

    /***
     * 图表二设置参数
     */
    const myChart2OptionReset = () => {
      const option2 = {
        // title: {
        //   text: '折线图堆叠'
        // },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          top: '3%',
          left: '0%',
          icon: 'circle',
          itemWidth: 16,
          itemHeight: 8,
          textStyle: {
            color: '#fff',
            fontSize: 11
          },
          data: [{
            name: 'A相对温度',
            icon: 'image:///icons/icon-legend-blue.png'
          }, {
            name: 'B相对温度',
            icon: 'image:///icons/icon-legend-yellow.png'
          }, {
            name: 'C相对温度',
            icon: 'image:///icons/icon-legend-green.png'
          }
          ]
        },
        grid: {
          top: '25%',
          left: '8%',
          right: '10%',
          bottom: '12%',
          containLabel: true
        },
        xAxis: {
          name: '时间（h）',
          nameLocation: 'center',
          nameGap: 30,
          nameTextStyle: {
            padding: [0, 0, 0, 170]
          },
          type: 'category',
          boundaryGap: false,
          data: data2.x
        },
        yAxis: {
          name: '线缆温度（℃）',
          nameTextStyle: {
            padding: [0, 0, 0, 38]
          },
          min: 0,
          max: 60,
          interval: 15,
          type: 'value'
        },
        series: [
          {
            name: 'A相对温度',
            type: 'line',
            stack: '总量',
            data: data2.a,
            smooth: true,
            markLine: {
              data: [
                {
                  yAxis: state.realTimeData.tempAReference.replace(/[^0-9.]/ig, '')
                }
              ]
            }
          },
          {
            name: 'B相对温度',
            type: 'line',
            stack: '总量',
            data: data2.b,
            smooth: true,
            markLine: {
              data: [
                {
                  yAxis: state.realTimeData.tempBReference.replace(/[^0-9.]/ig, '')
                }
              ]
            }
          },
          {
            name: 'C相对温度',
            type: 'line',
            stack: '总量',
            data: data2.c,
            smooth: true,
            markLine: {
              data: [
                {
                  yAxis: state.realTimeData.tempCReference.replace(/[^0-9.]/ig, '')
                }
              ]
            }
          }
        ]
      }
      myChart2.clear()
      myChart2.setOption(option2)
    }
    const getRealTimeData = () => {
      store.dispatch('device/getDeviceDetailRealTimeData', {
        deviceId: props.deviceId
      }).then((res) => {
        if (res && res.success) {
          console.log(res.result)
          state.realTimeData = res.result
          if (realTimeDataLoading) {
            realTimeDataLoading = false
          }
        }
      })
    }

    const get24HourData = () => {
      store.dispatch('device/getDeviceDetail24HourData', {
        deviceId: props.deviceId
      }).then((res) => {
        if (res && res.success) {
          for (const item of res.result.leftEList) {
            data1.x.push(item.index)
            data1.d.push(item.value)
          }
          myChart1OptionReset()

          for (const item of res.result.tempAList) {
            data2.x.push(item.index)
            data2.a.push(item.value)
          }
          for (const item of res.result.tempBList) {
            data2.b.push(item.value)
          }
          for (const item of res.result.tempCList) {
            data2.c.push(item.value)
          }
          myChart2OptionReset()
          if (get24HourDataLoading) {
            get24HourDataLoading = false
          }
        }
      })
    }

    return {
      props,
      state,
      deviceDetails7dayBox,
      baseInfo,
      alarms
    }
  }
}
</script>

<style scoped>
.device-details-div {
  background: #292C60;
  min-width: 960px;
}

.device-details-div .gh-modal-dialog-body .device-details-title {
  border-bottom: 1px solid;
  border-color: rgba(255, 255, 255, 0.1);
  line-height: 0.4rem;
  font-weight: bold;
  position: relative;
}

.margin-left-right-parent > div {
  margin-left: 0.19rem;
  margin-right: 0.19rem;
}

.device-details-info-box {
  padding-top: 10px;
  padding-bottom: 10px;
}

.device-details-info-box > div {
  font-size: 0.12rem;
  line-height: 0.24rem;
  float: left;
}

.device-details-info-box > div.item-w1 {
  min-width: 23%;
}

.device-details-info-box > div.item-w2 {
  min-width: 53%;
}

.device-details-info-box > div.item-w3 {
  min-width: 17%;
}

.device-details-info-box > div.item-w4 {
  min-width: 28%;
}

.device-details-info-box > div.item-w5 {
  min-width: 38%;
}

.device-details-title span {
  float: right;
  font-size: 0.12rem;
  font-weight: normal;
  opacity: 0.6;
}

.device-details-charts {
  padding: 0 0.16rem 0.16rem 0.16rem;
}

.device-details-charts > div {
  float: left;
  background: rgba(15, 17, 54, 0.2);

}

.device-details-charts-left {
  width: 61%;
  padding: 0 0.16rem;
}

.device-details-charts-right {
  width: calc(39% - 0.16rem);
  margin-left: 0.16rem;
  padding: 0 0.16rem;
}

:deep() .left-charts {
  margin-top: 0.05rem;
  width: 50%;
  height: 2.58rem;
  float: left;
}

.left-charts-box {
  height: 2.63rem;
  width: 100%;
}

.device-details-charts-title {
  border-bottom: 1px solid;
  border-color: rgba(255, 255, 255, 0.1);
  height: 0.5rem;
  line-height: 0.5rem;
  width: 100%;
}

/*.device-details-charts .chart-panel{*/
/*  background-color: red;*/
/*}*/
.device-details-7day-box {
  height: 2.63rem;
  overflow: hidden;
  overflow-y: auto;
}

.device-details-7day-box::-webkit-scrollbar {
  width: 6px; /*高宽分别对应横竖滚动条的尺寸*/
  height: 1px;
}

.device-details-7day-box::-webkit-scrollbar-thumb {
  border-radius: 6px;
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: #404B9F;
}

.device-details-7day-box::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  border-radius: 5px;
  background: transparent;
}

.device-details-7day-box > div {
  line-height: 0.3rem;
  font-size: 0.12rem;
}

.device-details-7day-box > div > span {
  float: right;
}

:deep() .ant-spin {
  max-height: none !important;
}
</style>
