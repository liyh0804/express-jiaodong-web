<template>
<div class="equipment-online-monitor-wrap">
  <div class="header">
    设备在线监测
  </div>
  <a-spin :spinning="deviceStatistics.loading">
    <div class="content">
      <template v-for="item in deviceStatistics.list" :key="item.index">
        <div class="item">
          <a-progress
            type="circle"
            :width="state.width"
            :strokeWidth="8"
            :stroke-color="{
              '0%': item.startColor,
              '100%': item.endColor,
            }"
            :percent="item.rate"
          >
            <template #format="rate">
              <a-tooltip placement="left">
                <template #title>
                  <div>在线 {{item.online}}</div>
                  <div>离线 {{item.offline}}</div>
                </template>
                <div>
                  <div class="percent-txt">{{ rate }}%</div>
                  <div v-if="state.shown" class="lbl-txt">在线率</div>
                </div>
              </a-tooltip>
            </template>
          </a-progress>
          <div class="lbl one-row" :title="item.title">{{item.name}}</div>
        </div>
      </template>
    </div>
  </a-spin>
</div>
</template>

<script>
import { reactive, watch, onMounted, computed } from 'vue'
import { useStore } from 'vuex'

export default {
  props: {
    rem: {
      type: Number,
      default: function () {
        return 100
      }
    },
    time: {
      type: Number,
      default: new Date().getTime()
    }
  },
  setup(props, context) {
    const state = reactive({
      width: 76,
      shown: window.innerWidth >= 1280
    })
    const store = useStore()

    watch(
      () => props.rem,
      () => {
        setSize()
      }
    )
    watch(
      () => props.time,
      () => {
        store.dispatch('monitor/getDeviceGroupStatus')
      }
    )
    const setSize = () => {
      const rem = props.rem === null ? 100 : props.rem
      state.width = 0.76 * rem
      state.shown = window.innerWidth >= 1280
    }

    onMounted(() => {
      setSize()
      store.dispatch('monitor/getDeviceGroupStatus')
    })

    return {
      state,
      deviceStatistics: computed(() => store.state.monitor.deviceGroupStatistics),
      getDeviceGroupStatus: () => store.dispatch('monitor/getDeviceGroupStatus')
    }
  }
}
</script>

<style lang="less" scoped>
.equipment-online-monitor-wrap {
  width: 4.52rem;
  height: 3.04rem;
  .header {
    width: 4.52rem;
    height: 0.4rem;
    margin-bottom: 0.06rem;
    font-size: 0.16rem;
    font-weight: 700;
    color: #fff;
    line-height: 0.4rem;
    padding-left: 0.16rem;
    background: url(../../assets/images/monitor/bg-title-4.png) no-repeat center;
    background-size: 4.52rem 0.4rem;
  }
  .content {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    width: 4.52rem;
    height: 2.58rem;
    padding: 0.16rem 0.32rem;
    background: url(../../assets/images/monitor/bg-content-right.png) no-repeat center;
    background-size: 4.52rem 2.58rem;
    .item {
      width: 1.12rem;
      height: 1.02rem;
      text-align: center;
      .ant-progress-circle .ant-progress-inner {
        width: 0.76rem;
        height: 0.76rem;
        font-size: 0.16rem;
        color: #fff;
      }
      .percent-txt {
        font-size: 0.16rem;
        line-height: 0.21rem;
        color: #fff;
        font-weight: 700;
      }
      .lbl-txt {
        font-size: 0.12rem;
        line-height: 0.16rem;
        color: #fff;
      }
      .lbl {
        font-size: 0.14rem;
        line-height: 0.22rem;
        color: #fff;
        text-align: center;
        margin-top: 2px;
      }
    }
    .item:nth-child(n+4) {
      margin-top: 0.16rem;
    }
  }
}
</style>
