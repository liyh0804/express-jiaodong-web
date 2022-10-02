<template>
  <ul class="navitems clearfix">
    <li :class="$route.path === '/dashboard' || $route.path === '/' ? 'active' : ''">
      <!-- <router-link to="/dashboard">监控中心</router-link> -->
      <a href="/dashboard">监控中心</a>
    </li>
    <li :class="$route.path === '/issue_manage/fire' ? 'active' : ''">
      <router-link to="/issue_manage/fire">火警管理</router-link>
    </li>
    <li :class="$route.path === '/issue_manage/breakdown' ? 'active' : ''">
      <router-link to="/issue_manage/breakdown">故障管理</router-link>
    </li>
    <li :class="$route.path === '/issue_manage/hidden_trouble' ? 'active' : ''">
      <router-link to="/issue_manage/hidden_trouble">隐患管理</router-link>
    </li>
    <li :class="$route.path === '/inteli_monitor_sys' ? 'active' : ''">
      <router-link to="/inteli_monitor_sys">智能监控</router-link>
    </li>
    <li :class="$route.path === '/maintenance_manage' ? 'active' : ''">
      <router-link to="/maintenance_manage">维保管理</router-link>
    </li>
    <li :class="$route.path === '/patrol_check' ? 'active' : ''">
      <router-link to="/patrol_check">巡检管理</router-link>
    </li>
    <li :class="$route.path === '/duty_check' ? 'active' : ''">
      <router-link to="/duty_check">值班查岗</router-link>
    </li>
  </ul>
</template>

<script>
export default {
  data () {
    return {
      path: '/dashboard'
    }
  },
  watch: {
    '$route.path': function(newVal, oldVal) {
      // console.log(newVal+"---"+oldVal);
      this.path = newVal
      // if(newVal === '/login'){
      //   console.log('欢迎进入登录页面');
      // } else if(newVal === '/register'){
      //   console.log('欢迎进入注册页面');
      // }
    }
  }
}
</script>

<style lang="less" scoped>
ul.navitems {
  margin: 0;
  border: 0;
  height: 0.88rem;
  width: 11.2rem;
  padding-inline-start: 0;

  li {
    list-style: none;
    float: left;
    width: 1.4rem;
    height: 0.88rem;
    text-align: center;
    padding: 0.29rem 0 0.12rem 0;
    a {
      display: inline-block;
      height: 100%;
      font-size: 0.22rem;
      line-height: 0.32rem;
      color: #ddd;
      border-bottom: 0.08rem solid transparent;
    }
    &.active a {
      color: #fff;
      font-weight: bold;
      border-bottom: 0.08rem solid #6677F0;
    }
  }
}
</style>
