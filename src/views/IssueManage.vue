<template>
  <div class="search-wrap">
    <a-form
      name="search-form"
      ref="formRef"
      :model='formState'
      class="form-wrap"
      id="searchForm"
      @finish="handleFinish"
    >
      <div class="form-wwp">
        <a-form-item name="type">
          <a-input type="hidden" :value="formState.type" />
        </a-form-item>
        <a-form-item label='时间范围' name="timeRange">
          <a-range-picker
            class="range-picker"
            v-model:value='formState.timeRange'
            format="YYYY-MM-DD"
            :placeholder="['开始时间', '结束时间']"
          />
        </a-form-item>
        <a-form-item label='设备名称' name="deviceName">
          <a-input placeholder="请输入设备名称" class="devicename inpt" v-model:value="formState.deviceName"></a-input>
        </a-form-item>
        <a-form-item label='单位名称' name="departName">
          <a-input placeholder="请输入单位名称" class="departname inpt" v-model:value="formState.departName"></a-input>
        </a-form-item>
        <a-form-item :label="type_cn + '来源'" name="origin">
          <a-select
            v-model:value='formState.origin'
            placeholder='全部'
            class='source-select'
            :dropdownMatchSelectWidth='false'
            :showArray='true'
          >
            <a-select-option value="">全部</a-select-option>
            <a-select-option key="0" value="0">人工上报</a-select-option>
            <a-select-option key="1" value="1">物联网监测</a-select-option>
            <a-select-option key="2" value="2">智能视频终端</a-select-option>
            <a-select-option key="3" value="3">人工上报</a-select-option>
            <a-select-option key="4" value="4">物联网监测</a-select-option>
            <a-select-option key="5" value="5">智能视频终端</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label='核警状态' v-if="type_cn=='火警'" name="fireCheckStatus">
          <a-select
            v-model:value='formState.fireCheckStatus'
            placeholder='全部'
            class='common-select'
            :dropdownMatchSelectWidth='false'
            :showArray='true'
          >
            <a-select-option key="-1" value="">全部</a-select-option>
            <a-select-option key="0" value="0">待核警</a-select-option>
            <a-select-option key="1" value="1">真警</a-select-option>
            <a-select-option key="2" value="2">误报</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label='处置状态' name="processStatus">
          <a-select
            v-model:value='formState.processStatus'
            class='common-select'
            :dropdownMatchSelectWidth='false'
          >
            <a-select-option key="-1" value="">全部</a-select-option>
            <a-select-option key="0" value="0">待处理</a-select-option>
            <a-select-option key="1" value="1">已处理</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label='逾期状态' name="overTimeStatus">
          <a-select
            v-model:value='formState.overTimeStatus'
            placeholder='全部'
            class='common-select'
            :dropdownMatchSelectWidth='false'
          >
            <a-select-option key="-1" value="">全部</a-select-option>
            <a-select-option key="0" value="0">未逾期</a-select-option>
            <a-select-option key="1" value="1">已逾期</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-button
            type='primary'
            html-type='submit'
            class='btn search-btn'
          >
            查询
          </a-button>
          <a-button class='btn reset-btn' @click="handleReset">
            重置
          </a-button>
        </a-form-item>
      </div>
      <div class="export-wrap">
        <a-button class='btn' @click="exportSecurityAlarmList">
          导出
        </a-button>
      </div>
    </a-form>
  </div>
  <div class="table-warp">
    <a-table :dataSource='issues.list' :columns='columns' :bordered="false"
             :pagination="false" :locale="zhCN">
      <template #address="{ record }">
        <div class="address-wrap one-row" :title="record.address">
          {{ record.address }}
        </div>
      </template>
      <template #action="{ record }">
        <span>
          <a @click="showDeviceDetails(record.deviceId)">
            <img src="../assets/images/issue_manager/详情.png">详情
          </a>

          <a @click="dosoneting(record)">
            <img src="../assets/images/issue_manager/处理.png">处理
          </a>

          <a @click="showBimInfo(record.areaId)">
            <img src="../assets/images/issue_manager/定位.png">定位
          </a>
        </span>
      </template>
    </a-table>
    <div>
      <a-pagination :total="issues.total" :pageSize="issues.pageSize" :showSizeChanger="false" :hideOnSinglePage="true"
                    @change="handlePageChange" :show-quick-jumper="pagination.showQuickJumper" :showTotal="showTotal"></a-pagination>
    </div>
  </div>
  <a-modal
    v-model:visible="visible"
    :title="title"
    :footer="null"
    @cancel="closedialog"
  >
    <handleModelStep
      @closeBig="closeBig"
      @getList="getList"
      v-if="visibledo == true"
      :title="title"
      :type="state.type"
      :flowStatus="state.flowStatus"
      :faultId="state.faultId"
    />
  </a-modal>

  <a-modal dialogClass="gh-modal-dialog"
           wrapClassName="gh-modal-dialog-wrap"
           @destroyOnClose="true"
           :title="null"
           width="960px"
           :visible="state.deviceInfoVisable"
           @cancel="state.deviceInfoVisable = false"
           :destroyOnClose="true"
           :footer="null"
           :maskClosable="false"
           :keyboard="false"
  >
    <DeviceDetails :deviceId="state.deviceId"/>
  </a-modal>

  <a-modal dialogClass="gh-modal-dialog"
           wrapClassName="gh-modal-dialog-wrap"
           @destroyOnClose="true"
           width="960px"
           :visible="state.bimInfoVisable"
           @cancel="closeBimInfo"
           :destroyOnClose="true"
           :footer="null"
           :maskClosable="false"
           :keyboard="false"
  >
    <BimExhibition :width="960" :height="670" :floorArea="state.floorArea"></BimExhibition>
  </a-modal>
</template>
<script>
import { reactive, onMounted, computed, ref } from 'vue'
import { useStore } from 'vuex'
import moment from 'moment'
import DeviceDetails from '@/components/device/DeviceDetails.vue'
import BimExhibition from '@/components/bim/BimExhibition'
import handleModelStep from '@/components/handle/handleModelStep.vue'
// 以故障页的列作为基模板，其他页在基模板上增删
const columnsA = [
  {
    title: '系统接收时间',
    dataIndex: 'createTime',
    key: 'createTime'
  },
  {
    title: '火警编号',
    dataIndex: 'code',
    key: 'code'
  },
  {
    title: '设备名称',
    dataIndex: 'deviceName',
    key: 'deviceName'
  },
  {
    title: '设备ID',
    dataIndex: 'deviceId',
    key: 'deviceId'
  },
  {
    title: '设备地址',
    dataIndex: 'address',
    key: 'address',
    slots: {
      customRender: 'address'
    }
  },
  {
    title: '单位名称',
    dataIndex: 'departName',
    key: 'departName'
  },
  {
    title: '火警来源',
    dataIndex: 'originStr',
    key: 'originStr'
  },
  {
    title: '火警描述',
    dataIndex: 'descr',
    key: 'descr'
  },
  {
    title: '核警状态',
    dataIndex: 'checkStatusStr',
    key: 'checkStatusStr'
  },
  {
    title: '处置状态',
    dataIndex: 'flowStatusStr',
    key: 'flowStatusStr'
  },
  {
    title: '逾期状态',
    dataIndex: 'overTimeStatusStr',
    key: 'overTimeStatusStr'
  },
  {
    title: '操作',
    dataIndex: 'operation',
    key: 'operation',
    slots: { customRender: 'action' }
  }
]

const columnsB = [
  {
    title: '系统接收时间',
    dataIndex: 'createTime',
    key: 'createTime'
  },
  {
    title: '故障编号',
    dataIndex: 'code',
    key: 'code'
  },
  {
    title: '设备名称',
    dataIndex: 'deviceName',
    key: 'deviceName'
  },
  {
    title: '设备ID',
    dataIndex: 'deviceId',
    key: 'deviceId'
  },
  {
    title: '设备地址',
    dataIndex: 'address',
    key: 'address'
  },
  {
    title: '单位名称',
    dataIndex: 'departName',
    key: 'departName'
  },
  {
    title: '故障来源',
    dataIndex: 'originStr',
    key: 'originStr'
  },
  {
    title: '故障描述',
    dataIndex: 'descr',
    key: 'descr'
  },
  {
    title: '处置状态',
    dataIndex: 'flowStatusStr',
    key: 'flowStatusStr'
  },
  {
    title: '逾期状态',
    dataIndex: 'overTimeStatusStr',
    key: 'overTimeStatusStr'
  },
  {
    title: '操作',
    dataIndex: 'operation',
    key: 'operation',
    slots: { customRender: 'action' }
  }
]

const columnsC = [
  {
    title: '系统接收时间',
    dataIndex: 'createTime',
    key: 'createTime'
  },
  {
    title: '隐患编号',
    dataIndex: 'code',
    key: 'code'
  },
  {
    title: '设备名称',
    dataIndex: 'deviceName',
    key: 'deviceName'
  },
  {
    title: '设备ID',
    dataIndex: 'deviceId',
    key: 'deviceId'
  },
  {
    title: '设备地址',
    dataIndex: 'address',
    key: 'address'
  },
  {
    title: '单位名称',
    dataIndex: 'departName',
    key: 'departName'
  },
  {
    title: '隐患来源',
    dataIndex: 'originStr',
    key: 'originStr'
  },
  {
    title: '隐患描述',
    dataIndex: 'descr',
    key: 'descr'
  },
  {
    title: '处置状态',
    dataIndex: 'flowStatusStr',
    key: 'flowStatusStr'
  },
  {
    title: '逾期状态',
    dataIndex: 'overTimeStatusStr',
    key: 'overTimeStatusStr'
  },
  {
    title: '操作',
    dataIndex: 'operation',
    key: 'operation',
    slots: { customRender: 'action' }
  }
]

const PAGE_SIZE = 17

export default {
  props: ['type'],
  components: {
    DeviceDetails,
    BimExhibition,
    handleModelStep
  },
  setup(props, context) {
    const formRef = ref()
    const visible = ref(false)
    const visibledo = ref(false)
    const title = ref('')
    const state = reactive({
      deviceInfoVisable: false,
      bimInfoVisable: false,
      floorArea: null,
      flowStatus: 0,
      faultId: null
    })
    const formState = reactive({
      timeRange: ref(),
      deviceId: '',
      deviceName: '',
      departName: '',
      origin: '',
      fireCheckStatus: '',
      overTimeStatus: '',
      processStatus: '',
      type: props.type === 'fire' ? 1 : props.type === 'breakdown' ? 2 : 3
    })

    let columns = null
    if (props.type === 'fire') {
      columns = columnsA
    } else if (props.type === 'breakdown') {
      columns = columnsB
    } else {
      columns = columnsC
    }

    const store = useStore()
    const issues = computed(() => store.state.issue.issues)

    onMounted(() => {
      store.dispatch('issue/getIssueList', {
        type: formState.type,
        pageNo: 1,
        pageSize: PAGE_SIZE
      })
    })

    const showDeviceDetails = (id) => {
      state.deviceId = id
      state.deviceInfoVisable = true
    }

    const showBimInfo = (areaId) => {
      /***
       * todo  通过areaid 找出对应的bim 再在bim内找到对应的楼层
       * @type {boolean}
       */

      store.dispatch('bim/queryAreaById', { id: areaId }).then((res) => {
        if (res && res.success) {
          state.bimInfoVisable = true
          state.floorArea = res.result
        }
      })
    }
    const closeBimInfo = () => {
      state.bimInfoVisable = false
      state.floorArea = null
    }

    const handleFinish = (values) => {
      let timeBegin = ''
      let timeEnd = ''
      if (values.timeRange && values.timeRange.length) {
        timeBegin = values.timeRange[0].format('YYYY-MM-DD')
        timeEnd = values.timeRange[1].format('YYYY-MM-DD')
      }
      const params = {
        timeBegin,
        timeEnd,
        ...values,
        pageNo: 1,
        pageSize: PAGE_SIZE
      }
      store.dispatch('issue/getIssueList', params)
    }

    const handlePageChange = (page, pageSize) => {
      let timeBegin = ''
      let timeEnd = ''
      if (formState.timeRange && formState.timeRange.length) {
        timeBegin = formState.timeRange[0].format('YYYY-MM-DD')
        timeEnd = formState.timeRange[1].format('YYYY-MM-DD')
      }
      const params = {
        timeBegin,
        timeEnd,
        ...formState,
        pageNo: page,
        pageSize: pageSize || PAGE_SIZE
      }
      store.dispatch('issue/getIssueList', params)
    }

    const handleReset = () => {
      formRef.value.resetFields()
      store.dispatch('issue/getIssueList', {
        pageNo: 1,
        pageSize: PAGE_SIZE,
        type: formState.type
      })
    }
    const exportSecurityAlarmList = () => {
      const params = {
        ...formState
      }
      params.timeBegin = formState.timeRange && formState.timeRange[0].format('YYYY-MM-DD')
      params.timeEnd = formState.timeRange && formState.timeRange[1].format('YYYY-MM-DD')
      store.dispatch('issue/exportSecurityAlarmList', params)
    }
    const closeBig = () => {
      visible.value = false
    }
    const closedialog = () => {
      visible.value = false
      visibledo.value = false
      console.log('close')
      // console.log(videoREf.value)
    }
    const dosoneting = (obj) => {
      // console.log('===================================')
      // console.log(obj)
      title.value = '火警管理-' + '处理'
      visible.value = true
      visibledo.value = true

      state.flowStatus = obj.flowStatus || 0
      console.log(state.flowStatus)
      state.faultId = obj.id
      const typeObj = {
        fire: 1,
        breakdown: 2,
        hidden_trouble: 3
      }
      console.log(props.type)
      state.type = typeObj[props.type] || 0
      console.log(state.type)
    }
    return {
      pagination: {
        total: issues.value.total,
        pageSize: PAGE_SIZE,
        showSizeChanger: false,

        showQuickJumper: {
          goButton: '页'
        },
        hideOnSinglePage: true,
        change: (page, pageSize) => handlePageChange(page, pageSize)
      },
      formRef,
      formState,
      state,
      visible,
      visibledo,
      title,
      type_cn: props.type === 'fire' ? '火警' : props.type === 'breakdown' ? '故障' : props.type === 'hidden_trouble' ? '隐患' : '',
      // issues: computed(() => store.state.issue.issues),
      issues,
      columns,
      ranges: {
        Today: [moment(), moment()],
        'This Month': [moment(), moment().endOf('month')]
      },
      closedialog,
      closeBig,
      dosoneting,
      getIssueList: (params) => store.dispatch('issue/getIssueList', params),
      exportSecurityAlarmList,
      showDeviceDetails,
      showBimInfo,
      handleFinish,
      handleReset,
      closeBimInfo,
      showTotal: (total, range) => `当前${range[0]}-${range[1]}条,总共 ${total} 条`,
      handlePageChange
    }
  }
}
</script>
<style lang="less" scoped>
// .search-wrap {
//   width: 18.56rem;
//   height: 0.64rem;
//   margin: 0 auto;
//   margin-top: 0.16rem;
  .ant-form {
    display: flex;
    flex: 1;
    height: 0.32rem;
    flex-direction: row;
  }

.ant-form {
  display: flex;
  width: 18.56rem;
  height: 0.64rem;
  padding: 0.16rem 0.24rem;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background: url(../assets/images/issue_manager/bg1.png) no-repeat;
  background-size: 18.56rem 0.64rem;

  .ant-form-item {
    margin-right: 0.24rem;
  }

  .ant-form-item:first-child {
    display: none;
  }

  /deep/ .ant-col.ant-form-item-label {
    height: 0.32rem;
    line-height: 0.32rem;

    label {
      font-size: 0.14rem;
      line-height: 0.3rem;
      color: #FFFFFF;
      background: #6677F0;
    }
    .form-wwp {
      display: flex;
      flex: 1;
      // height: 0.32rem;
      flex-direction: row;
      flex-wrap: nowrap;
      align-items: center;
      justify-content: flex-start;
      /deep/ .ant-form-item {
        margin: 0;
        margin-right: 0.24rem;
        display: flex;
        flex: 1;
        // height: 0.32rem;
        flex-direction: row;
        flex-wrap: nowrap;
        align-items: center;
        justify-content: flex-start;
      }
      .ant-form-item:first-child {
        display: none;
      }
      /deep/ .ant-col.ant-form-item-label
      {
        height: 0.32rem;
        line-height: 0.32rem;
        label {
          font-size: 0.14rem;
        }
      }
      /deep/ .ant-form-item-control {
        line-height: 0.32rem;
      }
      /deep/ .ant-select-single:not(.ant-select-customize-input) .ant-select-selector .ant-select-selection-search-input {
        height: 0.32rem;
        padding: 0 0.11rem;
      }
      /deep/ .ant-select-selector{
        padding: 0 0.11rem;
      }
      /deep/ .ant-select-single .ant-select-selector .ant-select-selection-item, .ant-select-single .ant-select-selector .ant-select-selection-placeholder {
        line-height: 0.32rem;
        color:#FFFFFF;
      }
      /deep/ .ant-select-selection-placeholder {
        line-height: 0.32rem;
        color:#FFFFFF;
      }

      .range-picker {
        width: 2.5rem;
        height: 0.32rem;
        font-size: 0.14rem;
        line-height: 0.24rem;
        /deep/ .ant-input {
          padding: 0.04rem 0.11rem;
        }
      }
      .device-select {
        width: 1rem;
        height: 0.32rem;
        font-size: 0.14rem;
      }
      .depart-select {
        width: 1rem;
        height: 0.32rem;
        font-size: 0.14rem;
      }
      .source-select {
        width: 1rem;
        height: 0.32rem;
        font-size: 0.14rem;
      }
      .common-select {
        width: 0.78rem;
        height: 0.32rem;
        font-size: 0.14rem;
      }
      .reset-btn {
        margin-left: 0.08rem;
        background: #252756;
      }
      /deep/ .ant-calendar-picker-input {
        background-color: rgba(171, 187, 255, 0.2);
        border-radius: 2px;
        font-size: 0.14rem;
      }
      /deep/ .ant-select-selector {
        background: rgba(171, 187, 255, 0.2);
        border: 0px;
        height: 0.32rem;
        padding: 0.01rem auto;
      }
    }
    .export-wrap {
      //   background: green;
      // display: flex;
      // flex: 1;
      // // height: 0.32rem;
      // flex-direction: row;
      // flex-wrap: nowarp;
      align-items: center;
    }
  }

  .devicename {
    width: 1.26rem;
    height: 0.32rem;
    font-size: 0.14rem;
  }

  .departname {
    width: 1.44rem;
    height: 0.32rem;
    font-size: 0.14rem;
  }

  .inpt {
    color: #fff;
    background: rgba(171, 187, 255, 0.2);
  }

  .source-select {
    width: 1.2rem;
    height: 0.32rem;
    font-size: 0.14rem;
  }

  .common-select {
    width: 0.78rem;
    height: 0.32rem;
    font-size: 0.14rem;
  }

  .export-wrap {
    background: green;
  }

  .btn {
    width: 0.64rem;
    height: 0.32rem;
    border-radius: 2px;
    text-align: center;
    padding: 0;
    font-size: 0.14rem;
    line-height: 0.3rem;
    color: #FFFFFF;
    background: #6677F0;
  }

  .reset-btn {
    margin-left: 0.08rem;
    line-height: 0.3rem;
    background: #252756;
  }

  /deep/ .ant-calendar-picker-input {
    background-color: rgba(171, 187, 255, 0.2);
    border-radius: 2px;
    font-size: 0.14rem;
  }

  /deep/ .ant-select-selector {
    background: rgba(171, 187, 255, 0.2);
    border: 0px;
    height: 0.32rem;
    padding: 0.01rem auto;
  }
}

.table-warp {
  width: 18.56rem;
  height: 8.64rem;
  margin: 0 auto;
  margin-top: 0.16rem;
  margin-bottom: 0.16rem;
  padding-left: 0.16rem;
  padding-right: 0.16rem;
  padding-top: 0.16rem;
  padding-bottom: 0.16rem;
  background: url(../assets/images/issue_manager/bg2.png);
  background-size: 18.56rem 100%;
  background-repeat: no-repeat;
  .address-wrap {
    width: 2.59rem;
  }

  /deep/ .ant-table {
    background: #252756;
    color: #FFFFFF;
    font-size: 0.14rem;
    // line-height: 0.40rem;
  }

  /deep/ .ant-pagination-item a {
    background: #252756;
    color: #FFFFFF;
    border-color: #FFFFFF;
  }

  /deep/ .ant-pagination-item-active a {
    background: rgba(102, 119, 240, 1);
    color: #FFFFFF;
    border-color: #FFFFFF;
  }

  /deep/ .ant-pagination-item-link {
    background: #252756;
    color: #FFFFFF;
    font-size: 0.14rem;
  }

  /deep/ .ant-pagination-item-ellipsis {
    color: #FFFFFF;
  }
  /deep/ th {
    padding: 0;
  }
  /deep/ th {
    padding-top: .09rem;
    padding-bottom: .09rem;
    padding-left: .16rem;
    padding-right: .24rem;
    font-size: .14rem;
  }
  /deep/ td {
    padding-top: .09rem;
    padding-bottom: .09rem;
    padding-left: .16rem;
    padding-right: .24rem;
  }
  /deep/ thead th {
    border: 0;
    background-color: rgba(102, 119, 240, 0.6);
    color: rgba(255, 255, 255, 1);
    height: 0.40rem;
  }

  /deep/ tbody td {
    border: 0px solid #6677F0;
    height: 0.40rem;

    span a {
      color: rgba(113, 232, 255, 1);
      padding-right: 0.16rem;
    }
  }

  /deep/ tbody tr:nth-child(even) {
    background-color: rgba(102, 119, 240, 0.1);
    color: rgba(255, 255, 255, 0.8);
  }

  /deep/ tbody tr:nth-child(odd) {
    color: rgba(255, 255, 255, 0.8);
  }

  /deep/ li {
    color: #FFFFFF;
  }

  /deep/ tbody > tr:hover:not(.ant-table-expanded-row):not(.ant-table-row-selected) > td {
    border-top: 1px solid #6677F0;
    border-bottom: 1px solid #6677F0;
    background-color: rgba(0, 0, 0, 0);
  }

  /deep/ tbody > tr:hover:not(.ant-table-expanded-row):not(.ant-table-row-selected) > td:first-child {
    border-left: 1px solid #6677F0;
    border-top: 1px solid #6677F0;
    border-bottom: 1px solid #6677F0;
    background-color: rgba(0, 0, 0, 0);
    border-radius: 2px;
  }

  /deep/ tbody > tr:hover:not(.ant-table-expanded-row):not(.ant-table-row-selected) > td:last-child {
    border-right: 1px solid #6677F0;
    border-top: 1px solid #6677F0;
    border-bottom: 1px solid #6677F0;
    background-color: rgba(0, 0, 0, 0);
    border-radius: 2px;
  }

  .ant-pagination {
    text-align: right;
    margin-top: 0.18rem;
  }
  /deep/ .ant-form .ant-form-item .ant-input {
    background: rgba(171, 187, 255, 0.2);
  }
}
</style>
<style scoped>
@import '~@/assets/css/formstyle.css';
</style>
