<template>
  <div class="factory-brand">
    <div class="search-wrap">
      <a-form
        layout="inline"
        :model="formState"
        @finish="handleFinish"
      >
        <a-form-item class="form-item" label="设备类型:">
          <a-select class="inpt" v-model:value="formState.deviceType" placeholder="请选择设备类型">
            <a-select-option value="">全部</a-select-option>
            <a-select-option v-for="type in state.types" :key="type.value" :value="type.value">{{ type.text }}</a-select-option>
          </a-select>
          <!-- <a-input class="inpt" v-model:value="formState.deviceType" placeholder="请输入设备类型"></a-input> -->
        </a-form-item>
        <a-form-item class="form-item" label="设备名称:">
          <a-input class="inpt" v-model:value="formState.subTypeName" placeholder="请输入设备名称" ></a-input>
        </a-form-item>
        <a-form-item class="form-item" label="物联网设备:">
          <a-select class="select" v-model:value="formState.online" placeholder="请选择">
            <a-select-option value="">全部</a-select-option>
            <a-select-option value="1">是</a-select-option>
            <a-select-option value="2">否</a-select-option>
          </a-select>
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
      <div class="title">类型和名称列表</div>
      <div class="btns">
        <!-- <a-button @click="addType">添加类型</a-button> -->
        <a-button type="primary" @click="addSubType">添加名称</a-button>
      </div>
    </div>
    <div class="table clearfix">
      <a-table
        :columns="state.columns"
        :dataSource="subTypeList.list"
        :pagination="false"
        :rowKey="(record) => `key-${record.id}`"
      >
        <template #online="{ record }">
          <div>
            {{ record.online == 1 ? '是' : '否' }}
          </div>
        </template>
        <template #logo="{ record }">
          <img class="icon-img" :src="record.logoUrl" alt="icon">
          <!-- <a-button type="link" @click='viewIcon'>查看</a-button> -->
        </template>
        <template #operation="{record}">
          <div>
            <a href="javascript:;" class="btn" :data-id="record.id" :data-sub-type-code="record.subTypeCode" :data-device-type="record.deviceType" :data-sub-type-name="record.subTypeName" :data-online="record.online" :data-logo-url="record.logoUrl" @click="editRecord">编辑</a>
            <a-popconfirm
              title="您确定要删除该条设备名称吗?"
              ok-text="确定"
              cancel-text="取消"
              @confirm="() => confirmDelete(record.id)"
              @cancel="cancel"
            >
              <a class="btn" :id="record.id" href="#">删除</a>
            </a-popconfirm>
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
          :hideOnSinglePage="hideOnSinglePage"
          @change="change"
          :show-quick-jumper="showQuickJumper"
        ></a-pagination>
      </div>
    </div>
    <a-modal
      class="modal"
      :width="480"
      v-model:visible="state.visible"
      :title="state.editable ? '添加设备名称' : '编辑设备名称'"
      okText="确定"
      cancelText="取消"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <a-form
        ref="formRef"
        :model="modalState"
        :rules="rules"
        :hideRequiredMark="true"
      >
        <a-form-item ref="subTypeName" name="subTypeName" label="设备名称:">
          <a-input style="width: 328px" v-model:value="modalState.subTypeName" placeholder="请输入设备名称"></a-input>
        </a-form-item>
        <a-form-item ref="subTypeName" name="subTypeName" label="设备编码:">
          <a-input style="width: 328px" v-model:value="modalState.subTypeCode" placeholder="请输入设备编码"></a-input>
        </a-form-item>
        <a-form-item ref="deviceType" name="deviceType" label="设备类型:">
          <a-select style="width: 328px" v-model:value="modalState.deviceType" placeholder="请选择设备类型">
            <a-select-option v-for="item in state.types" :key="item.value" :value="item.value">{{ item.text }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item ref="online" name="online" label="物联设备:">
          <a-select style="width: 104px" v-model:value="modalState.online" placeholder="请选择">
            <a-select-option key="1" value="1">是</a-select-option>
            <a-select-option key="2" value="2">否</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item style="margin-bottom: 0" ref="deviceBrand" name="deviceBrand" label="设备图标:">
          <a-upload
            v-model:file-list="modalState.logoUrl"
            name="avatar"
            list-type="picture-card"
            class="avatar-uploader"
            :show-upload-list="false"
            :before-upload="beforeUpload"
            :customRequest="handleRequest"
            @change="handleChange"
          >
          <img v-if="modalState.logoUrl" :src="modalState.logoUrl" class="device-icon" alt="deviceicon" />
          <div v-else>
            <loading-outlined v-if="loading"></loading-outlined>
            <plus-outlined v-else></plus-outlined>
            <div class="ant-upload-text">上传图片</div>
          </div>
        </a-upload>
        <i class="tip">支持.jpg/.png格式文件大小50kb以内</i>
        </a-form-item>
      </a-form>
    </a-modal>
    <!-- <a-modal
      class="modal"
      :width="480"
      v-model:visible="state.typeVisible"
      title="添加设备类型"
      okText="确定"
      cancelText="取消"
      @ok="handleTypeOk"
      @cancel="handleTypeCancel"
    >
      <a-form>
        <a-form-item label="设备类型">
          <a-input type="text" v-model:value="typeModal." placeholder="请输入设备类型"></a-input>
        </a-form-item>
      </a-form>
    </a-modal> -->
  </div>
</template>

<script>
import { reactive, computed, onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import { message } from 'ant-design-vue'
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons-vue'
import { getDictByCode } from '@/api/dictcode'
import { uploadFile } from '@/api/common'

const columns = [{
  title: '序号',
  dataIndex: 'id',
  key: 'id'
}, {
  title: '设备类型',
  dataIndex: 'deviceType_dictText',
  key: 'deviceType_dictText'
}, {
  title: '设备名称',
  dataIndex: 'subTypeName',
  key: 'subTypeName'
}, {
  title: '物联网设备',
  dataIndex: 'online',
  key: 'online',
  slots: {
    customRender: 'online'
  }
}, {
  title: '设备图标',
  dataIndex: 'logoUrl',
  key: 'logoUrl',
  slots: {
    customRender: 'logo'
  }
}, {
  title: '操作',
  dataIndex: 'operation',
  slots: {
    customRender: 'operation'
  }
}]

export default {
  components: {
    PlusOutlined,
    LoadingOutlined
  },
  setup(props, context) {
    const store = useStore()
    const formRef = ref()
    const formState = reactive({
      deviceType: '',
      subTypeName: '',
      online: ''
    })
    const state = reactive({
      visible: false,
      editable: false,
      columns,
      types: [],
      typeVisible: false
    })

    const modalState = reactive({
      id: '',
      deviceType: '',
      subTypeCode: '',
      subTypeName: '',
      online: '',
      logoUrl: ''
    })

    const rules = {
      subTypeName: [
        {
          required: true,
          message: '',
          trigger: 'blur'
        }
      ],
      subTypeCode: [
        {
          required: true,
          message: '',
          trigger: 'blur'
        }
      ],
      deviceType: [
        {
          required: true,
          message: '',
          trigger: 'change'
        }
      ],
      online: [
        {
          required: true,
          message: '',
          trigger: 'change'
        }
      ],
      logoUrl: [
        {
          required: true,
          message: '',
          trigger: 'change'
        }
      ]
    }

    onMounted(() => {
      const params = {
        pageNo: 1,
        pageSize: 10
      }
      getDictByCode('device_type').then(res => {
        if (res && res.success && res.result.length > 0) {
          state.types = res.result
        } else {
          message.error('获取设备类型失败', 1)
        }
      }).catch(error => { console.log(error) })
      store.dispatch('device/getDeviceTypeList', {
        payload: params
      })
    })

    const handlePageChange = (page, pageSize) => {
      const params = {
        ...formState,
        pageNo: page,
        pageSize
      }
      store.dispatch('device/getDeviceTypeList', {
        payload: params
      })
    }

    const handleFinish = values => {
      const params = {
        ...formState,
        pageNo: 1,
        pageSize: 10
      }
      store.dispatch('device/getDeviceTypeList', {
        payload: params
      })
    }

    const reset = () => {
      formState.deviceType = ''
      formState.subTypeName = ''
      formState.online = ''
      const params = { pageNo: 1, pageSize: 10 }
      store.dispatch('device/getDeviceTypeList', {
        payload: params
      })
    }

    const handleCancel = () => {
      modalState.subTypeName = ''
      modalState.deviceType = ''
      modalState.online = '2'
      modalState.logoUrl = ''
      modalState.id = ''
      modalState.subTypeCode = ''
      state.visible = false
      // formRef.value.resetFields()
    }

    const addSubType = () => {
      getDictByCode('device_type').then(res => {
        if (res && res.success && res.result.length > 0) {
          state.types = res.result
          modalState.online = '2'
          modalState.deviceType = res.result[0].value
          state.editable = false
          state.visible = true
        } else {
          message.error('获取设备类型失败', 1)
        }
      }).catch(error => { console.log(error) })
    }

    const reload = () => {
      formState.subTypeName = ''
      formState.deviceType = ''
      formState.online = ''
      store.dispatch('device/getDeviceTypeList', {
        payload: {
          pageNo: 1,
          pageSize: 10
        }
      })
    }

    const handleOk = () => {
      formRef.value.validate().then(() => {
        const params = modalState
        store.dispatch('device/addDeviceSubType', {
          payload: params
        }).then(res => {
          if (res && res.success) {
            message.success(res.result, 1, () => {
              reload()
              state.visible = false
              modalState.id = ''
              modalState.deviceType = ''
              modalState.logoUrl = ''
              modalState.online = '2'
              modalState.subTypeCode = ''
              modalState.subTypeName = ''
            })
          } else {
            message.error(res.result || state.editable ? '编辑失败' : '创建失败', 1)
          }
        })
      }).catch(error => {
        console.log(error)
      })
    }

    const editRecord = ({ target }) => {
      const { id, logoUrl, subTypeName, deviceType, online, subTypeCode } = target.dataset || {}
      getDictByCode('device_type').then(res => {
        if (res && res.success && res.result.length > 0) {
          state.types = res.result
          modalState.deviceType = deviceType
          modalState.subTypeName = subTypeName
          modalState.online = online
          modalState.id = id
          modalState.logoUrl = logoUrl
          modalState.subTypeCode = subTypeCode
          state.editable = true
          state.visible = true
          state.editable = false
          state.visible = true
        } else {
          message.error('获取设备类型失败', 1)
        }
      }).catch(error => { console.log(error) })
    }

    const confirmDelete = (id) => {
      store.dispatch('device/deleteDeviceSubType', {
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

    const addType = () => {
      state.typeVisible = true
    }

    const handleChange = info => {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList)
      }

      if (info.file.status === 'done') {
        // message.success(`${info.file.name} file uploaded successfully`)
      } else if (info.file.status === 'error') {
        message.error(` 设备图标 [${info.file.name}] 上传失败.`)
      }
    }

    const beforeUpload = (file) => {
      const size = 50 * 1024
      const types = ['jpg', 'png']
      if (file && file.size > size) {
        // 大小超过限制，需要压缩
        message.warn('图片大小超过50KB，请压缩', 1)
        return false
      }
      let flag = false
      types.forEach(type => {
        if (file.type.includes(type)) {
          flag = true
        }
      })
      if (flag === false) {
        message.warn('请上传支持的图片格式', 1)
        return false
      }
      return true
    }

    const handleRequest = (file) => {
      const formData = new FormData()
      formData.append('file', file.file)
      uploadFile(formData).then(res => {
        if (res && res.success) {
          modalState.logoUrl = res.result
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
      subTypeList: computed(() => store.state.device.deviceTypeList),
      pagination: computed(() => ({
        total: store.state.device.deviceTypeList.total,
        pageSize: 10,
        pageNo: store.state.device.deviceTypeList.pageNo
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
      addSubType,
      editRecord,
      confirmDelete,
      addType,
      beforeUpload,
      handleChange,
      handleRequest
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
    .form-item {
      margin-right: 24px;
      .inpt {
        width: 240px;
      }
      .select {
        width: 104px;
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
    .btns {
      button {
        margin-left: 8px;
      }
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
  .icon-img {
    position: absolute;
    width: 32px;
    margin-top: -16px;
  }
}
.ant-form-item {
  margin-bottom: 12px;
}
i.tip {
  position: absolute;
  width: 140px;
  font-style: normal;
  color: rgba(0, 0, 0, 0.4);
  line-height: 20px;
}
.device-icon {
  width: 102px;
  height: 102px;
}
</style>
