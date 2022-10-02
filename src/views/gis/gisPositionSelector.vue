<template>
  <div v-if="state.isShow">
    <a-modal class="gh-modal-dialog"
             wrapClassName="gh-modal-dialog-wrap"
             :title="props.title"
             width="960px"
             height="800px"
             :visible="state.isShow"
             @cancel="handleCancel"
             :destroyOnClose="true"
             :maskClosable="false"
             :keyboard="false"
             :bodyStyle="{padding:'0px'}"
    >
      <sl-gis-position-selector-Kernel @selectedInfoCallBack="selectedInfoCallBack"
                                       :address="props.address" :lnglat="props.lnglat"></sl-gis-position-selector-Kernel>
      <template #footer>
        <div class="footer-info">{{ state.selectedInfo.address }}&nbsp;{{ state.selectedInfo.lnglat }}</div>
        <a-button key="back" @click="handleCancel">取 消</a-button>
        <a-button key="submit" type="primary" @click="handleOK">确 定</a-button>
      </template>
    </a-modal>
  </div>
</template>

<script>
import { reactive, watch } from 'vue'
import GisPositionSelectorKernel from './gisPositionSelectorKernel'
import { message } from 'ant-design-vue'

export default {
  props: {
    show: {
      type: Boolean,
      default: function () {
        return false
      }
    },
    title: {
      type: String,
      default: function () {
        return ''
      }
    },
    address: {
      type: String,
      default: function () {
        return ''
      }
    },
    lnglat: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  emits: ['cancel', 'ok'],
  components: {
    'sl-gis-position-selector-Kernel': GisPositionSelectorKernel
  },
  setup(props, context) {
    const state = reactive({
      isShow: false,
      selectedInfo: {
        id: null,
        lnglat: null,
        address: null
      }
    })

    watch(
      () => props.show,
      (value, prevValue) => {
        console.log(value)
        state.isShow = value
      }
    )

    const handleCancel = () => {
      context.emit('cancel')
      state.selectedInfo = {
        lnglat: null,
        address: null
      }
    }

    const handleOK = () => {
      if (state.selectedInfo.lnglat !== null) {
        context.emit('ok', JSON.parse(JSON.stringify(state.selectedInfo)))
        state.selectedInfo = {
          lnglat: null,
          address: null
        }
      } else {
        message.error('请点击地图进行标记')
      }
    }

    const selectedInfoCallBack = (info) => {
      state.selectedInfo = info
    }

    return {
      state,
      props,
      handleOK,
      handleCancel,
      selectedInfoCallBack
    }
  }

}
</script>

<style scoped>

.footer-info {
  position: absolute;
  font-size: 14px;
  line-height: 30px;
  font-weight: bold;
}
</style>
