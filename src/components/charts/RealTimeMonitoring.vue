<template>
  <div class="real-time-monitor-wrap">
    <div class="header">
      <div class="title">实时监控</div>
      <div class="r-c">
        <router-link to="/inteli_monitor_sys">
          <span>查看详情</span>
          <img src="../../assets/images/monitor/icon-right.png" alt="right">
        </router-link>
      </div>
    </div>
    <div class="content">
      <div class="floors">
        <div class="floors-mask" :class="[state.floorTapsVisable?'show-floorTap':'']">
          <div class="floors-panel" :style="{top:(state.floorTapsVisable?'0px':state.floorTapsStyleTop)}">
            <a v-for="item in state.floorTaps" :key="item.id"
               :title="item.floorName"
               :class="[state.floorTapActiveId==item.id?'active':'','layer']"
               @click="selectFloorTap(item.id, $event)">{{ item.floorName }}</a>
          </div>
          <DownOutlined class="layer" @click="showFloorTaps()"/>
        </div>
      </div>
      <div class="videos">
        <a-carousel arrows>
          <template #prevArrow>
            <div class="custom-slick-arrow" style="left: 10px; zindex: 1">
              <img src="../../assets/images/monitor/arrow-left.png" alt="arrow"/>
            </div>
          </template>
          <template #nextArrow>
            <div class="custom-slick-arrow" style="right: 10px">
              <img src="../../assets/images/monitor/arrow-right.png" alt="arrow"/>
            </div>
          </template>
          <!-- <template #prevArrow>
            <div class="custom-slick-arrow">
              <img src="../../assets/images/monitor/arrow-left.png" alt="arrow"/>
            </div>
          </template>
          <template #nextArrow>
            <div class="custom-slick-arrow" style="right: 10px">
              <img src="../../assets/images/monitor/arrow-right.png" alt="arrow"/>
            </div>
          </template> -->
          <!-- {{list[0][0]['id']}} -->
            <div class='carousl-item-wrapper' v-for="(item,index) in state.list" :key="index">
              <div class="movie-wrap" v-for="itemson in item" :key="itemson.id" @click="getCam(itemson.videoUrl,true,itemson.name)">
                <img
                  :src="itemson.imgSrc"
                  alt="">
                <div class="one-row movie-txt">{{ itemson.name }}</div>
                <img class="btn-img" src="../../assets/images/monitor/icon-play.png" alt="play">
              </div>
            </div>
          <!-- <div v-if="state.list.length>0">
            <div class='carousl-item-wrapper'  v-for="(item,index) in state.list"  :key="index">
            <div class="movie-wrap" v-for="itemson in item" :key="itemson.id">
              <img  @click="getCam(itemson.videoUrl,true)"
                :src="itemson.imgSrc"
                alt="">
              <div class="one-row movie-txt">{{itemson.name}}</div>
              <img class="btn-img" src="../../assets/images/monitor/icon-play.png" alt="play">
            </div>
          </div>
          </div> -->

        </a-carousel>
      </div>
    </div>
    <!-- <Modal></Modal> -->
    <a-modal
      @destroyOnClose="true"
      :title="'监控播放-'+state.title"
      :visible="state.visible"
      @cancel="handleCancel"
      :footer="null"
    >
      <p>
        <CameraNow :getUrl="state.geturl" ref="cameranow"/>
      </p>
    </a-modal>
  </div>
</template>

<script>
import { onMounted, reactive, ref, watch } from 'vue'
import { DownOutlined } from '@ant-design/icons-vue'
import CameraNow from '@/components/cameras/camera_now.vue'
// import Modal from '@/components/ui/Modal.vue'
import { message } from 'ant-design-vue'
import { getFloorList, getQueryCamerasByFloor } from '@/api/cameras'

export default {
  components: {
    DownOutlined,
    CameraNow
    // Modal
  },
  props: {
    time: {
      type: Number,
      default: new Date().getTime()
    }
  },
  setup(props) {
    const cameranow = ref()
    const state = reactive({
      visible: false,
      floorTaps: [],
      floorTapActiveId: 0,
      floorTapsVisable: false,
      floorTapsStyleTop: '-0.1rem',
      floors: 32,
      list: [],
      geturl: '',
      title: ''
    })
    const showFloorTaps = () => {
      state.floorTapsVisable = true
      console.log(state.floorTapsVisable)
    }
    const selectFloorTap = (id, e) => {
      state.floorTapActiveId = id
      state.floorTapsVisable = false
      console.log('state.floorTapActiveId', state.floorTapActiveId)
      state.floorTapsStyleTop = '-' + e.currentTarget.offsetTop + 'px'
      const params = {
        locationId: state.floorTapActiveId
      }
      console.log(params)
      getQueryCamerasByFloor(params).then(res => {
        // console.log('；甑')
        console.log('数据：：：：：：：：：：：：：：：：：：：：：：：：：：：：：：：：：：：：')
        console.log(res)
        const result = []
        if (res.code === 200) {
          for (var i = 0, len = res.result.length; i < len; i += 6) {
            result.push(res.result.slice(i, i + 4))
          }
          // res.result.forEach((e, index) => {
          //       datalist.push()
          // })
          state.list = result || []
          console.log(state.list)
        }
      })
    }
    const showModal = () => {
      state.visible = true
      cameranow.value.play()
      // cameranow.value.videoREf.value.play()
      // debugger
    }
    const handleCancel = () => {
      state.visible = false
      cameranow.value.close()
    }

    // for (let i = 0; i < 25; i++) {
    //   const o = {
    //     id: i,
    //     name: (i + 1) + '楼'
    //   }
    //   state.floorTaps.push(o)
    // }
    const getCam = (objurl, bol, name) => {
      console.log(objurl)
      if (bol) {
        state.geturl = objurl
        console.log(state.geturl)
        state.title = name
        showModal()
      } else {
        message.warning({ content: '视频异常，不支持播放!' })
      }
    }
    onMounted(() => {
      console.log(state.floorTaps)
      const params = {
        areaParentId: '7'
      }
      getFloorList(params).then(res => {
        // console.log(res)
        if (res.code === 200) {
          state.floorTaps = res.result || []
          state.floorTapActiveId = state.floorTaps[0].id
          // getQueryCamerasByFloor(state.floorTapActiveId)
          const params = {
            locationId: state.floorTapActiveId
          }
          // console.log(params)
          // console.log('---------------------------')
          getQueryCamerasByFloor(params).then(res => {
            // console.log('；甑')
            console.log('数据：：：：：：：：：：：：：：：：：：：：：：：：：：：：：：：：：：：：')
            console.log(res)
            const result = []
            if (res.code === 200) {
              for (var i = 0, len = res.result.length; i < len; i += 6) {
                result.push(res.result.slice(i, i + 6))
              }
              // res.result.forEach((e, index) => {
              //       datalist.push()
              // })
              state.list = result || []
              console.log(state.list)
            }
          })
        }
      })
    })

    const reload = () => {
      const params = {
        locationId: state.floorTapActiveId
      }
      getQueryCamerasByFloor(params).then(res => {
        const result = []
        if (res.code === 200) {
          for (var i = 0, len = res.result.length; i < len; i += 6) {
            result.push(res.result.slice(i, i + 6))
          }
          state.list = result || []
        }
      })
    }
    watch(
      () => props.time,
      () => {
        reload()
      }
    )

    return {
      state,
      cameranow,
      getCam,
      handleCancel,
      showFloorTaps,
      selectFloorTap,
      showModal
    }
  }
}
</script>

<style lang="less" scoped>
.real-time-monitor-wrap {
  width: 4.52rem;
  height: 3.04rem;

  .header {
    height: 0.4rem;
    margin-bottom: 0.06rem;
    background: url(../../assets/images/monitor/bg-title-4.png) no-repeat center;
    background-size: 4.52rem 0.4rem;

    .title {
      float: left;
      font-size: 0.18rem;
      color: #fff;
      line-height: 0.4rem;
      font-weight: 700;
      margin-left: 0.16rem;
    }

    .r-c {
      float: right;

      a {
        font-size: 0.14rem;
        color: #fff;
        line-height: 0.4rem;

        span {
          vertical-align: middle;
        }

        img {
          width: 0.16rem;
          height: 0.16rem;
          vertical-align: middle;
        }
      }
    }
  }

  .content {
    width: 4.52rem;
    height: 2.58rem;
    background: url(../../assets/images/monitor/bg-content-right.png) no-repeat center;
    background-size: 4.52rem 2.58rem;
    // padding: 0.16rem 0;
    .v-device {
      width: 4.52rem;
      height: 3.04rem;
    }

    .floors {
      height: 0.52rem;
      padding: 0.16rem 0.06rem 0.16rem;

      .floors-mask {
        width: 100%;
        height: 100%;
        position: relative;
        overflow: hidden;

        &.show-floorTap {
          overflow: inherit;

          .floors-panel {
            z-index: 8;
            background-color: #303475;
            transform: translateY(-0.1rem);
          }

        }

        .floors-panel {
          position: absolute;
          z-index: 6;
          //width: calc(100% - 0.4rem);
          padding-right: 0.3rem;
          padding-left: 0.12rem;
          padding-top: 0.1rem;
        }

        .layer {
          float: left;
          width: 0.38rem;
          height: 0.2rem;
          border-radius: 0.11rem;
          margin-right: 0.1rem;
          margin-bottom: 0.09rem;
          font-size: 12px;
          color: #fff;
          line-height: 0.2rem;
          text-align: center;
          background-color: rgba(102, 119, 240, 0.4);

          cursor: pointer;

          &.active {
            background-color: #6677F0;
          }

          &.anticon-down {
            position: absolute;
            right: 0.1rem;
            width: 0.28rem;
            z-index: 7;

            .svg {
              margin-top: 5px;
            }
          }
        }
      }
    }

    .videos {
      width: 4.52rem;
      height: 2.06rem;

      .carousl-item-wrapper {
        display: flex !important;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: space-between;
        padding: 0 0.46rem;
      }

      .movie-wrap {
        width: 1.12rem;
        height: 0.9rem;
        // margin-right: 0.12rem;
        margin-bottom: 0.1rem;
        position: relative;
        z-index: 1000;
        cursor: pointer;

        img {
          width: 1.12rem;
          height: 0.72rem;
          margin-bottom: 0.02rem;
        }

        img.btn-img {
          position: absolute;
          width: 0.24rem;
          height: 0.24rem;
          margin-left: 0.84rem;
          margin-top: -0.44rem;
        }

        .movie-txt {
          font-size: 12px;
          line-height: 16px;
          color: #fff;
        }
      }

      .movie-wrap:nth-child(3n+3) {
        margin-right: 0;
      }
    }

    .ant-carousel /deep/ .slick-slide {
      text-align: center;
      height: 100%;
      overflow: hidden;
    }

    .ant-carousel /deep/ .custom-slick-arrow {
      width: 0.24rem;
      height: 0.24rem;
      top: calc(50% - 0.12rem);
      z-index: 2;
      opacity: 0.3;

      img.arrow {
        width: 0.24rem;
        height: 0.24rem;
      }

      &.slick-prev {
        left: 0.12rem;
      }

      &.slick-next {
        right: 0.12rem;
      }
    }

    .ant-carousel /deep/ .custom-slick-arrow:before {
      display: none;
    }

    .ant-carousel /deep/ .custom-slick-arrow:hover {
      opacity: 0.5;
    }

    // .ant-carousel /deep/ .slick-slide h3 {
    //   color: #fff;
    // }
  }
}
</style>
