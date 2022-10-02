<template>
  <div class="area-tree">
    <a-spin :spinning="state.loading||state.initLoading">
      <a-button type="primary" @click="addData(null)" v-if="!props.readOnly">添加区域</a-button>
      <div style="margin-top: 10px">
        <a-input-search v-model:value="state.searchValue" style="margin-bottom: 8px" placeholder="请输入搜索关键字"/>
      </div>
      <div>

        <a-table :showHeader="false" :pagination="false" v-if="!state.initLoading"
                 :columns="state.columns" :data-source="filtered()" :defaultExpandAllRows="true"
                 @expand="expand" :customRow="rowClick" :rowClassName="rowClassName" rowKey='id'>
          <template #action="{ record }">
            <div v-if="state.editRow&&state.editRow.id===record.id"
                 :class="['table-tree-row-div','edit-row',{'all-not-children-indent':state.allRowNotChildren}]">
              <a-input @click.stop="inputClick" :id="'js-edit-input-'+record.id"
                       v-model:value="record.serviceAreaName"/>
              <!--                <a-button size="small" style="margin-right: 8px" >取消</a-button>-->
              <!--                <a-button size="small" type="primary" @click="editOK(record)">确定</a-button>-->
              <span class="icon-wrap-edit clearfix">
                  <span @click.stop="editCancel(record)" class="icon-item">
                    <svg t="1628499901777" class="icon" viewBox="0 0 1024 1024" version="1.1"
                         xmlns="http://www.w3.org/2000/svg" p-id="1760" width="16" height="16"><path
                      d="M571.7 514.1l164.9-164.9c16.3-16.3 16.3-43.1 0-59.4-16.3-16.3-43.1-16.3-59.4 0L512.3 454.7 347.4 289.8c-16.3-16.3-43.1-16.3-59.4 0-16.3 16.3-16.3 43.1 0 59.4l164.9 164.9L288 679c-16.3 16.3-16.3 43.1 0 59.4 16.3 16.3 43.1 16.3 59.4 0l164.9-164.9 164.9 164.9c16.3 16.3 43.1 16.3 59.4 0 16.3-16.3 16.3-43.1 0-59.4L571.7 514.1z"
                      p-id="1761" fill="#6677F0"></path></svg>
                  </span>
                  <span @click.stop="editOK(record)" class="icon-item">
                    <svg t="1628499835067" class="icon" viewBox="0 0 1024 1024" version="1.1"
                         xmlns="http://www.w3.org/2000/svg" p-id="1124" width="16" height="16"><path
                      d="M799.8 318.3c-16.3-16.3-43.1-16.3-59.4 0L444.8 614 287.7 456.9c-16.3-16.3-43.1-16.3-59.4 0-16.3 16.3-16.3 43.1 0 59.4L415.1 703c16.3 16.3 43.1 16.3 59.4 0l325.3-325.3c16.4-16.3 16.4-43 0-59.4z"
                      p-id="1125" fill="#6677F0"></path></svg>
                  </span>
                </span>
            </div>
            <div v-else
                 :class="['table-tree-row-div',{'all-not-children-indent':state.allRowNotChildren}]">
              <span>
                  {{ record.serviceAreaName }}
              </span>
              <span class="icon-wrap clearfix" v-if="!record.isLock&&!props.readOnly" >
                  <span class="icon-item">
                    <img @click.stop="editData(record)" src="@/assets/images/tree/icon_edit.png"/>
                  </span>
                  <span @click.stop="addData(record)" class="icon-item">
                    <img src="@/assets/images/tree/icon_add.png"/>
                  </span>
                  <a-popconfirm title="确定删除？" placement="topRight" ok-text="确定" cancel-text="取消" @confirm.stop="deleteDate(record)">
                    <span  class="icon-item">
                      <img src="@/assets/images/tree/icon_delete.png"/>
                    </span>
                  </a-popconfirm>
              </span>
            </div>
          </template>
          <!--          <template #action>-->
          <!--            <a>Delete</a>-->
          <!--          </template>-->
          <!--          <template #expandedRowRender="{ record }">-->
          <!--            <p style="margin: 0">-->
          <!--              {{ record.description }}-->
          <!--            </p>-->
          <!--          </template>-->
        </a-table>
      </div>
    </a-spin>
  </div>
</template>

<script>
import { onMounted, reactive } from 'vue'
import { useStore } from 'vuex'
import { message } from 'ant-design-vue'

export default {

  props: {
    readOnly: {
      type: Boolean,
      default: function () {
        return false
      }
    }
  },
  emits: ['onSelected'],
  setup(props, context) {
    const store = useStore()
    const state = reactive({
      searchValue: '',
      selectedRow: null,
      editRow: null,
      editNameBackup: null,
      allRowNotChildren: false,
      columns: [
        {
          title: 'serviceAreaName',
          dataIndex: 'serviceAreaName',
          key: 'serviceAreaName',
          slots: { customRender: 'action' }
        }
      ],
      initLoading: true,
      loading: false,
      treeData: []
      // treeData: [
      //   {
      //     serviceAreaName: '市南区',
      //     id: '370202'
      //   }, {
      //     serviceAreaName: '市北区',
      //     id: '370203'
      //   }, {
      //     serviceAreaName: '即墨区',
      //     id: '370215',
      //     children: [
      //       {
      //         serviceAreaName: '0-0-0',
      //         id: '0-0-0',
      //         children: [
      //           {
      //             serviceAreaName: '0-0-0-0',
      //             id: '0-0-0-0'
      //           },
      //           {
      //             serviceAreaName: '0-0-0-1',
      //             id: '0-0-0-1'
      //           },
      //           {
      //             serviceAreaName: '0-0-0-2',
      //             id: '0-0-0-2'
      //           }
      //         ]
      //       },
      //       {
      //         serviceAreaName: '0-0-1',
      //         id: '0-0-1',
      //         children: [
      //           {
      //             serviceAreaName: '0-0-1-0',
      //             id: '0-0-1-0'
      //           },
      //           {
      //             serviceAreaName: '0-0-1-1',
      //             id: '0-0-1-1'
      //           },
      //           {
      //             serviceAreaName: '0-0-1-2',
      //             id: '0-0-1-2'
      //           }
      //         ]
      //       }]
      //   }
      // ]
    })

    const filterWithParent = (data) => {
      if (!data.children) return
      for (let i = data.children.length - 1; i >= 0; i--) {
        const item = data.children[i]
        filterWithParent(item)
        if ((!item.children || item.children.length === 0) && item.serviceAreaName.indexOf(state.searchValue) === -1) {
          data.children.splice(i, 1)
        }
      }
      if (data.children.length === 0) {
        delete data.children
      }
    }

    const filtered = () => {
      state.allRowNotChildren = true
      state.treeData[0].isLock = true
      if (state.searchValue !== '') {
        const treeFilteredData = JSON.parse(JSON.stringify(state.treeData))
        for (let i = treeFilteredData.length - 1; i >= 0; i--) {
          const item = treeFilteredData[i]
          filterWithParent(item)
          if ((!item.children || item.children.length === 0) && item.serviceAreaName.indexOf(state.searchValue) === -1) {
            treeFilteredData.splice(i, 1)
          } else if (state.allRowNotChildren && item.children && item.children.length > 0) {
            state.allRowNotChildren = false
          }
        }
        return treeFilteredData
      }
      for (let i = state.treeData.length - 1; i >= 0; i--) {
        const item = state.treeData[i]
        if (state.allRowNotChildren && item.children && item.children.length > 0) {
          state.allRowNotChildren = false
        }
      }
      return state.treeData
    }

    const deleteDateWithParent = (parent, item) => {
      if (!parent.children) return false
      for (let i = parent.children.length - 1; i >= 0; i--) {
        if (parent.children[i].id === item.id) {
          parent.children.splice(i, 1)
          if (parent.children.length === 0) {
            delete parent.children
          }
          return true
        }
        if (deleteDateWithParent(parent.children[i], item)) {
          return true
        }
      }
      return false
    }

    const deleteDateSuccess = (item) => {
      state.selectedRow = null
      for (let i = state.treeData.length - 1; i >= 0; i--) {
        if (state.treeData[i].id === item.id) {
          state.treeData.splice(i, 1)
          return
        }
        if (deleteDateWithParent(state.treeData[i], item)) {
          return
        }
      }
    }

    const deleteDate = (item) => {
      console.log(item)
      store.dispatch('area/deleteAreaTree', { id: item.id }).then((res) => {
        if (res && res.success) {
          message.success('删除成功')
          deleteDateSuccess(item)
        } else {
          message.error('删除失败:' + res.message)
        }
        state.loading = false
      })
    }

    const itemRowBgMouseover = (e, item) => {
      console.log(e.target)
    }

    const expand = (e, o) => {
      console.log(e, o)
      return false
    }

    const rowClick = (record, index) => {
      return {
        onClick: (event) => {
          if (state.editRow != null) {
            editCancel(state.editRow)
          }
          if (state.selectedRow !== null && state.selectedRow.id === record.id) {
            state.selectedRow = null
          } else {
            state.selectedRow = record
          }
          context.emit('onSelected', state.selectedRow)
        }
      }
    }

    const rowClassName = (record, index) => {
      return 'table-tree-row ' + (state.selectedRow !== null && state.selectedRow.id === record.id ? 'row-selected' : '')
    }

    const addData = (item) => {
      const id = '-' + new Date().getTime()
      let parentId = ''
      const target = item || state.selectedRow
      if (target !== null) {
        parentId = target.id
        if (!target.children) {
          target.children = []
        }
        const newObj =
          {
            serviceAreaName: '新区域',
            organizationId: null,
            id: id,
            parentId: parentId
          }
        target.children.push(newObj)
        editData(newObj)
      } else {
        const newObj =
          {
            serviceAreaName: '新区域',
            organizationId: null,
            id: id
          }
        if (!state.treeData[0]) {
          newObj.parentId = 0
          state.treeData.push(newObj)
        } else {
          if (!state.treeData[0].children) {
            state.treeData[0].children = []
          }
          parentId = state.treeData[0].id
          newObj.parentId = parentId
          state.treeData[0].children.push(newObj)
        }
        editData(newObj)
      }

      expandIconClick(parentId)
    }
    /****
     * 有时候新增的展不开
     * 由于没找到展开指定行的方法 元素操作让其展开
     */
    const expandIconClick = (id) => {
      if (id === '') return
      const expandIcon = document.querySelector('tr[data-row-key="' + id + '"]>td>div.ant-table-row-expand-icon')
      if (expandIcon === null) {
        setTimeout(() => {
          expandIconClick(id)
        }, 100)
        return
      }
      console.log('找到了', expandIcon)
      if (expandIcon.className.indexOf('ant-table-row-collapsed') !== -1) {
        expandIcon.click()
      }
    }

    const editData = (item) => {
      state.selectedRow = item
      state.editRow = item
      state.editNameBackup = item.serviceAreaName
      editInputAutofocus(item.id)
    }
    /****
     * 编辑状态的input获得焦点
     */
    const editInputAutofocus = (id) => {
      const editInput = document.querySelector('#js-edit-input-' + id)
      if (editInput === null) {
        setTimeout(() => {
          editInputAutofocus(id)
        }, 100)
        return
      }
      editInput.focus()
    }
    const editCancel = (item) => {
      if (item.id.indexOf('-') === 0) {
        deleteDateSuccess(item)
      } else {
        item.serviceAreaName = state.editNameBackup
      }
      state.editRow = null
    }
    const editOkSuccess = () => {
      state.editNameBackup = null
      state.editRow = null
    }
    const editOkBeforeSuccess = () => {
      // state.editNameBackup = null
      state.editRow = null
    }
    const editOkUnSuccess = (item) => {
      state.editRow = item
    }

    const editOK = (item) => {
      state.loading = true
      if (item.serviceAreaName.replace(/(^s*)|(s*$)/g, '').length === 0) {
        message.warning('请输入区域名')
        state.loading = false
        return
      }
      state.loading = true
      editOkBeforeSuccess()
      /***
       * 虚拟的是新增 否则是修改
       */
      if (item.id.indexOf('-') === 0) {
        store.dispatch('area/addAreaTree', item).then((res) => {
          if (res && res.success) {
            message.success('新增成功')
            item.id = res.result.toString()
            editOkSuccess()
          } else {
            message.error('新增失败:' + res.message)
            editOkUnSuccess()
          }
          state.loading = false
        })
      } else {
        store.dispatch('area/editAreaTree', item).then((res) => {
          if (res && res.success) {
            message.success('修改成功')
            editOkSuccess()
          } else {
            message.error('修改失败:' + res.message)
            editOkUnSuccess()
          }
          state.loading = false
        })
      }
    }

    const load = () => {
      state.initLoading = true
      store.dispatch('area/getAreaTree', {
        id: 0
      }).then((res) => {
        if (res && res.success) {
          state.treeData = [res.result]
          console.log(state.treeData)
        } else {
          message.error('查询异常:' + res.message)
        }
        state.initLoading = false
      })
    }

    onMounted(() => {
      load()
    })

    const inputClick = () => {
      /****
       *阻止
       */
    }
    return {
      state,
      itemRowBgMouseover,
      expand,
      rowClick,
      rowClassName,
      addData,
      deleteDate,
      editData,
      editCancel,
      editOK,
      filtered,
      inputClick,
      props
    }
  }
}
</script>

<style scoped>

.icon-wrap {
  position: absolute;
  right: 0px;
  display: none;
}

.icon-wrap-edit {
  position: absolute;
  right: 0px;
}

.icon-wrap .icon-item,
.icon-wrap-edit .icon-item {
  float: left;
  margin: 5px 3px;
  display: flex;
  cursor: pointer;
  z-index: 3;
}

.icon-wrap .icon-item img
.icon-wrap-edit .icon-item svg {
  align-self: center;
}

:deep() .table-tree-row.ant-table-row-hover:not(.ant-table-expanded-row):not(.ant-table-row-selected) > td,
:deep() .table-tree-row:hover:not(.ant-table-expanded-row):not(.ant-table-row-selected) > td,
:deep() .table-tree-row.row-selected > td {
  background-color: rgba(102, 119, 240, 0.2);
}

:deep() .table-tree-row > td {
  border: none;
  padding: 7px 0px;
  transition: none;
  height: 36px;
}

:deep() .table-tree-row > td > .ant-table-row-expand-icon {
  border: none;
  background: none;
  position: relative;
  top: 3px;
  width: 16px;
  height: 16px;
}

:deep() .table-tree-row > td > .ant-table-row-expanded::after,
:deep() .table-tree-row > td > .ant-table-row-collapsed::after {
  display: block;
  content: '';
  border: 3px solid black;
  width: 0px;
  height: 0px;
  border-right-color: transparent;
  border-bottom-color: transparent;
  transition: all 0.3s;
  transform: rotate(135deg);
  position: absolute;
  left: calc(50% - 2px);
  top: calc(50% - 2px);
  transform-origin: 25% 25%;
}

:deep() .table-tree-row > td > .ant-table-row-collapsed::after {
  transform: rotate(225deg);
}

:deep() .table-tree-row > td:hover > .table-tree-row-div > .icon-wrap,
:deep() .table-tree-row.row-selected .icon-wrap {
  display: inline-block;
}

.table-tree-row-div {
  display: inline-block;
  min-height: 16px;
}

.table-tree-row-div.edit-row input {
  width: 130px;
  padding: 2px 5px;
}

.all-not-children-indent {
  margin-left: 24px;
}

:deep() .ant-table-row-level-6 .table-tree-row-div input {
  width: 100px;
}

:deep() .ant-table-row-level-7 .table-tree-row-div input {
  width: 80px;
}

:deep() .ant-table-row-level-8 .table-tree-row-div input {
  width: 70px;
}

:deep() .ant-table-row-level-9 .table-tree-row-div input {
  width: 55px;
}

:deep() .ant-table-row-level-10 .table-tree-row-div input {
  width: 30px;
}
</style>
