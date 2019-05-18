import "babel-polyfill"
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/store'
import './common/stylus/index.styl'
import fastClick from "fastclick"
import Vuelazyload from "vue-lazyload";

fastClick.attach(document.body)

// fastclick.attch(document.body)

Vue.use(Vuelazyload, {
  loading: require('./common/image/default.png')
}) //图片懒加载


Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
