<template>
  <div class="content-wrap">
    <div class="left">
      <leftfloor />
    </div>
    <div class="right">
      <rightfloor />
    </div>
    <a-modal
      @destroyOnClose="true"
      title="监控播放"
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
// import { onMounted } from 'vue'
import CameraNow from '@/components/cameras/camera_now.vue'
import leftfloor from '@/components/cameras/cameraLeft.vue'
import rightfloor from '@/components/cameras/cameraRight.vue'

export default {
  components: {
    CameraNow,
    leftfloor,
    rightfloor
  },
  data() {
    return {
      list: [],
      visible: false,
      geturl: '',
      floorid: 'all'
    }
  },
  mounted() {
    // this.getList();
  },
  methods: {

  }
}
</script>

<style lang="less" scoped>
.content-wrap {
  color: #fff;
  padding: 0.1rem 0.3rem 0;

}

.bim-new-item {
  line-height: 0.22rem;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.left {
  float: left;
  width: 5.74rem;
  height: 9.44rem;
  background: url(../assets/images/watching/leftboder.png) no-repeat;
  background-size: 100% 9.44rem;
  padding: 1em;

}
.right {
  width: 12.5rem;
  margin-left: 5.84rem;

}
</style>
