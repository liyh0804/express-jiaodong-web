<template>
  <div class="imgs" ref="displayParent">
    <div
      class="fullsctext"
      style="z-index: 100"
      @click="fullscreenToggle()"
      v-if="(!isFullscreen()) && ($route.path!='/dashboard')"
    >
      <img src="@/assets/images/fullScreen.png" />
    </div>
    <div class="fullsctext" @click="fullscreenToggle()" v-else>
      <a-icon type="fullscreen-exit" class="white-color font-size-28" />
    </div>
    <img :src="imageUrl" />
  </div>
</template>

<script>
export default {
  name: 'child',
  props: ['getUrl'],
  data() {
    return {
      timer: null,
      websock: null,
      dataFrames: [],
      imageUrl: require('@/assets/images/video_loading.gif')
    }
  },
  mounted() {
    console.log(this.getUrl)
    console.log(this.$route.path)
    // this.initWebSocket(this.getUrl);
  },
  beforeUnmount() {
    // 清除定时器
    clearInterval(this.timer)
    console.log('befoestroy')

    if (this.websock) {
      console.log('destory websocket')
      this.websock.close()
      this.websock = null
    }
  },
  unmounted() {
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = null
    }
    // window.clearInterval(this.player)
    // this.player = null
  },
  methods: {
    fullscreenToggle() {
      this.srceenKey++
      // console.log(this.srceenKey)
      const bol = this.isFullscreen()
      console.log(bol)
      this.srceenBol = !bol
      const v = this.$refs.displayParent
      if (this.srceenBol) {
        var globalreqfullscreen = this.getreqfullscreen()
        globalreqfullscreen.call(v)
      } else {
        var exitFullscreen = this.exitFullscreen()
        exitFullscreen.call(v)
      }
    },
    isFullscreen() {
      // console.log(document.fullscreenElement);
      // console.log(document.msFullscreenElement);
      // console.log(document.mozFullScreenElement);
      // console.log(document.webkitFullscreenElement);
      return (
        document.fullscreenElement ||
        document.msFullscreenElement ||
        document.mozFullScreenElement ||
        document.webkitFullscreenElement ||
        false
      )
    },
    // 进入全屏
    getreqfullscreen() {
      // this.srceenBol = false
      var root = document.documentElement

      return (
        root.requestFullscreen ||
        root.webkitRequestFullscreen ||
        root.mozRequestFullScreen ||
        root.msRequestFullscreen
      )
    },
    // 退出全屏
    exitFullscreen() {
      // this.srceenBol = true
      if (document.exitFullScreen) {
        document.exitFullScreen()
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen()
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen()
      }
      // else if (element.msExitFullscreen) {
      //   element.msExitFullscreen()
      // }
    },
    closeCamera() {
      console.log('关闭触发停止')
      clearInterval(this.timer)
      if (this.websock) {
        console.log('close websocket')
        this.websock.close()
        this.websock = null
      }
    },
    initWebSocket() {
      const url = this.getUrl
      // 初始化weosocket
      this.websock = null
      // let wsuri = 'ws://' + window.WebSocketURL + '/channel/q1'
      // let wsuri = "ws://" + window.WebSocketURL;
      // let wsuri = 'https://juejin.im/post/6844904202389422094'
      // console.log("------------------------------------------------------");
      // console.log(wsuri);
      this.websock = new WebSocket(url)
      console.log('进来')
      console.log(this.websock)
      const self = this
      self.playFrameData()
      this.websock.onmessage = this.websocketonmessage
      this.websock.onopen = this.websocketonopen
      this.websock.onerror = this.websocketonerror
      this.websock.onclose = (e) => {
        console.log(e)
        setTimeout(() => {
          this.websocketclose(e, url)
        }, 1000)
      }
    },
    playFrameData() {
      // const self = this
      // let data = this.dataList
      // console.log(this.dataFrames.length)
      // console.log(
      //   "......................开始播放................................."
      // );
      if (this.dataFrames.length > 0) {
        const data = this.dataFrames.shift()
        if (this.dataFrames.length > 50) {
          this.dataFrames.splice(0, 20)
        }

        /* 原图url */
        // console.log(data);
        const frame = data
        console.log(frame)
        // self.realWidth = frame.width;
        // self.realHeight = frame.height;
        // console.log(frame)
        // let imgurl = frame.url;
        // let lefturl = imgurl.split(".jpg")[0] + "_left.jpg";
        // self.imageUrl = frame.url;
        // console.log(self.$refs.imgB)
        // self.boxCanvasBig.clearRect(0, 0, self.canvasWidth, self.canvasHeight)
        // self.boxCanvasImg.clearRect(0, 0, self.canvasWidth, self.canvasHeight)
        // this.headPoints = []
        // let bboxes = frame.other_bboxes

        // this.close = false
        // let lineTo = [
        //   { x: 180, y: 640 },
        //   { x: 1800, y: 880 },
        // ]
        // console.log("===================================================")
        // console.log(bboxes.length)
        // self.drawBoxes(bboxes)
      }

      // console.log("------------------------222222222222")
      let fps = 200
      //  console.log(self.dataFrames.length)
      if (self.dataFrames.length === 0) {
        fps = 10
      } else if (self.dataFrames.length < 10) {
        fps = 10
      } else {
        // console.log(self.dataFrames.length)
        fps = Math.ceil(self.dataFrames.length)
      }

      const distance = parseInt(1000 / fps)
      // console.log(distance)
      self.timer = setTimeout(self.playFrameData, distance)
      // 新的连接
      // console.log(data)
    },
    websocketonopen() {
      console.log('connect success')
      // var self = this
    },
    websocketonerror(e) {
      // 连接建立失败重连
      console.log('发生错误', e)
      if (this.websock) {
        this.websock.close()
        window.clearTimeout(this.timer)
        this.timer = null
      }

      // console.log('re connect')
      setTimeout(() => {
        this.initWebSocket()
      }, 3000)
    },
    websocketonmessage(e) {
      // 数据接收
      const data = JSON.parse(e.data)
      // console.log(data.length)
      if (data.length > 7) {
        data.forEach((e, index) => {
          if (index % 2 === 0) {
            this.dataFrames.push(e)
          }
        })
      } else {
        data.forEach((e) => {
          this.dataFrames.push(e)
        })
      }
      // console.log(data)

      // console.log(this.dataFrames)
      // if(this.dataFrames){}
    },
    websocketclose(e, url) {
      // 关闭
      console.log('断开连接', e)
      if (e.code === 1006) {
        setTimeout(() => {
          console.log('re connect')
          this.initWebSocket(url)
        }, 3000)
      }
    }
  }
}
</script>

<style scoped>
.imgs{
  position: relative;
}
.imgs img {
  width: 100%;
}

.fullsctext {
  position: absolute;
  z-index: 50;
  right: 20px;
  top: 20px;
  color: #ffffff;
  line-height: 26px;
  font-size: 20px;
  width: 35px;
  cursor: pointer;
}

.fullsctext:hover {
  text-decoration: underline;
}

.fullsctext img {
  width: 25px;
  float: left;
}
</style>
