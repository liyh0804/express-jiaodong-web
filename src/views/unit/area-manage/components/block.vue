<template>
  <div class="form-wrap">
    <a-form
    layout="inline"
    :model="formState"
    @finish="handleFinish"
    @finishFailed="handleFinishFailed"
  >
    <a-form-item label="区域/楼栋:">
      <a-select class="region-select" v-model:value="formState.region" placeholder="请选择区域/楼栋">
        <a-select-option value="shanghai">Zone one</a-select-option>
        <a-select-option value="beijing">Zone two</a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item label="楼层:">
      <a-select class="layer-select" v-model:value="formState.layer" placeholder="请选择楼层">
        <a-select-option value="shanghai">Zone one</a-select-option>
        <a-select-option value="beijing">Zone two</a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item label="子区域/单元:">
      <a-select class="subarea-select" v-model:value="formState.subArea" placeholder="请选择">
        <a-select-option value="shanghai">Zone one</a-select-option>
        <a-select-option value="beijing">Zone two</a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item label="单位名称/业主姓名:">
      <a-input class="name-inpt" v-model:value="formState.name" type="name" placeholder="请输入">
        <!-- <template #prefix><LockOutlined style="color: rgba(0, 0, 0, 0.25)" /></template> -->
      </a-input>
    </a-form-item>
    <a-form-item class="right">
      <a-button class="reset-style">
        重置
      </a-button>
      <a-button
        type="primary"
        html-type="submit"
      >
        查询
      </a-button>
    </a-form-item>
  </a-form>
  </div>
</template>

<script>
import { defineComponent, reactive } from 'vue'
export default defineComponent({
  setup() {
    const formState = reactive({
      region: 'shanghai',
      layer: 'one',
      name: '',
      subArea: ''
    })

    const handleFinish = values => {
      console.log(values, formState)
    }

    const handleFinishFailed = errors => {
      console.log(errors)
    }

    return {
      formState,
      handleFinish,
      handleFinishFailed
    }
  }
})
</script>

<style lang="less" scoped>
.form-wrap {
  .area-select {
    width: 128px;
  }
  .layer-select, .subarea-select {
    width: 104px;
  }
  .name-inpt {
    width: 136px;
  }
  .right {
    margin: 0;
    float: right;
    .reset-style {
      margin-right: 8px;
    }
  }
}
</style>
