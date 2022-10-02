import Loading from '@/components/loading/index'
import Amap from '@/components/gis/index'

import moment from 'moment'
import 'moment/locale/zh-cn'

import {
  Col, Row, Drawer, Form, Button, Input, Radio, Image, Spin, Progress, Tooltip, Select,
  Icon, Dropdown, Modal, Carousel, Table, Pagination, Steps, DatePicker, Calendar, Popover,
  Menu, Empty, ConfigProvider, TimePicker, Avatar, Switch, Upload, Popconfirm
} from 'ant-design-vue'

moment.locale('zh-cn')

function injectComponent(app) {
  app.use(Loading)
  app.use(Amap)
  app.use(Row)
  app.use(Col)
  app.use(Drawer)
  app.use(Form)
  app.use(Button)
  app.use(Input)
  app.use(Radio)
  app.use(Image)
  app.use(Spin)
  app.use(Progress)
  app.use(Tooltip)
  app.use(Select)
  app.use(Icon)
  app.use(Dropdown)
  app.use(Modal)
  app.use(DatePicker)
  app.use(Carousel)
  app.use(Table)
  app.use(Pagination)
  app.use(Steps)
  app.use(Calendar)
  app.use(Popover)
  app.use(Menu)
  app.use(Empty)
  app.use(ConfigProvider)
  app.use(TimePicker)
  app.use(Switch)
  app.use(Avatar)
  app.use(Switch)
  app.use(Upload)
  app.use(Popconfirm)
}

export default injectComponent
