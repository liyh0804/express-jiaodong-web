<template>
    <div class="tip-3 text-center">
      <h2 v-if="flowStatus===4">正在处理中，你可以查看 <a @click="checkDetail()">审批详情</a></h2>
        <h2 v-if="flowStatus===5">该告警处理已完成，你可以查看 <a @click="checkDetail()">审批详情</a></h2>
    </div>
    <handleModelDetail @closedialog="closedialog"  :detail="detail" :faultId="faultId"/>
</template>
<script>
import { defineComponent, reactive, toRefs } from 'vue'
import handleModelDetail from '@/components/handle/handleModelDetail.vue'
export default defineComponent({
  components: {
    handleModelDetail
  },
  props: {
    faultId: String,
    flowStatus: Number
  },
  setup() {
    const state = reactive({
      detail: false
    })
    const checkDetail = () => {
      state.detail = true
    }
    const closedialog = () => {
      state.detail = false
    }
    return {
      ...toRefs(state),
      checkDetail,
      closedialog
    }
  }
})
</script>
<style scoped>
h2{
  color: #fff;
}
a{
  color: #88A2F7;
  text-decoration: underline;
}
.tip-3{
  padding-top: 0.5rem;
  text-align: center;
}
</style>
