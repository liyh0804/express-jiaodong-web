<template>
  <div class="factory-brand">
    <div class="search-wrap">
      <a-form
        layout="inline"
        :model="formState"
        @finish="handleFinish"
      >
        <a-form-item class="form-item" label="生产厂家:">
          <a-input v-model:value="formState.deviceCompanyName" placeholder="请输入生产厂家"></a-input>
        </a-form-item>
        <a-form-item class="form-item" label="品牌:">
          <a-input class="input" v-model:value="formState.deviceBrand" placeholder="请输入设备品牌" ></a-input>
        </a-form-item>
        <a-form-item class="right">
          <a-button class="reset-style" @click="reset">
            重置
          </a-button>
          <a-button
            type="primary"
            html-type="submit"
          >
            查询
          </a-button>
        </a-form-item>
      </a-form>
    </div>
    <div class="operations">
      <div class="title">设备列表</div>
      <a-button type="primary" @click="addDevice">添加厂家品牌</a-button>
    </div>
    <div class="table clearfix">
      <a-table
        :columns="state.columns"
        :dataSource="factoryBrands.list"
        :pagination="false"
        :rowKey="(record) => `key-${record.id}`"
      >
        <template #operation="{record}">
          <div>
            <a href="javascript:;" class="btn" :data-id="record.id" :data-brand="record.deviceBrand" :data-factory="record.deviceCompanyName" @click="editRecord">编辑</a>
            <a-popconfirm
              title="您确定要删除该厂家及品牌吗?"
              ok-text="确定"
              cancel-text="取消"
              @confirm="() => confirmDelete(record.id)"
              @cancel="cancel"
            >
              <a class="btn" :id="record.id" href="#">删除</a>
            </a-popconfirm>
            <!-- <a href="#" class="btn" :id="record.id" @click="deleteRecord"></a> -->
          </div>
        </template>
      </a-table>
      <div class="pagination">
        <a-pagination
          :total="pagination.total"
          :pageSize="pagination.pageSize"
          :current="pagination.pageNo"
          :showTotal="showTotal"
          :showSizeChanger="false"
          :hideOnSinglePage="false"
          @change="change"
          :show-quick-jumper="showQuickJumper"
        ></a-pagination>
      </div>
    </div>
    <a-modal
      class="modal"
      :width="480"
      v-model:visible="state.visible"
      :title="state.editable ? '编辑厂家设备' : '添加厂家设备'"
      okText="确定"
      cancelText="取消"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <a-form
        ref="formRef"
        :model="modalState"
        :rules="rules"
      >
        <a-input type="hidden" name="id" v-model:value="modalState.id"></a-input>
        <a-form-item ref="deviceCompanyName" name="deviceCompanyName" label="生产厂家:">
          <a-input style="width: 328px" v-model:value="modalState.deviceCompanyName" placeholder="请输入生产厂家"></a-input>
        </a-form-item>
        <a-form-item style="margin-bottom: 0" ref="deviceBrand" name="deviceBrand" label="设备品牌:">
          <a-input style="width: 328px"  v-model:value="modalState.deviceBrand" placeholder="请输入设备品牌"></a-input>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import { reactive, computed, onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import { message } from 'ant-design-vue'

const columns = [{
  title: '序号',
  dataIndex: 'id',
  key: 'id'
}, {
  title: '生产厂家',
  dataIndex: 'deviceCompanyName',
  key: 'deviceCompanyName'
}, {
  title: '设备品牌',
  dataIndex: 'deviceBrand',
  key: 'deviceBrand'
}, {
  title: '操作',
  dataIndex: 'operation',
  slots: {
    customRender: 'operation'
  }
}]

export default {
  setup(props, context) {
    const store = useStore()
    const formRef = ref()
    const formState = reactive({
      deviceCompanyName: '',
      deviceBrand: ''
    })
    const state = reactive({
      visible: false,
      editable: false,
      columns
    })

    const modalState = reactive({
      id: '',
      deviceCompanyName: '',
      deviceBrand: ''
    })

    const rules = {
      deviceCompanyName: [
        {
          required: true,
          message: '',
          trigger: 'blur'
        }
      ],
      deviceBrand: [
        {
          required: true,
          message: '',
          trigger: 'blur'
        }
      ]
    }

    onMounted(() => {
      const params = {
        pageNo: 1,
        pageSize: 10
      }
      store.dispatch('device/getFactoryBrandList', {
        payload: params
      })
    })

    const handlePageChange = (page, pageSize) => {
      const params = {
        ...formState,
        pageNo: page,
        pageSize
      }
      store.dispatch('device/getFactoryBrandList', {
        payload: params
      })
    }

    const handleFinish = values => {
      const params = {
        ...formState,
        pageNo: 1,
        pageSize: 10
      }
      store.dispatch('device/getFactoryBrandList', {
        payload: params
      })
    }

    const reset = () => {
      formState.deviceCompanyName = ''
      formState.deviceBrand = ''
      const params = { pageNo: 1, pageSize: 10 }
      store.dispatch('device/getFactoryBrandList', {
        payload: params
      })
    }

    const handleCancel = () => {
      modalState.deviceBrand = ''
      modalState.deviceCompanyName = ''
      state.visible = false
      formRef.value.resetFields()
    }

    const reload = () => {
      formState.deviceBrand = ''
      formState.deviceCompanyName = ''
      store.dispatch('device/getFactoryBrandList', {
        payload: {
          pageNo: 1,
          pageSize: 10
        }
      })
    }

    const handleOk = () => {
      formRef.value.validate().then(() => {
        const params = modalState
        store.dispatch('device/addDeviceFactoryBrand', {
          payload: params
        }).then(res => {
          if (res && res.success) {
            message.success(res.result, 1, () => {
              reload()
              state.visible = false
            })
          } else {
            message.error(res.result || state.editable ? '编辑失败' : '创建失败', 1)
          }
        })
      }).catch(error => {
        console.log(error)
      })
    }

    const addDevice = () => {
      modalState.deviceCompanyName = ''
      modalState.deviceBrand = ''
      modalState.id = ''
      state.editable = false
      state.visible = true
    }

    const editRecord = ({ target }) => {
      const { id, brand, factory } = target.dataset || {}
      modalState.deviceBrand = brand
      modalState.deviceCompanyName = factory
      modalState.id = id
      state.editable = true
      state.visible = true
    }

    const confirmDelete = (id) => {
      store.dispatch('device/deleteDeviceFactory', {
        payload: {
          id
        }
      }).then(res => {
        if (res && res.success) {
          message.success(res.result, 1, () => {
            reload()
          })
        } else {
          message.error('删除失败', 1)
        }
      })
    }

    return {
      formState,
      modalState,
      rules,
      state,
      columns,
      formRef,
      factoryBrands: computed(() => store.state.device.factoryBrandList),
      // factoryBrands: store.state.device.factoryBrandList,
      pagination: computed(() => ({
        total: store.state.device.factoryBrandList.total,
        pageSize: 10,
        pageNo: store.state.device.factoryBrandList.pageNo
      })),
      showQuickJumper: {
        goButton: '页'
      },
      hideOnSinglePage: true,
      showTotal: (total, range) => `当前${range[0]}-${range[1]}条,总共 ${total} 条`,
      change: (page, pageSize) => handlePageChange(page, pageSize),
      reset,
      handleFinish,
      handleCancel,
      handleOk,
      addDevice,
      editRecord,
      confirmDelete
    }
  }
}
</script>

<style lang="less" scoped>
.factory-brand {
  .search-wrap {
    padding: 24px;
    border-radius: 2px;
    background-color: #fff;
    .right {
      float: right;
      margin: 0;
      button {
        margin-left: 8px;
      }
    }
  }
  .operations {
    display: flex;
    justify-content: space-between;
    padding: 16px 24px;
    margin-top: 16px;
    background-color: #fff;
    .title {
      font-size: 16px;
      color: #000;
    }
  }
  .table {
    background-color: #fff;
    padding: 0 24px 16px;
    .btn {
      margin-left: 20px;
      font-size: 14px;
      color: #6677F0;
      &:first-child {
        margin: 0;
      }
    }
    .pagination {
      float: right;
      margin-top: 16px;
    }
  }
}
</style>
