<template>
  <div class="detail">
    <h1 class="title">基本信息</h1>
    <section class="grp">
      <section class="group">
        <div class="item">
          <label for="">设备类型:</label>
          <span>自动喷火灭火设施</span>
        </div>
        <div class="item">
          <label for="">设备型号:</label>
          <span>{{ detail.deviceModel }}</span>
        </div>
        <div class="item">
          <label for="">绑定状态:</label>
          <span>{{ detail.bindStatus == 0 ? '未绑定' : '已绑定' }}</span>
        </div>
      </section>
      <section class="group">
        <div class="item">
          <label for="">设备名称:</label>
          <span>{{ detail.deviceSubTypeName }}</span>
        </div>
        <div class="item">
          <label for="">设备序列号:</label>
          <span>{{ detail.devSn }}</span>
        </div>
        <div class="item">
          <label for="">绑定地址:</label>
          <span class="address">--</span>
        </div>
      </section>
      <section class="group">
        <div class="item">
          <label for="">生产厂家:</label>
          <span>{{ detail.devCompanyName }}</span>
        </div>
        <div class="item">
          <label for="">生产日期:</label>
          <span>{{ detail.productDate }}</span>
        </div>
      </section>
      <section class="group">
        <div class="item">
          <label for="">设备品牌:</label>
          <span>{{ detail.deviceBrand }}</span>
        </div>
        <div class="item">
          <label for="">有效期:</label>
          <span>{{ detail.invalidDate }}</span>
        </div>
      </section>
    </section>
    <h1 class="title">其他</h1>
    <section class="other-section">
      <div>
        <label for="">检验报告:</label>
        <span><a :href="detail.reportUrl" target="_blank">检验报告</a></span>
      </div>
    </section>
  </div>
</template>

<script>
import { computed, onMounted, reactive } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { getDictByCode } from '@/api/dictcode'

export default {
  setup(props, context) {
    const route = useRoute()
    const store = useStore()
    const state = reactive({
      types: []
    })
    const { deviceId = '' } = route.query || {}
    onMounted(() => {
      store.dispatch('device/getDeviceDetailById', {
        payload: {
          id: deviceId
        }
      })
      getDictByCode('device_type').then(res => {
        if (res && res.success && res.result.length > 0) {
          state.types = res.result
        } else {
          // message.error('获取设备类型失败', 1)
        }
      }).catch(error => { console.log(error) })
    })

    return {
      detail: computed(() => store.state.device.deviceDetail)
    }
  }
}
</script>

<style lang="less" scoped>
.detail {
  padding: 0 24px;
  background-color: #fff;
  .title {
    margin: 0;
    padding: 20px 0;
    font-size: 16px;
    color: #000000;
    font-weight: 700;
  }
  label {
    font-size: 14px;
    color: #000;
    margin-right: 8px;
  }

  section.grp {
    display: flex;
    justify-content: space-between;
    height: 130px;
    border-bottom: 1px solid rgba(0, 0, 0, .06);
    .group {
      .item {
        margin-bottom: 16px;
        span {
          color: rgba(0, 0, 0, .6);
          &.address {
            display: inline-block;
            vertical-align: top;
            max-width: 280px;
          }
        }
      }
    }
  }
  .other-section {
    padding: 2px 0 12px;
  }
}
</style>
