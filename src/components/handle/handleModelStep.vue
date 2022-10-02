<template>
  <!-- {{title}} -->
  <div class="step">
    <!-- 第一步{{title}}-{{step}} -->
    <a-steps :current="current">
      <a-step v-for="item in steps" :key="item.title" :title="item.title"/>
    </a-steps>
    <div class="steps-content">
      <!-- {{ steps[current].content }} -->
      <stepOne
        v-if="current == 0"
        :nowchildstep="nowchildstep"
        @getpeo="getpeo"
        :typeNow="typeNow"
        :checkFlag="checkFlag"
        :weibao="weibao"
      />
      <stepTwo
        v-if="current == 1"
        :nowchildstep="nowchildstep"
        @getSureWB="getSureWB"
        @getForm="getForm"
      />
      <stepThree v-if="current == 2" :faultId="faultId" :flowStatus="flowStatus"/>
    </div>
    <div class="steps-action">
      <a class="hrefs" v-if="current < 2" @click="checkDetail()">审批详情</a>
      <!-- {{ current }},{{ nowchildstep }} -->
      <!-- <a-button @click="prev" v-if="nowchildstep > 1">上一步</a-button> -->
      <a-button
        style="margin-left: 8px"
        v-if="current == steps.length - 1 || current==0"
        type="primary"
        @click="closeBig"
      >
        好的
      </a-button>
      <a-button
        style="margin-left: 8px"
        v-if="current==1"
        type="primary"
        @click="closeBig"
      >
        取消
      </a-button>
      <a-button
        v-if="(current < steps.length - 1) && (!(nowchildstep === 2 && current===0))"
        style="margin-left: 8px"
        type="primary"
        @click="next"
      >下一步
      </a-button
      >
      <a-button
        v-if="weibao !==null"
        style="margin-left: 8px"
        type="primary"
        @click="weibaonext"
      >下一步
      </a-button>
    </div>
  </div>
  <handleModelDetail @closedialog="closedialog" :detail="detail" :faultId="faultId"/>
</template>
<script>
import { defineComponent, ref, reactive, toRefs, onMounted } from 'vue'
import stepOne from '@/components/handle/step1.vue'
import stepTwo from '@/components/handle/step2.vue'
import stepThree from '@/components/handle/step3.vue'
import { message } from 'ant-design-vue'
import handleModelDetail from '@/components/handle/handleModelDetail.vue'
import { getSceneManualCheck, getPersonSceneCheckResult, submitEventToMaintain, updateFlowStatus } from '@/api/inteli'
// import { prop } from 'vue-class-component'

export default defineComponent({
  components: {
    stepOne,
    stepTwo,
    stepThree,
    handleModelDetail
  },
  props: {
    title: String,
    flowStatus: Number,
    faultId: String,
    type: Number
  },
  setup(props, ctx) {
    // 初始化0则是第一步  1是第二步
    let statusType = 0
    let childType = 1
    if (props.flowStatus === 1 || props.flowStatus === 0) {
      statusType = 0
    } else if (props.flowStatus === 2) {
      statusType = 0
      childType = 2
    } else if (props.flowStatus === 3) {
      statusType = 1
    } else {
      statusType = 2
    }
    const current = ref(statusType)
    const typeNow = ref(statusType)
    const nowchildstep = ref(childType)
    const state = reactive({
      weibao: null,
      checkFlag: 1,
      sureWB: 1,
      form: {},
      peopleId: {
        sure: 1,
        objString: false
      },
      disChoseNext: false,
      detail: false
    })
    const getpeo = (obj) => {
      state.peopleId = obj
      console.log('是否需要巡检的状态')
      console.log(state.peopleId)
    }
    const checkDetail = () => {
      state.detail = true
    }
    const closedialog = () => {
      state.detail = false
    }
    const getSureWB = (e) => {
      console.log(e)
      state.sureWB = e
    }
    const getForm = (form) => {
      console.log(form)
      state.form = form
    }
    const closeBig = () => {
      console.log('向外传值')
      ctx.emit('closeBig')
    }
    const getWB = () => {
      window.localStorage.setItem('weibao', null)
      getPersonSceneCheckResult({ faultId: props.faultId }).then(res => {
        // console.log(res)
        state.weibao = res.result || null
        window.localStorage.setItem('weibao', JSON.stringify(state.weibao))
        console.log('维保---信息：')
        console.log(state.weibao)
      })
    }
    const weibaonext = () => {
      console.log('---tijioao--')
      const params = {
        faultId: props.faultId,
        flowStatus: 3,
        type: props.type ? props.type : undefined
      }
      updateFlowStatus(params).then(res => {
        current.value++
        nowchildstep.value = 1
        if (res.code === 200) {
          message.success('更新成功！')
          state.weibao = null
          window.localStorage.setItem('weibao', null)
          ctx.emit('getList')
        }
      })
    }
    const justOneFun = (params) => {
      getSceneManualCheck(params).then(
        (res) => {
          console.log(res)
          if (res.code === 200) {
            // current.value++
            if (params.checkFlag === 0) {
              current.value++
            } else {
              nowchildstep.value++
              typeNow.value++
            }

            console.log(current.value, nowchildstep.value, typeNow.value)
            getWB()
          }
        }
      )
    }
    const next = () => {
      const litBol = current.value === 0 && nowchildstep.value === 1
      // 第一步选择了维保
      // 第二步下一步必须
      if (
        current.value === 0 &&
        !state.peopleId.objString &&
        state.peopleId.sure === 2
      ) {
        // 没选人，给组件提个醒
        message.warning('对不起，您还未选择巡检人员！')
      } else if (current.value === 0 && state.peopleId.sure === 1) {
        // 不选人员直接维保
        state.checkFlag = 0
        console.log('没选直接维保')
        const params = {
          checkFlag: 0,
          faultId: props.faultId,
          type: props.type ? props.type : undefined
        }
        justOneFun(params)
        ctx.emit('getList')
      } else if (litBol) {
        // alert(1)
        state.checkFlag = 1
        console.log('选了人')
        console.log(state.peopleId)
        const params = {
          checkFlag: 1,
          propertyUserId: state.peopleId.objString.id,
          propertyUserName: state.peopleId.objString.userName,
          faultId: props.faultId,
          type: props.type ? props.type : undefined
        }
        console.log(params)
        justOneFun(params)
        ctx.emit('getList')
      } else {
        if (current.value === 1 && nowchildstep.value === 1) {
          let params = {}
          if (state.sureWB === 1) {
            // 不需要维保
            params = {
              maintainFlag: state.sureWB - 1,
              faultId: props.faultId,
              type: props.type ? props.type : undefined
            }
          } else {
            // 需要维保
            params = {
              maintainFlag: state.sureWB - 1,
              faultId: props.faultId,
              maintainType: state.form.type,
              maintainCompany: state.form.com,
              maintainUserId: state.form.peo,
              type: props.type ? props.type : undefined
            }
          }
          submitEventToMaintain(params).then(res => {
            console.log(res)
          })
          current.value++
          nowchildstep.value--
          ctx.emit('getList')
        }
      }
    }
    const prev = () => {
      console.log(nowchildstep.value)
      const sureBol =
        (current.value === 0 && nowchildstep.value !== 1) ||
        (current.value === 1 && nowchildstep.value !== 1)
      if (sureBol) {
        nowchildstep.value--
      } else {
        current.value--
      }
    }
    onMounted(() => {
      if (props.flowStatus === 2) {
        getWB()
      }
    })
    return {
      ...toRefs(state),
      getSureWB,
      getForm,
      weibaonext,
      getWB,
      justOneFun,
      checkDetail,
      closeBig,
      closedialog,
      typeNow,
      current,
      nowchildstep,
      getpeo,
      steps: [
        {
          title: '现场核实',
          content: '现场核实'
        },
        {
          title: '维保申请',
          content: '维保申请'
        },
        {
          title: '处理完成',
          content: '处理完成'
        }
      ],
      next,
      prev
    }
  }
})
</script>
<style scoped>
.hrefs {
  float: left;
  color: #88a2f7;
  text-decoration: underline;
}

.step {
  color: #fff;
}

.steps-content {
  margin-top: 16px;
  min-height: 200px;
  text-align: center;
  text-align: left;
  padding: 0.1rem 0 !important;
}

.steps-action {
  margin-top: 24px;
  text-align: right;
}

.ant-btn,
.content-wrap .ant-btn:focus {
  background: none;
  color: #fff;
  border-color: #6677f0;
}

.ant-btn:hover {
  background: none;
  color: #7a88ee;
  border-color: #7a88ee;
}

.ant-btn-primary,
.ant-btn-primary:focus {
  background-color: #6677f0;
  border-color: #6677f0;
  margin-right: 1em;
}

.ant-btn-primary:hover {
  background-color: #7a88ee;
  border-color: #7a88ee;
  color: #fff;
}

.ant-select-arrow {
  color: #fff !important;
}

.steps-content {
  border-top: 1px solid rgb(255 255 255 / 18%);
}
</style>
