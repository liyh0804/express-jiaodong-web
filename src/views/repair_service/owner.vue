<template>
  <div>
    <a-table
      :columns="state.columns"
      :data-source="repairs.list"
      :pagination="false"
      :row-selection="rowSelection"
      :rowKey="(record, index) => record.id"
    >
      <template #serviceType="{ record }">
        {{ record.serviceType_dictText }}
      </template>
      <template #operation = "{ record }">
        <span>
          <a-popover trigger="hover">
            <template #content>
              <span class="tips-txt">业主&nbsp;&nbsp;{{record.userName}}&nbsp;&nbsp;&nbsp;&nbsp;{{record.userTelephone}}</span>
              {{ record.user }}
            </template>
            <a class="links">
              <img src="../../assets/images/maintainence_manager/telephone.png" >
              <span>联系方式</span>
            </a>
          </a-popover>
        </span>
      </template>
    </a-table>
    <div class="pagination-wrap" v-if="pagination.total">
      <a-pagination :current="pagination.current" :total="pagination.total" :show-quick-jumper="pagination.showQuickJumper" :pageSize="pagination.pageSize" @change="pchange" :show-total="showTotal"></a-pagination>
    </div>
    <div class="operations" v-if="pagination.total">
      <a-button class="btn" @click="showRepairModal">转维保</a-button>
      <a-button class="btn" @click="showPropertyRepairModal">转物业</a-button>
    </div>
    <a-modal
      v-model:visible="visible"
      title="转维保"
      ok-text="确定"
      cancel-text="取消"
      @ok="submitUserFaultToMaintain"
    >
      <a-form :model="maintenanceState">
        <a-form-item label="维保类型" name="maintainType">
          <a-select class="select-wrap" v-model:value="maintenanceState.maintainType" placeholder="请选择">
            <a-select-option v-for="type in maintainType" :value="type.value" :key="type.value">{{type.text}}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="维保公司" name="maintainCompanyName">
          <a-select class="select-wrap" @change="handleMaintainCompanyChange" v-model:value="maintenanceState.maintainCompanyName" placeholder="请选择">
            <a-select-option v-for="company in maintainCompany" :value="company.maintainCompanyName" :key="company.id">{{company.maintainCompanyName}}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="维保人员" name="maintainUserId">
          <a-select class="select-wrap"  v-model:value="maintenanceState.maintainUserId" placeholder="请选择">
            <a-select-option v-for="user in maintainUsers" :value="user.id" :key="user.id">{{user.userName}}</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>
    <a-modal
      v-model:visible="propertyVisible"
      title="转物业"
      ok-text="确定"
      cancel-text="取消"
      @ok="submitUserFaultToProperty"
    >
      <a-form>
        <a-form-item label="物业人员" :model="propertyState" name="propertyUserId">
          <a-select class="select-wrap" v-model:value="propertyState.propertyUserId" placeholder="请选择">
            <a-select-option v-for="user in propertyUsers" :value="user.id" :key="user.userName">{{user.userName}}</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
<script>
import { computed, reactive, ref } from 'vue'
import { useStore } from 'vuex'
import { Modal, notification } from 'ant-design-vue'

const columns = [{
  title: '业主单位',
  dataIndex: 'userCompany'
},
{
  title: '服务模式',
  dataIndex: 'serviceType',
  slots: {
    customRender: 'serviceType'
  }
},
{
  title: '具体位置',
  dataIndex: 'detailAddress'
},
{
  title: '设备名称',
  dataIndex: 'deviceName'
},
{
  title: '描述',
  dataIndex: 'faultDesc'
},
{
  title: '提交时间',
  dataIndex: 'createTime'
},
{
  title: '操作',
  dataIndex: 'operation',
  slots: { customRender: 'operation' }
}]

export default {
  setup(props) {
    const store = useStore()
    const state = reactive({
      columns,
      selectRows: []
    })
    const maintenanceState = reactive({
      maintainCompanyName: computed(() => store.state.maintenance.maintainCompany.length > 0 ? store.state.maintenance.maintainCompany[0].maintainCompanyName : ''),
      maintainType: computed(() => store.state.maintenance.maintainType.length > 0 ? store.state.maintenance.maintainType[0].value : ''),
      maintainUserId: computed(() => store.state.maintenance.maintainUsers.length > 0 ? store.state.maintenance.maintainUsers[0].id : '')
    })
    const propertyState = reactive({
      propertyUserId: computed(() => store.state.maintenance.propertyUsers.length > 0 ? store.state.maintenance.propertyUsers[0].id : '')
    })
    const visible = ref(false)
    const propertyVisible = ref(false)
    const rowSelection = {
      onChange: (selectedRowKeys) => {
        state.selectRows = selectedRowKeys
      }
    }

    const showRepairModal = () => {
      if (!state.selectRows.length) {
        Modal.warning({
          title: '提醒',
          content: '至少选择一条业主维保记录',
          okText: '确定'
        })
        return
      }
      store.dispatch('maintenance/getAllMaintenanceInfo').then(
        visible.value = true
      ).catch(error => {
        console.log(error)
      })
    }
    const handleMaintainCompanyChange = (value, option) => {
      store.dispatch('maintenance/getMaintainUserByCompanyId', { companyId: option.key })
    }
    const showPropertyRepairModal = () => {
      if (!state.selectRows.length) {
        Modal.warning({
          title: '提醒',
          content: '至少选择一条业主维保记录',
          okText: '确定'
        })
        return
      }
      store.dispatch('maintenance/getUserByPropertyId', { propertyCompanyId: '' }).then(
        propertyVisible.value = true
      ).catch(error => {
        console.log(error)
      })
    }

    const handlePaginationChange = (page, pageSize) => {
      store.dispatch('maintenance/getOwnerRepairList', { type: '', pageNo: page, pageSize: pageSize || 14 })
    }

    const pagination = computed(() => ({
      total: store.state.maintenance.repairs.total,
      current: store.state.maintenance.repairs.pageNo,
      pageSize: store.state.maintenance.repairs.pageSize,
      showQuickJumper: {
        goButton: '页'
      }
    }))

    const submitUserFaultToProperty = () => {
      const faultId = state.selectRows.join(',')
      const params = {
        faultId,
        ...propertyState
      }
      store.dispatch('maintenance/submitUserFaultToProperty', { ...params }).then(res => {
        if (res && res.success) {
          notification.success({
            message: '成功',
            description: '业主维保已成功转交给相关物业人员'
          })
          propertyVisible.value = false
          store.dispatch('maintenance/getOwnerRepairList', { pageNo: 1, pageSize: 14 })
        } else {
          console.log('error')
        }
      })
    }

    const submitUserFaultToMaintain = () => {
      const faultId = state.selectRows.join(',')
      const params = {
        faultId,
        ...maintenanceState
      }
      store.dispatch('maintenance/submitUserFaultToMaintain', { ...params }).then(res => {
        if (res && res.success) {
          notification.success({
            message: '成功',
            description: '业主维保已成功转交给相关维保人员'
          })
          visible.value = false
          store.dispatch('maintenance/getOwnerRepairList', { pageNo: 1, pageSize: 14 })
        } else {
          console.log('error')
        }
      })
    }

    return {
      state,
      repairs: computed(() => store.state.maintenance.repairs),
      maintainCompany: computed(() => store.state.maintenance.maintainCompany),
      maintainType: computed(() => store.state.maintenance.maintainType),
      maintainUsers: computed(() => store.state.maintenance.maintainUsers),
      propertyUsers: computed(() => store.state.maintenance.propertyUsers),
      rowSelection,
      pagination,
      pchange: (page, pageSize) => handlePaginationChange(page, pageSize),
      showTotal: (total, range) => `当前${range[0]}-${range[1]}条,总共 ${total} 条`,
      visible,
      showRepairModal,
      propertyVisible,
      showPropertyRepairModal,
      handleMaintainCompanyChange,
      submitUserFaultToProperty,
      submitUserFaultToMaintain,
      maintenanceState,
      propertyState
    }
  }
}
</script>
<style lang="less" scoped>
.links {
  span {
    font-size: 0.14rem;
    color: #71E8FF;
    vertical-align: middle;
  }
  img {
    width: 0.16rem;
    // height: 0.16rem;
    min-width: 0.12rem;
    margin-right: 0.04rem;
    vertical-align: middle;
  }
}
.tips-txt {
  font-size: 0.14rem;
  color: #fff;
}
.pagination-wrap {
  margin-top: 0.12rem;
  text-align: right;
  .ant-pagination {
    color: #fff;
  }
}
.operations {
  display: flex;
  flex-direction: row;
  .btn {
    width: 0.88rem;
    height: 0.32rem;
    font-size: 0.14rem;
    color: #fff;
    background: #6677F0;
    border-radius: 2px;
    margin-right: 0.24rem;
  }
  .btn:hover {
    color: #fff;
  }
}
.select-wrap {
  width: 3.98rem;
  height: 0.32rem;
  background: rgba(171, 187, 255, 0.2);
  border: 0;
  border-radius: 2px;
}
/deep/ .ant-select-single:not(.ant-select-customize-input) .ant-select-selector {
  background: rgba(171, 187, 255, 0.2);
  border: 0;
}
.ant-modal-confirm-body .ant-modal-confirm-title {
  color: #fff !important;
}
.ant-modal-confirm-body .ant-modal-confirm-content {
  color: #fff !important;
}
.ant-select-single.ant-select-show-arrow .ant-select-selection-item, .ant-select-single.ant-select-show-arrow .ant-select-selection-placeholder {
  color: #fff;
}
.ant-select {
  color: #fff;
}
.ant-select-open {
  color: #fff;
}
</style>
