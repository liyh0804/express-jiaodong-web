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
        <a-form-item has-feedback label="名称" name="orgName">
          <a-input v-model:value="formState.orgName" placeholder="请输入名称" :disabled='disabled' class='width360' autocomplete="off" />
        </a-form-item>
        <a-form-item has-feedback label="分类" name="orgCategory">
          <a-select
            v-model:value="formState.orgCategory"
            class='width166'
            placeholder="请选择分类"
            :disabled='disabled'
          >
            <a-select-option v-for='item in state.orgCategoryList' :value="item.value" :key='item.value'>{{item.label}}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item has-feedback label="服务模式" name="serviceModel">
          <a-select
                v-model:value="formState.serviceModel"
                class='width166'
                placeholder="请选择服务模式"
              >
            <a-select-option v-for='item in state.orgServiceModelList' :value="item.value" :key='item.value'>{{item.label}}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item has-feedback label="所属区域"  name="serviceAreaList" class='width360'>
          <!--
            多选版本
            <TreeSelect
                v-model:value="formState.serviceAreaList"
                style="width: 100%"
                :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                :tree-data="treeData"
                placeholder="Please select"
                tree-default-expand-all
                tree-checkable
              >
                <template #title="{ key, value }">
                  <span style="color: #08c" v-if="key === '0-0-1'">Child Node1 {{ value }}</span>
                </template>
              </TreeSelect>
           -->
             <TreeSelect
                v-model:value="value"
                style="width: 100%"
                :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                :tree-data="treeData"
                placeholder="Please select"
                tree-default-expand-all
                @select='selectTree'
              >
                <template #title="{ key, value }">
                  <span style="color: #08c" v-if="key === '0-0-1'">Child Node1 {{ value }}</span>
                </template>
              </TreeSelect>
            <!-- <provinceCity class='width360' v-model:modelValue="formState.serviceAreaList" :disabled='disabled'></provinceCity> -->
          <!-- <a-input v-model="formState.pass" class='width360' autocomplete="off" /> -->
        </a-form-item>
        <br>
        <a-form-item has-feedback label="详细地址" name="orgAddr" class='width360'>
          <!-- <provinceCity  v-model="formState.pass2"></provinceCity> -->
          <mapCom v-model:modelValue="formState.orgAddr" placeHolder='选择详细地址'></mapCom>
          <!-- <a-input  v-model:value="formState.orgAddr" class='width360' placeholder="详细地址" :disabled='disabled' autocomplete="off" /> -->
        </a-form-item>
        <a-form-item has-feedback label="建筑面积（㎡）" name="orgBuildArea">
          <a-input v-model:value="formState.orgBuildArea" placeholder="建筑面积（㎡）" class='width166' autocomplete="off" />
        </a-form-item>
        <a-form-item has-feedback label="占地面积（㎡）" name="orgPlaceArea">
          <a-input v-model:value="formState.orgPlaceArea" placeholder="占地面积（㎡）" class='width166' autocomplete="off" />
        </a-form-item>
        <a-form-item has-feedback label="楼栋数量" name="buildNum">
          <a-input v-model:value="formState.buildNum" class='width166' placeholder="楼栋数量" autocomplete="off" />
        </a-form-item>
        <a-form-item has-feedback label="结构类型"  name="structureType">
          <a-select
            v-model:value="formState.structureType"
            :disabled='disabled'
            class='width166'
            placeholder="请选择结构类型"
          >
            <a-select-option v-for='item in state.orgStructureTypeList' :value="item.value" :key='item.value'>{{item.label}}</a-select-option>
          </a-select>
        </a-form-item>
        <br>
        <a-form-item has-feedback label="最高层数（层）" name="onGroundFloor">
          <a-input v-model:value="formState.onGroundFloor" placeholder="最高层数（层）" class='width166' autocomplete="off" />
        </a-form-item>
        <a-form-item has-feedback label="地上层数（层）" name="topFloor">
          <a-input v-model:value="formState.topFloor" placeholder="地上层数（层）" class='width166' autocomplete="off" />
        </a-form-item>
        <a-form-item has-feedback label="地下层数（层）" name="underGroundFloor">
          <a-input v-model:value="formState.underGroundFloor" placeholder="地下层数（层）" class='width166' autocomplete="off" />
        </a-form-item>
        <a-form-item has-feedback label="危险源" name="haveDanger">
          <a-select
                v-model:value="formState.haveDanger"
                class='width166'
                :disabled='disabled'
                placeholder="危险源"
              >
            <a-select-option value="0">否</a-select-option>
            <a-select-option value="1">是</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item has-feedback label="耐火等级" name="fireRating">
          <a-select
                v-model:value="formState.fireRating"
                class='width166'
                placeholder="耐火等级"
                :disabled='disabled'
              >
            <a-select-option value="1">一级</a-select-option>
            <a-select-option value="2">二级</a-select-option>
            <a-select-option value="3">三级</a-select-option>
            <a-select-option value="3">四级</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item has-feedback label="重点安全单位" name="keySafeOrg">
          <a-select
                v-model:value="formState.keySafeOrg"
                class='width166'
                :disabled='disabled'
                placeholder="重点安全单位"
              >
            <a-select-option value="0">否</a-select-option>
            <a-select-option value="1">是</a-select-option>
          </a-select>
        </a-form-item>
        <br>
        <a-form-item has-feedback label="主要活动人（可选）" class='noMarginBottom'>
          <a-select
                v-model:value="formState.mainVisitor"
                class='width360'
                :disabled='disabled'
                placeholder="请选择"
              >
            <a-select-option v-for='item in state.orgMainVisitorList' :value="item.value" :key='item.value'>{{item.label}}</a-select-option>
          </a-select>
        </a-form-item>
    </Card>
    <Card title="联系方式" :bordered="false">
        <a-form-item has-feedback label="消防安全负责人姓名" name="fireSecurityOwner">
          <a-input v-model:value="formState.fireSecurityOwner" class='width166' autocomplete="off" />
        </a-form-item>
        <a-form-item has-feedback label="联系电话" name="ownerPhone">
          <a-input v-model:value="formState.ownerPhone" placeholder="联系电话" class='width166' autocomplete="off" />
        </a-form-item>
        <a-form-item has-feedback label="消防安全管理人姓名" name="fireSecurityAdmin">
          <a-input v-model:value="formState.fireSecurityAdmin" placeholder="消防安全管理人姓名" class='width166' autocomplete="off" />
        </a-form-item>
        <a-form-item has-feedback label="联系电话" name="adminPhone">
          <a-input v-model:value="formState.adminPhone" placeholder="联系电话" class='width166' autocomplete="off" />
        </a-form-item>
        <a-form-item has-feedback label="消控室地址" name="fireSecurityOffice">
          <a-input v-model:value="formState.fireSecurityOffice" :disabled='disabled' placeholder="消控室地址" class='width360' autocomplete="off" />
        </a-form-item>
        <br>
        <a-form-item has-feedback label="消控室电话" name="officePhone" class='noMarginBottom'>
          <a-input v-model:value="formState.officePhone" placeholder="消控室电话" class='width166' autocomplete="off" />
        </a-form-item>
    </Card>
    <Card title="合作协议" :bordered="false">
        <a-form-item has-feedback label="起始时间" name="agreementBt" class='noMarginBottom'>
          <a-date-picker v-model:value="formState.agreementBt" placeholder="起始时间" :disabledDate='disabledDateBt' :valueFormat="'YYYY-MM-DD'" :format="'YYYY/MM/DD'" class='width166' />
        </a-form-item>
        <a-form-item has-feedback label="终止时间" name="agreementEt" class='noMarginBottom'>
          <a-date-picker v-model:value="formState.agreementEt" placeholder="终止时间" :disabledDate='disabledDateEt' :valueFormat="'YYYY-MM-DD'" :format="'YYYY/MM/DD'" class='width166' />
        </a-form-item>
        <a-form-item has-feedback label="协议附件" name="agreementFile" class='noMarginBottom'>
          <!-- <a-input v-model="formState.pass" class='width166' autocomplete="off" /> -->
          <div class='width360'>
              <Upload
                v-model:value="formState.agreementFile"
                name="file22"
                ref='upload2'
                :multiple="false"
                :headers="headers"
                :customRequest="handleRequest"
                :showUploadList='false'
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
import { Card, message, Upload, Modal, TreeSelect } from 'ant-design-vue'
import { UploadOutlined, ExclamationCircleOutlined } from '@ant-design/icons-vue'
// import provinceCity from '@/views/mochaItom/compontents/provinceCity'
import mapCom from '@/views/mochaItom/compontents/mapPosition'
import { useRouter, useRoute } from 'vue-router'
import { getEnumList, add } from '@/api/mochaItom'
import { uploadFile } from '@/api/common'

// import locale from 'ant-design-vue/lib/locale-provider/zh_CN'
const treeData = [
  {
    title: 'Node1',
    value: '0-0',
    key: '0-0',
    children: [
      {
        value: '0-0-1',
        key: '0-0-1',
        slots: {
          title: 'title'
        }
      },
      {
        title: 'Child Node2',
        value: '0-0-2',
        key: '0-0-2'
      }
    ]
  },
  {
    title: 'Node2',
    value: '0-1',
    key: '0-1'
  }
]
export default defineComponent({
  setup(props) {
    const value = ref('0-0-2')
    const router = useRouter()
    const route = useRoute()
    let disabled = ref(false)
    if (route.query.type === 'edit') {
      disabled = true
    }
    const state = reactive({
      /**
       * 字典值数据源 start
      */
      orgCategoryList: [], // 分类
      orgCooperationModelList: [], // 合作模式
      orgMainVisitorList: [], // 主要负责
      orgStructureTypeList: [] // 结构类型
    })
    const formRef = ref()
    console.log(formRef, '999')
    const agreementFile = ref([])
    const layout = ref('vertical')
    const formState = reactive({
      orgType: 1,
      orgName: '', // 名称
      orgCategory: null, // 分类
      serviceModel: null, // 服务模式
      serviceAreaList: [], // 服务区域
      orgAddr: {
        address: '',
        lnglat: []
      }, // 详细地址
      orgBuildArea: null, // 建筑面积
      orgPlaceArea: null, // 占地面积
      buildNum: null, // 楼栋数量
      structureType: null, // 结构类型
      onGroundFloor: null, // 最高层数（层）
      topFloor: null, // 地上层数
      underGroundFloor: null, // 地下层数
      haveDanger: null, // 危险源
      fireRating: null, // 耐火等级
      keySafeOrg: null, // 重点安全单位
      mainVisitor: null, // 主要负责人（可选)
      fireSecurityOwner: null, // 消防安全负责人姓名
      ownerPhone: null, // 联系电话
      fireSecurityAdmin: null, // 消防安全管理人姓名
      adminPhone: null, // 联系电话
      fireSecurityOffice: null, // 消控室地址
      officePhone: null, // 消控室电话
      agreementBt: '', // 起始时间
      agreementEt: '', // 终止时间
      agreementFile: '' // 协议附件

    })
    const disabledDateBt = current => {
      if (formState.agreementEt) {
        return current > new Date(formState.agreementEt)
      } else {
        return false
      }
      // Can not select days before today and today
    }
    const disabledDateEt = current => {
      if (formState.agreementBt) {
        return current < new Date(formState.agreementBt)
      } else {
        return false
      }
    }
    const handleChange = info => {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.agreementFile)
      }
      if (info.file.status === 'done') {
        message.success(`${info.file.name} file uploaded successfully`)
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`)
      }
    }
    const validatePass = async (rule, value) => {
      console.log(value, 'valuevaluevalue')
      if (!(value.address && value.lnglat.length)) {
        return Promise.reject('地址信息有误,请重新选择')
      } else {
        return Promise.resolve()
      }
    }
    const rules = {
      orgName: [
        {
          required: true,
          message: '请填写名称',
          trigger: 'blur'
        }
      ],
      orgCategory: [
        {
          required: true,
          message: '请填写分类',
          trigger: 'change'
        }
      ],
      // serviceAreaNames: [
      //   {
      //     required: true,
      //     message: '所属区域不能为空',
      //     trigger: 'blur'
      //   }
      // ],
      orgAddr: [
        {
          required: true,
          validator: validatePass
        }
      ],
      orgPlaceArea: [
        {
          required: true,
          message: '请填写占地面积',
          trigger: 'blur'
        }
      ],
      buildNum: [
        {
          required: true,
          message: '请填写楼栋数量',
          trigger: 'blur'
        }
      ],
      structureType: [
        {
          required: true,
          message: '请选择结构面类型',
          trigger: 'change'
        }
      ],
      onGroundFloor: [
        {
          required: true,
          message: '请输入最高层数',
          trigger: 'blur'
        }
      ],
      topFloor: [
        {
          required: true,
          message: '请输入地上层数',
          trigger: 'blur'
        }
      ],
      underGroundFloor: [
        {
          required: true,
          message: '请输入地下层数',
          trigger: 'blur'
        }
      ],
      haveDanger: [
        {
          required: true,
          message: '请选择危险源',
          trigger: 'change'
        }
      ],
      fireRating: [
        {
          required: true,
          message: '请选择耐火等级',
          trigger: 'change'
        }
      ],
      keySafeOrg: [
        {
          required: true,
          message: '重点安全单位不能为空',
          trigger: 'change'
        }
      ],
      fireSecurityOwner: [
        {
          required: true,
          message: '消防安全负责人姓名不能为空',
          trigger: 'blur'
        }
      ],
      ownerPhone: [
        {
          required: true,
          message: '联系电话不能为空',
          trigger: 'blur'
        }
      ],
      fireSecurityAdmin: [
        {
          required: true,
          message: '消防安全管理人姓名不能为空',
          trigger: 'blur'
        }
      ],
      adminPhone: [
        {
          required: true,
          message: '联系电话不能为空',
          trigger: 'blur'
        }
      ], // 联系电话
      fireSecurityOffice: [
        {
          required: true,
          message: '消控室地址不能为空',
          trigger: 'blur'
        }
      ],
      officePhone: [
        {
          required: true,
          message: '消控室电话不能为空',
          trigger: 'blur'
        }
      ],
      agreementBt: [
        {
          required: true,
          message: '开始时间不能为空',
          trigger: 'change'
        }
      ],
      agreementEt: [
        {
          required: true,
          message: '终止时间不能为空',
          trigger: 'change'
        }
      ],
      agreementFile: [
        {
          required: true,
          message: '协议附件不能为空'
        }
      ]
    }
    const selectTree = (a, b, c) => {
      console.log(a, b, c)
      console.log(value, 88888)
    }
    const handleFinish = values => {
      console.log(values, formState)
    }
    const handleRequest = (file) => {
      console.log(file, 88888)
      const formData = new FormData()
      formData.append('file', file.file)
      uploadFile(formData).then(res => {
        console.log(res, 9999)
        formState.agreementFile = res.result
      })
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
    const printData = async () => {
      console.log(formState, 8888)
      const valid = await formRef.value.validate()
      if (!valid) return
      await showConfirm()
      const params = JSON.parse(JSON.stringify(formState))
      params.agreementBt += ' 00:00:00'
      params.agreementEt += ' 23:59:59'
      add(params).then(res => {
        console.log(res)
      })
    }
    const getDictList = () => {
      getEnumList('OrgCategory').then(res => {
        const { success, result } = res
        if (success) {
          state.orgCategoryList = result
          console.log(state.orgCategoryList, 888, 'OrgCategory')
        }
      })
      getEnumList('OrgServiceModel').then(res => {
        const { success, result } = res
        if (success) {
          state.orgServiceModelList = result
        }
      })
      getEnumList('OrgMainVisitor').then(res => {
        const { success, result } = res
        if (success) {
          state.orgMainVisitorList = result
        }
      })
      getEnumList('OrgStructureType').then(res => {
        const { success, result } = res
        if (success) {
          state.orgStructureTypeList = result
        }
      })
      /**
       * OrgCategory,
          OrgCooperationModel,
          OrgMainVisitor,
          OrgQualificationLevel,
          OrgServiceModel,
          OrgStructureType
       */
    }
    getDictList()
    return {
      value,
      state,
      formState,
      formRef,
      rules,
      layout,
      agreementFile,
      disabled,
      router,
      route,
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      disabledDateBt,
      disabledDateEt,
      handleChange,
      printData,
      handleFinishFailed,
      handleFinish,
      resetForm,
      showConfirm,
      handleRequest,
      treeData,
      selectTree
    }
  },
  components: {
    Card,
    // provinceCity,
    UploadOutlined,
    mapCom,
    Upload,
    TreeSelect
    // TreeSelectNode
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
