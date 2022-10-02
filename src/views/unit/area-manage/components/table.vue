<template>
  <div class="table">
    <a-table :columns="columns" :dataSource="dataSource" :pagination="false" :scroll="{ x: true }">
      <template #name="{ record }">
        <div class="one-row" :title="record.name">{{record.name}}</div>
      </template>
      <template #address="{ record }">
        <div class="one-row" :title="record.address">{{ record.address }}</div>
      </template>
      <template #operation="{ record }">
        <a href="javascript:;" class="btn" :data-record="record">编辑</a>
        <a href="javascript:;" class="btn delete" :data-record="record" @click="deleteModal">删除</a>
      </template>
    </a-table>
    <div class="pagination">
      <a-pagination
        :total="pagination.total"
        :pageSize="pagination.pageSize"
        :showTotal="pagination.showTotal"
        :showSizeChanger="false"
        :hideOnSinglePage="true"
        @change="pagination.change"
        :show-quick-jumper="pagination.showQuickJumper"
      ></a-pagination>
    </div>
    <a-modal
      v-model:visible="visible"
      title="Vertically centered modal dialog"
      centered
      @ok="visible = false"
    >
      <p>some contents...</p>
      <p>some contents...</p>
      <p>some contents...</p>
    </a-modal>
  </div>
</template>

<script>
import { ref } from 'vue'
const columns = [{
  title: '区域/楼栋',
  dataIndex: 'area',
  key: 'area'
}, {
  title: '楼层',
  dataIndex: 'layer',
  key: 'layer'
}, {
  title: '单位名称/业主姓名',
  dataIndex: 'name',
  key: 'name',
  slots: {
    customRender: 'name'
  }
}, {
  title: '单位地址/业主地址',
  dataIndex: 'address',
  key: 'address',
  slots: {
    customRender: 'address'
  }
}, {
  title: '安全责任人',
  dataIndex: 'owner',
  key: 'owner'
}, {
  title: '安全责任人电话',
  dataIndex: 'mobile',
  key: 'mobile'
}, {
  title: '安全管理人',
  dataIndex: 'manager',
  key: 'manager'
}, {
  title: '安全管理人电话',
  dataIndex: 'managerMobile',
  key: 'managerMobile'
}, {
  title: '操作',
  dataIndex: 'operation',
  key: 'operation',
  fixed: 'right',
  width: 136,
  slots: {
    customRender: 'operation'
  }
}]
const dataSource = [{
  area: '希望大厦',
  layer: '5楼',
  name: '青岛高重智能科技有限公司',
  address: '青岛市市北区福州北路798号希望大厦五楼',
  owner: '李亚辉',
  mobile: '15864223796',
  manager: '杜伟',
  managerMobile: '15865223788'
}]
export default {
  setup(props, contexTemplatet) {
    const visible = ref(false)
    const handlePageChange = (page, pageSize) => {
      console.log(page)
      console.log(pageSize)
    }
    const pagination = {
      total: 100,
      pageSize: 10,
      pageNo: 2,
      showQuickJumper: {
        goButton: '页'
      },
      hideOnSinglePage: true,
      change: (page, pageSize) => handlePageChange(page, pageSize),
      visible
    }

    const deleteModal = () => {
      visible.value = true
    }
    return {
      columns,
      dataSource,
      pagination,
      deleteModal
    }
  }
}
</script>

<style lang="less" scoped>
.table {
  width: 100%;
  height: 100%;
  padding: 0 24px;
  background: #fff;
  :deep(.ant-table td) {
    white-space: nowrap;
  }
  :deep(.ant-table th) {
    white-space: nowrap;
  }
  .pagination {
    padding: 16px 24px 16px 0;
    text-align: right;
  }
  .btn {
    font-size: 14px;
    color: #000;
    &.delete {
      margin-left: 16px;
      color: rgba(0, 0, 0, .6);
    }
  }
}
</style>
