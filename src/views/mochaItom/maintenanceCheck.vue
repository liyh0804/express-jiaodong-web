<template>
<ConfigProvider :locale="state.locale">
  <a-table :columns="columns" :data-source="state.data" @change="handleTableChange" :scroll="{ x: 1500, y: 400 }" style="margin-top:10px" :pagination="state.pagination">
    <template #serveStatus="{record}">
      <a-switch checked-children="启用" un-checked-children="停止" @change="changeBtn(record)" v-model:checked="record.serveStatus" />
    </template>
    <template #action="{ record }">
      <a class='textButton' @click='jumpView(record.age)'>查看详情</a>
      <a class='textButton' @click='jumpEdit(record.age)'>编辑</a>
      <!-- <a-button type="text">Text Button</a-button>
      <a-button type="text" @click='jumpView'>查看详情</a-button> -->
      <!-- <a>编辑</a> -->
    </template>
  </a-table>
</ConfigProvider>
</template>
<script>
import { defineComponent, onMounted, reactive, ref } from 'vue'
import { ConfigProvider } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import locale from 'ant-design-vue/lib/locale-provider/zh_CN'
const columns = [
  {
    title: '所属区域',
    width: 220,
    dataIndex: 'name',
    key: 'name',
    fixed: 'left'
  },
  {
    title: '编号',
    width: 200,
    dataIndex: 'age',
    key: 'age'
  },
  {
    title: '名称',
    dataIndex: 'address',
    key: '1',
    width: 250
  },
  {
    title: '分类',
    dataIndex: 'address',
    key: '2',
    width: 150
  },
  {
    title: '服务模式',
    dataIndex: 'address',
    key: '3',
    width: 150
  },
  {
    title: '信息采集状态',
    dataIndex: 'address',
    key: '4',
    width: 150
  },
  {
    title: '服务状态',
    dataIndex: 'serveStatus',
    key: '5',
    width: 150,
    slots: {
      customRender: 'serveStatus'
    }
  },
  {
    title: '详细地址',
    dataIndex: 'address',
    key: '6',
    width: 350
  },
  {
    title: '操作',
    key: 'operation',
    fixed: 'right',
    width: 160,
    slots: {
      customRender: 'action'
    }
  }
]

export default defineComponent({
  props: {
    formState: Object
  },
  setup(props) {
    const checked = ref(false)
    const router = useRouter()
    const state = reactive({
      data: [],
      locale: locale,
      pagination: {
        hideOnSinglePage: true,
        current: 1,
        pageSize: 10,
        total: 100,
        showQuickJumper: true,
        showTotal: (total, range) => `当前${range[0]}-${range[1]}条,总共 ${total} 条`,
        showSizeChange: (current, pageSize) => { console.log(current, pageSize) }
      }
    })
    const getTableList = () => {
      console.log(props.formState)
      // 所有父组件的元素全拿进来
      for (let i = 0; i < 12; i++) {
        state.data.push({
          key: i,
          name: `Edrward ${i}`,
          serveStatus: !(i % 7),
          age: 32,
          address: `London Park no. ${i}`
        })
        state.pagination.total = 12
      }
    }
    const changeBtn = (res) => {
      console.log(res)
    }
    const handleTableChange = (pag, filters, sorte) => {
      console.log(pag, 111, filters, sorte)
      state.pagination.current = pag.current
    }
    const jumpView = (row) => {
      console.log(row, 'row')
      router.push('/h')
    }
    const jumpEdit = (row) => {
      console.log(row, 'row')
      const path = '/edit'
      const query = {
        id: 100087
      }
      router.push({ path, query })
    }
    const getDataList = () => {
      console.log(props.formState, 2222)
    }
    onMounted(() => {
      getTableList()
    })
    return {
      state,
      checked,
      columns,
      router,
      changeBtn,
      getTableList,
      handleTableChange,
      jumpView,
      jumpEdit,
      getDataList
    }
  },
  components: {
    ConfigProvider
  }
})
</script>
<style lang='less' scoped>
.ant-table-row-cell-break-word a{
  margin-right: 20px;
}
:deep(.ant-table-thead tr th){
  color:#000000;
  font-weight: bold;
}
.textButton{
  display: inline-block;
}
</style>
