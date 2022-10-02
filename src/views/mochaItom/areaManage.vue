<template>
  <div>
    <a-input-search v-model:value="searchValue" style="margin-bottom: 8px" placeholder="Search" />
    <Tree
      :expandedKeys="expandedKeys"
      :auto-expand-parent="autoExpandParent"
      :tree-data="gDatas"
      @expand="onExpand"
      defaultExpandAll
    >
      <template #title="nodeData">
        <span v-if="nodeData.label.indexOf(searchValue) > -1 && searchValue">
          {{ nodeData.label.substr(0, nodeData.label.indexOf(searchValue)) }}
          <span style="color: #f50">{{ searchValue }}</span>
          {{ nodeData.label.substr(nodeData.label.indexOf(searchValue) + searchValue.length) }}
        </span>
        <span v-if='!nodeData.isEdit'>{{ nodeData.label }}</span>
        <a-input v-if='nodeData.isEdit' v-model:value='editObj.label'> </a-input>
        <a-input v-if='nodeData.isAdd' v-model:value='addObj.label'> </a-input>
        <span class='operateSet'>
          <FormOutlined @click="editNode(nodeData)" class='marginR12' style="color:#6677F0"/>
          <DeleteOutlined class='marginR12' style="color:#6677F0"/>
          <PlusSquareOutlined @click='addNode(nodeData)' class='marginR12' style="color:#6677F0"/>
        </span>
      </template>
    </Tree>
  </div>
</template>
<script>
import { defineComponent, ref, watch, reactive } from 'vue'
import { Tree } from 'ant-design-vue'
import { DeleteOutlined, PlusSquareOutlined, FormOutlined } from '@ant-design/icons-vue'
// <FormOutlined /><DeleteOutlined /><PlusSquareOutlined />
const x = 3
const y = 2
const z = 1
const genData = []

const generateData = (_level, _preKey, _tns) => {
  const preKey = _preKey || '0'
  const tns = _tns || genData
  const children = []

  for (let i = 0; i < x; i++) {
    const key = `${preKey}-${i}`
    tns.push({
      title: key,
      key
    })

    if (i < y) {
      children.push(key)
    }
  }

  if (_level < 0) {
    return tns
  }

  const level = _level - 1
  children.forEach((key, index) => {
    tns[index].children = []
    return generateData(level, key, tns[index].children)
  })
}

generateData(z)
const dataList = []

const generateList = data => {
  for (let i = 0; i < data.length; i++) {
    const node = data[i]
    const key = node.key
    dataList.push({
      key,
      title: key
    })

    if (node.children) {
      generateList(node.children)
    }
  }
}

generateList(genData)

const getParentKey = (key, tree) => {
  let parentKey

  for (let i = 0; i < tree.length; i++) {
    const node = tree[i]
    if (node.children) {
      if (node.children.some(item => item.key === key)) {
        parentKey = node.key
      } else if (getParentKey(key, node.children)) {
        parentKey = getParentKey(key, node.children)
      }
    }
  }

  return parentKey
}
const treeData = [{
  label: '一级 1',
  isEdit: false,
  children: [{
    label: '二级 1-1',
    children: [{
      label: '三级 1-1-1'
    }]
  }]
}, {
  label: '一级 2',
  children: [{
    label: '二级 2-1',
    children: [{
      label: '三级 2-1-1'
    }]
  }, {
    label: '二级 2-2',
    children: [{
      label: '三级 2-2-1'
    }]
  }]
}, {
  label: '一级 3',
  children: [{
    label: '二级 3-1',
    children: [{
      label: '三级 3-1-1'
    }]
  }, {
    label: '二级 3-2',
    children: [{
      label: '三级 3-2-1'
    }]
  }]
}]
export default defineComponent({
  setup() {
    const editObj = reactive({
      label: ''
    })
    let addObj = reactive({})
    console.log(reactive)
    const expandedKeys = ref([])
    const searchValue = ref('')
    const autoExpandParent = ref(true)
    const gData = ref(genData)
    const gDatas = reactive(treeData)
    const onExpand = keys => {
      expandedKeys.value = keys
      autoExpandParent.value = false
    }

    watch(searchValue, value => {
      // console.log(gDatas.value.tree)
      const expanded = dataList
        .map(item => {
          if (item.title.indexOf(value) > -1) {
            return getParentKey(item.key, gData.value)
          }

          return null
        })
        .filter((item, i, self) => item && self.indexOf(item) === i)
      expandedKeys.value = expanded
      searchValue.value = value
      autoExpandParent.value = true
    })
    const setEdit = (data, id) => {
      data.forEach(item => {
        if (item.label === id) {
          item.isEdit = true
        } else {
          item.isEdit = false
        }
        if (item.children && item.children.length) {
          setEdit(item.children, id)
        }
      })
    }
    const setAddStatus = (data, id) => {
      data.forEach(item => {
        if (item.label === id) {
          item.isAdd = true
        } else {
          item.isAdd = false
        }
        if (item.children && item.children.length) {
          setAddStatus(item.children, id)
        }
      })
    }
    const delAdd = (data, id) => {
      data.forEach(item => {
        if (item.label === id) {
          delete item.isAdd
        }
        if (item.children && item.children.length) {
          delAdd(item.children, id)
        }
      })
    }
    const setAdd = (data, id) => {
      console.log(data, id, 'data, id')
      data.forEach(item => {
        if (item.label === id) {
          if (item.children) {
            item.children.push(
              {
                label: ''
              }
            )
          } else {
            item.children = []
            item.children.push(
              {
                label: ''
              }
            )
          }
        } else {
          item.isEdit = false
        }
        if (item.children && item.children.length) {
          setAdd(item.children, id)
        }
      })
      setAddStatus(gDatas, '')
    }
    const addNode = (nodeData) => {
      delAdd(gDatas, nodeData.label)
      addObj = JSON.parse(JSON.stringify(nodeData))
      setAdd(gDatas, nodeData.label)
      console.log(gDatas)
    }
    const editNode = (nodeData) => {
      // nodeData.isEdit = true
      console.log(nodeData.label, 'nodeData.pos')
      // const arr = nodeData.pos.split('-')
      // arr.shift()
      // console.log(arr)
      // treeData[arr[0]].children[arr[1]].isEdit = true
      editObj.label = nodeData.label
      console.log(editObj, 'editObjeditObjeditObj')
      setEdit(gDatas, nodeData.label)
      console.log(nodeData, 'nodeDatanodeData')
    }
    return {
      expandedKeys,
      searchValue,
      autoExpandParent,
      gData,
      editObj,
      addObj,
      onExpand,
      gDatas,
      editNode,
      setEdit,
      setAdd,
      addNode,
      setAddStatus
    }
  },
  components: {
    Tree,
    DeleteOutlined,
    PlusSquareOutlined,
    FormOutlined
  }
})
</script>
<style scoped lang='less'>
  // background: rgba(102, 119, 240, 0.2);
  :deep(.ant-tree li .ant-tree-node-content-wrapper.ant-tree-node-selected){
    background: none;
    height:36px;
    line-height: 36px;
    font-size: 14px;
    background: rgba(102, 119, 240, 0.2);
  }
  :deep(.ant-tree-treenode-switcher-close.ant-tree-treenode-selected){
    // background: rgba(102, 119, 240, 0.2);
  }
  :deep(.ant-tree li .ant-tree-node-content-wrapper){
    width: 100%;
    height:36px;
    line-height: 36px;
  }
  :deep(.ant-tree li .ant-tree-node-content-wrapper):hover{
    background: rgba(102, 119, 240, 0.2);
  }
  :deep(.ant-tree li span.ant-tree-switcher, .ant-tree li span.ant-tree-iconEle){
    margin-top: 5px;
  }
  .operateSet{
    display: inline-block;
    margin-left: 150px;
  }
  .marginR12{
    margin-right:12px;
  }
</style>
