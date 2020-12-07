import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import * as echarts from 'echarts'
import "echarts-gl"
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
import axios from 'axios';
Vue.use(Element)

Vue.prototype.$http = axios
Vue.prototype.$echarts = echarts
Vue.prototype.$website = 'http://localhost:8289'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
