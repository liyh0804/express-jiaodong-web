<template>
  <a-form
    layout="vertical"
    class="device-edit-form"
    ref="refForm"
    :rules="rules"
    :model="formState"
    @finish="handleFinish"
  >
    <fieldset>
      <div class="info base-info">
        <h1>基本信息</h1>
        <div class="content">
          <fieldset class="form-item-wrap">
            <a-form-item class="form-item" label="设备分类" name="devType">
              <a-select class="select" @change="handleTypeChange" v-model:value="formState.devType" placeholder="请选择设备分类">
                <a-select-option value="">请选择设备分类</a-select-option>
                <a-select-option v-for="type in state.types" :key="type.value" :value="type.value">{{type.title}}</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item class="form-item" label="设备名称" name="devSubType">
              <a-select class="select" v-model:value="formState.devSubType" @change="hanleSubTypeChange" placeholder="请选择设备名称">
                <a-select-option value="">请选择设备名称</a-select-option>
                <a-select-option v-for="subType in subTypeList" :key="subType.id" :value="subType.subTypeCode" :code="subType.subTypeCode">{{ subType.subTypeName }}</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item class="form-item" label="生产厂家" name="devCompanyId">
              <a-select class="inpt" v-model:value="formState.devCompanyId" @change="handleFactoryChange" placeholder="请选择生产厂家">
                <a-select-option value="">请选择生产厂家</a-select-option>
                <a-select-option v-for="factory in factoryList" :key="factory.id" :value="factory.id" :brand="factory.deviceBrand">{{factory.deviceCompanyName}}</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="品牌" name="deviceBrand">
              <!-- <a-select class="inpt" placeholder="请选择品牌">
                <a-select-option value="">全部</a-select-option>
              </a-select> -->
              <a-input v-model:value="formState.deviceBrand" disabled></a-input>
            </a-form-item>
          </fieldset>
          <fieldset class="form-item-wrap">
            <a-form-item class="form-item" label="设备型号" name="deviceModel">
            <a-input class="inpt" v-model:value="formState.deviceModel" placeholder="请输入设备型号"></a-input>
          </a-form-item>
          <a-form-item class="form-item" label="设备序列号" name="devSn">
            <a-input class="inpt" v-model:value="formState.devSn" placeholder="请输入设备序列号"></a-input>
          </a-form-item>
          <a-form-item class="form-item" label="生产日期" name="productDate">
            <a-date-picker v-model:value="formState.productDate" placeholder="请选择生产日期" />
            <!-- <a-select class="inpt" placeholder="">全部</a-select> -->
          </a-form-item>
          <a-form-item class="form-item" label="有效期" name="invalidDate">
            <a-date-picker v-model:value="formState.invalidDate" placeholder="请选择有效期" />
            <!-- <a-select class="inpt" placeholder="">全部</a-select> -->
          </a-form-item>
          </fieldset>
        </div>
      </div>
    </fieldset>
    <fieldset>
      <div class="info other-info">
        <h1>其他</h1>
        <div class="content">
          <fieldset class="form-item-wrap">
            <a-form-item class="form-item" label="检验报告" name="reportUrl">
              <div class="in-row">
                <div v-if="formState.reportUrl"><a class="report-link" :href="formState.reportUrl" target="_blank">检查报告</a></div>
                <a-upload
                  name="file"
                  class="file-upload"
                  :fileList="fileList"
                  :multiple="false"
                  :headers="headers"
                  :beforeUpload="beforeUpload"
                  :customRequest="handleRequest"
                  @change="handleChange"
                >
                  <!-- action="http://localhost:8080/api/firefighting-system/upload/uploadFile" -->
                  <a-button>
                    <!-- <upload-outlined></upload-outlined> -->
                    <i class="iconfont icon-upload">&nbsp;&nbsp;上传附件</i>
                  </a-button>
                </a-upload>
                <i>支持 word/PDF 格式文件，大小500kb以内</i>
              </div>
            </a-form-item>
          </fieldset>
        </div>
      </div>
    </fieldset>
    <!-- <fieldset>
      <a-form-item>
        <a-buttom>取消</a-buttom>
        <a-button @click="onSubmit" type="primary">提交</a-button>
      </a-form-item>
    </fieldset> -->
  </a-form>
  <div class="btn-wrap">
    <a-button>取消</a-button>
    <a-button type="primary" @click="onSubmit">提交</a-button>
  </div>
</template>

<script>
import { onMounted, reactive, computed, ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'
import moment from 'moment'
import { getDictByCode } from '@/api/dictcode'
import { uploadFile } from '@/api/common'
import { message } from 'ant-design-vue'

export default {
  setup() {
    const store = useStore()
    const state = reactive({
      types: []
    })
    const formState = reactive({
      id: '',
      devType: '',
      devSubType: '',
      devCompanyId: '',
      subTypeCode: '',
      deviceBrand: '',
      deviceModel: '',
      devSn: '',
      productDate: '',
      invalidDate: '',
      reportUrl: ''
    })
    const fileList = ref([])
    const router = useRouter()
    const route = useRoute()
    const refForm = ref()
    const rules = {
      devType: [
        {
          required: true,
          message: '',
          trigger: 'change'
        }
      ],
      devSubType: [
        {
          required: true,
          message: '',
          trigger: 'change'
        }
      ],
      devCompanyId: [
        {
          required: true,
          message: '',
          trigger: 'change'
        }
      ],
      deviceBrand: [
        {
          required: true,
          message: '',
          trigger: 'change'
        }
      ],
      deviceModel: [{
        required: true,
        message: '',
        trigger: 'blur'
      }],
      devSn: [{
        required: true,
        message: '',
        trigger: 'blur'
      }],
      productDate: [
        {
          required: true,
          message: '',
          trigger: 'change',
          type: 'object'
        }
      ],
      invalidDate: [
        {
          required: true,
          message: '',
          trigger: 'change',
          type: 'object'
        }
      ],
      reportUrl: [
        {
          required: true,
          message: '',
          trigger: 'change'
        }
      ]
    }
    onMounted(() => {
      // const params = { pageNo: 1, pageSize: 10 }
      // store.dispatch('device/getDeviceList', {
      //   payload: params
      // })
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
      console.log(route)
      const { deviceId } = route.query || {}
      store.dispatch('device/getDeviceDetailById', {
        payload: {
          id: deviceId
        }
      }).then(res => {
        if (res && res.success) {
          // 根据选择的设备分类，查询子分类
          const { result = {} } = res || {}
          handleTypeChange(result.devType)
          formState.id = result.id
          formState.devType = result.devType
          formState.devSubType = result.devSubType
          formState.devCompanyId = result.devCompanyId
          formState.deviceBrand = result.deviceBrand
          formState.deviceModel = result.deviceModel
          formState.devSn = result.devSn
          formState.reportUrl = result.reportUrl
          formState.productDate = moment(result.productDate, 'YYYY-MM-DD')
          formState.invalidDate = moment(result.invalidDate, 'YYYY-MM-DD')
        }
      })
    })

    const handleTypeChange = (value) => {
      formState.subTypeCode = ''
      store.dispatch('device/getSubTypeListByDeviceType', {
        payload: {
          deviceType: value
        }
      })
    }

    const handleFactoryChange = (value, option) => {
      formState.deviceBrand = option.brand
    }

    const onSubmit = (values) => {
      refForm.value.validate().then(() => {
        const params = {
          ...formState
        }
        params.invalidDate = formState.invalidDate.format('YYYY-MM-DD')
        params.productDate = formState.productDate.format('YYYY-MM-DD')
        params.devName = formState.devSubType + formState.devSn
        store.dispatch('device/saveDeviceInfo', {
          payload: params
        }).then(res => {
          if (res && res.success) {
            router.push('/device-manage/list')
          } else {
            message.error(res.message || '创建失败', 2)
          }
        })
      })
    }

    const hanleSubTypeChange = (value, record) => {
      if (value) {
        formState.subTypeCode = record.code
      } else {
        formState.subTypeCode = ''
      }
    }

    const handleChange = info => {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList)
      }
      let resFileList = [...info.fileList]
      resFileList = resFileList.slice(-1)
      resFileList = resFileList.map(file => {
        if (file.response) {
          file.url = file.response.url
        }
        return file
      })
      fileList.value = resFileList
      if (info.file.status === 'done') {
        // message.success(`${info.file.name} file uploaded successfully`)
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} 文件上传失败.`)
      }
    }

    const handleRequest = (file) => {
      const formData = new FormData()
      formData.append('file', file.file)
      uploadFile(formData).then(res => {
        if (res && res.success) {
          formState.reportUrl = res.result
        } else {
          message.warn('上传检验报告失败', 1)
        }
      })
    }

    const beforeUpload = (file) => {
      if (file.size >= 500 * 1024) {
        message.error('文件大小不能超过500KB', 1)
        return false
      }
      const fileType = file.type && file.type.toLowerCase()
      let flag = false
      if (fileType.includes('pdf') || fileType.includes('word')) {
        flag = true
      } else {
        message.error('仅支持pdf、word格式', 1)
      }
      return flag
    }

    return {
      state,
      formState,
      refForm,
      rules,
      fileList,
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      factoryList: computed(() => store.state.device.factoryBrandList.list),
      subTypeList: computed(() => store.state.device.subTypeList),
      handleTypeChange,
      handleFactoryChange,
      onSubmit,
      beforeUpload,
      handleChange,
      handleRequest,
      hanleSubTypeChange
    }
  }
}
</script>

<style lang="less" scoped>
.device-edit-form {
  .info {
    background-color: #fff;
    border-radius: 2px;
    &:first-child {
      margin-bottom: 16px;
    }
    h1 {
      height: 56px;
      padding: 16px 24px;
      margin: 0;
      font-size: 16px;
      color: #000;
      font-weight: 700;
      border-bottom: 1px solid rgba(0, 0, 0, .05);
    }
    .content {
      padding: 24px;
      .form-item-wrap {
        display: flex;
        justify-content: flex-start;
        &:last-child .form-item {
          margin-bottom: 0;
        }
        .select {
          width: 360px;
        }
        .inpt {
          width: 166px;
        }
        .form-item {
          // padding: 0;
          margin-right: 28px;
          .in-row {
            display: flex;
            .upload {
              width: 107px;
              &.icon-upload {
                height: 107px;
              //   border: 1px solid rgba(0, 0, 0, 0.15);
              //   border-radius: 2px;
              }
            }
            i {
              font-size: 14px;
              font-style: normal;
              color: rgba(0, 0, 0, 0.4);
              margin-left: 8px;
              line-height: 32px;
            }
          }
        }
      }
    }
  }
  .ant-input[disabled] {
    color: #000;
  }
  .file-upload /deep/ .ant-upload-list {
    display: none;
  }
  .report-link {
    margin-right: 8px;
    line-height: 32px;
  }
  .has-error .file-upload button {
    border-color: #ff4d4f;
  }
}
.btn-wrap {
  position: absolute;
  width: 100%;
  bottom: 0;
  padding: 12px 24px;
  margin-left: -24px;
  height: 56px;
  background-color: #fff;
  box-shadow: 0px -1px 2px 0px rgba(0, 0, 0, 0.03);
  text-align: right;
  button {
    margin-left: 8px;
  }
}
</style>
