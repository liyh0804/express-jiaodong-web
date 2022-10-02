<template>
  <div class='white-back'>
    <a-form
      name="custom-validation"
      ref="formRef"
      :model="formState"
      :layout='layout'
   >
    <Card title="基本信息" :bordered="true">
        <a-form-item  label="名称" class='width260'>
          <span>{{formState.pass}}</span>
        </a-form-item>
        <a-form-item  label="资质" class='width260'>
          <span>{{formState.pass}}</span>
        </a-form-item>
        <a-form-item  label="服务区域" class='width260'>
           <span>{{formState.pass2}}</span>
        </a-form-item>
        <a-form-item  label="详细地址" class="lastFormItem">
           <a-tooltip placement="topLeft">
              <template #title>
                <span>{{formState.pass3}}</span>
              </template>
              <span>{{formState.pass3}}</span>
           </a-tooltip>
        </a-form-item>
          <br>
        <a-form-item  label="合作模式" class='width260'>
          <span>{{formState.pass}}</span>
        </a-form-item>
        <a-form-item  label="公司负责人" class='width260'>
           <span>{{formState.pass}}</span>
        </a-form-item>
        <a-form-item  label="联系电话" class='width260'>
           <span>{{formState.pass}}</span>
        </a-form-item>
        <a-form-item  label="楼栋数量">
           <span>{{formState.pass}}</span>
        </a-form-item>
    </Card>
    <Card title="资质" :bordered="true">
        <a-form-item  label="资质名称" class='width260'>
          <span>{{formState.pass}}</span>
        </a-form-item>
    </Card>
    <Card title="合作协议" :bordered="true">
        <a-form-item  label="起始时间"  class='width260' >
           <span>{{formState.pass}}</span>
        </a-form-item>
        <a-form-item  label="终止时间"  class='width260'>
           <span>{{formState.pass}}</span>
        </a-form-item>
        <a-form-item  label="协议附件"  class='noMarginBottom'>
          <!--  <span>{{formState.pass}}</span> -->
          <div class='width360'>
              <Upload
                v-model:file-list="fileList"
                name="file22"
                ref='upload2'
                :multiple="true"
                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                :headers="headers"
             >
                <a-button>
                  <UploadOutlined/>
                  上传附件
                </a-button>
              </Upload>
          </div>
        </a-form-item>
    </Card>
  </a-form>
  <div class='submitFixed'>
    <a-button class='marginR8'>取消</a-button>
  </div>
</div>
</template>
<script>
import { defineComponent, reactive, ref, createVNode } from 'vue'
import { Card, Upload, Modal } from 'ant-design-vue'
import { UploadOutlined, ExclamationCircleOutlined } from '@ant-design/icons-vue'

// import locale from 'ant-design-vue/lib/locale-provider/zh_CN'

export default defineComponent({
  setup(props) {
    const formRef = ref()
    const fileList = ref([])
    const layout = ref('inline')
    const formState = reactive({
      pass: '山东省',
      pass2: ['山东省', '青岛市', '市北区'],
      pass3: '山东省青岛市李沧区十梅庵区文昌路677印象湾小区3号楼1101',
      checkPass: '',
      age: undefined
    })
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
    return {
      formState,
      formRef,
      layout,
      fileList,
      headers: {
        authorization: 'authorization-text'
      },
      showConfirm
    }
  },
  components: {
    Card,
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
  border:none;
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
.width260{
  width:265px;
}
:deep(.ant-form-item){
  display: inline-block;
  margin-right: 0px;
  // width: 265px;
}
:deep(.ant-card-body){
  margin-right: -12px;
  padding-bottom: 10px;
  padding-top: 0px;
}
// .ant-card{
//   margin-bottom: 16px;
// }
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
  // padding-bottom: 0px;
}
.marginR8{
  margin-right:8px;
}
:deep(.ant-form-item-children){
  color: rgba(0, 0, 0, 0.6);
  display: inline-block;
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
}
:deep(.lastFormItem .ant-form-item-children){
  width:220px;
}
:deep(.ant-col.ant-form-item-control-wrapper) {
  display: inline-block;
  vertical-align: middle;
  height: 36px;
}
</style>
