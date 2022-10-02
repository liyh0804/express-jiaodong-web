<template>
  <div class="step">
    <div class="child-1" v-if="nowchildstep === 1">
      <a-radio-group v-model:value="value" @change="changeValue">
        <a-radio :style="radioStyle" :value="1">不需要现场核实</a-radio>
        <a-radio :style="radioStyle" :value="2">内容需要现场核实</a-radio>
      </a-radio-group>
      <p v-if="value === 2">请选择去现场核实的巡检员</p>
      <a-row v-if="value === 2">
        <a-col
          class="gutter-row"
          :span="6"
          v-for="(item, index) in nameLists"
          :key="index"
        >
          <div
            class="gutter-box"
            @click="getpeo(item, index)"
            :class="choseCurrent === index ? 'current' : ''"
          >
            <h5>{{ item.userName }}</h5>
            <p>{{ item.telephone }}</p>
          </div>
        </a-col>
      </a-row>
    </div>
    <!-- <div class="child-1 text-center hcenter" v-if="nowchildstep == 2">
      等待巡检员 {{ nameLists[choseCurrent].userName }}现场核实
    </div> -->
    <!-- {{checkFlag}}-null -->
    <!-- {{nowchildstep}} -->
    <!-- {{weibao}} -->
    <div class="child-1" v-if="nowchildstep === 2 && sonweibao">
      <div class="tipsing">
        <a-row>
          <a-col :span="12">
            <a-space :size="6">
              <a-image
                width="50"
                :src="`${sonweibao.picUrl}?${random}`"
              >
                <template #placeholder>
                  <a-image
                    width="50"
                    :src="sonweibao.picUrl"
                    :preview="false"
                  />
                </template>
              </a-image>
              <!-- <div class="b-t">查看图片</div> -->
            </a-space>
          </a-col>
          <a-col :span="12">
            <div class="back">
              <video :src="sonweibao.videoUrl" controls="controls" ref="videoREf">
                您的浏览器暂时不支持视频播放
              </video>
            </div>
            <!-- <div class="b-t">查看录像</div> -->
          </a-col>
          <a-col :span="24" class="text-center">
            <h3 class="color-white">巡检员核实结果</h3>
          </a-col>
        </a-row>
      </div>
    </div>
    <div class="child-1" v-if="nowchildstep === 2  && !sonweibao">
      <!-- {{typeNow}} -->
      <!-- checkFlag -->
        <div class="child-1 text-center hcenter">
        等待巡检员现场核实/维保信息更近
      </div>

      <!-- <div class="tipsing">
        <a-row>
          <a-col :span="12">
            <a-space :size="6">
              <a-image
                width="50"
                :src="`https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png?${random}`"
              >
                <template #placeholder>
                  <a-image
                    width="50"
                    src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png?x-oss-process=image/blur,r_50,s_50/quality,q_1/resize,m_mfit,h_200,w_200"
                    :preview="false"
                  />
                </template>
              </a-image>
              <div class="b-t">查看图片</div>
            </a-space>
          </a-col>
          <a-col :span="12" @click="videoPlay()">
            <div class="back">
              <video :src="videoSrc" controls="controls" ref="videoREf">
                您的浏览器暂时不支持视频播放
              </video>
            </div>
            <div class="b-t">查看录像</div>
          </a-col>
          <a-col :span="24" class="text-center">
            <h3 class="color-white">巡检员核实结果</h3>
          </a-col>
        </a-row>
      </div> -->
    </div>
  </div>
</template>
<script>
import { defineComponent, reactive, ref, toRefs } from 'vue'
import { getUserByPropertyID } from '@/api/inteli'
export default defineComponent({
  props: {
    nowchildstep: Number,
    typeNow: Number,
    checkFlag: Number,
    weibao: Object
  },
  setup(props, ctx) {
    const value = ref(1)
    const choseCurrent = ref(null)
    // const nowStepChild = props.nowchildstep
    // const nowchildstep = ref(1)
    window.localStorage.setItem('chosePeo', choseCurrent)
    // 初始化1
    const state = reactive({
      nameLists: [],
      sonweibao: JSON.parse(window.localStorage.getItem('weibao'))
    })
    console.log(state.sonweibao)
    const radioStyle = reactive({
      display: 'block',
      height: '0.3rem',
      lineHeight: '0.3rem'
    })

    const getPeople = () => {
      getUserByPropertyID({ propertyCompanyid: 1 }).then(res => {
        console.log(res)
        if (res.code === 200) {
          state.nameLists = res.result || []
        }
      })
    }
    const changeValue = (e) => {
      // console.log(e.target.value)
      value.value = e.target.value
      // console.log(value.value)
      const obj = {
        sure: value.value,
        objString: false
      }
      ctx.emit('getpeo', obj)
      if (e.target.value === 2) {
        getPeople()
      }
    }
    // 指定巡检员
    const getpeo = (e, index) => {
      choseCurrent.value = index
      console.log(e)
      const obj = {
        sure: value.value,
        objString: e || false
      }
      ctx.emit('getpeo', obj)
    }

    return {
      ...toRefs(state),
      nowStepChild: props.nowchildstep,
      getPeople,
      changeValue,
      choseCurrent,
      getpeo,
      value,
      radioStyle
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
.gutter-box {
  width: 100%;
  height: 0.5rem;
  background: rgba(102, 119, 240, 0.2);
  border-radius: 2px;
  border: 1px solid #6677f0;
  padding: 0.05rem 0.1rem;
  cursor: pointer;
}
.ant-col-6 {
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
.ant-col-6 .gutter-box.current {
  background: url(../../assets/images/watching/chosepeople.png) no-repeat center
    center rgba(102, 119, 240, 0.8);
  background-size: 50%;
}
.text-center {
  text-align: center;
}
.hcenter {
  padding-top: 0.8rem;
}
.ant-row {
  max-height: 1.7rem;
  overflow: auto;
}
.b-t {
  width: 100%;
  text-align: center;
  font-size: 0.1rem;
  color: #71e8ff;
  line-height: 0.35rem;
  font-size: 0.15rem;
  text-decoration: underline;
}
</style>
