<template>
<div>
    <a-input v-model:value="modelValueCom.address" :placeHolder='placeHolderTxt' style='background: #ffffff; cursor: default' disabled >
        <template #suffix>
            <span @click="mapShow()" :style="{'cursor': editDisable? 'not-allowed': 'pointer', 'line-height': '16px'}">
                <svg t="1627991701516" class="icon" viewBox="0 0 1024 1024"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg" p-id="15161"
                    width="16"
                    height="16"
                    line-height='16'
                    >
                    <path
                        d="M512 959.469288c-10.69969 0-16.60519-1.283226-20.36584-5.689582-2.261507-2.64934-229.644237-272.535093-290.237267-403.232784-21.890566-46.818305-33.44267-97.655134-33.44267-147.265018 0-187.090049 154.331971-339.226005 344.045777-339.226005s344.045777 153.187915 344.045777 341.429183c0 56.871265-10.660804 99.841939-36.789904 148.300604C747.006362 687.675068 534.795169 950.618713 532.675902 953.24247c-2.532683 3.166109-7.055696 6.227842-20.145829 6.227842L512 959.470311zM512 272.403087c-72.959685 0-132.325771 59.365062-132.325771 132.325771S439.040315 537.054629 512 537.054629s132.325771-59.365062 132.325771-132.325771S584.959685 272.403087 512 272.403087z"
                        p-id="15162">
                    </path>
                </svg>
            </span>
        </template>
    </a-input>
    <sl-gis-position-selector :show="state.positionSelectorShow"
        @cancel="positionSelectorCancel"
        @ok="positionSelectorOK"
        :title="modelValueCom.address"
        :address="modelValueCom.address"
        :lnglat="modelValueCom.lnglat"
        >
    </sl-gis-position-selector>
</div>
</template>

<script>
import { reactive, toRef, computed } from 'vue'
import GisPositionSelector from '../../../gis/gisPositionSelector'
export default {
  props: {
    disabled: Boolean,
    modelValue: Object,
    placeHolder: String
  },
  components: {
    'sl-gis-position-selector': GisPositionSelector
  },
  setup(props, context) {
    const state = reactive({
      buildingSelectorTitle: '动态标题',
      positionSelectorTitle: '标题动态',
      positionSelectorAddress: '即墨服装批发市场',
      positionSelectorShow: false
    })
    const editDisable = toRef(props, 'disabled')
    const modelValue = toRef(props, 'modelValue')
    const placeHolders = toRef(props, 'placeHolder')
    state.positionSelectorTitle = modelValue.value.address
    state.positionSelectorAddress = modelValue.value.address
    const modelValueCom = computed({
      get () {
        if (modelValue.value) {
          return modelValue.value
        } else {
          return {}
        }
      },
      set (value) {
        return value
      }
    })
    const mapShow = () => {
      if (props.disabled) return
      state.positionSelectorShow = true
    }
    const positionSelectorOK = (selectedInfo) => {
      console.log(selectedInfo)
      // alert('地址：' + selectedInfo.address + '；经纬度：' + selectedInfo.lnglat)
      context.emit('update:modelValue', selectedInfo)
      context.emit('change', selectedInfo)
      // update:modelValue()
      state.positionSelectorShow = false
    }
    const positionSelectorCancel = () => {
      state.positionSelectorShow = false
    }
    return {
      modelValueCom,
      editDisable,
      placeHolderTxt: placeHolders.value || '详细地址',
      state,
      mapShow,
      positionSelectorOK,
      positionSelectorCancel
    }
  }
}
</script>

<style scoped lang='less'>
span svg {
  width: 100%;
  height: 100%;
  fill: lightskyblue;
}
:deep(.ant-input.ant-input-disabled){
  background: #ffffff;
  cursor: default;
  color: rgba(0, 0, 0, 0.85);
}
</style>
