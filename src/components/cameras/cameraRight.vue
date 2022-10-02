<template>
  <div class="right-top">
    <a-form layout="inline" :model="form" ref="searchForm">
      <a-form-item label="报警描述">
        <!-- faultDes -->
        <input
          class="usinp"
          placeholder="请输入报警描述"
          v-model="form.faultDes"
        />
      </a-form-item>
      <a-form-item label="处理状态">
        <a-select
          v="form.status"
          :default-value="undefined"
          show-search
          placeholder="默认全部"
          option-filter-prop="children"
          style="width: 2.2rem"
          @change="handleChangeDeail"
        >
          <a-select-option :value="undefined">全部</a-select-option>
          <a-select-option value="0">待处理</a-select-option>
          <a-select-option value="1">进行中</a-select-option>
          <a-select-option value="2">已完成</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item>
        <a-button type="primary" @click="search()"> 查询 </a-button>
        <a-button style="margin-left: 10px" @click="resetForm"> 重置 </a-button>
      </a-form-item>
    </a-form>
  </div>
  <div class="right-bottom">
    <cameraRightTable :form="form" ref="camerTable" />
  </div>
</template>

<script>
// import { message } from 'ant-design-vue';
import cameraRightTable from '@/components/cameras/cameraRightable.vue'

export default {
  components: {
    cameraRightTable
  },
  data() {
    return {
      form: {
        faultDes: undefined,
        status: undefined,
        pageNo: 1,
        pageSize: 10
      }
    }
  },
  mounted() {},
  methods: {
    search() {
      // console.log(this.form)
      this.$refs.camerTable.getList()
    },
    resetForm() {
      this.$router.go(0)
      this.form = {
        faultDes: undefined,
        status: undefined,
        pageNo: 1,
        pageSize: 10
      }
      // this.faultDes="undefined"
      // this.status="undefined"
    },

    handleChangeWarning(value) {
      console.log(value)
      this.form.faultDes = value
    },
    handleChangeDeail(value) {
      console.log(`selected ${value}`)
      this.form.status = value
    }
  }
}
</script>
<style scoped>
.right-top {
  padding: 0.12rem 0 0 0.12rem;
  width: 100%;
  background: url(../../assets/images/watching/righttop.png) no-repeat;
  background-size: 100% 0.7rem;
  height: 0.7rem;
}
.right-bottom {
  margin-top: 0.1rem;
  width: 100%;
  padding: 1em;
  background: url(../../assets/images/watching/rightbottom.png) no-repeat;
  background-size: 100% 8.64rem;
  height: 8.64rem;
}
.ant-form .ant-form-item input, .ant-calendar-picker-container input.usinp {
  padding: 0 0.1rem;
  color: #fff;
  background-color: rgba(171, 187, 255, 0.2) !important;
  border: none;
  height: 0.3rem;
}
::-webkit-input-placeholder { /* WebKit browsers */
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.12rem;
}

::-moz-placeholder { /* Mozilla Firefox 19+ */
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.12rem;
}

:-ms-input-placeholder { /* Internet Explorer 10+ */
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.12rem;
}
/deep/ .ant-form {
  background-image: none !important;
  background-size: 18.56rem 0.64rem;
}
</style>
