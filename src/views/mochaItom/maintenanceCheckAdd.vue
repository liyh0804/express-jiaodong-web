<template>
  <div class='white-back'>
    <a-form
      name="custom-validation"
      ref="formRef"
      :model="formState"
      :rules="rules"
      :layout='layout'
      @finish="handleFinish"
      @finishFailed="handleFinishFailed"
    >
    <Card title="基本信息" :bordered="false">
        <a-form-item has-feedback label="名称" name="pass">
          <a-input v-model:value="formState.pass" placeholder="请输入" :disabled='disabled' class='width360' autocomplete="off" />
        </a-form-item>
        <a-form-item has-feedback label="资质" name="pass">
          <a-select
                v-model:value="formState.pass"
                class='width166'
                :disabled='disabled'
                placeholder="请选择"
              >
            <a-select-option value="1">1</a-select-option>
            <a-select-option value="2">2</a-select-option>
            <a-select-option value="3">3</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item has-feedback label="合作模式" name="pass">
          <a-select
                v-model:value="formState.pass"
                class='width166'
                placeholder="请选择"
              >
            <a-select-option value="1">1</a-select-option>
            <a-select-option value="2">2</a-select-option>
            <a-select-option value="3">3</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item has-feedback label="服务区域" name="pass2">
          <div class='width360'>
            <provinceCity  v-model:modelValue="formState.pass2"></provinceCity>
          </div>
          <!-- <a-input v-model="formState.pass" class='width360' autocomplete="off" /> -->
        </a-form-item>
        <br>
        <a-form-item has-feedback label="详细地址" name="pass">
          <!-- <provinceCity  v-model="formState.pass2"></provinceCity> -->
          <a-input  v-model="formState.pass" class='width360' :disabled='disabled' autocomplete="off" />
        </a-form-item>
        <a-form-item has-feedback label="公司负责人" name="pass">
          <a-input v-model="formState.pass" class='width166' autocomplete="off" />
        </a-form-item>
        <a-form-item has-feedback label="联系电话" name="pass">
          <a-input v-model="formState.pass" class='width166' autocomplete="off" />
        </a-form-item>
    </Card>
    <Card title="资质" :bordered="false">
        <a-form-item has-feedback label="资质名称" name="pass">
          <a-input v-model="formState.pass" class='width166' :disabled='disabled' autocomplete="off" />
        </a-form-item>
        <a-form-item has-feedback label="资质附件" name="pass" class='noMarginBottom'>
          <!-- <a-input v-model="formState.pass" class='width166' autocomplete="off" /> -->
          <div class='width360'>
              <Upload
                v-model:file-list="fileList"
                name="file22"
                ref='upload2'
                :multiple="true"
                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                :headers="headers"
                @change="handleChange"
              >
                <a-button>
                  <UploadOutlined/>
                  上传附件
                </a-button>
              </Upload>
          </div>
        </a-form-item>
    </Card>
    <Card title="合作协议" :bordered="false">
        <a-form-item has-feedback label="起始时间" name="pass" class='noMarginBottom'>
          <a-date-picker v-model:value="formState.pass" class='width166' />
        </a-form-item>
        <a-form-item has-feedback label="终止时间" name="pass" class='noMarginBottom'>
          <a-date-picker v-model:value="formState.pass" class='width166' />
        </a-form-item>
        <a-form-item has-feedback label="协议附件" name="pass" class='noMarginBottom'>
          <!-- <a-input v-model="formState.pass" class='width166' autocomplete="off" /> -->
          <div class='width360'>
              <Upload
                v-model:file-list="fileList"
                name="file22"
                ref='upload2'
                :multiple="true"
                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                :headers="headers"
                @change="handleChange"
              >
                <a-button>
                  <UploadOutlined/>
                  上传附件
                </a-button>
              </Upload>
          </div>
        </a-form-item>
    </Card>

    <!-- <ConfigProvider :locale="state.locale">
  </ConfigProvider> -->
  </a-form>
  <div class='submitFixed'>
    <a-button  @click="printData" class='marginR8'>取消</a-button>
    <a-button type='primary' @click="printData">提交</a-button>
  </div>
</div>
</template>
<script>
import { defineComponent, reactive, ref, createVNode } from 'vue'
import { Card, message, Upload, Modal } from 'ant-design-vue'
import { UploadOutlined, ExclamationCircleOutlined } from '@ant-design/icons-vue'
import provinceCity from '@/views/mochaItom/compontents/provinceCity'
import { useRouter, useRoute } from 'vue-router'

// import locale from 'ant-design-vue/lib/locale-provider/zh_CN'

export default defineComponent({
  setup(props) {
    const router = useRouter()
    const route = useRoute()
    let disabled = ref(false)
    if (route.query.type === 'edit') {
      disabled = true
    }
    const formRef = ref()
    console.log(formRef, '999')
    const fileList = ref([])
    const layout = ref('vertical')
    const formState = reactive({
      pass: '',
      pass2: ['山东省', '青岛市', '市北区'],
      checkPass: '',
      age: undefined
    })
    const checkAge = async (rule, value) => {
      if (!value) {
        return Promise.reject('Please input the age')
      }
      if (!Number.isInteger(value)) {
        return Promise.reject('Please input digits')
      } else {
        if (value < 18) {
          return Promise.reject('Age must be greater than 18')
        } else {
          return Promise.resolve()
        }
      }
    }
    const handleChange = info => {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList)
      }
      if (info.file.status === 'done') {
        message.success(`${info.file.name} file uploaded successfully`)
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`)
      }
    }
    const validatePass = async (rule, value) => {
      if (value === '') {
        return Promise.reject('Please input the password')
      } else {
        if (formState.checkPass !== '') {
          formRef.value.validateField('checkPass')
        }

        return Promise.resolve()
      }
    }
    const validatePass2 = async (rule, value) => {
      if (value === '') {
        return Promise.reject('Please input the password again')
      } else if (value !== formState.pass) {
        return Promise.reject('error')
      } else {
        return Promise.resolve()
      }
    }
    const rules = {
      pass: [
        {
          required: true,
          validator: validatePass,
          trigger: 'change'
        }
      ],
      checkPass: [
        {
          validator: validatePass2,
          trigger: 'change'
        }
      ],
      age: [
        {
          validator: checkAge,
          trigger: 'change'
        }
      ]
    }
    const handleFinish = values => {
      console.log(values, formState)
    }
    const showConfirm = () => {
      return new Promise((resolve, reject) => {
        Modal.confirm({
          title: 'Do you Want to delete these items?',
          icon: createVNode(ExclamationCircleOutlined),
          content: createVNode(
            'div',
            {
              style: 'color:red;'
            },
            'Some descriptions'
          ),
          onOk() {
            console.log('OK')
            return resolve(true)
          },
          onCancel() {
            console.log('Cancel')
            return reject(false)
          },
          class: 'test'
        })
      })
    }
    const handleFinishFailed = errors => {
      console.log(errors)
    }
    const resetForm = () => {
      formRef.value.resetFields()
    }
    const printData = async() => {
      await showConfirm()
      console.log(formState.pass, formRef.value.validate(), 45678)
    }
    return {
      formState,
      formRef,
      rules,
      layout,
      fileList,
      disabled,
      router,
      route,
      headers: {
        authorization: 'authorization-text'
      },
      handleChange,
      printData,
      handleFinishFailed,
      handleFinish,
      resetForm,
      showConfirm
    }
  },
  components: {
    Card,
    provinceCity,
    UploadOutlined,
    Upload
  }
})
</script>
<style lang='less' scoped>
.white-back {
  // background: #fff;
  overflow: hidden;
}
:deep(.ant-card-head){
  font-size: 16px;
  font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
  font-weight: bold;
  color: #000000;
  line-height: 24px;
}
:deep(.ant-col.ant-form-item-label){
  padding-bottom: 6px;
}
:deep(.ant-form-item-label label){
  color:#000000;
}
.width166{
  width:166px;
}
.width360{
  width:360px;
}
:deep(.ant-form-item){
  display: inline-block;
  margin-right: 24px;
  // margin-bottom: 18px;
}
:deep(.ant-card-body){
  margin-right: -12px;
  padding-bottom: 10px;
  padding-top: 20px;
}
.ant-card{
  margin-bottom: 16px;
}
.noMarginBottom{
  // margin-bottom: 0px;
}
.submitFixed{
  background: #ffffff;
  height: 56px;
  line-height: 56px;
  text-align: right;
  padding-right: 24px;
}
:deep(.content-sect){
  padding-bottom: 56px;
}
.ant-form-vertical .ant-form-item{
  padding-bottom: 0px;
  margin-bottom: 0px;
}
.marginR8{
  margin-right:8px;
}
:deep(.ant-form-item-control-wrapper){
  height:52px;
}
</style>
