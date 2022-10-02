import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
// import { injectComponents } from '@/utils/index'
import router from './router'
import moment from 'moment'
import 'moment/locale/zh-cn'
// import './permission'

moment.locale('zh-cn')

const app = createApp(App)
// app.use(Loading)
// app.use(Amap)
// injectComponents(app)

app.use(store).use(router).mount('#app')
