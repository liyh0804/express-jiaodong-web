<template>
  <div class="sta-wrapper">
    <a-spin :spinning="todayFireStatistics.loading">
      <dl class="fire-wrap grp">
        <dt>
          <router-link class="gotolink" to="/issue_manage/fire">
            <img src="../../assets/images/monitor/icon-fire.png" alt="fire">
            <h2 class="fire">今日火警</h2>
          </router-link>
        </dt>
        <div class="detail">
          <div class="clearfix sp">
            <dd class="f1">
              <h5>待处理&nbsp;&nbsp;</h5>
              <div class="quantity">{{todayFireStatistics.fireAlarmWaitToProcess}}</div>
            </dd>
            <dd>
              <h5>真警</h5>
              <div class="quantity">{{todayFireStatistics.realFireAlarm}}</div>
            </dd>
            <dd class="rg">
              <h5>处理超时</h5>
              <div class="quantity">{{todayFireStatistics.fireAlarmProcessDelay}}</div>
            </dd>
          </div>
          <div class="clearfix">
            <dd class="f1">
              <h5>待处理单位</h5>
              <div class="quantity">{{todayFireStatistics.fireAlarmDepartment}}</div>
            </dd>
            <dd>
              <h5>处理完成</h5>
              <div class="quantity">{{todayFireStatistics.fireAlarmProcessDone}}</div>
            </dd>
          </div>
        </div>
      </dl>
    </a-spin>
    <a-spin :spinning="todayFaultStatistics.loading">
      <dl class="gz-wrap grp">
        <dt>
          <router-link class="gotolink g2" to="/issue_manage/breakdown">
            <img src="../../assets/images/monitor/icon-gz.png" alt="gz">
            <h2 class="gz-txt">今日故障</h2>
          </router-link>
        </dt>
        <div class="detail gz">
          <div class="clearfix sp">
            <dd>
              <h5>待处理</h5>
              <div class="quantity">{{todayFaultStatistics.faultWaitToProcess}}</div>
            </dd>
            <dd class="rg">
              <h5>处理完成</h5>
              <div class="quantity">{{todayFaultStatistics.faultProcessDelay}}</div>
            </dd>
          </div>
          <div class="clearfix">
            <dd>
              <h5>处理超时</h5>
              <div class="quantity">{{todayFaultStatistics.faultProcessDone}}</div>
            </dd>
          </div>
        </div>
      </dl>
    </a-spin>
    <a-spin :spinning="todayThreatStatistics.loading">
      <dl class="gz-wrap grp">
        <dt>
          <router-link class="gotolink g3" to="/issue_manage/hidden_trouble">
            <img src="../../assets/images/monitor/icon-yh.png" alt="yh">
            <h2 class="yh-txt">今日隐患</h2>
          </router-link>
        </dt>
        <div class="detail yh">
          <div class="clearfix sp">
            <dd>
              <h5>待处理</h5>
              <div class="quantity">{{todayThreatStatistics.threatWaitToProcess}}</div>
            </dd>
            <dd class="rg">
              <h5>处理完成</h5>
              <div class="quantity">{{todayThreatStatistics.threatProcessDelay}}</div>
            </dd>
          </div>
          <div class="clearfix">
            <dd>
              <h5>处理超时</h5>
              <div class="quantity">{{todayThreatStatistics.threatProcessDone}}</div>
            </dd>
          </div>
        </div>
      </dl>
    </a-spin>
  </div>
</template>

<script>
import { onMounted, computed, watch } from 'vue'
import { useStore } from 'vuex'

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
      store.dispatch('monitor/getTodayPrecessInfo')
      store.dispatch('monitor/getTodayFaultPrecessInfo')
      store.dispatch('monitor/getTodayThreatPrecessInfo')
    })
    watch(
      () => props.time,
      () => {
        store.dispatch('monitor/getTodayPrecessInfo')
        store.dispatch('monitor/getTodayFaultPrecessInfo')
        store.dispatch('monitor/getTodayThreatPrecessInfo')
      }
    )

    return {
      todayFireStatistics: computed(() => store.state.monitor.todayFireStatistics),
      todayFaultStatistics: computed(() => store.state.monitor.todayFaultStatistics),
      todayThreatStatistics: computed(() => store.state.monitor.todayThreatStatistics),
      getDeviceGroupStatus: () => store.dispatch('monitor/getTodayPrecessInfo'),
      getTodayFaultPrecessInfo: () => store.dispatch('monitor/getTodayFaultPrecessInfo'),
      getTodayThreatPrecessInfo: () => store.dispatch('monitor/getTodayThreatPrecessInfo')
    }
  }
}
</script>

<style lang="less" scoped>
.sta-wrapper {
  dl, dd, dt, h2, h5 {
    margin: 0;
    padding: 0;
    border: 0;
  }
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  .grp {
    height: 100%;
    overflow: hidden;
    background: red;
    dt {
      display: inline-block;
      margin-right: 0.24rem;
      vertical-align: middle;
    }
  }
  .fire-wrap {
    width: 3.73rem;
    height: 1.44rem;
    background: url(../../assets/images/monitor/bg-sts.png) no-repeat center;
    background-size: 3.73rem 1.44rem;
    padding: 0.2rem 0.24rem;
  }
  .gz-wrap {
    width: 2.96rem;
    height: 1.44rem;
    background: url(../../assets/images/monitor/bg-sts-2.png) no-repeat center;
    background-size: 2.96rem 1.44rem;
    padding: 0.2rem 0.24rem;
  }
  .gotolink {
    display: block;
    width: 0.64rem;
    height: 0.72rem;
    text-align: center;
    margin-top: 0.08rem;
    img {
      width: 0.48rem;
      height: 0.48rem;
    }
    h2 {
      font-size: 0.16rem;
      color: #fff;
      font-weight: bold;
      word-break: keep-all;
      &.fire {
        color: #FDD665;
      }
      &.gz-txt {
        color: #71E8FF;
      }
      &.yh-txt {
        color: #58EDB6;
      }
    }
  }
  .detail {
    display: inline-block;
    vertical-align: middle;
    color: #fff;
    width: calc(100% - 0.88rem);
    height: 100%;
    dd {
      float: left;
      h5 {
        color: #FDD665;
        font-size: 0.14rem;
        line-height: 0.22rem;
        word-break: keep-all;
      }
      .quantity {
        font-size: 0.16rem;
        line-height: 0.24rem;
        color: #fff;
        font-weight: 700;
      }
      &.f1 {
        margin-right: 0.28rem;
      }
      &.rg {
        float: right;
      }
    }
    .sp {
      margin-bottom: 0.12rem;
    }
    &.gz dd h5 {
      color: #71E8FF;
    }
    &.yh dd h5 {
      color: #58EDB6;
    }
  }
}
</style>
