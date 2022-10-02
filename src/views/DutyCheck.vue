<template>

  <a-form
    layout='inline'
    ref="formRef"
    :model='formState'
    id="searchForm"
    @finish="handleFinish"
  >
    <a-form-item style="min-width:410px" label='时间范围' my='true' name="timeRange">
      <a-range-picker
        v-model:value='formState.timespan'
        :placeholder="['开始时间', '结束时间']"
      />
    </a-form-item>
    <a-form-item>
      <a-button
        type='primary'
        html-type='submit'
        class='btn'
      >
        查询
      </a-button>
    </a-form-item>
    <a-form-item>
      <a-button ghost class=' btn' @click="resetForm">
        重置
      </a-button>
    </a-form-item>
    <span style="float: right">
      <a-form-item>
        <a-button
          type='primary' class='btn' @click="checkDutyNow()">
          立即手动查岗
        </a-button>
      </a-form-item>
      <a-form-item>
        <a-button ghost class='btn' @click="setDutyConfig()">
          查岗设置
        </a-button>
      </a-form-item>
      <a-form-item>
        <a-button type='primary' class='btn' @click="exportDutyList">
          导出
        </a-button>
      </a-form-item>
    </span>
  </a-form>
  <div class="table-warp">
    <a-table
      :dataSource="dataSource"
      :columns="state.columns"
      :bordered="false"
      :pagination="false"
    >
      <template #checkType="{ record }">
        <div v-if="record.checkType === 0">
          自动查岗
        </div>
        <div v-else>
          手动查岗
        </div>
      </template>
      <template #checkStatus="{ record }">
        <div v-if="record.checkStatus === 1 ">
          是
        </div>
        <div v-else>
          否
        </div>
      </template>
      <template #dutyStatus="{ record }">
        <div v-if=" record.dutyStatus === 1 ">
          是
        </div>
        <div v-else-if="record.duty_status === 0">
          否
        </div>
        <div v-else>
          未知
        </div>
      </template>
      <template #operation="{ record }">
        <a @click="seeImg(record.picUrl)">
          <img src="@/assets/images/watching/seeimage.png"/>查看截图
        </a>
      </template>
    </a-table>
    <div class="pagination-wrap">
      <a-pagination :current="dutyList.pageNo" :pageSize="dutyList.pageSize" :total="dutyList.total"
                    @change="pchange"  :show-quick-jumper="showQuickJumper" :showTotal="showTotal"></a-pagination>
    </div>
  </div>
  <a-modal v-model:visible="visible" :title="title" :footer="null">
    <a-image
      style="width: 100%"
      :src="picUrl"
    />
  </a-modal>

  <a-modal dialogClass="gh-modal-dialog"
           wrapClassName="gh-modal-dialog-wrap"
           @destroyOnClose="true"
           :title="null"
           width="550px"
           :visible="state.configVisable"
           @cancel="state.configVisable = false"
           :destroyOnClose="true"
           :footer="null"
           :maskClosable="false"
           :keyboard="false"
  >
    <DutyConfig @close="state.configVisable = false"/>
  </a-modal>

</template>

<script>
import { reactive, ref, onMounted, computed } from 'vue'
import { useStore } from 'vuex'
import { exportDutyHistoryList } from '@/api/duty'
// import { Modal } from 'ant-design-vue'
import DutyConfig from '@/components/duty/DutyConfig.vue'
import { notification } from 'ant-design-vue'

const columns = [
  {
    title: '查岗方式',
    dataIndex: 'checkType',
    key: 'checkType',
    slots: { customRender: 'checkType' }
  },
  {
    title: '查岗时间',
    dataIndex: 'createTime',
    key: 'createTime'
  },
  {
    title: '查岗是否成功',
    dataIndex: 'checkStatus',
    key: 'checkStatus',
    slots: { customRender: 'checkStatus' }
  },
  {
    title: '人员是否在岗',
    dataIndex: 'dutyStatus',
    key: 'dutyStatus',
    slots: { customRender: 'dutyStatus' }
  },
  {
    title: '操作',
    dataIndex: 'operation',
    key: 'operation',
    slots: { customRender: 'operation' }
  }
]

export default {
  components: {
    DutyConfig
  },
  setup() {
    const visible = ref(false)
    const formRef = ref()
    const title = ref('')
    const picUrl = ref('')
    const store = useStore()
    const formState = reactive({
      timeRange: ref()
    })
    const state = reactive({
      columns,
      configVisable: false
    })

    onMounted(() => {
      store.dispatch('duty/getDutyHistoryList', {
        pageNo: 1,
        pageSize: 14
      })
    })
    const seeImg = (url) => {
      picUrl.value = url
      title.value = '查看截图'
      visible.value = true
    }

    const exportDutyList = () => {
      let from = ''
      let to = ''
      if (formState.timespan && formState.timespan.length) {
        from = formState.timespan[0].format('YYYY-MM-DD')
        to = formState.timespan[1].format('YYYY-MM-DD')
      }
      const timeStamp = from ? `-${from}~${to}` : ''
      exportDutyHistoryList({
        from,
        to
      }).then(res => {
        if (typeof window.navigator.msSaveBlob !== 'undefined') {
          window.navigator.msSaveBlob(new Blob([res.data], { type: 'application/vnd.ms-excel' }), `查岗记录${timeStamp}.xls`)
        } else {
          const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/vnd.ms-excel' }))
          const link = document.createElement('a')
          link.style.display = 'none'
          link.href = url
          link.setAttribute('download', `查岗记录${timeStamp}.xls`)
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link) // 下载完成移除元素
          window.URL.revokeObjectURL(url) // 释放掉blob对象
        }
      })
    }

    const handleFinish = () => {
      console.log(formState)
      let from = ''
      let to = ''
      if (formState.timespan && formState.timespan.length) {
        from = formState.timespan[0].format('YYYY-MM-DD')
        to = formState.timespan[1].format('YYYY-MM-DD')
      }
      const params = {
        from,
        to,
        pageNo: 1,
        pageSize: 14
      }
      store.dispatch('duty/getDutyHistoryList', params)
    }

    const handlePaginationChange = (page, pageSize) => {
      let from = ''
      let to = ''
      if (formState.timespan && formState.timespan.length) {
        from = formState.timespan[0].format('YYYY-MM-DD')
        to = formState.timespan[1].format('YYYY-MM-DD')
      }
      const params = {
        pageNo: page,
        pageSize,
        from,
        to
      }
      store.dispatch('duty/getDutyHistoryList', params)
    }

    const pagination = {
      total: computed(() => store.state.duty.dutyList.total),
      pageSize: computed(() => store.state.duty.dutyList.pageSize || 14),
      pageNo: computed(() => store.state.duty.dutyList.pageNo),
      showSizeChanger: false,
      showTotal: (total, range) => `当前${range[0]}-${range[1]}条,总共 ${total} 条`,
      showQuickJumper: {
        goButton: '页'
      },
      hideOnSinglePage: true,
      change: handlePaginationChange
    }

    const resetForm = () => {
      window.location.reload()
    }

    const checkDutyNow = () => {
      store.dispatch('duty/manualDuty').then((res) => {
        if (res && res.success) {
          notification.success({
            description: '查岗成功'
          })
        } else {
          notification.success({
            description: '查岗失败'
          })
        }
      })
    }

    const setDutyConfig = () => {
      state.configVisable = true
    }
    return {
      state,
      formRef,
      formState,
      seeImg,
      visible,
      title,
      picUrl,
      dutyList: computed(() => store.state.duty.dutyList),
      dataSource: computed(() => store.state.duty.dutyList.list),
      pagination,
      exportDutyList,
      handleFinish,
      resetForm,
      pchange: (page, pageSize) => handlePaginationChange(page, pageSize),
      showTotal: (total, range) => `当前${range[0]}-${range[1]}条,总共 ${total} 条`,
      showQuickJumper: {
        goButton: '页'
      },
      checkDutyNow,
      setDutyConfig
    }
  }
}
</script>
<style scoped>
@import '~@/assets/css/formstyle.css';

.ant-form {
  background: url(../assets/images/issue_manager/bg1.png);
  background-size: 18.56rem 100%;
  background-repeat: no-repeat;
  width: 18.56rem;
  padding: 16px 0.24rem;
  margin: 16px 0.34rem;
}

.table-warp {
  padding: 16px 0.24rem;
  margin: 16px 0.34rem;
  background: url(../assets/images/issue_manager/bg2.png);
  background-size: 18.56rem 100%;
  background-repeat: no-repeat;
  height: 8.64rem;
  width: 18.56rem;
}

img {
  width: 0.2rem;
  margin: -0.05rem 0.04rem 0 0;
}

a {
  color: #71e8ff;
  margin-right: 2em;
}

a:last-child {
  margin-right: 0;
}

.pagination-wrap {
  margin-top: 0.18rem;
  text-align: right;
  z-index: 2;
}
</style>

<style>

/****
*   弹框 弹出子窗体公共样式 begin
*       <a-modal dialogClass="gh-modal-dialog" wrapClassName="gh-modal-dialog-wrap" ......
*   内部界面 有.gh-modal-dialog-header与.gh-modal-dialog-body  其他自定义
 */

.gh-modal-dialog .ant-modal-content {
  background: #292C60;
  border-radius: 8px;
  min-height: 0.48rem;
  color: #FFFFFF;
}

.gh-modal-dialog .ant-modal-content .ant-modal-body {
  padding: 0px;
}

.gh-modal-dialog-wrap {
  background-color: rgba(0, 0, 0, 0.79)
}

.gh-modal-dialog .ant-modal-content .ant-modal-close-x {
  width: 0.58rem;
  height: 0.38rem;
  font-size: 0.15rem;
  font-style: normal;
  line-height: 0.38rem;
}

.gh-modal-dialog .ant-modal-content .ant-modal-close-x svg {
  fill: #ffffff;
}

.gh-modal-dialog .ant-modal-content .ant-modal-body .gh-modal-dialog-header {
  background: #404B9F;
  border-radius: 8px 8px 0px 0px;
  height: 0.38rem;
  line-height: 0.38rem;
  padding: 0 0.32rem;
  font-size: 0.15rem;
}

.gh-modal-dialog .ant-modal-content .ant-modal-body .gh-modal-dialog-body {
  background: #292C60;
  padding: 0.16rem 0.16rem;
  font-size: 0.14rem;
}

/****
*   弹框 弹出子窗体公共样式 end
 */

</style>
