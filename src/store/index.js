import Vue from 'vue'
import Vuex from 'vuex'
import chords from '@/assets/ukulele_chords.json'
import parser from '@/lib/parser.js'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    key: 0,
    keyMin: -6,
    keyMax: 6,
    chords: chords,
    tokens: []
  },
  mutations: {
    keyUp (state) {
      if (state.key < state.keyMax) {
        state.tokens = parser.transpose(state.tokens, 1)
        state.key++
      }
    },
    keyDown (state) {
      if (state.key > state.keyMin) {
        state.tokens = parser.transpose(state.tokens, -1)
        state.key--
      }
    },
    keyReset (state) {
      if (state.key !== 0) {
        state.tokens = parser.transpose(state.tokens, 0 - state.key)
        state.key = 0
      }
    }
  },
  getters: {
    errors (state) {
      return parser.validate(state.tokens, state.chords)
    },
    charts (state) {
      return parser.convertChart(state.tokens, state.chords)
    },
    text (state) {
      return parser.rebuildingText(state.tokens, state.chords)
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
      context.state.tokens = parser.tokenize(text)
    },
    setChartPos (context, { index, pos }) {
      context.state.tokens.forEach(e => {
        if (e.index === index) {
          e.value.frets = parser.convertTextFrets(pos.frets, pos.baseFret)
        }
      })
    }
  },
  modules: {
  }
})
