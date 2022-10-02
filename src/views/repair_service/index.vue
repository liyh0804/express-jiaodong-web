<template>
<div class="repair-wrap">
  <div class="tab-wrap">
    <ul>
      <li>
        <a href="javascript:;" :class="state.current ? '': 'active'" data-id="" @click="onTabChange">业主维保管理</a>
      </li>
      <li>
        <a href="javascript:;" :class="state.current === '0' ? 'active': ''" data-id="0" @click="onTabChange">应急维保明细</a>
      </li>
      <li>
        <a href="javascript:;" :class="state.current === '1' ? 'active': ''" data-id="1"  @click="onTabChange">预约维保明细</a>
      </li>
      <li>
        <a href="javascript:;" :class="state.current === '2' ? 'active': ''" data-id="2" @click="onTabChange">例行维保明细</a>
      </li>
      <li>
        <a href="javascript:;" :class="state.current === '3' ? 'active': ''" data-id="3" @click="onTabChange">转物业明细</a>
      </li>
    </ul>
  </div>
  <div class="table-wrap">
    <div class="tbl-content">
      <sl-owner v-if="state.current === ''" />
      <sl-urgent v-if="state.current ==='0'" type="0" />
      <sl-booking v-if="state.current === '1'" type="1"></sl-booking>
      <sl-regular v-if="state.current === '2'" type="2"></sl-regular>
      <sl-estate v-if="state.current === '3'"></sl-estate>
    </div>
  </div>
</div>
</template>

<script>
import { reactive, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import Owner from './owner.vue'
import Urgent from './urgent.vue'
import Booking from './booking.vue'
import Regular from './regular.vue'
import Estate from './estate.vue'

export default {
  components: {
    'sl-owner': Owner,
    'sl-urgent': Urgent,
    'sl-booking': Booking,
    'sl-regular': Regular,
    'sl-estate': Estate

  },
  setup(props) {
    const route = useRoute()
    const state = reactive({
      current: route.query.type ? route.query.type : '',
      pageNo: 1,
      pageSize: 14
    })
    const store = useStore()
    onMounted(() => {
      if (state.current === '') {
        store.dispatch('maintenance/getOwnerRepairList', { pageNo: 1, pageSize: 14 })
      } else {
        store.dispatch('maintenance/getDeviceRepairList', { type: state.current, pageNo: 1, pageSize: 14 })
      }
    })
    const onTabChange = (evt) => {
      const id = evt.currentTarget.dataset.id
      state.current = id
      if (id === '') {
        store.dispatch('maintenance/getOwnerRepairList', { pageNo: 1, pageSize: 14 })
      } else if (id >= 0 && id < 3) {
        store.dispatch('maintenance/getDeviceRepairList', { type: id, pageNo: 1, pageSize: 14 })
      } else {
        store.dispatch('maintenance/getDevicePropertyRepairList', { pageNo: 1, pageSize: 14 })
      }
    }
    return {
      state,
      onTabChange
    }
  }
}
</script>

<style lang="less" scoped>
.repair-wrap {
  .tab-wrap {
    margin: 0.28rem 0.32rem 0.16rem 0.32rem;
    ul, li {
      padding: 0;
      margin: 0;
    }
    li {
      list-style: none;
      display: inline-block;
      width: 1.44rem;
      height: 0.4rem;
      margin-right: 0.16rem;
      a {
        display: block;
        width: 1.44rem;
        height: 0.4rem;
        font-size: 0.14rem;
        line-height: 0.4rem;
        text-align: center;
        color: #fff;
        background: url(../../assets/images/maintainence_manager/bg-select-default.png) no-repeat center;
        background-size: 1.44rem 0.4rem;
      }
      a.active {
        font-weight: 700;
        background: url(../../assets/images/maintainence_manager/bg-selected.png) no-repeat center;
      }
    }
  }
  .table-wrap {
    height: 8.64rem;
    padding: 0 0.32rem;
    background: url(../../assets/images/issue_manager/bg2.png) no-repeat center;
    background-size: 18.56rem 8.64rem;
    .tbl-content {
      margin: 0.16rem 0.32rem;
    }
    /deep/ .ant-table {
      background: transparent;
      .ant-table-thead > tr > th {
        border: 0;
        background-color: rgba(102, 119, 240, 0.6);
        font-size: 0.14rem;
        font-weight: 700;
        color: #fff;
      }
      .ant-table-tbody >tr:nth-child(odd) {
        background-color: rgba(102, 119, 240, 0.1);
      }
      .ant-table-tbody >tr:nth-child(even) {
        background-color: #2B2E60;
      }
      .ant-table-tbody > tr > td {
        font-size: 0.14rem;
        color: #D6D5DD !important;
      }
      .ant-table-tbody > tr.ant-table-row-selected td {
        background: transparent;
      }
    }
  }
}
/deep/ .ant-pagination-jump-prev .ant-pagination-item-container .ant-pagination-item-ellipsis, .ant-pagination-jump-next .ant-pagination-item-container .ant-pagination-item-ellipsis {
  color: #fff !important;
}
</style>
