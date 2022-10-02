<template>
  <div class="unit-area">
    <div class="search-form">
      <Form />
    </div>
    <div class="operation-wrap">
      <div class="title">单位列表</div>
      <div class="operations">
        <a-button class="btn" @click="showBuildManage">建筑管理</a-button>
        <a-button class="btn">批量导入</a-button>
        <a-button class="btn">批量导出</a-button>
        <a-button class="btn">添加单位</a-button>
      </div>
    </div>
    <div class="table-wrap">
      <Table />
    </div>
    <div>
      <architechure-drawer :visible="state.visible" :onClose="onClose"></architechure-drawer>
    </div>
  </div>
</template>

<script>
import { reactive, onMounted } from 'vue'
import { useStore } from 'vuex'
import Form from './components/block.vue'
import Table from './components/table.vue'
import ArchitechureDrawer from './components/architechure-drawer.vue'

export default {
  name: 'AreaManage',
  components: {
    Form,
    Table,
    ArchitechureDrawer
  },
  setup(props, context) {
    const state = reactive({
      visible: false
    })
    const store = useStore()

    const reload = () => {
      const params = {
        pageNo: 1,
        pageSize: 10
      }
      store.dispatch('area/getAreaCompanyList', { payload: params })
    }

    onMounted(() => {
      reload()
    })

    const showBuildManage = () => {
      state.visible = true
    }
    const onClose = () => {
      state.visible = false
    }
    return {
      state,
      showBuildManage,
      onClose
    }
  }
}
</script>

<style lang="less" scoped>
.search-form {
  padding: 24px;
  background: #fff;
}
.operation-wrap {
  display: flex;
  justify-content: space-between;
  padding: 16px 24px;
  margin-top: 16px;
  background: #fff;
  .title {
    font-size: 16px;
    line-height: 32px;
    color: #000;
  }
  .btn {
    margin-left: 17px;
    color: rgba(0, 0, 0, .6);
  }
}
</style>
