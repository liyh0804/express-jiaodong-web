<template>
  <a-radio-group :value="state.tab_type" @change="onTabChange">
    <a-radio-button value="" :checked=true :autofocus=true>业主维保管理</a-radio-button>
    <a-radio-button value="0">应急维保明细</a-radio-button>
    <a-radio-button value="1">预约维保明细</a-radio-button>
    <a-radio-button value="2">例行维保明细</a-radio-button>
    <a-radio-button value="3" >转物业明细</a-radio-button>
  </a-radio-group>
  <div class="table-warp">
    <!-- <a-table
      :dataSource='state.dataSource'
      :columns='state.columns'
      :bordered="false"
      :rowSelection="state.rowSelection"
      :pagination="pagination">
      <template #action_tel = "{ text }">
        <span>
          <a-popover :titel="text" trigger="hover">
            <template #content>
              {{ text }}
            </template>
            <a>
              <img src="../assets/images/maintainence_manager/telephone.png" >联系方式
            </a>
          </a-popover>
        </span>
      </template>
      <template #actions = "{ record }">
        <span>
          <a-popover trigger="hover">
            <template #content>
              {{ record.maintain_user_phone }}
            </template>
            <a>
              <img src="../assets/images/maintainence_manager/telephone.png" >联系方式
            </a>
          </a-popover>
          <a :href="record.file_path">
            <img src="../assets/images/issue_manager/定位.png">下载报告
          </a>
        </span>
      </template>
    </a-table> -->
    <span v-if="state.tab_type=='owners'">
      <a-button class='opr-btn'>
        转维保
      </a-button>
      <a-button class='opr-btn'>
        转物业
      </a-button>
    </span>
  </div>
</template>

<script>
import { reactive, onMounted } from 'vue'
import { useStore } from 'vuex'

export default {
  props: ['type'],
  setup(props, context) {
    const state = reactive({
      tab_type: '',
      columns: [],
      dataSource: [
        {
          key: '1',
          createTime: '2021-04-21 09:10:02',
          code: '0988434',
          operation: '烟感'
        },
        {
          key: '2',
          createTime: '2021-04-21 09:10:02',
          code: '0988434',
          operation: '烟感'
        }
      ],
      rowSelection: null
    })
    const store = useStore()
    onMounted(() => {
      store.dispatch('maintenance/getOwnerRepairList')
    })
    const onTabChange = (e) => {
      state.tab_type = e.target.value
      store.dispatch('maintenance/getOwnerRepairList', { type: e.target.value })
      // if (e.target.value === 'owner') {

      // }
      // switch (e.target.value) {
      //   case 'owners':
      //     forOwners()
      //     break
      //   case 'urgent':
      //     forUrgent()
      //     break
      //   case 'booked':
      //     forBooked()
      //     break
      //   case 'regular':
      //     forRegular()
      //     break
      //   case 'estates':
      //     forEstates()
      //     break
      //   default:
      //     break
      // }
    }

    const deviceTypes = {
      全部: -1,
      火灾自动报警主机: 0,
      独立式烟感探测器: 1,
      可燃气体探测器: 2,
      电气火灾探测器: 3,
      水压探测仪: 4,
      液位监测仪: 5
    }
    const businessnames = {
      全部: -1,
      中国海洋大学: 1
    }
    const alarmSources = {
      全部: -1,
      人工上报: 0,
      物联网监测: 1,
      智能视频终端: 2
    }
    const dealStatuses = {
      全部: -1,
      待处理: 0,
      已处理: 1
    }
    const alarmCheckStatuses = {
      全部: -1,
      待核警: 0,
      真警: 1,
      误报: 2
    }
    const overdueStatuses = {
      全部: -1,
      未逾期: 0,
      已逾期: 1
    }

    return {
      pagination: {
        total: 100,
        pageSize: 10,
        showSizeChanger: false,
        showTotal: (total, range) => `当前${range[0]}-${range[1]}条,总共 ${total} 条`,
        showQuickJumper: {
          goButton: '页'
        },
        hideOnSinglePage: true
      },
      formState: {
        timespan: undefined
      },
      state,
      type_cn: props.type === 'fire' ? '火警' : props.type === 'breakdown' ? '故障' : props.type === 'hidden_trouble' ? '隐患' : '',
      // issues: computed(() => store.state.issue.issues),
      deviceTypes,
      businessnames,
      alarmSources,
      alarmCheckStatuses,
      dealStatuses,
      overdueStatuses,
      onTabChange
    }
  }
}
</script>
<style lang="less" scoped>
.ant-radio-group{
  margin-left: 0.16rem;
  width: 7.84rem;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  .ant-radio-button-wrapper {
    width: 1.44rem;
    height: 0.4rem;
    padding: 0;
    font-size: 0.14rem;
    line-height: 0.4rem;
    color: white;
    text-align: center;
    border: 0;
    background: url(../assets/images/maintainence_manager/bg-select-default.png) no-repeat;
    background-size: 1.44rem 0.4rem;
    margin-left: 0.16rem;
    &:active {
      background: url(../assets/images/maintainence_manager/bg-selected.png);
    }
  }
  .ant-radio-button-wrapper:not(:first-child)::before {
    width: 0;
  }
}

.table-warp {
  margin-left: 0.32rem;
  margin-right: 0.32rem;
  margin-top: 0.16rem;
  margin-bottom: 0.16rem;
  padding-left: 0.16rem;
  padding-right: 0.16rem;
  padding-top: 0.16rem;
  padding-bottom: 0.16rem;
  background: url(../assets/images/issue_manager/bg2.png);
  background-size: 18.56rem 100%;
  background-repeat: no-repeat;
  height: 8.64rem;
  width: 18.56rem;
  /deep/ .ant-table {
    background: #252756;
    color: #FFFFFF;
    font-size: 0.14rem;
  }
  /deep/ .ant-pagination-item a {
    background: #252756;
    color: #FFFFFF;
    border-color: #FFFFFF;
  }
  /deep/ .ant-pagination-item-active a{
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
  /deep/ thead th {
    border: 0;
    background-color: rgba(102, 119, 240, 0.6);
    color: rgba(255, 255, 255, 1);
    height: 0.40rem;
  }

  /deep/ tbody td {
    border: 0px solid #6677F0;
    height: 0.40rem;
    span a{
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
    color:#FFFFFF;
  }
  /deep/ tbody>tr:hover:not(.ant-table-expanded-row):not(.ant-table-row-selected)>td {
    border-top: 1px solid #6677F0;
    border-bottom: 1px solid #6677F0;
    background-color: rgba(0, 0, 0, 0);
  }
  /deep/ tbody>tr:hover:not(.ant-table-expanded-row):not(.ant-table-row-selected)>td:first-child {
    border-left: 1px solid #6677F0;
    border-top: 1px solid #6677F0;
    border-bottom: 1px solid #6677F0;
    background-color: rgba(0, 0, 0, 0);
    border-radius: 2px;
  }
  /deep/ tbody>tr:hover:not(.ant-table-expanded-row):not(.ant-table-row-selected)>td:last-child {
    border-right: 1px solid #6677F0;
    border-top: 1px solid #6677F0;
    border-bottom: 1px solid #6677F0;
    background-color: rgba(0, 0, 0, 0);
    border-radius: 2px;
  }
  .ant-btn {
    align-items: center;
    text-align:center;
    width: 0.88rem;
    height: 0.32rem;
    margin-right: 0.24rem;
    font-size: 0.14rem;
    background: rgba(102, 119, 240, 1);
    border-radius: 2px;
  }
}
.opr-btn {
  width: 0.88rem;
  height: 0.32rem;
  text-align: center;
  font-size: 0.14rem;
  color: #fff;
  line-height: 0.32rem;
  margin-right: 0.24rem;
}
</style>
<style scoped>
@import '~@/assets/css/formstyle.css';
</style>
