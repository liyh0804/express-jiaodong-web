<template>
  <div>
    <a-table
      :columns="state.columns"
      :data-source="repairs.list"
      :pagination="false"
      :row-selection="rowSelection"
      :rowKey="(record, index) => `key-${record}-${index}`"
    >
      <template #serviceType="{ record }">
        {{ record.serviceType_dictText }}
      </template>
      <template #serviceStatusType="{ record }">
        {{ record.maintainStatus_dictText }}
      </template>
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
      <a-pagination :current="pagination.current" :total="pagination.total" :pageSize="pagination.pageSize" @change="pchange" :show-quick-jumper="pagination.showQuickJumper" :show-total="showTotal"></a-pagination>
    </div>
  </div>
</template>
<script>
import { reactive, computed } from 'vue'
import { useStore } from 'vuex'

const columns = [
  {
    title: '维保单号',
    dataIndex: 'maintainNo'
  },
  {
    title: '维保公司',
    dataIndex: 'maintainCompanyName'
  },
  {
    title: '维保人员',
    dataIndex: 'maintainUserName'
  },
  {
    title: '业主单位',
    dataIndex: 'departName'
  },
  {
    title: '服务模式',
    dataIndex: 'serviceType',
    slots: {
      customRender: 'serviceType'
    }
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
    title: '服务状态',
    dataIndex: 'maintainStatus',
    slots: {
      customRender: 'serviceStatusType'
    }
  },
  {
    title: '服务及时性',
    dataIndex: 'overTime', // 0 及时 >0 已逾期
    slots: { customRender: 'overtime' }
  },
  {
    title: '逾期时长',
    dataIndex: 'overTime', // 单位天
    slots: { customRender: 'overtimeshow' }
  },
  {
    title: '操作',
    dataIndex: 'operation',
    slots: { customRender: 'operation' }
  }
]
export default {
  props: {
    type: {
      type: String,
      default: () => '0'
    }
  },
  setup(props) {
    const state = reactive({
      type: 0,
      columns
    })
    const store = useStore()
    const handlePaginationChange = (page, pageSize) => {
      store.dispatch('maintenance/getDeviceRepairList', { type: props.type, pageNo: page, pageSize: pageSize || 14 })
    }
    return {
      state,
      repairs: computed(() => store.state.maintenance.deviceRepairList),
      pagination: computed(() => ({
        total: store.state.maintenance.deviceRepairList.total,
        current: store.state.maintenance.deviceRepairList.pageNo,
        pageSize: store.state.maintenance.deviceRepairList.pageSize,
        showQuickJumper: {
          goButton: '页'
        }
      })),
      pchange: (page, pageSize) => handlePaginationChange(page, pageSize),
      showTotal: (total, range) => `当前${range[0]}-${range[1]}条,总共 ${total} 条`
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
</style>
