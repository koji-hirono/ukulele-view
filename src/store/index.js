import Vue from 'vue'
import Vuex from 'vuex'
import parser from '@/lib/parser.js'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    key: 0,
    keyMin: -6,
    keyMax: 6,
    charts: []
  },
  mutations: {
    keyUp (state) {
      if (state.key < state.keyMax) {
        state.charts = parser.transpose(state.charts, 1)
        state.key++
      }
    },
    keyDown (state) {
      if (state.key > state.keyMin) {
        state.charts = parser.transpose(state.charts, -1)
        state.key--
      }
    },
    keyReset (state) {
      if (state.key !== 0) {
        state.charts = parser.transpose(state.charts, 0 - state.key)
        state.key = 0
      }
    },
    setCharts (state, charts) {
      state.charts = charts
    },
    setChartPos (state, { index, pos }) {
      state.charts.forEach(e => {
        if (e.index === index) {
          e.value.curPos = pos
        }
      })
    }
  },
  getters: {
    charts (state) {
      return state.charts
    },
    text (state) {
      return parser.rebuildingText(state.charts)
    }
  },
  actions: {
    keyUp (context) {
      context.commit('keyUp')
    },
    keyDown (context) {
      context.commit('keyDown')
    },
    keyReset (context) {
      context.commit('keyReset')
    },
    parse (context, text) {
      context.commit('setCharts', parser.parse(text))
    },
    setChartPos (context, { index, pos }) {
      context.commit('setChartPos', { index, pos })
    }
  },
  modules: {
  }
})
