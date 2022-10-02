<template>
  <div class="new-event-div" ref="newEventDiv">
    <div class="bim-title w1">全部监控</div>
    <div class="select">
      楼层：
      <a-select
        v-model="floorid"
        default-value="all"
        show-search
        placeholder="默认全部"
        option-filter-prop="children"
        style="width: 1.498rem"
        @change="handleChange"
      >
        <a-select-option value="all">全部</a-select-option>
        <a-select-option :value="item.id" v-for="item in list" :key="item.id">{{
          item.floorName
        }}</a-select-option>
      </a-select>
    </div>
    <div class="bim-new-item" v-if="floorid === 'all'">
      <div v-for="(item,index) in camerasall" :key="index">
        <div class="floorNum">
          <div class="floor-left"></div>
          <div class="floor-num">{{item.flname}}</div>
          <div class="floor-right"></div>
        </div>
        <div class="floorCamList">
          <a-row :gutter="16">
            <a-col :span="8" @click="getCam(itemson.videoUrl, true,itemson.name)" v-for="itemson in item.lists" :key="itemson.id">
              <div class="dial">
                <img src="@/assets/images/watching/noline.png" v-if="false" />
                <img src="@/assets/images/watching/play.png" v-if="true" />
              </div>
              <img
                :src="itemson.imgSrc"
              />
              <p>
                {{itemson.name}}
              </p>
            </a-col>
          </a-row>
        </div>
      </div>
    </div>
    <div class="bim-new-item" v-else>
        <div class="floorCamList">
          <a-row :gutter="16">
            <a-col :span="8" @click="getCam(item.videoUrl, true)" v-for="item in cameras" :key="item.id">
              <div class="dial">
                <img src="@/assets/images/watching/noline.png" v-if="false" />
                <img src="@/assets/images/watching/play.png" v-if="true" />
              </div>
              <img
                :src="item.imgSrc"
              />
              <p class="dialp">
                {{item.name}}
              </p>
            </a-col>
          </a-row>
        </div>
    </div>
    <a-modal
      @destroyOnClose="true"
      :title="'监控播放-'+title"
      :visible="visible"
      @cancel="handleCancel"
      :footer="null"
    >
      <p>
        <CameraNow :getUrl="geturl" ref="cameranow" />
      </p>
    </a-modal>
  </div>
</template>

<script>
import { getFloorList, queryVideoGroupUnderFloor, getCameraListByLocationId } from '@/api/cameras'
import CameraNow from '@/components/cameras/camera_now.vue'
import { message } from 'ant-design-vue'

export default {
  components: {
    CameraNow
  },
  data() {
    return {
      list: [],
      visible: false,
      geturl: '',
      floorid: 'all',
      camerasall: [],
      cameras: [],
      title: ''
    }
  },
  mounted() {
    this.getList()
    this.getcameras()
  },
  methods: {
    getList() {
      const params = {
        areaParentId: '7'
      }
      getFloorList(params).then((res) => {
        console.log(res)
        if (res.code === 200) {
          this.$nextTick(() => {
            this.list = res.result || []
          })
        } else {
          this.list = []
          message.warning({ content: '视频异常，暂无数据' })
        }
      })
    },
    getcameras() {
      const params = {
        buildId: 7
      }
      queryVideoGroupUnderFloor(params).then((res) => {
        if (res.code === 200) {
          const camerasall = res.result
          const arr = []
          for (const i in camerasall) {
            arr.push({ flname: i, lists: camerasall[i] })
          }
          this.camerasall = arr
          console.log(';;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;')
          console.log(this.camerasall)
        } else {
          this.camerasall = []
        }
      })
    },
    handleChange(value) {
      console.log(`selected ${value}`)
      this.floorid = value
      getCameraListByLocationId({ locationId: this.floorid }).then(res => {
        console.log(res)
        if (res.code === 200) {
          this.cameras = res.result || []
          console.log(this.cameras)
        }
      })
    },
    getCam(objUrl, bol, name) {
      console.log(objUrl)
      if (bol) {
        this.visible = true
        this.geturl = objUrl
        this.title = name
        console.log(this.geturl)
        // this.$nextTick(() => {
        //   this.$refs.cameranow.play()
        // })
      } else {
        message.warning({ content: '视频异常，不支持播放!' })
      }
    },
    handleCancel(e) {
      console.log('Clicked cancel button')
      this.visible = false
      // this.$nextTick(() => {
      this.$refs.cameranow.close()
      // })
    }
  }
}
</script>
<style scoped>
div.new-event-div {
  transition: all 0.8s;
  padding: 0.08rem 0.2rem;
  background: rgba(136, 162, 247, 0.1);
  position: relative;
  z-index: 2;
  width: 100%;
}

.new-event-div div {
  text-align: left;
  font-size: 0.14rem;
  color: #ffffff;
  font-family: "Microsoft YaHei";
}

.new-event-div div.bim-title {
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

.new-event-div div.bim-title:after {
  content: "";
  position: absolute;
  padding-bottom: 0.1rem;
  background-color: #6677f0;
  left: 0;
  bottom: 0.05rem;
  z-index: -1;
}

.new-event-div div.bim-title.w1:after {
  width: 67.7%;
}

.new-event-div div.bim-title.w2:after {
  width: 60%;
}

.new-event-div > div.one-row {
  padding: 0.08rem;
  position: relative;
}

.bim-title.w1 {
  float: left;
}
.select {
  margin-left: 3.1rem;
}
.floorNum {
  text-align: center;
  font-size: 0.14rem;
  color: #ffffff;
  overflow: hidden;
  margin-top: 0.1rem;
}
.floor-left,
.floor-right {
  margin-top: 10px;
}
.floor-left {
  width: 0.54rem;
  height: 0.01rem;
  background: #abbbff;
  position: relative;
  float: left;
  margin: 0.1rem 0 0 35%;
}
.floor-left:before {
  content: "";
  display: inline-block;
  width: 0.07rem;
  height: 0.07rem;
  background: #abbbff;
  border-radius: 50%;
  position: absolute;
  right: 0;
  top: -3px;
}
.floor-num {
  width: 0.8rem;
  float: left;
  text-align: center !important;
}
.floor-right {
  width: 0.54rem;
  height: 0.01rem;
  background: #abbbff;
  position: relative;
  float: left;
  margin: 0.1rem 0 0 0;
}
.floor-right:before {
  content: "";
  display: inline-block;
  width: 0.07rem;
  height: 0.07rem;
  background: #abbbff;
  border-radius: 50%;
  position: absolute;
  left: 0;
  top: -3px;
}
img {
  width: 100%;
  height: 1rem;
}
.floorCamList {
  margin-top: 10px;
}
.floorCamList .ant-col {
  cursor: pointer;
}

.floorCamList .ant-col p {
  overflow: hidden; /*超出部分隐藏*/
  white-space: nowrap; /*不换行*/
  text-overflow: ellipsis; /*超出部分文字以...显示*/
}
.floorCamList .ant-col:hover p {
  text-decoration: underline;
}
.dial {
  position: absolute;
  left: 0.08rem;
  top: 0;
  width: calc(100% - 0.16rem);
  height: calc(100% - 0.36rem);
  z-index: 2;
  background-color: rgb(102 119 240 / 32%);
}
p.dialp{
  margin-bottom: 0 !important;
}
.dial img {
  width: 0.5rem;
  height: 0.5rem;
  position: absolute;
  right: 0.1rem;
  bottom: 0rem;
}
.bim-new-item {
  height: 8.6rem;
  overflow: hidden;
  overflow-y: auto;
}
</style>
