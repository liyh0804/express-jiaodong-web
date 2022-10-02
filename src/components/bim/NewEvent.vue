<template>
  <div class="new-event-div" ref="newEventDiv">
    <a-spin :spinning="state.loading">
      <div class="bim-title w1">最新事件</div>
      <div class="bim-new-box">
        <div class="bim-new-elevator" ref="bomNewElevator"
             :style="{transition:(!state.roll?'none':'all 0.8s'), transform : (!state.roll?'none':'translateY(-'+state.oneHeight*3+'px)') } ">
          <div class="bim-new-item" :title="value.eventContent" v-for='(value,index) in state.areaEventsList'
               :key="index">
            {{ value._index }}、{{ value.eventContent }}
          </div>
        </div>
      </div>
    </a-spin>
  </div>
</template>

<script>
import { onMounted, reactive, ref, watch } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'NewEvent',
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
    const store = useStore()
    let isInitRoll = false
    const state = reactive({
      roll: false,
      rollNum: 0,
      oneHeight: 0,
      areaEventsListTemp: [],
      areaEventsList: [],
      loading: true
    })

    const newEventDiv = ref()
    const bomNewElevator = ref()

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
      () => props.time,
      (count, prevCount) => {
        loadAreaEventsData()
      }
    )
    const loadAreaEventsData = () => {
      state.loading = true
      store.dispatch('bim/getAreaEventsList', {
        column: 'createTime',
        order: 'desc',
        areaId: 7
      }).then((res) => {
        if (res && res.success) {
          res.result.records.map((item, index) => {
            item._index = (index + 1)
          })
          state.areaEventsListTemp = res.result.records
          if (state.areaEventsList.length === 0) {
            state.areaEventsList = state.areaEventsListTemp.concat()
          }
          if (!isInitRoll) {
            setTimeout(roll, 5000)
            isInitRoll = true
          }
          state.loading = false
        }
      })
    }

    const listHandler = () => {
      state.areaEventsList = state.areaEventsListTemp.concat()
      if (state.rollNum > 0) {
        for (let i = 0; i < state.rollNum; i++) {
          state.areaEventsList.push(state.areaEventsList[i])
        }
        state.areaEventsList.splice(0, state.rollNum)
      }
    }

    onMounted(() => {
      loadAreaEventsData()
      setSize()
      setTimeout(() => {
        newEventDiv.value.style.transition = 'all 0.8s'
      }, 200)
    })
    const setSize = () => {
      console.log('props.width', props.width)
      newEventDiv.value.style.height = props.height + 'px'
      if (props.width) {
        newEventDiv.value.style.width = props.width + 'px'
      } else {
        newEventDiv.value.style.width = '100%'
      }
    }
    // const areaEventsList = computed(() => store.state.bim.areaEvents)

    /***
     * 滚动之后
     * roll 标识 关闭 bim-new-item 关闭动画 元素高度移动清零
     * 将结果列表中的前三个 移动到结果列表尾部
     */
    const rollAfter = () => {
      state.rollNum += 3
      if (state.rollNum > 10) {
        state.rollNum -= 10
      }
      // console.log('rollNum:' + state.rollNum)
      state.roll = false
      listHandler()
      setTimeout(roll, 2500)
    }

    /***
     * 开始滚动
     * roll 标识 开启 bim-new-item 开启动画 向上移动3个元素高度
     */
    const roll = () => {
      if (!bomNewElevator.value || bomNewElevator.value.children.length <= 0) {
        return
      }
      state.oneHeight = bomNewElevator.value.children[0].offsetHeight
      state.roll = true

      setTimeout(rollAfter, 2500)
    }

    return {
      state,
      newEventDiv,
      bomNewElevator,
      listHandler
    }
  }
}
</script>

<style scoped>

div.new-event-div {
  padding: 0.15rem 0.2rem;
  background: rgba(136, 162, 247, 0.1);
  position: relative;
  z-index: 2;
}

.new-event-div div {
  text-align: left;
  font-size: 0.14rem;
  color: #ffffff;
  font-family: "Microsoft YaHei";
}

.bim-new-item {
  line-height: 0.22rem;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  width: 97%;
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

div.bim-new-box {
  height: calc(100% - 0.35rem);
  overflow: hidden;
  position: relative;
}

div.bim-new-elevator {
  position: absolute;
  width: 100%;
}

:deep() .ant-spin-nested-loading, :deep() .ant-spin-container, :deep() .ant-spin-blur {
  height: 100%;
  width: 100%;
}

</style>
