<template>
  <section class="header-comp">
    <div class="logo-wrapper">
      <div class="logo">
        <h1>
          <a href="/dashboard" title="智慧消防平台">智慧消防平台</a>
        </h1>
      </div>
      <h1 class="title">智慧消防平台</h1>
    </div>
    <div class="nav-wrap">
      <slot></slot>
    </div>
    <div class="right-wrapper">
      <slot name="userInfo"></slot>
    </div>
  </section>
</template>
<style lang="less" scoped>
  .header-comp {
    * {
      margin: 0;
      padding: 0;
      border: 0;
    }
    height: 0.88rem;
    padding: 0 0.34rem;
    .logo-wrapper {
      display: flex;
      width: 5.2rem;
      flex-direction: row;
      .logo {
        width: 0.48rem;
        height: 0.48rem;
        margin-top: 0.2rem;
        z-index: 0;
        a {
          display: block;
          width: 0.48rem;
          height: 0.48rem;
          background: url(../assets/images/monitor/logo.png) no-repeat center;
          background-size: 0.48rem 0.48rem;
          // font-size: 0;
          text-indent:  -99999rem;
          overflow: hidden;
        }
      }
      h1.title {
        font-size: 0.36rem;
        color: #fff;
        line-height: 0.88rem;
        font-weight: 700;
        margin-left: 0.16rem;
        z-index: 0;
      }

    }
    .logo-wrapper::before {
      content: '';
      position: absolute;
      width: 5.2rem;
      height: 0.28rem;
      z-index: 0;
      margin-top: 0.48rem;
      background: linear-gradient(270deg, rgba(102, 119, 240, 0) 0%, #6677F0 100%);;
    }
    .nav-wrap {
      position: absolute;
      top: 0;
      margin-left: 5.2rem;
    }
    .right-wrapper {
      float: right;
      height: 0.48rem;
      margin-top: -0.68rem;
      right: 0;
    }
  }
</style>
