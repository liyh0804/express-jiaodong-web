<template>
  <div class="white-back">
    <a-table :columns="columns" :data-source="state.data" @change="handleTableChange" :scroll="{ x: 1500, y: 400 }" :pagination="state.pagination">
    <template #status="{record}">
      <a-switch checked-children="启用" un-checked-children="停止" @change="changeBtn(record)" v-model:checked="record.status" />
    </template>
    <template #action="{ record }">
      <a class='textButton' @click='jumpView(record.age)'>查看详情</a>
      <a class='textButton' @click='jumpEdit(record.age)'>编辑</a>
      <a class='textButton' @click='jumpEdit(record.age)'>服务启用</a>
      <a class='textButton' @click='jumpEdit(record.age)'>服务停用</a>
      <a class='textButton' @click='jumpEdit(record.age)'>查看协议</a>
    </template>
  </a-table>
  </div>
</template>
<script>
import { defineComponent, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { getDataList } from '@/api/mochaItom'
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
    dataIndex: 'orgCode',
    key: 'age'
  },
  {
    title: '名称',
    dataIndex: 'orgName',
    key: '1',
    width: 250
  },
  {
    title: '分类',
    dataIndex: 'orgCategory',
    key: '2',
    width: 150
  },
  {
    title: '服务模式',
    dataIndex: 'cooperationModel',
    key: '3',
    width: 150
  },
  {
    title: '服务状态',
    dataIndex: 'status',
    key: '5',
    width: 150,
    slots: {
      customRender: 'statusstatus'
    }
  },
  {
    title: '详细地址',
    dataIndex: 'orgAddr',
    key: '6',
    width: 350
  },
  {
    title: '操作',
    key: 'operation',
    fixed: 'right',
    width: 390,
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
    const placement = ref('right')
    const visible = ref(true)
    const showDrawer = () => {
      visible.value = true
    }
    const onClose = () => {
      visible.value = false
    }
    const checked = ref(false)
    const router = useRouter()
    const state = reactive({
      data: [],
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
    const getTableList = async () => {
      const { current, pageSize } = state.pagination
      const params = {
        ...props.formState,
        current,
        pageSize
      }
      const { code, result } = await getDataList(params)
      if (code === 200 && result) {
        const { current, size, total, records } = result
        state.data = records || []
        state.pagination.pageSize = size
        state.pagination.current = current
        state.pagination.total = total
      }
    }
    const addServiceUnit = () => {
      router.push('/operation-manage/serviceUnitAdd')
    }
    const changeBtn = (res) => {
      console.log(res)
    }
    const handleTableChange = (pag, filters, sorte) => {
      console.log(pag, 111, filters, sorte)
      state.pagination.current = pag.current
      getTableList()
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
    onMounted(() => {
      getTableList()
    })
    return {
      placement,
      visible,
      state,
      checked,
      columns,
      router,
      changeBtn,
      getTableList,
      handleTableChange,
      jumpView,
      jumpEdit,
      addServiceUnit,
      showDrawer,
      onClose
    }
  }
})
</script>
<style lang='less' scoped>
.white-back {
  background: #fff;
  overflow: hidden;
}
.ant-table-row-cell-break-word a{
  margin-right: 20px;
}
:deep(.ant-table-thead tr th){
  color:#000000;
  font-weight: bold;
}

</style>
