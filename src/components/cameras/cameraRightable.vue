<template>
<ConfigProvider :locale="locale">
  <a-table
    class="ostable table-warp"
    :columns="columns"
    :data-source="data"
    :pagination="pagination"
    @change="onChange"
    :loading="loading"
  >
    <template #status="{ record }">
      <span v-if="record.flowStatus === 0">待处理</span>
      <span v-if="record.flowStatus === 2">待处理</span>
      <span v-if="record.flowStatus === 3">待处理</span>
      <span v-if="record.flowStatus == 4">待处理</span>
      <span v-if="record.flowStatus == 5">已处理</span>
    </template>
    <template #address="{ record }">
      <div class="one-row address-wrap" :title="record.addr">
        {{ record.addr }}
      </div>
    </template>
    <template #action="{ record }">
      <span>
        <a @click="seeimg(record, '查看截图')">
          <img src="@/assets/images/watching/seeimage.png" />查看截图
        </a>
        <a-divider type="vertical" />
        <a @click="seeVideo(record, '查看录像')">
          <img src="@/assets/images/watching/seeVideo.png" />查看录像
        </a>
        <a-divider type="vertical" />
        <a @click="dosoneting(record, '处理')">
          <img src="@/assets/images/watching/donow.png" />处理
        </a>
        <a-divider type="vertical" />
        <a> <img src="@/assets/images/watching/map.png" />定位 </a>
      </span>
    </template>
  </a-table>
</ConfigProvider>
  <a-modal
    v-model:visible="visible"
    :title="title"
    :footer="null"
    @cancel="closedialog"
  >
    <a-image style="width: 100%" v-if="title == '查看截图'" :src="picUrl" />
    <!-- <videPlay  v-if="title == '查看录像'"/> -->
    <video
      :src="videoSrc"
      autoplay="autoplay"
      controls="controls"
      ref="videoREf"
      v-if="title == '查看录像'"
    >
      您的浏览器暂时不支持视频播放
    </video>
    <handleModelStep
      @closeBig="closeBig"
      @getList="getList"
      v-if="visibledo == true"
      :title="title"
      :flowStatus="flowStatus"
      :faultId="faultId"
    />
  </a-modal>
</template>
<script>
import { ConfigProvider } from 'ant-design-vue'
import { defineComponent, ref, onMounted, reactive, toRefs } from 'vue'
import handleModelStep from '@/components/handle/handleModelStep.vue'
import { bizCameraEventList } from '@/api/inteli'
import locale from 'ant-design-vue/lib/locale-provider/zh_CN'

const columns = [
  {
    title: '报警时间',
    dataIndex: 'createTime',
    width: 180
  },
  {
    title: '设备ID',
    dataIndex: 'sysOrgCode',
    width: 120
  },
  {
    title: '设备地址',
    dataIndex: 'addr',
    width: 120,
    slots: {
      customRender: 'address'
    }
  },
  {
    title: '报警描述',
    dataIndex: 'eventDetail',
    width: 160
  },
  {
    title: '事件类型',
    dataIndex: 'eventType',
    width: 100
  },
  {
    title: '处理状态',
    dataIndex: 'flowStatus',
    slots: { customRender: 'status' },
    width: 130
  },
  {
    title: '操作',
    key: 'action',
    slots: { customRender: 'action' },
    width: 400
  }
]

export default defineComponent({
  components: {
    handleModelStep,
    ConfigProvider
  },
  props: {
    form: Object
  },
  setup(props) {
    const state = reactive({
      locale: locale,
      loading: false,
      flowStatus: 0,
      faultId: '',
      data: [],
      params: props.form,
      picUrl: null,
      total: 0,
      pagination: {
        pageSize: props.form.pageSize,
        current: props.form.pageNo,
        total: 0,
        showQuickJumper: {
          goButton: '页'
        },
        showTotal: (total, range) => `当前${range[0]}-${range[1]}条,总共 ${total} 条`
      },
      bimInfoVisable: false,
      floorArea: null
    })

    const visible = ref(false)
    const visibledo = ref(false)
    const title = ref('')
    const videoSrc = ref('')
    const videoREf = ref()
    // const warningid = props.warningid
    // const deailid = props.deailid
    const closeBig = () => {
      visible.value = false
    }
    const getList = () => {
      // alert('get')
      state.loading = true
      bizCameraEventList(state.params).then((res) => {
        if (res.code === 200) {
          state.data = res.result.records || []
          state.pagination = {
            pageSize: state.params.pageSize,
            current: state.params.pageNo,
            total: res.result.total
          }
          state.loading = false
        }
      })
    }
    const onChange = (pageNumber) => {
      state.params.pageNo = pageNumber.current
      getList()
    }
    const seeimg = (obj) => {
      const usnowobj = JSON.parse(JSON.stringify(obj))
      visible.value = true
      visibledo.value = false
      state.picUrl = usnowobj.picUrl
      title.value = '查看截图'
    }

    const seeVideo = (obj) => {
      const usnowobj = JSON.parse(JSON.stringify(obj))
      visible.value = true
      visibledo.value = false
      videoSrc.value = usnowobj.deviceUrl
      title.value = '查看录像'
      videoREf.value.play()
    }

    const closedialog = () => {
      visible.value = false
      visibledo.value = false
      if (videoREf.value) {
        videoREf.value.pause()
      }
    }

    // 处理弹窗

    const dosoneting = (obj) => {
      title.value = '设备名称-' + '处理'
      visible.value = true
      visibledo.value = true

      state.flowStatus = obj.flowStatus
      console.log(obj)
      state.faultId = obj.id
    }

    onMounted(() => {
      getList()
      // const params = {}
      // bizCameraEventList(params).then((res) => {
      //   if (res.code === 200) {
      //     state.data = res.result.records || []
      //   }
      // })
    })

    return {
      ...toRefs(state),
      closeBig,
      onChange,
      getList,
      videoREf,
      visible,
      visibledo,
      seeimg,
      seeVideo,
      closedialog,
      dosoneting,
      title,
      videoSrc,
      columns
    }
  }
})
</script>
<style scoped>
.address-wrap {
  width: 1.21rem;
}
img {
  width: 0.25rem;
  margin: -0.05rem 0.04rem 0 0;
  /* float: left; */
}
a {
  color: #71e8ff;
  margin-right: 0.18rem;
}
a:last-child {
  margin-right: 0;
}
/deep/ .ant-spin-blur {
  clear: none !important;
}
/deep/ .ant-table-thead > tr > th {
  height: 0.4rem;
  padding: 0.09rem 0.24rem 0.09rem 0.16rem;
  font-size: 0.14rem;
  line-height: 0.22rem;
}
/deep/ tr > td {
  font-size: 0.14rem;
  line-height: 0.22rem;
}
.ant-table-pagination.ant-pagination {
  color: #fff;
}
</style>
