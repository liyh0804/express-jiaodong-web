<template>
  <div class="imgs" ref="displayParent">
    <!-- <video-player
        class="video-player vjs-custom-skin"
        ref="videoPlayer"
        :playsinline="true"
        :options="playerOptions"
      >
      </video-player> -->
    <!-- <p>{{getUrl}}</p> -->
    <video :src="getUrl" autoplay="autoplay" controls="controls" ref="videoREf">
      您的浏览器暂时不支持视频播放
      </video>
      <div class="buttondiv">
        播放速度：
        <span @click="changeSpeed(2)">2X</span>
        <span @click="changeSpeed(1.5)">1.5X</span>
        <span @click="changeSpeed(1)">1X</span>
        <span @click="changeSpeed(0.7)">0.7X</span>
      </div>
    <!-- <img :src="imageUrl" /> -->
  </div>
</template>

<script>
// import VideoPlayer from 'vue-video-player'
export default {
  name: 'child',
  props: ['getUrl'],
  components: {
    // VideoPlayer
  },
  data() {
    return {
      playerOptions: {
        // 播放速度
        playbackRates: [0.7, 1.0, 1.5, 2.0],
        // 如果true,浏览器准备好时开始回放。
        autoplay: false,
        // 默认情况下将会消除任何音频。
        muted: false,
        // 导致视频一结束就重新开始。
        loop: false,
        // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        preload: 'auto',
        language: 'zh-CN',
        // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        aspectRatio: '16:9',
        // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        fluid: true,
        sources: [
          {
            // 类型
            type: 'video/mp4',
            // url地址
            // src: 'https://www.w3school.com.cn//i/movie.ogg',
            src: this.getUrl
          }
        ],
        // 你的封面地址
        poster:
          'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fn.sinaimg.cn%2Fsinacn21%2F762%2Fw1000h562%2F20180815%2Fb5f2-hhtfwqr8860663.jpg&refer=http%3A%2F%2Fn.sinaimg.cn&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1611738381&t=da92135b776dafe17ac486dc2b7dbe30',
        // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
        notSupportedMessage: '此视频暂无法播放，请稍后再试',
        controlBar: {
          timeDivider: true, // 当前时间和持续时间的分隔符
          durationDisplay: true, // 显示持续时间
          remainingTimeDisplay: false, // 是否显示剩余时间功能
          fullscreenToggle: true // 全屏按钮
        }
      },
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
    // clearInterval(this.timer)
    // console.log('befoestroy')

    // if (this.websock) {
    //   console.log('destory websocket')
    //   this.websock.close()
    //   this.websock = null
    // }
  },
  methods: {
    play() {
      this.$refs.videoREf.play()
    },
    close() {
      this.$refs.videoREf.pause()
    },
    changeSpeed(speed) {
      this.$refs.videoREf.playbackRate = speed
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
.buttondiv{
  color: #fff;
}
.buttondiv span{
  display: inline-block;
  padding: 0 0.1rem;
  cursor: pointer;
}
.buttondiv span:hover{
  text-decoration: underline;
}
</style>
