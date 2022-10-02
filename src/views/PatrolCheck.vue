<template>
<div class="patrol clearfix">
  <div class="patrol-left">
    <div class="date-wrap">
      <ConfigProvider :locale="locale">
      <a-calendar v-model:value="value" @change="onPanelChange">
        <template #headerRender="{ value, onChange }">
        <div class="calendar-hd">
          <div class="checktoday blue text-center cp" @click="gettoday(value,onChange)">今日</div>
          <div class="calendar-hd-title">巡检日历</div>
          <div class="calendar-hd-controls">
            <a-row type="flex" justify="space-between">
              <a-col>
                <img src="../assets/images/patrol/arrow-lleft.png" alt="lleft" @click="yearj(value,onChange)">
                <img src="../assets/images/patrol/arrow-left.png" alt="lleft" @click="monthj(value,onChange)">
              </a-col>
              <a-col>
                <div class="dm-txt">
                  {{year}}年{{month}}月
                </div>
              </a-col>
              <a-col>
                <img src="../assets/images/patrol/arrow-right.png" alt="lleft" @click="montha(value,onChange)">
                <img src="../assets/images/patrol/arrow-rright.png" alt="lleft" @click="yeara(value,onChange)">
              </a-col>
            </a-row>
          </div>
        </div>
      </template>
        <template #dateCellRender="{ current: value }">
          <ul class="events">
            <li class="green" v-if="getListData(value).Text=='正常'">
              <img src="@/assets/images/zhengchang.png">
            </li>
            <li class="blue" v-if="getListData(value).Text=='未巡检'">
              <img src="@/assets/images/noxunjian.png">
            </li>
            <li class="red" v-if="getListData(value).Text=='异常'">
              <img src="@/assets/images/yichang.png">
            </li>
          </ul>
        </template>
      </a-calendar>
      </ConfigProvider>
    </div>
  </div>
  <div class="patrol-right">
    <div class="list-wrap">
      <div class="export">{{year}}年{{month}}月{{date}}号巡检记录 <a-button @click="downs()">导出</a-button></div>
      <a-table :columns="columns" :data-source="patrolCheckList" :pagination="false">
        <template #result="{ record }">
           {{record.checkResult == 1 ? '正常' : '异常'}}
        </template>
      </a-table>
    </div>
  </div>
</div>

</template>

<script>
import { ConfigProvider } from 'ant-design-vue'
import locale from 'ant-design-vue/lib/locale-provider/zh_CN'
import moment from 'moment'
import 'moment/locale/zh-cn'
// import moment from 'moment'
import { defineComponent, ref, reactive, toRefs, onMounted, computed } from 'vue'
import { useStore } from 'vuex'
import { downOpen } from '@/api/patrol'
moment.locale('zh-cn')

const columns = [
  {
    dataIndex: 'id',
    key: 'id',
    title: '序号',
    width: 40
  },
  {
    dataIndex: 'checkItem',
    key: 'checkItem',
    title: '巡检项目',
    width: 140
  },
  {
    title: '巡检部位',
    dataIndex: 'devName',
    key: 'devName',
    width: 140
  },
  {
    title: '位置',
    dataIndex: 'areaName',
    key: 'areaName',
    width: 168
  },
  {
    title: '巡检时间',
    key: 'checkTime',
    dataIndex: 'checkTime',
    width: 140
  },
  {
    title: '巡检人',
    key: 'userName',
    dataIndex: 'userName',
    width: 140
  },
  {
    title: '巡检结果',
    key: 'result',
    dataIndex: 'result',
    slots: {
      customRender: 'result'
    },
    width: 60
  }
]

const data = []
const year = (new Date()).getFullYear()
const month = (new Date()).getMonth() + 1
const date = (new Date()).getDate()
export default defineComponent({
  components: {
    ConfigProvider
  },
  setup() {
    const value = ref()
    const state = reactive({
      locale: locale,
      nowday: {},
      data,
      year,
      month,
      date,
      monstatus: [],
      columns
    })
    const store = useStore()
    const getListData = value => {
      let listData = {
        Text: '未巡检'
      }
      const year = value.year()
      const month = (value.month()) + 1 < 10 ? ('0' + (value.month() + 1)) : (value.month() + 1)
      const date = value.date() < 10 ? ('0' + value.date()) : value.date()
      const thisTime = year + '-' + month + '-' + date

      if (state.monstatus[thisTime] === 0) {
        listData = {
          Text: '异常'
        }
      }
      if (state.monstatus[thisTime] === 1) {
        listData = {
          Text: '正常'
        }
      }
      if (value.month() + 1 !== state.month) {
        listData = {
          Text: '别的月'
        }
      }

      return listData || {}
    }
    const getMonthListFun = () => {
      const month = state.month < 10 ? ('0' + state.month) : (state.month)
      const params = {
        selMonth: state.year + '-' + month
      }
      store.dispatch('patrol/getPatrolCheckSummaryByMonth', { payload: { ...params } }).then(res => {
        if (res.code === 200) {
          state.monstatus = res.result || []
        }
      })
    }
    const getMonthDateListFun = () => {
      const month = state.month < 10 ? ('0' + state.month) : (state.month)
      const date = state.date < 10 ? ('0' + state.date) : (state.date)
      const params = {
        selDay: state.year + '-' + month + '-' + date
      }
      state.nowday = state.year + '-' + month + '-' + date
      store.dispatch('patrol/getPatrolCheckListByDate', { payload: { ...params } })
    }
    const yearj = (value, onChange) => {
      state.year = value.year() - 1
      onChange(state.year + '-' + state.month + '-' + value.date())
      getMonthListFun()
    }
    const monthj = (value, onChange) => {
      state.month--
      if (state.month === 0) {
        state.month = 12
        state.year--
      }
      onChange(state.year + '-' + state.month + '-' + value.date())
      getMonthListFun()
    }
    const yeara = (value, onChange) => {
      state.year = value.year() + 1
      onChange(state.year + '-' + state.month + '-' + value.date())
      getMonthListFun()
    }
    const montha = (value, onChange) => {
      state.month++
      if (state.month === 13) {
        state.month = 1
        state.year++
      }
      onChange(state.year + '-' + state.month + '-' + value.date())
      getMonthListFun()
    }
    const onPanelChange = (value, mode) => {
      if (typeof value === 'string') {
      } else {
        state.year = value.year()
        state.month = value.month() + 1
        state.date = value.date()
      }

      getMonthDateListFun()
    }
    const gettoday = (value, onChange) => {
      // 切换今日
      state.year = year
      state.month = month
      state.date = date
      onChange(year + '-' + month + '-' + date)
      getMonthListFun()
      getMonthDateListFun()
    }
    const downs = () => {
      const params = {
        selDay: state.nowday
      }
      downOpen(params).then(e => {
        if (typeof window.navigator.msSaveBlob !== 'undefined') {
          window.navigator.msSaveBlob(new Blob([e.data], { type: 'application/vnd.ms-excel' }), state.nowday + '日巡检记录' + '.xls')
        } else {
          const url = window.URL.createObjectURL(new Blob([e.data], { type: 'application/vnd.ms-excel' }))
          const link = document.createElement('a')
          link.style.display = 'none'
          link.href = url
          link.setAttribute('download', state.nowday + '日巡检记录' + '.xls')
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link) // 下载完成移除元素
          window.URL.revokeObjectURL(url) // 释放掉blob对象
        }
      })
    }
    onMounted(() => {
      getMonthListFun()
      getMonthDateListFun()
    })
    return {
      ...toRefs(state),
      downs,
      getMonthListFun,
      getMonthDateListFun,
      gettoday,
      onPanelChange,
      getListData,
      value,
      yearj,
      monthj,
      yeara,
      montha,
      patrolCheckList: computed(() => store.state.patrol.patrolCheckList)
      // monstatus: computed(() => store.state.patrol.patrolMonthCheck)
    }
  }
})

</script>

<style lang="less" scoped>
.patrol {
  height: 100%;
  padding: 0.16rem 0.24rem 0;
  &-left {
    float: left;
    width: 5.12rem;
    height: 100%;
    .date-wrap {
      width: 5.12rem;
      height: 5.76rem;
      background: url(../assets/images/patrol/datepicker.png) no-repeat center;
      background-size: 5.12rem 5.76rem;
      position: relative;
      .cp{
        cursor: pointer;
      }
      .cp:hover{
        text-decoration: underline;
      }
      .text-center{
        text-align: center;
      }
      .checktoday{
        position: absolute;
        top: 5.3rem;
        left:calc(50% - 0.5rem);
        width: 1rem;
      }
      /deep/ .ant-fullcalendar-column-header-inner{
        font-size: 0.16rem;
      }
      /deep/ .ant-fullcalendar-value{
        height: 0.16rem;
      }
      /deep/ .ant-fullcalendar-content {
        overflow: hidden;
        ul li{
          font-size: 0.02rem;
          img{
            height: 0.2rem;
          }
        }

      }
      .calendar-hd {
        &-title {
          font-size: 0.16rem;
          color: #fff;
          font-weight: 700;
          padding: 0.11rem 0 0.24rem 0.14rem;
        }
        &-controls {
          padding: 0.02rem 0.32rem;
          img:nth-child(n+2) {
            width: 16px;
            height: 16px;
            margin-left: 0.24rem;
          }
          .dm-txt {
            font-size: 0.16rem;
            line-height: 0.21rem;
            color: #fff;
          }
        }
      }
    }
  }
  &-right {
    float: right;
    width: 13.28rem;
    height: 100%;
    .list-wrap {
      width: 13.28rem;
      height: 9.44rem;
      padding: 0 0.16rem;
      background: url(../assets/images/patrol/bg-list.png) no-repeat center;
      background-size: 13.28rem 9.44rem;
      .export {
        padding: 0.16rem 00rem 0rem ;
        font-size: 0.16rem;
        line-height: 0.32rem;
        color: #fff;
        font-weight: 700;
        overflow: hidden;
        button {
          float: right;
          width: 0.8rem;
          height: 0.32rem;
          background-color: rgba(102, 119, 240, 0.6);
          text-align: center;
          border: 0;
          font-size: 0.14rem !important;
          color: #fff;
          line-height: 0.32rem;
        }
      }
      /deep/ .ant-table {
        background: transparent;
      }
      /deep/ .ant-table-thead > tr > th {
        background: rgba(102, 119, 240, 0.6);
        height: 0.4rem;
        padding: 0.09rem 0.24rem 0.09rem 0.16rem;
        font-size: 0.14rem;
        line-height: 0.22rem;
        color: #fff;
        font-weight: 700;
        border: 0;
      }
      /deep/ .ant-table-thead > tr > th:first-child {
        padding: 0.09rem 0.16rem 0.09rem 0.24rem;
        border-radius: 2px 0 0 2px;
      }
      /deep/ .ant-table-thead > tr > th:last-child {
        border-radius: 0 2px 2px 0;
      }
      /deep/ tr > td {
        font-size: 0.14rem;
        line-height: 0.22rem;
        color: #D6D5DD !important;
      }
      /deep/ .ant-table-tbody > tr > td {
        background: transparent;
      }
      /deep/ .ant-table-tbody > tr:nth-child(even) {
        background: rgba(102, 119, 240, 0.1);
      }

    }
  }
}
/deep/ .ant-radio-group.ant-radio-group-outline.ant-radio-group-default{
  display: none !important;
}
/deep/ .ant-fullcalendar-last-month-cell{
  .ant-fullcalendar-date{
    .ant-fullcalendar-value{
      color:rgba(255, 255, 255, 0.5) !important;
    }
  }
}
/deep/ .ant-fullcalendar-next-month-btn-day{
  .ant-fullcalendar-date{
    .ant-fullcalendar-value{
      color:rgba(255, 255, 255, 0.5) !important;
    }
  }
}
.green{
  color: #58EDB6;
}
.blue{
  color: rgba(102, 119, 240, 0.6);
}
.red{
  color: #FD8165;
}
</style>
