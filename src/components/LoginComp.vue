<template>
  <a-spin :spinning="formState.loading">
    <a-form
      name="custom-validation"
      ref="formRef"
      :model="formState"
      :rules="rules"
      v-bind="layout"
      @finish="handleFinish"
      @finishFailed="handleFinishFailed"
    >
      <a-form-item required label="" name="username">
        <div class="login-form-item">
          <img class="icon-img" src="../assets/images/login/icon-account.png" alt="username" />
          <a-input v-model:value="formState.username" type="text" autocomplete="off" placeholder="请输入账号" />
        </div>
      </a-form-item>
      <a-form-item required label="" name="password">
        <div class="login-form-item">
          <img class="icon-img" src="../assets/images/login/icon-password.png" alt="password" />
          <a-input v-model:value="formState.password" :type="formState.passwordType" autocomplete="off" placeholder="请输入密码"></a-input>
          <div class="eye-wrap" v-if="formState.visible" @click="changePasswordType">
            <img class="psd_img" src="../assets/images/login/password-view.png" alt="p_close" />
          </div>
          <div class="eye-wrap" v-else @click="changePasswordType">
            <img class="psd_img" src="../assets/images/login/password-close.png" alt="p_close" />
          </div>
        </div>
      </a-form-item>
      <a-form-item>
        <div class="login-form-item btn-wrap">
          <a-button type="primary" class="submit-btn" html-type="submit">登录</a-button>
        </div>
      </a-form-item>
    </a-form>
  </a-spin>
</template>
<script>
import { reactive, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

export default {
  setup() {
    const store = useStore()
    const router = useRouter()
    const formRef = ref()
    const formState = reactive({
      username: '',
      password: '',
      passwordType: 'password',
      loading: false,
      visible: false
    })

    const validateAccount = async (rule, value) => {
      if (value === '') {
        return Promise.reject('请输入账号')
      } else {
        // if (formState.username !== '') {
        //   formRef.value.validateField('username')
        // }
        return Promise.resolve()
      }
    }

    const validatePass = async (rule, value) => {
      if (value === '') {
        return Promise.reject('请输入密码')
      } else {
        // if (formState.password !== '') {
        //   formRef.value.validateField('password')
        // }
        return Promise.resolve()
      }
    }
    const rules = {
      username: [{ validator: validateAccount, trigger: 'change' }],
      password: [{ validator: validatePass, trigger: 'change' }]
    }
    const layout = {
      // labelCol: { span: 4 },
      // wrapperCol: { span: 14 }
    }
    const handleFinish = values => {
      console.log(values, formState)
      store.dispatch('user/login', { ...values }).then((res) => {
        debugger
        router.push('/unit-manage/area-manage')
      })
    }
    const handleFinishFailed = errors => {
      console.log(errors)
    }

    return {
      formState,
      formRef,
      rules,
      layout,
      token: computed(() => store.state.user.token),
      userInfo: computed(() => store.state.user.userInfo),
      handleFinishFailed,
      handleFinish
    }
  },
  methods: {
    changePasswordType() {
      this.formState.visible = !this.formState.visible
      this.formState.passwordType = this.formState.visible ? 'text' : 'password'
    }
  }
}
</script>

<style lang="less" scoped>
.ant-form {
  img.icon-img {
    position: absolute;
    top: 0.08rem;
    width: 0.25rem;
    height: 0.24rem;
    vertical-align: middle;
  }
  input {
    position: absolute;
    width: 2.98rem;
    height: 0.4rem;
    margin-left: 0.25rem;
    background: transparent;
    border: 0;
    outline: none;
    box-shadow: none;
    color: #fff;
  }
  input:focus, input:blur {
    border: none;
    box-shadow: none;
  }
  .has-error .login-form-item {
    border-color: #FD8165;
  }
  .login-form-item {
    position: relative;
    width: 3.69rem;
    height: 0.4rem;
    border: 1px solid rgba(102, 119, 240, 0.6);
    border-radius: 2px;
    padding: 0 0.16rem;
    &.error {
      border-color: #FD8165;
    }
    .eye-wrap {
      position: absolute;
      width: 0.4rem;
      height: 0.4rem;
      right: 0.16rem;
      text-align: right;
      .psd_img {
        width: 0.24rem;
        height: 0.24rem;
        vertical-align: super;
        margin-top: 0.08rem;
      }
    }
    input:-webkit-autofill , textarea:-webkit-autofill, select:-webkit-autofill {
      -webkit-text-fill-color: #ededed !important;
      -webkit-box-shadow: 0 0 0px 1000px transparent inset !important;
      background-color:transparent;
      background-image: none;
      transition: background-color 50000s ease-in-out 0s; //背景色透明 生效时长 过渡效果 启用时延迟的时间
    }
  }
  :deep(.ant-form-item) {
    margin-bottom: 0.24rem;
  }
  :deep(.ant-form-item-control) {
    line-height: unset;
  }
  .btn-wrap {
    margin-top: 0.16rem;
    padding: 0;
    .submit-btn {
      width: 3.69rem;
      height: 0.4rem;
      font-size: 0.16rem;
      line-height: 0.4rem;
      border-radius: 2px;
      margin: 0;
      background: #6677F0;
    }
  }

  .has-error .ant-input:not(.has-error .ant-input-disabled), -has-error .ant-input:not(.has-error .ant-input-disabled), .has-error .ant-input:not(-has-error .ant-input-disabled), -has-error .ant-input:not(-has-error .ant-input-disabled) {
    background: transparent;
    background-color: transparent;
    box-shadow: none;
  }
  /deep/ .has-error .ant-input:not(.has-error .ant-input-disabled), -has-error .ant-input:not(.has-error .ant-input-disabled), .has-error .ant-input:not(-has-error .ant-input-disabled), -has-error .ant-input:not(-has-error .ant-input-disabled) {
    background-color: transparent;
    box-shadow: none;
  }
  .has-error .ant-input-affix-wrapper:not(.has-error .ant-input-affix-wrapper-disabled), -has-error .ant-input-affix-wrapper:not(.has-error .ant-input-affix-wrapper-disabled), .has-error .ant-input-affix-wrapper:not(-has-error .ant-input-affix-wrapper-disabled), -has-error .ant-input-affix-wrapper:not(-has-error .ant-input-affix-wrapper-disabled) {
    background: transparent;
  }
  :deep(.ant-input-affix-wrapper) {
    position: absolute;
    left: 0.25rem;
    width: 3.28rem;
    height: 0.4rem;
    line-height: 0.4rem;
    border: 0;
    background-color: transparent;
    // background-color: red;
    input {
      background-color: transparent;
      color: #fff;
      outline: none;
      border: 0;
      box-shadow: none;
    }
    :deep(input:focus) {
      border: 0;
      box-shadow: none;
    }
  }
  :deep(.ant-input-affix-wrapper:focus) {
    box-shadow: 0;
  }
  :deep(.ant-form-explain, .ant-form-extra) {
    position: absolute;
    margin-left: 0.52rem;
    // margin-top: 0.04rem;
    color: #FD8165;
  }
  :deep(.ant-input-password.ant-input-affix-wrapper) {
    box-shadow: none;
  }
}
</style>
