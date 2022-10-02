<template>
  <div class="header-nav white-back">
    <div class="nav" :class="formState.orgType===1?'current':''" @click="changeOrgType(1)">服务单位</div>
    <div class="nav" :class="formState.orgType===2?'current':''" @click="changeOrgType(2)">维保及检测机构</div>
    <div class="nav" :class="formState.orgType===3?'current':''" @click="changeOrgType(3)">公共机构</div>
  </div>
  <div class="white-back contant-body" :class="state.togleBol? 'expand' :''">
    <a-form
      layout="inline"
      :model="formState"
    >
      <a-form-item label="所属区域">
        <a-select
          v-model:value="formState.Region"
          class='width200'
          ref="select"
        >
          <a-select-option value="">全部</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="分类">
        <a-select
          v-model:value="formState.classification"
          class='width200'
          ref="select"
        >
          <a-select-option value="">全部</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="名称">
        <a-select
          v-model:value="formState.name"
          class='width200'
          ref="select"
        >
          <a-select-option value="">全部</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item class="fl-right po-at" v-if="!state.togleBol">
        <a-button class="rest" @click="clearWindow()">重置</a-button>
        <a-button type="primary" @click="getData"> 查询 </a-button>
        <span class="search-text" @click="togle(true)"
          >展开 <DownOutlined
        /></span>
      </a-form-item>
      <a-form-item label="服务模式" v-if="state.togleBol">
        <a-select
          v-model:value="formState.serveMode"
          class='width200'
          ref="select"
        >
          <a-select-option value="">全部</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="服务状态" v-if="state.togleBol">
        <a-select
          v-model:value="formState.serveStatus"
          class='width200'
          ref="select"
        >
          <a-select-option value="">全部</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="信息采集状态" v-if="state.togleBol">
        <a-select
          v-model:value="formState.msgStatus"
          class='width144'
          ref="select"
        >
          <a-select-option value="">全部</a-select-option>
        </a-select>
      </a-form-item>
      <br/>
      <a-form-item class="fl-right po-at" v-if="state.togleBol">
        <a-button class="rest" @click="clearWindow()">重置</a-button>
        <a-button type="primary" html-type="submit"> 查询 </a-button>
        <span class="search-text" @click="togle(false)"
          >收起 <UpOutlined
        /></span>
      </a-form-item>
    </a-form>
  </div>
  <ConfigProvider :locale="state.locale">
  <div class="white-back tableContent">
    <div class="option">
      <div class="op-h">单位列表</div>
      <div class="buttons">
        <a-button class="rest" @click="showDrawer">建筑管理</a-button>
        <a-button class="rest">批量导入</a-button>
        <a-button class="rest">批量导出</a-button>
        <a-button type="primary" @click='addServiceUnit'>添加单位</a-button>
      </div>
    </div>
    <serUnit v-if="formState.orgType===1" ref='orgType' :formState="formState"/>
    <maintenanceCheck v-if="formState.orgType===2" ref='orgType' :formState="formState"/>
    <pubInstitution v-if="formState.orgType===3" ref='orgType' :formState="formState"/>
  </div>
    <Drawer
    :placement="state.placement"
    :closable="false"
    :destroyOnClose='true'
    :width='400'
    :headerStyle="{
      'color': 'red',
      'fontWeight':'bold'
    }"
    :visible="state.visible"
    @close="onClose"
  >
   <template v-slot:title>
     <span class="drawTitle">区域管理</span>
   </template>
    <p>Some contents...</p>
    <p>Some contents...</p>
    <p>Some contents...</p>
  </Drawer>
</ConfigProvider>
</template>
<script>
import { DownOutlined, UpOutlined } from '@ant-design/icons-vue'
import { defineComponent, nextTick, reactive, ref } from 'vue'
import { ConfigProvider, Drawer } from 'ant-design-vue'
import serUnit from '@/views/mochaItom/serviceunit.vue'
import maintenanceCheck from '@/views/mochaItom/maintenanceCheck.vue'
import pubInstitution from '@/views/mochaItom/pubInstitution.vue'
import { useRouter } from 'vue-router'
import locale from 'ant-design-vue/lib/locale-provider/zh_CN'
export default defineComponent({
  setup() {
    const router = useRouter()
    const orgType = ref()
    const state = reactive({
      locale: locale,
      togleBol: false,
      visible: false,
      placement: 'right'
    })
    const formState = reactive({
      Region: '',
      classification: '',
      name: '',
      serveMode: '',
      serveStatus: '',
      msgStatus: '',
      orgType: 1
    })
    const changeOrgType = (key) => {
      formState.orgType = key
    }
    const showDrawer = () => {
      state.visible = true
    }
    const getData = () => {
      nextTick(() => {
        orgType.value.getTableList()
      })
    }
    const onClose = () => {
      state.visible = false
    }
    const togle = (bol) => {
      state.togleBol = bol
    }
    const addServiceUnit = () => {
      router.push('/operation-manage/serviceUnitAdd')
    }
    return {
      state,
      formState,
      orgType,
      router,
      changeOrgType,
      togle,
      addServiceUnit,
      showDrawer,
      onClose,
      getData
    }
  },

  components: {
    serUnit,
    maintenanceCheck,
    pubInstitution,
    ConfigProvider,
    DownOutlined,
    UpOutlined,
    Drawer
  }
})
</script>
<style lang='less' scoped>
/* .header-nav{

} */
.white-back {
  background: #fff;
  overflow: hidden;
}
.header-nav {
  position: absolute;
  left: 0;
  top: 0;
  padding: 24px 24px 0;
  width: 100%;
  border-top: 1px solid #ddd;
}
.header-nav .nav {
  height: 24px;
  font-size: 16px;
  line-height: 24px;
  cursor: pointer;
  padding: 0 0 30px 0;
  border-bottom: 4px solid rgba(102, 119, 240, 0);
  float: left;
  margin-right: 32px;
  color: #000000;
}
.header-nav .nav.current {
  color: #6677f0;
  border-bottom: 4px solid rgba(102, 119, 240, 1);
  font-weight: bold;
  color: #6677F0;
}
.contant-body{
  margin-top: 54px;
  padding:24px;
  height: 80px;
  transition: height 0.4s ease;
}
.ant-btn.ant-btn-primary {
  background: #6677f0;
}
.rest {
  margin-right: 8px;
}
.fl-right.ant-row.ant-form-item {
  float: right;
  margin-right: 0px;
}
.search-text {
  cursor: pointer;
  height: 22px;
  font-size: 14px;
  font-family: MicrosoftYaHei;
  color: #6677f0;
  line-height: 22px;
  margin-left: 10px;
}
.ant-col.ant-form-item-label label {
  display: inline-block;
  width: 100px;
  text-align: right;
}
.contant-table{
  // padding: 24px;
  margin-top: 50px;
}
.textButton{
  display: inline-block;
}
.ant-btn.ant-btn-primary {
  background: #6677f0;
}
.rest {
  margin-right: 8px;
}
.fl-right.ant-row.ant-form-item {
  float: right;
  margin-right: 0px;
}
.search-text {
  cursor: pointer;
  height: 22px;
  font-size: 14px;
  font-family: MicrosoftYaHei;
  color: #6677f0;
  line-height: 22px;
  margin-left: 10px;
}
.ant-col.ant-form-item-label label {
  display: inline-block;
  width: 100px;
  text-align: right;
}
.contant-table{
  padding: 24px;
  margin-top: 24px;
}
.tableContent{
  padding: 24px;
  margin-top: 16px;
}
.option{
  overflow: hidden;
  margin-bottom: 16px;
}
.op-h{
  float: left;
}
.buttons{
  float: right;
}
.width200{
  width: 200px;
}
.width144{
  width: 144px;
}
.expand{
  height: 198px;
}
.expand .ant-row.ant-form-item{
  margin-bottom: 24px;
}
.expand .fl-right.ant-row.ant-form-item {
  margin-bottom: 0px;
}
.ant-row.ant-form-item{
  margin-right: 24px;
  margin-bottom: 0px;
}
:deep(.ant-form-item-label label){
  color:#000000;
}
:deep(.ant-col.ant-form-item-label){
  line-height: 34px;
}
:deep(.ant-col.ant-form-item-control-wrapper .ant-form-item-control){
  line-height: 34px;
}
.drawTitle{
  font-size: 16px;
  font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
  font-weight: bold;
  color: #000000;
  line-height: 24px;
}
</style>
