<template>
  <div class="login-page">
    <div class="login-box">
      <div class="header">
        智慧消防云平台
        <div class="bg-wrap"></div>
      </div>
      <sl-login-comp />
    </div>
  </div>
</template>

<script>
import LoginBox from '@/components/LoginComp.vue'

export default {
  components: {
    'sl-login-comp': LoginBox
  }
}
</script>

<style lang="less" scoped>
.login-page {
  width: 100%;
  height: 100%;
  background: url(../assets/images/login/bg.png) no-repeat center;
  background-size: 19.2rem 10.8rem;
  // background-color: pink;

  .login-box {
    position: absolute;
    top: 3.2rem;
    right: 2.4rem;
    width: 5.2rem;
    height: 4rem;
    background: url(../assets/images/login/bg-login.png) no-repeat center;
    background-size: 5.2rem 4rem;
    padding: 0.5rem 0.76rem 0.6rem;
    .header {
      font-size: 0.42rem;
      line-height: 0.55rem;
      color: #fff;
      font-weight: 700;
      text-align: center;
      margin-bottom: 0.48rem;
      .bg-wrap {
        width: 2.41rem;
        height: 0.28rem;
        background-color: #6677F0;
        margin: 0 auto;
        margin-top: -0.2rem;
      }
    }
  }
}
</style>
