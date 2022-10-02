<template>
  <div ref="floorInfoDiv" class="floor-info-div">
    <a-spin :spinning="floorSecurityInfo.loading">
    <div class="bim-title w1">楼层信息</div>
    <div class="info-box clearfix">
      <div>接入设备总数<span>{{floorSecurityInfo.deviceCount}}</span></div>
      <div>电气火灾预警<span>{{floorSecurityInfo.elcFireCount}}</span></div>
      <div>火警<span>{{floorSecurityInfo.fireAlarmCount}}</span></div>
      <div>监测设备异常<span>{{floorSecurityInfo.deviceErrorCount}}</span></div>
      <div>故障<span>{{floorSecurityInfo.faultCount}}</span></div>
    </div>
    </a-spin>
  </div>
</template>

<script>
import { computed, onMounted, ref, watch } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'floorInfo',
  props: {
    width: {
      type: Number,
      default: function () {
        return null
      }
    },
    height: {
      type: Number,
      default: function () {
        return null
      }
    },
    floorArea: {
      type: Object,
      default: function () {
        return null
      }
    },
    time: {
      type: Number,
      default: new Date().getTime()
    }
  },
  setup(props) {
    const store = useStore()
    const floorInfoDiv = ref()

    watch(
      () => props.width,
      (count, prevCount) => {
        setSize()
      }
    )
    watch(
      () => props.height,
      (count, prevCount) => {
        setSize()
      }
    )
    watch(
      () => props.floorArea,
      (count, prevCount) => {
        if (props.floorArea !== null) {
          console.log(props.floorArea)
          store.dispatch('bim/getFloorSecurityInfo', {
            areaId: props.floorArea.id
          })
        }
      }
    )
    watch(
      () => props.time,
      (count, prevCount) => {
        if (props.floorArea !== null) {
          console.log(props.floorArea)
          store.dispatch('bim/getFloorSecurityInfo', {
            areaId: props.floorArea.id
          })
        }
      }
    )

    onMounted(() => {
      setSize()
      setTimeout(() => {
        floorInfoDiv.value.style.transition = 'all 0.8s'
      }, 200)
    })

    const setSize = () => {
      if (props.width) {
        floorInfoDiv.value.style.height = props.height + 'px'
        floorInfoDiv.value.style.width = (props.width ? (props.width + 'px') : '100%')
        floorInfoDiv.value.style.opacity = '1'
      } else {
        floorInfoDiv.value.style.width = '0px'
        floorInfoDiv.value.style.opacity = '0'
      }
    }

    return {
      floorInfoDiv,
      floorSecurityInfo: computed(() => store.state.bim.floorSecurityInfo)
    }
  }
}
</script>

<style scoped>

div.floor-info-div {
  overflow: hidden;
  position: absolute;
  right: 0.08rem;
  top: 0.08rem;
  padding: 0.15rem 0.2rem;
  background: rgba(136, 162, 247, 0.1);
  z-index: 1;
}

.info-box {

  min-width: 3rem;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.info-box > div {
  float: left;
  width: 40%;
  font-size: 0.14rem;
  color: #ffffff;
  position: relative;
  font-family: "Microsoft YaHei";

  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.info-box > div > span {
  position: absolute;
  right: 0rem;
  font-weight: bold;
}

.info-box > div:nth-child(2n) {
  margin-left: 0.5rem;
}

div.bim-title {
  font-size: 0.16rem;
  font-family: "Microsoft YaHei";
  font-weight: bold;
  position: relative;
  display: inline-block;
  line-height: 0.22rem;
  z-index: 0;
  padding-bottom: 0.06rem;
  color: #ffffff;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

div.bim-title:after {
  content: "";
  position: absolute;
  padding-bottom: 0.1rem;
  background-color: #6677F0;
  left: 0;
  bottom: 0.05rem;
  z-index: -1;
}

div.bim-title.w1:after {
  width: 67.7%;
}

div.bim-title.w2:after {
  width: 60%;
}

</style>
