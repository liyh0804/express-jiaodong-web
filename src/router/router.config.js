import { UserLayout, BasicLayout, BlankLayout, RouteView } from '@/layouts'

/**
 * 基础路由配置
 * @type {*[]}
 */
export const constantRouterMap = [{
  path: '/',
  component: RouteView,
  redirect: '/home',
  hidden: true,
  children: [{
    path: '/home',
    name: 'home',
    component: () => import(/* webpackChunkName "home" */ '@/views/home/index'),
    meta: { title: '首页' }
  }]
}, {
  path: '/user',
  component: UserLayout,
  redirect: '/user/login',
  hidden: true,
  children: [{
    path: '/user/login',
    name: 'login',
    component: () => import(/* webpackChunkName "user" */ '@/views/user/login'),
    meta: { title: '登录' }
  }, {
    path: '/user/register',
    name: 'register',
    component: () => import(/* webpackChunkName "user" */ '@/views/user/register'),
    meta: { title: '注册' }
  }, {
    path: '/user/register-result',
    name: 'registerResult',
    component: () => import(/* webpackChunkName "user" */ '@/views/user/register-result'),
    meta: { title: '注册结果' }
  }, {
    path: '/user/recover',
    name: 'recover',
    component: undefined
  }]
}, {
  path: '/404',
  hidden: true,
  component: () => import(/* webpackChunkName "error" */ '@/views/exception/404')
}]

export const asyncRouterMap = [{
  path: '/',
  name: 'index',
  component: RouteView,
  redirect: '/dashboard',
  meta: { title: '首页', iTitle: 'menu.home', permission: ['root', 'supervisor', 'operator'] },
  children: [
    // monitor
    {
      path: '/monitor',
      redirect: '/monitor/supervisor',
      component: BlankLayout,
      hidden: true,
      meta: { title: '监控中心', iTitle: 'menu.monitor', icon: 'icon-monitor', permission: ['monitor', 'supervisor', 'operator'] },
      children: [{
        path: '/monitor/supervisor',
        name: 'supervisor',
        component: () => import(/* webpackChunkName "monitor" */ '@/views/monitor/supervisor'),
        meta: { title: '监控中心', iTitle: 'menu.monitor.supervisor', keepAlive: true, permission: ['monitor', 'supervisor'] }
      }, {
        path: '/monitor/operator',
        name: 'operator',
        component: () => import(/* webpackChunkName "monitor" */ '@/views/monitor/operator'),
        meta: { title: '监控中心', iTitle: 'menu.monitor.operator', keepAlive: true, permission: ['monitor', 'operator'] }
      }]
    },
    // realtime monitor
    {
      path: '/matter_manage',
      redirect: '/matter_manage/firefight',
      component: BasicLayout,
      meta: { title: '实时监控', iTitle: 'menu.matter', icon: 'icon-jiankong', permission: ['matter', 'supervisor', 'operator'] },
      children: [{
        path: '/matter_manage/firefight',
        name: 'firefight',
        component: () => import(/* webpackChunkName 'matter' */ '@/views/matter-manage/firefight'),
        meta: { title: '火警管理', iTitle: 'menu.matter.firefight', keepAlive: true, permission: ['matter', 'supervisor', 'operator'] }
      }, {
        path: '/matter_manage/threat',
        name: 'threat',
        component: () => import(/* webpackChunkName 'matter' */ '@/views/matter-manage/threat'),
        meta: { title: '故障管理', iTitle: 'menu.matter.threat', keepAlive: true, permission: ['matter', 'supervisor', 'operator'] }
      }, {
        path: '/matter_manage/fault',
        name: 'fault',
        component: () => import(/* webpackChunkName 'matter' */ '@/views/matter-manage/fault'),
        meta: { title: '隐患管理', iTitle: 'menu.matter.fault', keepAlive: true, permission: ['matter', 'supervisor', 'operator'] }
      }]
    },
    // inteligent monitor
    {
      path: '/inteli-manage',
      redirect: '/inteli-manage/inteli-monitor',
      component: BasicLayout,
      meta: { title: '智能监控', iTitle: 'menu.inteli', icon: 'icon-shishijiankong', permission: ['inteli', 'supervisor', 'operator'] },
      children: [{
        path: '/inteli-manage/inteli-monitor',
        name: 'inteliMonitor',
        component: () => import(/* webpackChunkName 'inteli-manage' */ '@/views/inteli/monitor'),
        meta: { title: '智能监控', iTitle: 'menu.inteli.monitor', keepAlive: true, permission: ['inteli', 'supervisor', 'operator'] }
      }, {
        path: '/inteli-manage/duty-check',
        name: 'dutyCheck',
        component: () => import(/* webpackChunkName 'inteli-manage' */ '@/views/inteli/duty-check'),
        meta: { title: '值班查岗', iTitle: 'menu.inteli.dutyCheck', keepAlive: true, permission: ['inteli', 'supervisor', 'operator'] }
      }]
    },
    // patrol manage
    {
      path: '/patrol-manage',
      redirect: '/patrol-manage/records',
      component: BasicLayout,
      meta: { title: '智能巡检', iTitle: 'menu.patrol', icon: 'icon-xunjian', permission: ['patrol', 'supervisor', 'operator'] },
      children: [{
        path: '/patrol-manage/records',
        name: 'patrolRecords',
        component: () => import(/* webpackChunkName 'patrol' */ '@/views/patrol/records'),
        meta: { title: '巡检记录', iTitle: 'menu.patrol.records', keepAlive: true, permission: ['patrol', 'supervisor', 'operator'] }
      }, {
        path: '/patrol-manage/plan',
        name: 'patrolPlan',
        component: () => import(/* webpackChunkName 'patrol' */ '@/views/patrol/plan'),
        meta: { title: '巡检计划', iTitle: 'menu.patrol.plan', keepAlive: true, permission: ['patrol', 'supervisor', 'operator'] }
      }, {
        path: '/patrol-manage/schedual',
        name: 'patrolSchedual',
        component: () => import(/* webpackChunkName 'patrol' */ '@/views/patrol/schedual'),
        meta: { title: '排班计划', iTitle: 'menu.patrol.schedual', keepAlive: true, permission: ['patrol', 'supervisor', 'operator'] }
      }, {
        path: '/patrol-manage/template',
        name: 'patrolTemplate',
        component: () => import(/* webpackChunkName 'patrol' */ '@/views/patrol/template'),
        meta: { title: '巡检模板', iTitle: 'menu.patrol.template', keepAlive: true, permission: ['patrol', 'supervisor', 'operator'] }
      }]
    },
    // safety manage
    {
      path: '/safety-manage',
      redirect: '/safety-manage/overall-inspection',
      component: BasicLayout,
      meta: { title: '安全管理', iTitle: 'menu.safety', icon: 'icon-safety', permission: ['safety', 'supervisor', 'operator'] },
      children: [{
        path: '/safety-manage/overall-inspection',
        name: 'SafetyOverallInspection',
        component: () => import(/* webpackChunkName 'safety' */ '@/views/safety/overall-inspection'),
        meta: { title: '全面体检', iTitle: 'menu.patrol.overall-inspection', keepAlive: true, permission: ['safety', 'supervisor', 'operator'] }
      }, {
        path: '/safety-manage/trend',
        name: 'SafetyTrend',
        component: () => import(/* webpackChunkName 'safety' */ '@/views/safety/trend'),
        meta: { title: '安全趋势', iTitle: 'menu.safety.trend', keepAlive: true, permission: ['safety', 'supervisor', 'operator'] }
      }, {
        path: '/safety-manage/statistics',
        name: 'SafetyStatistics',
        component: () => import(/* webpackChunkName 'safety' */ '@/views/safety/statistics'),
        meta: { title: '安全统计', iTitle: 'menu.safety.statistics', keepAlive: true, permission: ['safety', 'supervisor', 'operator'] }
      }, {
        path: '/safety-manage/report',
        name: 'SafetyReport',
        component: () => import(/* webpackChunkName 'safety' */ '@/views/safety/report'),
        meta: { title: '安全报告', iTitle: 'menu.safety.report', keepAlive: true, permission: ['safety', 'supervisor', 'operator'] }
      }]
    },
    // 应急预案contingency manage
    {
      path: '/contingency-manage',
      redirect: '/contingency-manage/setting',
      component: BasicLayout,
      meta: { title: '应急预案', iTitle: 'menu.contingency', icon: 'icon-yingjiyuan', permission: ['contingency', 'supervisor', 'operator'] },
      children: [{
        path: '/contingency-manage/setting',
        name: 'ContingencySetting',
        component: () => import(/* webpackChunkName 'contingency' */ '@/views/contingency/setting'),
        meta: { title: '预案设置', iTitle: 'menu.contingency.setting', keepAlive: true, permission: ['contingency', 'supervisor', 'operator'] }
      }, {
        path: '/contingency-manage/plan',
        name: 'ContingencyPlan',
        component: () => import(/* webpackChunkName 'contingency' */ '@/views/contingency/plan'),
        meta: { title: '应急预案', iTitle: 'menu.contingency.plan', keepAlive: true, permission: ['contingency', 'supervisor', 'operator'] }
      }]
    },
    // maintenance manage
    {
      path: '/maintenance-manage',
      component: () => import(/* webpackChunkName 'maintenance' */ '@/views/repair_service'),
      name: 'MaintenanceManage',
      meta: { title: '维保管理', iTitle: 'menu.maintenance', icon: 'icon-weibao', permission: ['maintenance', 'supervisor', 'operator'] }
    },
    // 单位管理
    {
      path: '/unit-manage',
      redirect: '/unit-manage/area-manage',
      component: BasicLayout,
      meta: { title: '单位管理', iTitle: 'menu.unit', icon: 'icon-danwei', permission: ['unit', 'supervisor', 'operator'] },
      children: [{
        path: '/unit-manage/users',
        name: 'UnitUsers',
        component: () => import(/* webpackChunkName 'unit' */ '@/views/unit/users'),
        meta: { title: '用户管理', iTitle: 'menu.unit.users', keepAlive: true, permission: ['unit', 'supervisor', 'operator'] }
      }, {
        path: '/unit-manage/area-manage',
        name: 'AreaManage',
        component: () => import(/* webpackChunkName 'unit' */ '@/views/unit/area-manage'),
        meta: { title: '单位管理', iTitle: 'menu.unit.area', keepAlive: true, permission: ['unit', 'supervisor', 'operator'] }
      }]
    },
    {
      path: '/operation-manage',
      // component: () => import(/* webpackChunkName 'operation' */ '@/views/mochaItom/Index'),
      component: BasicLayout,
      redirect: '/operation-manage/list',
      meta: { title: '运营管理', iTitle: 'menu.system.operation', icon: 'icon-xunjian', permission: ['operation', 'operator', 'matter', 'supervisor'] },
      children: [{
        path: '/operation-manage/list',
        name: 'DeviceImport2',
        component: () => import(/* webpackChunkName 'device' */ '@/views/mochaItom/Index'),
        meta: { title: '运营列表', iTitle: 'menu.device.import', keepAlive: true, permission: ['device', 'operation', 'operator', 'matter', 'supervisor'] }
      },
      // {
      //   path: '/operation-manage/areaManage',
      //   name: 'AreaManage',
      //   component: () => import(/* webpackChunkName 'device' */ '@/views/mochaItom/areaManage'),
      //   meta: { title: '运营列表', iTitle: 'menu.device.import', keepAlive: true, permission: ['device', 'operation', 'operator', 'matter', 'supervisor'] }
      // },
      {
        path: '/operation-manage/serviceUnitDetail',
        name: 'ServiceUnitDetail',
        component: () => import(/* webpackChunkName 'operation' */ '@/views/mochaItom/serviceUnitDetail'),
        meta: { title: '服务单位详情', iTitle: 'menu.device.import', keepAlive: true, permission: ['device', 'operation', 'operator', 'matter', 'supervisor'] }
      },
      {
        path: '/operation-manage/serviceUnitAdd',
        name: 'ServiceUnitAdd',
        hidden: true,
        component: () => import(/* webpackChunkName 'operation' */ '@/views/mochaItom/serviceUnitAdd'),
        meta: { title: '服务单位添加', iTitle: 'menu.device.import', keepAlive: true, permission: ['device', 'operation', 'operator', 'matter', 'supervisor'] }
      },
      // 维保及检测机构_添加单位
      {
        path: '/operation-manage/maintenanceCheckAdd',
        name: 'maintenanceCheckAdd',
        hidden: true,
        component: () => import(/* webpackChunkName 'operation' */ '@/views/mochaItom/maintenanceCheckAdd'),
        meta: { title: '维保及检测机构_添加单位', iTitle: 'menu.device.import', keepAlive: true, permission: ['device', 'operation', 'operator', 'matter', 'supervisor'] }
      },
      // maintenanceCheckAddDetail
      {
        path: '/operation-manage/maintenanceCheckDetail',
        name: 'maintenanceCheckDetail',
        hidden: true,
        component: () => import(/* webpackChunkName 'operation' */ '@/views/mochaItom/maintenanceCheckDetail'),
        meta: { title: '维保及检测机构_查看详情', iTitle: 'menu.device.import', keepAlive: true, permission: ['device', 'operation', 'operator', 'matter', 'supervisor'] }
      }
      ]
    },
    // 设备管理
    {
      path: '/device-manage',
      redirect: '/device-manage/import',
      component: BasicLayout,
      meta: { title: '设备管理', iTitle: 'menu.device', icon: 'icon-xunjian', permission: ['device', 'supervisor', 'operator'] },
      children: [{
        path: '/device-manage/list',
        name: 'DeviceList',
        component: () => import(/* webpackChunkName 'device' */ '@/views/device/list'),
        meta: { title: '设备列表', iTitle: 'menu.device.import', keepAlive: true, permission: ['device', 'supervisor', 'operator'] }
      }, {
        path: '/device-manage/position',
        name: 'DevicePosition',
        component: () => import(/* webpackChunkName 'device' */ '@/views/device/position'),
        meta: { title: '设备定位', iTitle: 'menu.device.position', keepAlive: true, permission: ['device', 'supervisor', 'operator'] }
      }, {
        path: '/device-manage/device-type',
        name: 'DeviceType',
        component: () => import(/* webpackChunkName 'device' */ '@/views/device/type'),
        meta: { title: '设备类型', iTitle: 'menu.device.type', keepAlive: true, permission: ['device', 'supervisor', 'operator'] }
      }, {
        path: '/device-manage/factory-brand',
        name: 'FactoryBrand',
        component: () => import(/* webpackChunkName 'device' */ '@/views/device/factory-brand'),
        meta: { title: '厂家和品牌管理', iTitle: 'menu.device.factorybrand', keepAlive: true, permission: ['device', 'supervisor', 'operator'] }
      }, {
        path: '/device-manage/detail',
        name: 'DeviceDetail',
        hidden: true,
        component: () => import(/* webpackChunkName 'device' */ '@/views/device/detail'),
        meta: { title: '设备详情', iTitle: 'menu.device.detail', keepAlive: true, permission: ['device', 'supervisor', 'operator'] }
      }, {
        path: '/device-manage/device-edit',
        name: 'DeviceEdit',
        hidden: true,
        component: () => import(/* webpackChunkName 'device' */ '@/views/device/edit'),
        meta: { title: '编辑设备', iTitle: 'menu.device.edit', keepAlive: true, permission: ['device', 'supervisor', 'operator'] }
      }, {
        path: '/device-manage/device-add',
        name: 'DeviceAdd',
        hidden: true,
        component: () => import(/* webpackChunkName 'device' */ '@/views/device/edit'),
        meta: { title: '添加设备', iTitle: 'menu.device.add', keepAlive: true, permission: ['device', 'supervisor', 'operator'] }
      }]
    },
    // 系统设置
    {
      path: '/system-settings',
      component: BasicLayout,
      name: 'SystemSettings',
      meta: { title: '系统设置', iTitle: 'menu.system.settings', icon: 'icon-settings', permission: ['system', 'supervisor', 'operator'] },
      children: [
        {
          path: '/system-settings',
          name: 'SystemSettings',
          component: () => import(/* webpackChunkName 'settings' */ '@/views/system/settings'),
          meta: {
            title: '基础设置',
            iTitle: 'menu.system.settings',
            icon: 'icon-settings',
            permission: ['system', 'supervisor', 'operator']
          }
        },
        {
          path: '/system-settings/gis/geoManager',
          name: 'GeoManager',
          component: () => import(/* webpackChunkName 'unit' */ '@/views/gis/geoManager.vue'),
          meta: {
            title: '地图geo数据管理',
            iTitle: 'menu.system.settings',
            icon: 'icon-settings',
            permission: ['system', 'supervisor', 'operator']
          }
        },
        {
          path: '/system-settings/gis/demo',
          name: 'gisDemo1',
          component: () => import(/* webpackChunkName 'unit' */ '@/views/gis/demo.vue'),
          meta: {
            title: '地图 demo1',
            iTitle: 'menu.system.settings',
            icon: 'icon-settings',
            permission: ['system', 'supervisor', 'operator']
          }
        },
        {
          path: '/system-settings/gis/demo2',
          name: 'gisDemo2',
          component: () => import(/* webpackChunkName 'unit' */ '@/views/mochaItom/compontents/mapPosition/index'),
          meta: {
            title: '地图 demo2',
            iTitle: 'menu.system.settings',
            icon: 'icon-settings',
            permission: ['system', 'supervisor', 'operator']
          }
        },
        {
          path: '/system-settings/tree/demo',
          name: 'treeDemo',
          component: () => import(/* webpackChunkName 'unit' */ '@/views/tree/demo.vue'),
          meta: {
            title: 'tree demo',
            iTitle: 'menu.system.settings',
            icon: 'icon-settings',
            permission: ['system', 'supervisor', 'operator']
          }
        }
      ]
    }
    // // 用户登录
    // {
    //   path: '/user',
    //   component: UserLayout,
    //   redirect: '/user/login',
    //   meta: {},
    //   hidden: true,
    //   children: [{
    //     path: 'login',
    //     name: 'login',
    //     component: () => import(/* webpackChunkName "user" */ '@/views/user/login')
    //   }, {
    //     path: 'register',
    //     name: 'register',
    //     component: () => import(/* webpackChunkName "user" */ '@/views/user/register')
    //   }, {
    //     path: 'register-result',
    //     name: 'registerResult',
    //     component: () => import(/* webpackChunkName "user" */ '@/views/user/register-result')
    //   }, {
    //     path: 'recover',
    //     name: 'recover',
    //     component: undefined
    //   }]
    // }
  ]
}]
