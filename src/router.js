import Vue from 'vue'
import VueRouter from 'vue-router'
import ChartEdit from './components/ChartEdit.vue'
import FretsEdit from './components/FretsEdit.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/', component: ChartEdit },
  { path: '/settings', component: FretsEdit }
]

const router = new VueRouter({
  base: process.env.NODE_ENV === 'production' ? 'ukulele-view/' : '',
  routes,
  mode: 'history'
})

export default router
