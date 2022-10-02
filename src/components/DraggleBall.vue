<template>
  <div class="ball-wrapper">
    <div class="draggle-ball" v-drag>
      <div class="row">
        <div class="icon-wrap fire">
          <router-link to="/issue_manage/fire">
            <div data-type="fire" @click="readMessage" v-if="state.alarmFlag.fire">
              <img draggable="false" src="../assets/images/ball/icon-fire-default.png" class="trans_fade_image"/>
              <img draggable="false" src="../assets/images/ball/icon-fire.png"/>
            </div>
            <div v-else>
              <img draggable="false" v-if="bc.fireAlarmCount === 0" src="../assets/images/ball/icon-fire-default.png"/>
              <img draggable="false" v-else src="../assets/images/ball/icon-fire.png"/>
            </div>
            <div class="num" v-if="bc.fireAlarmCount !== 0">{{ bc.fireAlarmCount >= 100 ? '...' : bc.fireAlarmCount }}
            </div>
          </router-link>
        </div>
        <div class="icon-wrap fault">
          <router-link to="/issue_manage/breakdown">
            <div data-type="fault" @click="readMessage" v-if="state.alarmFlag.fault">
              <img draggable="false" src="../assets/images/ball/icon-fault-default.png" class="trans_fade_image"/>
              <img draggable="false" src="../assets/images/ball/icon-fault.png"/>
            </div>
            <div v-else>
              <img draggable="false" v-if="bc.faultCount === 0" src="../assets/images/ball/icon-fault-default.png"/>
              <img draggable="false" v-else src="../assets/images/ball/icon-fault.png"/>
            </div>
            <div class="num" v-if="bc.faultCount !== 0">{{ bc.faultCount >= 100 ? '...' : bc.faultCount }}</div>
          </router-link>
        </div>
      </div>
      <div class="row">
        <div class="icon-wrap threat">
          <router-link to="/issue_manage/hidden_trouble">
            <div data-type="threat" @click="readMessage" v-if="state.alarmFlag.threat">
              <img draggable="false" src="../assets/images/ball/icon-threat-default.png" class="trans_fade_image"/>
              <img draggable="false" src="../assets/images/ball/icon-threat.png"/>
            </div>
            <div v-else>
              <img draggable="false" v-if="bc.threatCount === 0" src="../assets/images/ball/icon-threat-default.png"/>
              <img draggable="false" v-else src="../assets/images/ball/icon-threat.png"/>
            </div>
            <div class="num" v-if="bc.threatCount !== 0">{{ bc.threatCount >= 100 ? '...' : bc.threatCount }}</div>
          </router-link>
        </div>
        <div class="icon-wrap police">
          <router-link to="/issue_manage/fire">
            <div data-type="actual" @click="readMessage" v-if="state.alarmFlag.actural">
              <img draggable="false" src="../assets/images/ball/icon-police-default.png" class="trans_fade_image"/>
              <img draggable="false" src="../assets/images/ball/icon-police.png"/>
            </div>
            <div v-else>
              <img draggable="false" v-if="bc.realAlarmCount === 0"
                   src="../assets/images/ball/icon-police-default.png"/>
              <img draggable="false" v-else src="../assets/images/ball/icon-police.png"/>
            </div>
            <div class="num" v-if="bc.realAlarmCount !== 0">{{ bc.realAlarmCount >= 100 ? '...' : bc.realAlarmCount }}
            </div>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, reactive } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'drag',
  setup(props, context) {
    const store = useStore()
    const state = reactive({
      x: window.innerWidth - 152,
      // y: 200,
      y: window.innerHeight - 152,
      position: 'fixed',
      cursor: 'default',
      dragging: false,
      offsetWidth: 0,
      offsetHeight: 0,
      // socketUrl: 'ws://192.168.103.201:18080/data-analysis/websocket/ALARM_FIRE-ALARM_FAULT-ALERT_THREAT-ALERT_POLICE',
      socketUrl: 'ws://192.168.103.201:18080/data-analysis/websocket/ALARM_FIRE',
      socket: null,
      alarmFlag: {
        fire: false,
        fault: false,
        threat: false,
        actural: false
      }
    })
    const openSocket = () => {
      console.log('socket connect success')
    }
    const connectSocketErr = () => {
      console.log('socket connect error')
    }
    const getServerMsg = (msg) => {
      console.log(msg.data)
      if (msg.data === '连接成功') return
      const data = JSON.parse(msg.data)
      const type = data.alarm_type
      if (!type) {
        return
      }
      if (type === 'ALARM_FIRE') {
        state.alarmFlag.fire = true
      } else if (type === 'ALARM_FAULT') {
        state.alarmFlag.fault = true
      } else if (type === 'ALARM_THREAT') {
        state.alarmFlag.threat = true
      } else if (type === 'ALARM_ACTURAL') {
        state.alarmFlag.actural = true
      }
      if (type) {
        store.dispatch('message/getBoxMessageCount')
      }
    }
    const connectWebsocket = () => {
      if (state.socket) {
        state.socket.close()
        state.socket = null
      }
      if (typeof WebSocket === 'undefined') {
        alert('您的浏览器暂时不支持消息推送，请更换浏览器')
      } else {
        state.socket = new WebSocket(state.socketUrl)
        state.socket.onopen = openSocket
        state.socket.onerror = connectSocketErr
        state.socket.onmessage = getServerMsg
      }
    }
    onMounted(() => {
      store.dispatch('message/getBoxMessageCount')
      connectWebsocket()
    })

    const boxMessageCount = computed(() => store.state.message.boxMessageCount)

    const readMessage = (evt) => {
      const type = evt.currentTarget.dataset && evt.currentTarget.dataset.type
      state.alarmFlag[type] = false
    }

    return {
      bc: boxMessageCount,
      fireAlarmCount: boxMessageCount.value.fireAlarmCount,
      faultCount: boxMessageCount.value.faultCount,
      threatCount: boxMessageCount.value.threatCount,
      realAlarmCount: boxMessageCount.value.realAlarmCount,
      state,
      readMessage
    }
  },
  // 注册局部组件指令
  directives: {
    drag: function (el) {
      const dragBox = el // 获取当前元素
      const sw = document.body.clientWidth - 114
      const sh = document.body.clientHeight - 114
      dragBox.onmousedown = e => {
        // 算出鼠标相对元素的位置
        const disX = e.clientX - dragBox.offsetLeft
        const disY = e.clientY - dragBox.offsetTop
        let hasMove = false
        document.body.className = document.body.className + ' noselect'
        document.onmousemove = e => {
          // 用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
          let left = e.clientX - disX
          let top = e.clientY - disY
          // 移动当前元素
          // if (left >= 156) {
          //   left = 156
          // }
          // if (top >= 156) {
          //   top = 156
          // }
          // if (-top >= window.innerHeight - 156 - 114) {
          //   top = -(window.innerHeight - 156 - 114)
          // }
          if (left <= 0) {
            left = 0
          } else if (left >= sw) {
            left = sw
          }
          if (top <= 88) {
            top = 88
          } else if (top >= sh) {
            top = sh
          }
          dragBox.style.left = left + 'px'
          dragBox.style.top = top + 'px'
          hasMove = true
        }
        document.onmouseup = ev => {
          document.body.className = document.body.className.replaceAll(' noselect', '')
          // 鼠标弹起来的时候不再移动
          document.onmousemove = null
          // 预防鼠标弹起来后还会循环（即预防鼠标放上去的时候还会移动）
          document.onmouseup = null
          if (hasMove) {
            console.log('hasMove')
            hasMove = false
            ev.stopPropagation()
            ev.preventDefault()
            ev.returnValue = false
            return false
          }
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.ball-wrapper {
  //position: fixed;
  //bottom: 1.56rem;
  //right: 1.56rem;
  //width: 114px;
  //height: 114px;
  .draggle-ball {
    /* 使用定位，脱离文档流 */
    position: fixed;
    bottom: 1.56rem;
    right: 1.56rem;
    /* 鼠标移入变成拖拽手势 */
    cursor: move;
    // z-index: 3000;
    width: 114px;
    height: 114px;
    border: 1px solid #eee;
    box-shadow: 5px 5px 40px rgba(0, 0, 0, .5);
    border-radius: 16px;
    background-color: #6677F0;
    // opacity: 0.8;
    // transition: all 0.1s;
    z-index: 20;
    // transform: translate3d(-50%, -50%, 0);
    padding-top: 2px;
  }

  .row {
    display: flex;
    flex-direction: row;
    height: 40px;
    align-items: center;
    justify-content: space-between;
    padding: 0 12px;
    margin-top: 10px;

    .icon-wrap {
      width: 40px;
      height: 40px;
      background-size: 40px 40px;

      .num {
        position: absolute;
        width: 24px;
        height: 24px;
        margin-top: -50px;
        margin-left: 24px;
        font-size: 16px;
        line-height: 24px;
        color: #fff;
        text-align: center;
        background: url(../assets/images/ball/icon-ava.png) no-repeat center;
        background-size: 24px 24px;
      }

      a {
        display: block;
        width: 40px;
        height: 40px;
        -webkit-user-drag: none;

        img {
          width: 40px;
          height: 40px;
          -webkit-user-drag: none;
          pointer-events: none;
        }
      }

      &.fire {
        // background: url(../assets/images/ball/icon-fire-default.png) no-repeat center;
      }

      &.fault {
        // background: url(../assets/images/ball/icon-fault-default.png) no-repeat center;
      }

      &.threat {
        // background: url(../assets/images/ball/icon-threat-default.png) no-repeat center;
      }

      &.police {
        // background: url(../assets/images/ball/icon-police-default.png) no-repeat center;
      }
    }
  }

  @-webkit-keyframes fadeInOut {
    0% {
      opacity: 1;
    }
    25% {
      opacity: 0;
    }
    50% {
      opacity: 0;
    }
    75% {
      opacity: 1;
    }
  }

  .trans_fade_image {
    position: absolute;
    -webkit-animation-name: fadeInOut;
    -webkit-animation-timing-function: ease-in-out;
    -webkit-animation-iteration-count: infinite;
    -webkit-animation-duration: 1s;
  }

  .banner img {
    width: 40px;
    height: 40px;
    -webkit-user-drag: none;
  }

  .banner a {
    -webkit-user-drag: none;
  }
}
</style>
