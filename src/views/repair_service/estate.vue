<template>
  <div>
    <a-table
      :columns="state.columns"
      :data-source="repairs.list"
      :pagination="false"
      :row-selection="rowSelection"
      :rowKey="(record, index) => `key-${record}-${index}`"
    >
      <template #overtime = "{ record }">
        <span>
          {{record.overTime == 0 ? '及时' : '已逾期'}}
        </span>
      </template>
      <template #overtimeshow = "{ record }">
        <span>
          {{record.overTime}}天
        </span>
      </template>
      <template #operation = "{ record }">
        <span>
          <a-popover trigger="hover">
            <template #content>
              <span class="tips-txt">维保人员&nbsp;&nbsp;{{record.maintainUserName}}&nbsp;&nbsp;&nbsp;&nbsp;{{record.maintainUserPhone}}</span>
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
      <a-pagination :current="pagination.current" :total="pagination.total" :pageSize="pagination.pageSize" @change="pchange" :show-quick-jumper="showQuickJumper" :showTotal="showTotal"></a-pagination>
    </div>
  </div>
</template>
<script>
import { reactive, computed } from 'vue'
import { useStore } from 'vuex'
const columns = [
  {
    title: '业主单位',
    dataIndex: 'departName'
  },
  {
    title: '服务模式',
    dataIndex: 'serviceType'
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
    dataIndex: 'faultTime'
  },
  {
    title: '维保人员',
    dataIndex: 'propertyUserName'
  }
]
export default {
  setup() {
    const state = reactive({
      columns
    })
    const store = useStore()
    const handlePaginationChange = (page, pageSize) => {
      store.dispatch('maintenance/getDevicePropertyRepairList', { pageNo: page, pageSize: pageSize || 14 })
    }
    return {
      state,
      repairs: computed(() => store.state.maintenance.devicePropertyRepairList),
      pagination: computed(() => ({
        total: store.state.maintenance.devicePropertyRepairList.total,
        current: store.state.maintenance.devicePropertyRepairList.pageNo,
        pageSize: store.state.maintenance.devicePropertyRepairList.pageSize
      })),
      showQuickJumper: {
        goButton: '页'
      },
      pchange: (page, pageSize) => handlePaginationChange(page, pageSize),
      showTotal: (total, range) => `当前${range[0]}-${range[1]}条,总共 ${total} 条`
    }
  }
}
</script>
<style lang="less" scoped>
.pagination-wrap {
  margin-top: 0.12rem;
  text-align: right;
  .ant-pagination {
    color: #fff;
  }
}
</style>
