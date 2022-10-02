<template>
    <div>
      <Cascader v-model:value="selectedOptions" :disabled='disabled' :options="options" @change="returnInfo" placeholder="请填写省市信息" />
    </div>
</template>

<script>
import { regionData, CodeToText, TextToCode } from 'element-china-area-data'
import { Cascader } from 'ant-design-vue'
import { defineComponent, reactive, computed, toRefs } from 'vue'
export default defineComponent({
  props: {
    addressInfo: Array,
    disabled: Boolean,
    modelValue: Array
  },
  setup(props, ctx) {
    console.log(props, ctx, 'props, ctx')
    const options = reactive(regionData)
    const propsData = toRefs(props)
    console.log(propsData.modelValue, 8866)
    const selectedOptions = computed({
      get () {
        console.log(propsData.modelValue.value[0], 'propsData.modelValuepropsData.modelValue')
        if (propsData.modelValue.value && propsData.modelValue.value.length && propsData.modelValue.value[0] && propsData.modelValue.value[1]) {
          const province = propsData.modelValue.value[0]
          const city = propsData.modelValue.value[1]
          const area = propsData.modelValue.value[2]
          console.log([TextToCode[province].code, TextToCode[province][city].code, TextToCode[province][city][area].code], 888888999)
          return [TextToCode[province].code, TextToCode[province][city].code, TextToCode[province][city][area].code]
        } else {
          return []
        }
      },
      set (value) {
        return value
      }
    })
    const returnInfo = (value) => {
      console.log(ctx, 8888)
      ctx.emit('update:modelValue', [CodeToText[value[0]], CodeToText[value[1]], CodeToText[value[2]]])
    }
    const printData = () => {
      console.log(propsData.modelValue, 77777, selectedOptions, 88888)
    }
    return {
      options,
      selectedOptions,
      returnInfo,
      printData
    }
  },
  components: {
    Cascader
  }
})
</script>
