<template>
  <div class="test-btns">
    {{ state.abc }}
    <div style="width: 300px;margin-top: 10px;background-color: #ffffff">
      <a-button type="primary">添加区域</a-button>
      <div style="margin-top: 10px">
        <a-input-search v-model:value="state.searchValue" style="margin-bottom: 8px" placeholder="请输入搜索关键字"/>
      </div>
      <div>

        <a-tree :tree-data="state.treeData">
          <template v-slot:custom="{item}" >
            {{item.title}}
          </template>
          <template v-slot:title="item">
            <div class="item-row-bg" @mouseover="itemRowBgMouseover($event,item)"></div>
            <span class="node-title">{{ item.title }} </span>
            <span class="icon-wrap clearfix">
              <span class="icon-item">
                <img src="../../assets/images/tree/icon_edit.png"/>
              </span>
              <span class="icon-item">
                <img src="../../assets/images/tree/icon_add.png"/>
              </span>
              <span class="icon-item">
                <img src="../../assets/images/tree/icon_delete.png"/>
              </span>
            </span>
          </template>
        </a-tree>

      </div>
    </div>
  </div>
</template>

<script>
import { reactive } from 'vue'
import { Tree } from 'ant-design-vue'

export default {
  components: {
    'a-tree': Tree
  },
  setup(props, context) {
    const state = reactive({
      abc: 'abcd',
      searchValue: '',
      treeData: [
        {
          title: '市南区',
          key: '370202'
        }, {
          title: '市北区',
          key: '370203'
        }, {
          title: '即墨区',
          key: '370215',
          children: [
            {
              title: '0-0-0',
              key: '0-0-0',
              children: [
                {
                  title: '0-0-0-0',
                  key: '0-0-0-0'
                },
                {
                  title: '0-0-0-1',
                  key: '0-0-0-1'
                },
                {
                  title: '0-0-0-2',
                  key: '0-0-0-2'
                }
              ]
            },
            {
              title: '0-0-1',
              key: '0-0-1',
              children: [
                {
                  title: '0-0-1-0',
                  key: '0-0-1-0'
                },
                {
                  title: '0-0-1-1',
                  key: '0-0-1-1'
                },
                {
                  title: '0-0-1-2',
                  key: '0-0-1-2'
                }
              ]
            }]
        }
      ]
    })

    const itemRowBgMouseover = (e, item) => {
      console.log(e.target)
    }
    return {
      state,
      itemRowBgMouseover
    }
  }
}
</script>

<style scoped>
:deep() .ant-tree {
  overflow: hidden;
}

:deep() .ant-tree li {
  position: relative;
}

.item-row-bg {
  position: absolute;
  width: 200%;
  height: 25px;
  left: -100%;
  z-index: 1;
}

:deep() ul.ant-tree li:hover > .ant-tree-node-content-wrapper > .ant-tree-title > .item-row-bg:empty {
  background: rgba(102, 119, 240, 0.2);
  border-radius: 2px;
}

:deep() ul.ant-tree li:hover > .ant-tree-node-content-wrapper > .ant-tree-title > .icon-wrap {
  display: inline-block;
}

.icon-wrap {
  position: absolute;
  right: 0px;
  display: none;
}

.icon-wrap .icon-item {
  float: left;
  margin: 5px 3px;
  display: flex;
}

.icon-wrap .icon-item img {
  align-self: center;
}

:deep() .ant-tree-switcher {
  z-index: 2;
}

:deep() .ant-tree li .ant-tree-node-content-wrapper:hover,
:deep() .ant-tree li .ant-tree-node-selected {
  background-color: unset;
}

</style>
