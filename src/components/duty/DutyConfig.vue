<template>
  <div class="duty-config-dialog-div">
    <div class="gh-modal-dialog-header">查岗设置</div>
    <a-spin :spinning="false">
      <div class="gh-modal-dialog-body">
        <a-form
          name="search-form"
          ref="formRef"
          :model='formState'
          class="form-wrap"
          id="searchForm"
          @finish="handleFinish"
        >
          <div>
            <a-form-item label='自动查岗时间范围' name="timeRange" class="timeRange">
              <a-time-picker class="gh-time_picker"
                v-model:value='formState.startHour' format="HH:mm" :placeholder="['请选择']"/>
              <span>~</span>
              <a-time-picker class="gh-time_picker"
                v-model:value='formState.endHour' format="HH:mm" :placeholder="['请选择']"/>
            </a-form-item>
          </div>
          <div>
            <a-form-item label='自动查岗频率' name="rate">
              <a-select
                v-model:value='formState.rate'
                class='device-select'
                :dropdownMatchSelectWidth='false'
                :defaultActiveFirstOption="true"
                style="width: 331px"
              >
                <a-select-option key="1" value="1">1次/1小时</a-select-option>
                <a-select-option key="2" value="2">1次/2小时</a-select-option>
                <a-select-option key="3" value="3">1次/3小时</a-select-option>
                <a-select-option key="4" value="4">1次/4小时</a-select-option>
                <a-select-option key="5" value="5">1次/5小时</a-select-option>
                <a-select-option key="6" value="6">1次/6小时</a-select-option>
              </a-select>
            </a-form-item>
          </div>
          <a-form-item class="clearfix" style="display:block;width: 100%">
            <a-button type="primary" @click="onSubmit" :disabled="canSubmit"
                      style="margin-right: 11px;float: right;width: 75px">确定
            </a-button>
            <a-button ghost class='btn' @click="onCancal" style="margin-right: 15px; float:right;width: 75px">取消
            </a-button>
          </a-form-item>
        </a-form>
      </div>
    </a-spin>
  </div>
</template>

<script>
import { computed, onMounted, reactive } from 'vue'
import { useStore } from 'vuex'
import { notification } from 'ant-design-vue'

export default {
  name: 'dutyConfig',
  emits: ['close'],
  setup(props, context) {
    const store = useStore()
    const formState = reactive({
      startHour: '',
      endHour: '',
      rate: '1'
    })
    onMounted(() => {
      store.dispatch('duty/getConfigDutyRate').then((res) => {
        if (res && res.success) {
          formState.rate = String(res.result.rate)
          formState.startHour = res.result.startHour
          formState.endHour = res.result.endHour
        }
      })
    })

    const onCancal = () => {
      context.emit('close')
    }

    const onSubmit = () => {
      console.log(formState.startHour)

      const f = {
        startHour: formState.startHour,
        endHour: formState.endHour,
        rate: formState.rate
      }

      store.dispatch('duty/configDutyRate', f).then((res) => {
        if (res && res.success) {
          notification.success({
            description: '设置成功'
          })
          context.emit('close')
        } else {
          notification.success({
            description: '设置失败'
          })
        }
      })
    }

    const canSubmit = computed(() => {
      return !(formState.startHour && formState.endHour && formState.rate)
    })

    return {
      formState,
      onSubmit,
      onCancal,
      canSubmit
    }
  }
}
</script>
<style scoped>
@import '~@/assets/css/formstyle.css';

.duty-config-dialog-div {
  background: #292C60;
}

.duty-config-dialog-div .gh-modal-dialog-body .device-details-title {
  border-bottom: 1px solid;
  border-color: rgba(255, 255, 255, 0.1);
  line-height: 0.4rem;
  font-weight: bold;
  position: relative;
}

.gh-modal-dialog .ant-modal-content .ant-modal-body .gh-modal-dialog-body {
  padding-left: 0.32rem;
}

.ant-form {
  background: none;
}

:deep().ant-col.ant-form-item-label {
  min-width: 160px;
  text-align: left;
}

.timeRange span {
  color: #FFFFFF;
  padding: 0 10px;
}

</style>
<style>
.ant-time-picker {
  background-color: #434880;
}

.ant-time-picker-panel {
  color: #ffffff;
}

.ant-time-picker-panel-input {
  color: #FFFFFF;
  background-color: #434880;
}

.ant-time-picker-panel-inner {
  background-color: #434880;
}

.ant-time-picker-input {
  border: none;
}

li.ant-time-picker-panel-select-option-selected {
  background-color: #4c57b2;
}

li.ant-time-picker-panel-select-option-selected:hover {
  background-color: #1e2046;
}

.ant-time-picker-panel-select li:hover {
  background-color: #1e2046;
}

.ant-time-picker-clear {
  background: none;
}

.ant-time-picker-clear:hover svg {
  fill: #FFFFFF;
}
.gh-time_picker input{
  background-color: transparent;
}
</style>
