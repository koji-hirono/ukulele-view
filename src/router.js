import Vue from 'vue'
import VueRouter from 'vue-router'
import ChartEdit from './components/ChartEdit.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/', component: ChartEdit }
]

const router = new VueRouter({
  routes,
  mode: 'history'
})

export default router
