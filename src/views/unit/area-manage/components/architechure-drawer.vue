<template>
  <a-drawer
    placement="right"
    :closable="false"
    :visible="visible"
    @close="onCancel"
    getContainer="body"
    class="drawer-wrap"
    width="400"
    :body-style="{ height: 'calc(100% - 56px)', padding: '16px 0 0' }"
  >
    <template #title>
      <div class="drawer-title">
        <h1>建筑管理 - 即墨市服装批发市场</h1>
        <a href="javascript:;" @click="onClose">
          <i class="iconfont icon-close"></i>
        </a>
      </div>
    </template>
    <div class="content">
      <div class="add-btn">
        <a-button type="primary" @click="addArea">添加区域/楼栋</a-button>
      </div>
      <div class="tree-wrap">
        <div v-for="item in state.architechure" :key="item.areaName">sss</div>
      </div>
      <div class="footer">
        <a-button @click="onCancel">取消</a-button>
        <a-button type="primary">确定</a-button>
      </div>
    </div>
  </a-drawer>
</template>

<script>
import { reactive } from 'vue'

export default {
  props: {
    visible: {
      typeof: Boolean,
      default: false
    },
    onClose: {
      typeof: Function,
      default: () => {}
    }
  },
  setup(props) {
    const state = reactive({
      visible: true,
      architechure: []
    })
    const onCancel = () => {
      props.onClose()
    }
    const addArea = () => {
      state.architechure.push({
        areaName: '',
        lantitude: -1,
        longtitude: -1,
        children: []
      })
    }
    return {
      state,
      onCancel,
      addArea
    }
  }
}
</script>

<style lang="less" scoped>
.drawer-wrap {
  .drawer-title {
    h1 {
      font-size: 16px;
      color: #000;
      font-weight: 700;
      margin: 0;
    }
    a {
      position: absolute;
      right: 24px;
      top: 16px;
      color: #cdcdcd;
      i.iconfont {
        font-size: 16px;
      }
    }
  }
  .content {
    height: calc(100% - 2px);
    .add-btn {
      margin-left: 16px;
    }
    .tree-wrap {
      height: calc(100% - 84px);
      padding: 0 24px;
      overflow: hidden;
    }
    .footer {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      height: 52px;
      padding: 0 24px;
      border-top: 1px solid #eee;
      button {
        margin-left: 8px;
      }
    }
  }
}
</style>
