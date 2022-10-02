<template>
  <div class="full-table">
    <div class="table-filter">
      <a-form
        name="search-form"
        ref="formRef"
        :model="formState"
        class="form-wrap"
        id="searchForm"
        @finish="handleFinish"
      >
        <div class="filter-left">
          <a-form-item label="用户姓名" name="name">
            <a-input class="inpt" v-model:value="formState.name" placeholder="请输入" />
          </a-form-item>
          <a-form-item label="角色名称" name="roleType">
            <a-select class="inpt" placeholder="全部" v-model:value="formState.roleType">
              <a-select-option value="">全部</a-select-option>
              <a-select-option key="1" value="1">领导</a-select-option>
              <a-select-option key="2" value="2">单位安全负责人</a-select-option>
              <a-select-option key="3" value="3">单位安全责任人</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="状态" name="disableFlag">
            <a-select class="inpt" placeholder="全部" v-model:value="formState.disableFlag">
              <a-select-option value="">全部</a-select-option>
              <a-select-option key="0" value="0">禁用</a-select-option>
              <a-select-option key="1" value="1">启用</a-select-option>
            </a-select>
          </a-form-item>
        </div>
        <div class="filter-right">
          <a-form-item>
            <a-button class="btn reset-btn" @click="handleReset"> 重置 </a-button>
          </a-form-item>
          <a-form-item>
            <a-button type="primary" html-type="submit" class="btn search-btn">
              查询
            </a-button>
          </a-form-item>
        </div>
      </a-form>
    </div>
    <div class="table-warp">
      <a-table
        :dataSource="users.list"
        :columns="columns"
        :bordered="false"
        :pagination="false"
        :scroll="{ x: true }"
      >
        <template #address="{ record }">
          <div class="address-wrap one-row" :title="record.address">
            {{ record.address }}
          </div>
        </template>
        <template #action="{ record }">
          <div>
            <a-switch checked-children="启用" un-checked-children="停用" v-model:checked="record.disableFlag" :id="record.id" @change="changeStatus" />
          </div>
        </template>
      </a-table>
      <div class= "pager">
        <a-pagination
          :total="pagination.total"
          :pageSize="pagination.pageSize"
          :showSizeChanger="false"
          :hideOnSinglePage="true"
          @change="handlePageChange"
          :show-quick-jumper="pagination.showQuickJumper"
          :showTotal="showTotal"
        ></a-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import { reactive, onMounted, computed } from 'vue'
import { useStore } from 'vuex'

const columns = [
  {
    title: '序号',
    dataIndex: 'id',
    key: 'id'
  },
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: '角色名称',
    dataIndex: 'roleName',
    key: 'roleName'
  },
  {
    title: '所属小组',
    dataIndex: 'groupName',
    key: 'groupName'
  },
  {
    title: '所属部门',
    dataIndex: 'companyName',
    key: 'companyName'
  },
  {
    title: '所属单位/业主',
    dataIndex: 'customerType',
    key: 'customerType'
  },
  {
    title: '联系电话',
    dataIndex: 'phone',
    key: 'phone'
  },
  {
    title: '邮箱',
    dataIndex: 'email',
    key: 'email'
  },
  {
    title: '创建时间',
    dataIndex: 'addTime',
    key: 'addTime'
  },
  {
    title: '最近一次登录时间',
    dataIndex: 'lastLoginTime',
    key: 'lastLoginTime'
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    fixed: 'right',
    width: 104,
    slots: {
      customRender: 'action'
    }
  }
]

export default {

  setup(props, context) {
    const state = reactive({
      floorArea: null,
      flowStatus: 0,
      faultId: null
    })
    const formState = reactive({
    })

    const store = useStore()

    onMounted(() => {
      store.dispatch('user/getUserManageUserList', {
        payload: {
          pageNo: 1,
          pageSize: 10,
          propertyId: '68e3a4227aa14546bc5810a060037b74'
        }
      })
    })

    const handleFinish = (values) => {
      const params = {
        ...formState,
        pageNo: 1,
        pageSize: 10,
        propertyId: '68e3a4227aa14546bc5810a060037b74'
      }
      store.dispatch('user/getUserManageUserList', {
        payload: params
      })
    }

    const handlePageChange = (page, pageSize) => {
      const params = {
        ...formState,
        pageNo: page,
        propertyId: '68e3a4227aa14546bc5810a060037b74',
        pageSize
      }
      store.dispatch('user/getUserManageUserList', {
        payload: params
      })
    }

    const handleReset = () => {
      formState.name = ''
      formState.roleType = ''
      formState.disableFlag = ''
      store.dispatch('user/getUserManageUserList', {
        payload: {
          pageNo: 1,
          pageSize: 10,
          propertyId: '68e3a4227aa14546bc5810a060037b74'
        }
      })
    }

    const reload = () => {
      const params = {
        pageNo: 1,
        pageSize: 10,
        propertyId: '68e3a4227aa14546bc5810a060037b74',
        ...formState
      }
      store.dispatch('user/getUserManageUserList', {
        payload: params
      })
    }

    const changeStatus = (checked, evt) => {
      const { id } = evt.currentTarget || {}
      console.log(id)
      store.dispatch('user/changeUserDisabled', {
        payload: { id }
      }).then(res => {
        reload()
      }).catch(() => {
        reload()
      })
    }

    return {
      users: computed(() => store.state.user.userRoleList),
      columns,
      pagination: computed(() => ({
        total: store.state.user.userRoleList.total,
        pageSize: 10,
        pageNo: store.state.user.userRoleList.pageNo,
        showSizeChanger: false,
        showQuickJumper: {
          goButton: '页'
        },
        hideOnSinglePage: true,
        change: (page, pageSize) => handlePageChange(page, pageSize)
      })),
      formState,
      state,
      handleFinish,
      handleReset,
      showTotal: (total, range) => `当前${range[0]}-${range[1]}条,总共 ${total} 条`,
      handlePageChange,
      changeStatus
    }
  }
}
</script>
<style lang="less" scoped>
.inpt {
  width: 200px;
}
.full-table {
  margin: 24px;
  height:auto;
  .table-filter {
    padding: 24px;
    background:#fff;
    .ant-form {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      font-size: 14px;
      .filter-left{
        display: flex;
        flex-direction: row;
        align-items: center;
        .ant-form-item {
          margin-right: 24px;
          margin-bottom: 0;
        }
      }
      .filter-right{
        display: flex;
        flex-direction: row;
        align-items: center;
        .ant-form-item {
          margin-left: 8px;
          margin-bottom: 0;
        }
      }
    }
    height: 80px;
    border-radius: 2px;
  }
  .table-warp {
    margin-top: 24px;
    margin-bottom: 16px;
    padding: 24px;
    background:white;
    :deep(.ant-table td) {
      white-space: nowrap;
    }
    :deep(.ant-table th) {
      white-space: nowrap;
    }
    .pager {
      text-align: right;
      margin-top: 15px;
    }

  }

}
</style>
