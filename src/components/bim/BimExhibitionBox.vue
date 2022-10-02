<template>
  <div class="bim-exhibition-box-div" ref="BimExhibitionBoxDiv">
    <div class="one-row clearfix">
      <newEvent :height="state.oneRowHeight" :width="state.newEventWidth" :time="props.time"></newEvent>
      <floorInfo :height="state.oneRowHeight" :width="state.floorInfoWidth"
                 :floorArea="state.floorArea"
                 :time="props.time"></floorInfo>
    </div>
    <BimExhibition :width="state.centerWidth" :height="state.centerHeight" @showFloor="showFloor"></BimExhibition>
  </div>
</template>

<script>
import { reactive, watch, ref, onMounted } from 'vue'
import BimExhibition from './BimExhibition'
import newEvent from './NewEvent'
import floorInfo from './FloorInfo'
import { getRem } from '../../utils/tool'

export default {

  name: 'BimExhibitionBox',
  components: {
    BimExhibition,
    newEvent,
    floorInfo
  },
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
    time: {
      type: Number,
      default: new Date().getTime()
    }
  },
  setup(props, context) {
    const state = reactive({
      centerHeight: 0,
      centerWidth: 0,
      oneRowHeight: 0,
      newEventWidth: 0,
      floorInfoWidth: 0,
      floorArea: null
    })

    const BimExhibitionBoxDiv = ref()

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
    const setSize = () => {
      const rem = getRem()
      const theWidth = (props.width == null ? window.innerWidth : props.width)
      const theHeight = (props.height == null ? window.innerHeight : props.height)
      if (BimExhibitionBoxDiv.value) {
        BimExhibitionBoxDiv.value.style.width = theWidth + 'px'
        BimExhibitionBoxDiv.value.style.height = theHeight + 'px'
      }
      state.oneRowHeight = 1.28 * rem
      state.centerWidth = theWidth - 0.16 * rem
      state.centerHeight = theHeight - state.oneRowHeight - 0.32 * rem

      if (state.floorArea === null) {
        state.newEventWidth = null
        state.floorInfoWidth = 0
      } else {
        state.newEventWidth = theWidth * 0.61 - 0.16 * rem
        state.floorInfoWidth = theWidth - state.newEventWidth - 0.48 * rem
      }
    }

    onMounted(() => {
      setSize()
    })

    const showFloor = (floor) => {
      console.log(floor)
      state.floorArea = floor
      setSize()
    }
    return {
      state,
      BimExhibitionBoxDiv,
      showFloor,
      props
    }
  }
}
</script>

<style scoped>

.bim-exhibition-box-div {

  height: 100%;
  width: 100%;
  position: relative;
  padding: 0.08rem;
}

.bim-exhibition-box-div > div.one-row {
  padding: 0.08rem;
  position: relative;
}

</style>
