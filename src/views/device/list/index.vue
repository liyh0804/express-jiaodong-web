<template>
  <div class="device-manage">
    <!-- form start -->
    <div class="form-wrap">
      <a-form
      layout="inline"
      :model="formState"
      @finish="handleFinish"
    >
      <fieldset>
        <a-form-item class="form-item" label="设备分类:">
          <a-select class="select" v-model:value="formState.devType" placeholder="请选择设备类型">
            <a-select-option value="">全部</a-select-option>
            <a-select-option v-for="type in state.types" :key="type.value" :value="type.value">{{ type.title }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item class="form-item" label="设备名称:">
          <a-input class="input" v-model:value="formState.devSubType" placeholder="请输入设备名称" ></a-input>
        </a-form-item>
        <a-form-item class="form-item" label="生产厂家:">
          <a-select class="select" v-model:value="formState.devCompanyId" placeholder="请选择">
            <a-select-option value="">全部</a-select-option>
            <a-select-option v-for="item in factoryList" :key="item.id" :value="item.id">{{item.deviceCompanyName}}</a-select-option>
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
        <a-button type="link" :class="state.isExpand ? 'shouqi' : 'expand'" @click="expand">{{ state.isExpand ? '收起' : '展开' }}</a-button>
      </a-form-item>
      </fieldset>
      <fieldset v-show="state.isExpand">
        <a-form-item class="form-item" label="设备品牌:">
          <a-input class="input" v-model:value="formState.deviceBrand" type="text" placeholder="请输入">
          </a-input>
        </a-form-item>
        <a-form-item class="form-item" label="设备型号:">
          <a-input class="select" v-model:value="formState.deviceModel" placeholder="请输入设备型号"></a-input>
        </a-form-item>
        <a-form-item class="form-item" label="绑定状态:">
          <a-select class="select" v-model:value="formState.bindStatus" placeholder="请选择">
            <a-select-option value="">全部</a-select-option>
            <a-select-option value="0">未绑定</a-select-option>
            <a-select-option value="1">已绑定</a-select-option>
          </a-select>
        </a-form-item>
      </fieldset>
    </a-form>
    </div>
    <!-- form end -->
    <!-- btns start -->
    <div class="operations">
      <div class="title">设备列表</div>
      <div class="operation-btns">
        <!-- <a-button class="seperate">设备分类管理</a-button> -->
        <a-button @click="batchCreateDeviceQrCode">二维码批量生成</a-button>
        <a-button class="seperate" @click="batchDownloadDeviceQrCode">二维码批量下载</a-button>
        <a-button>批量导入</a-button>
        <a-button class="seperate">批量导出</a-button>
        <a-button type="primary" @click="addDevice">添加设备</a-button>
      </div>
    </div>
    <!-- btns end -->
    <!-- list start -->
    <div class="table">
      <a-table
        :columns="columns"
        :dataSource="deviceList.list"
        :pagination="false"
        :scroll="{ x: true }"
        :rowKey="(record, index) => `key-${record.id}-${index}`"
      >
        <template #binding="{ record }">
          <div>{{ record.bindStatus === 0 ? '未绑定' : '已绑定' }}</div>
        </template>
        <template #qrcode="{ record }">
          <div>
             <a-popover class="qrcode-popover" trigger="click">
              <template #content>
                <div class="qrcode">
                  <img :src="state.qrcode" alt="qrcode">
                  <br>
                  <a href="#" class="download" :id="record.id" @click="downQrcode">下载</a>
                </div>
              </template>
              <a-button class="qrcode" type="link" :id="record.id" :qrcode="record.qrcode" @click="viewQrcode">查看</a-button>
            </a-popover>
            <!-- <a href="javascript:;" class="qrcode">查看</a> -->
          </div>
        </template>
        <template #operation="{ record }">
          <router-link :to="{ path: '/device-manage/detail', query: { deviceId: record.id} }" class="btn" :id="record.id">详情</router-link>
          <router-link :to="{ path: '/device-manage/device-edit', query: { deviceId: record.id} }" class="btn" :id="record.id">编辑</router-link>
          <!-- <a href="javascript:;" class="btn" :data-record="record">下载二维码</a> -->
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
    <!-- list end -->
  </div>
</template>

<script>
import { reactive, ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { getDictByCode } from '@/api/dictcode'

const columns = [{
  title: '设备分类',
  dataIndex: 'devType_dictText',
  key: 'devType_dictText'
}, {
  title: '设备名称',
  dataIndex: 'deviceSubTypeName',
  key: 'deviceSubTypeName'
}, {
  title: '生产厂家',
  dataIndex: 'devCompanyName',
  key: 'devCompanyName'
}, {
  title: '品牌',
  dataIndex: 'deviceBrand',
  key: 'deviceBrand'
}, {
  title: '设备型号',
  dataIndex: 'deviceModel',
  key: 'deviceModel'
}, {
  title: '设备序列号',
  dataIndex: 'devSn',
  key: 'devSn'
}, {
  title: '创建时间',
  dataIndex: 'createTime',
  key: 'createTime'
}, {
  title: '设备绑定状态',
  dataIndex: 'bindStatus',
  key: 'bindStatus',
  slots: {
    customRender: 'binding'
  }
}, {
  title: '设备二维码',
  dataIndex: 'qrcode',
  key: 'qrcode',
  slots: {
    customRender: 'qrcode'
  }
}, {
  title: '操作',
  dataIndex: 'operation',
  key: 'operation',
  fixed: 'right',
  slots: {
    customRender: 'operation'
  }
}]

export default {
  setup() {
    const store = useStore()
    const visible = ref(false)
    const formState = reactive({
      deviceBrand: '',
      deviceModel: '',
      devSubType: '',
      devCompanyId: '',
      devType: '',
      bindStatus: ''
    })
    const state = reactive({
      isExpand: false,
      types: [],
      qrcode: ''
    })
    const router = useRouter()

    onMounted(() => {
      const params = { pageNo: 1, pageSize: 10 }
      store.dispatch('device/getDeviceList', {
        payload: params
      })
      // 获取设备生产厂家
      store.dispatch('device/getFactoryBrandList', {
        payload: { pageNo: 1, pageSize: 100000 }
      })
      // 获取设备主类型列表
      getDictByCode('device_type').then(res => {
        if (res && res.success && res.result.length > 0) {
          state.types = res.result
        }
      })
    })

    const reset = () => {
      formState.deviceBrand = ''
      formState.deviceModel = ''
      formState.devSubType = ''
      formState.devCompanyId = ''
      formState.devType = ''
      formState.bindStatus = ''
      const params = { pageNo: 1, pageSize: 10 }
      store.dispatch('device/getDeviceList', {
        payload: params
      })
    }

    const handleFinish = values => {
      const params = {
        ...formState,
        pageNo: 1,
        pageSize: 10
      }
      store.dispatch('device/getDeviceList', {
        payload: params
      })
    }

    const expand = () => {
      state.isExpand = !state.isExpand
    }

    const handlePageChange = (page, pageSize) => {
      const params = {
        ...formState,
        pageNo: page,
        pageSize
      }
      store.dispatch('device/getDeviceList', {
        payload: params
      })
    }

    const deleteModal = () => {
      visible.value = true
    }

    const addDevice = () => {
      router.push({ path: '/device-manage/device-add' })
    }

    const batchCreateDeviceQrCode = () => {
      const params = formState
      store.dispatch('device/batchCreateDeviceQrCode', { payload: params }).then(res => {
        if (res && res.success) {
          message.success(res.result || '批量生成设备二维码成功！', 1)
        } else {
          message.error(res.result || '批量生成设备二维码失败！', 1)
        }
      })
    }

    const batchDownloadDeviceQrCode = () => {
      const params = formState
      store.dispatch('device/batchDownloadDeviceQrCode', { payload: params }).then(res => {
        if (res && res.success) {
          console.log(res.result)
          window.open(res.result)
        } else {
          message.error(res.result || '批量导出设备二维码失败！', 1)
        }
      })
    }

    const viewQrcode = ({ target }) => {
      const { id, qrcode } = target || {}
      if (qrcode) {
        state.qrcode = qrcode
      } else {
        store.dispatch('device/productQrcode', {
          payload: {
            id
          }
        }).then(res => {
          if (res && res.success) {
            state.qrcode = res.result
          }
        })
      }
    }

    const downQrcode = (evt) => {
      evt.preventDefault()
      const { id } = evt.currentTarget
      debugger
      store.dispatch('device/downloadQrcode', { payload: { id } }).then(res => {
        if (res && res.success) {
          window.open(res.result)
        }
      })
    }

    return {
      formState,
      state,
      columns,
      deviceList: computed(() => store.state.device.deviceList),
      factoryList: computed(() => store.state.device.factoryBrandList.list),
      pagination: computed(() => ({
        total: store.state.device.deviceList.total,
        pageSize: 10,
        pageNo: store.state.device.deviceList.pageNo,
        showQuickJumper: {
          goButton: '页'
        },
        hideOnSinglePage: true,
        showTotal: (total, range) => `当前${range[0]}-${range[1]}条,总共 ${total} 条`,
        change: (page, pageSize) => handlePageChange(page, pageSize)
      })),
      expand,
      reset,
      handleFinish,
      deleteModal,
      addDevice,
      batchCreateDeviceQrCode,
      batchDownloadDeviceQrCode,
      viewQrcode,
      downQrcode
    }
  }
}
</script>

<style lang="less" scoped>
@import './style.less';
</style>
<style lang="less" scoped>
.qrcode-popover {
}
.qrcode {
  text-align: center;
  img {
    width: 80px;
    height: 80px;
    button {
      text-align: center;
      color: #fff;
    }
  }
}
</style>
