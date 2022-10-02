<template>

  <div class="child-1" v-if="nowchildstep == 1">
     <a-radio-group v-model:value="step2value" @change="changeValue">
        <a-radio :style="radioStyle" :value="1">不需要发起维保申请</a-radio>
        <a-radio :style="radioStyle" :value="2">需要发起维保申请</a-radio>
      </a-radio-group>
      <div class="form content-wrap" v-if="step2value===2">
        <div class="form-row">
          <span>维保类型：</span>
          <a-select
          v-model="form.type"
          :default-value="form.type"
          style="width: 2.2rem"
          @change="handleChangetype"
        >
          <a-select-option :value="item.value" v-for="item in dictBy" :key="item.id">{{item.text}}</a-select-option>
        </a-select>

        </div>
        <div class="form-row">
          <span>维保公司：</span>
          <a-select
          v-model="form.com"
          :default-value="form.com"
          style="width: 2.2rem"
          @change="handleChangeCom"
        >
          <a-select-option :value="item.id" v-for="item in AllMaintainCompany" :key="item.id">{{item.maintainCompanyName}}</a-select-option>
        </a-select>
        </div>
        <div class="form-row">
          <span>维保人员：</span>
          <a-select
          v-model="form.peo"
          :default-value="form.peo"
          style="width: 2.2rem"
          @change="handleChangePeo"
        >
          <a-select-option :value="item.id" v-for="item in UserByCompany" :key="item.id">{{item.userName}}</a-select-option>
        </a-select>
        </div>
      </div>
  </div>
  <div class="child-1 text-center step-2" v-if="nowchildstep == 3">
    <h2 class="color-white"> 等待<span v-if="step2value===2">**维保公司**进行</span>应急维保</h2>
  </div>
</template>
<script>
import { defineComponent, ref, onMounted, toRefs, reactive } from 'vue'
import { getDictByCode, getAllMaintainCompany, getMaintainUserByCompanyId } from '@/api/inteli'
export default defineComponent({
  props: {
    nowchildstep: Number
  },
  setup(props, ctx) {
    const videoSrc = ref('https://cdn.theguardian.tv/webM/2015/07/20/150716YesMen_synd_768k_vp8.webm')
    const videoREf = ref()
    const step2value = ref(1)
    const state = reactive({
      form: {
        type: '1',
        com: '1',
        peo: '1'
      },
      dictBy: [],
      AllMaintainCompany: [],
      UserByCompany: []
    })
    const handleChangetype = (e) => {
      console.log(e)
      console.log(state.form.type)
      state.form.type = e
      getForm()
    }
    const handleChangeCom = (e) => {
      state.form.com = e
      const params = {
        companyId: state.form.com
      }
      getP(params)
      getForm()
    }
    const handleChangePeo = (e) => {
      state.form.peo = e
      getForm()
    }
    const changeValue = (e) => {
      // console.log(e.target.value)
      ctx.emit('getSureWB', e.target.value)
      getForm()
    }
    const getP = (params) => {
      getMaintainUserByCompanyId(params).then(res => {
        console.log(res)
        state.form.peo = res.result[0].id
        state.UserByCompany = res.result || []
      })
      getForm()
    }
    const getForm = () => {
      ctx.emit('getForm', state.form)
    }
    onMounted(() => {
      getDictByCode({ code: 'maintenance_type' }).then(res => {
        console.log(res)
        state.dictBy = res.result || []
        state.form.type = state.dictBy[0].value || undefined
      })
      getAllMaintainCompany().then(res => {
        console.log(res)
        state.AllMaintainCompany = res.result || []
        state.form.com = res.result[0].id || undefined
        const params = {
          companyId: state.form.com
        }
        getP(params)
      })
    })
    return {
      ...toRefs(state),
      getP,
      getForm,
      changeValue,
      handleChangetype,
      handleChangeCom,
      handleChangePeo,
      step2value,
      videoREf,
      videoSrc
    }
  }
})
</script>
<style scoped>
.child-1 {
  line-height: 0.2rem;
}
.ant-radio-wrapper {
  color: #fff;
  width: 100%;
}
p {
  font-size: 0.02rem;
  color: rgba(255, 255, 255, 0.5);
  margin: 0.1rem 0;
}
.gutter-box {
  width: 100%;
  height: 0.5rem;
  background: rgba(102, 119, 240, 0.2);
  border-radius: 2px;
  border: 1px solid #6677f0;
  padding: 0.05rem 0.1rem;
  cursor: pointer;
}
.ant-col-12 {
  padding: 0 0.04rem 0 0.04rem;
  margin-bottom: 0.08rem;
}
.ant-col-6:hover .gutter-box {
  background: rgba(102, 119, 240, 0.8);
}
.gutter-box h5 {
  color: #fff;
  margin: 0;
}
.gutter-box p {
  margin: 0;
}

.text-center {
  text-align: center;
}
.hcenter {
  padding-top: 0.8rem;
}

.dial {
  position: absolute;
  left: 0.04rem;
  top: 0;
  width: calc(100% - 0.08rem);
  height: 2.25rem;
  z-index: 2;
  background-color: rgb(102 119 240 / 32%);
}
.dial img {
  width: 0.5rem;
  height: 0.5rem;
  position: absolute;
  right: 0.1rem;
  bottom: 0rem;
}
.dial + img {
  width: 100%;
  height: 2.25rem;
}
.back{
  display: flex;
  height: 2.25rem;
  background: #333;
}
.back video{
  margin: auto;
}
.color-white{
  color: #fff;
}
.form{
  padding-top:0.2rem;
}
.form-row{
  margin: 0rem 0 0.2rem;
}
.step-2{
  line-height: 0.85rem !important;
}
</style>
