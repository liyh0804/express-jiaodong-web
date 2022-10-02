<template>
  <div class="myselfDialog" v-if="detail">
    <div class="selgi">
      <div class="cont">
        <div class="title">
          设备名称-处理-审批详情
          <CloseOutlined class="fl-right" @click="closedialogSon" />
        </div>
        <div class="cont-son-table re">
          <a-table
            class="ostable"
            :columns="columns"
            :data-source="data"
            :pagination="{ pageSize: 10 }"
          >
            <template #action="{ record }">
              <span>
                <a @click="seeimg(record, '查看截图')" class="ch"> 查看图片 </a>
                <a-divider type="vertical"  v-if="record.imgSrc"/>
                <a @click="seeVideo(record, '查看录像')" class="ch"> 查看录像 </a>
              </span>
            </template>
          </a-table>
          <div class="modelshow" v-show="title !== ''">
            <RightCircleOutlined class="close" @click="closedialogThis"/>
            <a-image
              v-if="title === '查看截图'"
              style="width: 100%"
              :src="imgSrc"
            />
            <video :src="videoSrc" autoplay="autoplay" controls="controls" ref="videoREf" v-if="title === '查看录像'">
              您的浏览器暂时不支持视频播放
              </video>
          </div>
          <a-button
            style="right: 20px;bottom:20px;position: absolute"
            type="primary"
            @click="closedialogSon"
          >确定</a-button>
        </div>
      </div>
    </div>
  </div>
  <!-- <a-modal v-model:visible="visible" :title="title" :footer="null" @cancel="closedialog">
    <a-image
      style="width: 100%"
      v-if="title === '查看截图'"
      src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
    />
    <video :src="videoSrc" autoplay="autoplay" controls="controls" ref="videoREf" v-if="title === '查看录像'">
      您的浏览器暂时不支持视频播放
      </video>
  </a-modal> -->
</template>
<script>
import { defineComponent, ref, onMounted, reactive, toRefs } from 'vue'
import { CloseOutlined, RightCircleOutlined } from '@ant-design/icons-vue'
import { getEventProcessDetailList } from '@/api/inteli'
import { message } from 'ant-design-vue'
// import { prop } from 'vue-class-component'
// import { message } from 'ant-design-vue'
const columns = [
  {
    title: '流程节点',
    dataIndex: 'processName',
    width: 100
  },
  {
    title: '处理时间',
    dataIndex: 'createTime',
    width: 180
  },
  {
    title: '处理人',
    dataIndex: 'handleBy',
    width: 80
  },
  {
    title: '描述',
    dataIndex: 'description',
    width: 160
  },
  {
    title: '记录文件',
    key: 'action',
    slots: { customRender: 'action' },
    width: 150
  }
]

export default defineComponent({
  components: {
    CloseOutlined, RightCircleOutlined
  },
  props: {
    detail: Boolean,
    faultId: String
  },
  setup(props, ctx) {
    const state = reactive({
      data: [],
      imgSrc: null
    })
    const visible = ref(false)
    const title = ref('')
    const videoSrc = ref('')
    const videoREf = ref()
    // const warningid = props.warningid
    // const deailid = props.deailid
    // console.log(warningid, deailid)
    const seeimg = (obj) => {
      console.log('===================================')
      console.log(obj)
      if (obj.picUrl) {
        state.imgSrc = obj.picUrl || null
        visible.value = true
        title.value = '查看截图'
      } else {
        message.warning('图片地址错误，请联系后台管理员')
      }
    }

    const seeVideo = (obj) => {
      console.log('===================================')
      console.log(obj)
      if (obj.videoUrl) {
        visible.value = true
        videoSrc.value = obj.videoUrl || null
        title.value = '查看录像'
      } else {
        message.warning('音频地址错误，请联系后台管理员')
      }

      // videoREf.value.play()
    }
    const closedialogSon = () => {
      console.log(props)
      // props.detail = false
      ctx.emit('closedialog')
    }
    const closedialogThis = () => {
      title.value = ''
    }
    const closedialog = () => {
      console.log('close')
      // console.log(videoREf.value)
      if (videoREf.value) {
        videoREf.value.pause()
      }
    }

    onMounted(() => {
      console.log(props.faultId)
      getEventProcessDetailList({ faultId: props.faultId }).then(res => {
        console.log(res)
        state.data = res.result || []
      })
    })
    return {
      ...toRefs(state),
      closedialogSon,
      closedialogThis,
      closedialog,
      seeimg,
      seeVideo,
      videoSrc,
      title,
      visible,
      columns
    }
  }
})
</script>
<style scoped>
.myselfDialog {
  width: 100%;
  height: 100%;
  background: rgba(51, 51, 51, 0.116);
  position: fixed;
  left: 0;
  top: 0;
  z-index: 10;
}
.selgi {
  width: 100%;
  height: 100%;
  display: flex;
}
.cont {
  width: 10rem;
  height: 8rem;
  margin: auto;
  border-radius: 8px;
  overflow: hidden;
}
.cont .title {
  background: #404b9f;
  height: 0.4rem;
  line-height: 0.2rem;
  color: #fff;
  padding: 0.1rem 0.2rem;
}
.fl-right {
  float: right;
  cursor: pointer;
  margin: 0.02rem 0 0 0;
}
.cont-son-table {
  color: #fff;
  height: calc(100% - 0.4rem);
  background-color: #292c60;
  padding: 0.2rem;
}
/deep/ .ostable .ant-table-thead > tr > th {
  background: #2f336e;
  border-bottom: 1px solid #2f336e;
}
/deep/ .ant-table-tbody > tr:nth-child(2n) > td {
  background: rgba(102, 119, 240, 0) !important;
  color: rgba(255, 255, 255, 0.6) !important;
}
/deep/ .ant-table-tbody > tr > td {
  border-bottom: 0.01rem solid #4B4D79 !important;
  color: rgba(255, 255, 255, 0.6) !important;
}
/deep/ a.ch{
  color: #71E8FF !important;
  font-size: 0.08rem;
  margin-right: 2em;
}
/deep/ a.ch:hover{
  text-decoration: underline;
}
.re{
  position: relative;
}
.modelshow{
  position: absolute;
  left: 0;
  top: 0;
  z-index: 1;
  width: 100%;
  height: 100%;
}
.close{
  z-index: 2;
  position: absolute;
  right: 0;
  top: 0;
  background: rgba(51, 51, 51, 0.466);
  padding: 1em;
  font-size: 0.2rem;
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
</style>
