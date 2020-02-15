import Vue from 'vue'
import Vuex from 'vuex'
import chords from '@/assets/ukulele_chords.json'

Vue.use(Vuex)

const normalize = function (note) {
  switch (note) {
    case 'Db':
      return 'C#'
    case 'Eb':
      return 'D#'
    case 'Gb':
      return 'F#'
    case 'Ab':
      return 'G#'
    case 'Bb':
      return 'A#'
    default:
      return note
  }
}

const tokenize = function (text) {
  const specs = [
    ['chord', '[A-G][#b]?[a-zA-Z0-9_()]*'],
    ['space', '[ \\t]+'],
    ['newline', '\\n'],
    ['word', '[^ \\t\\n]+']
  ]
  const tokreg = specs.map(e => '(' + e[1] + ')').join('|')
  const re = new RegExp(tokreg, 'ug')
  const tokens = []
  let m
  while ((m = re.exec(text)) != null) {
    const kind = specs.find((e, i) => m[i + 1] !== undefined)[0]
    let value
    if (kind === 'chord') {
      const ma = m[0].match(/^([A-G][#b]?)(.*)$/u)
      const rootNote = ma[1]
      const attrNote = ma[2]
      value = {
        rootNote: rootNote,
        attrNote: attrNote !== undefined ? attrNote : ''
      }
    } else {
      value = m[0]
    }
    tokens.push({
      kind: kind,
      value: value,
      index: m.index
    })
  }
  return tokens
}

const validate = function (tokens, chords) {
  const errors = []
  for (const token of tokens) {
    if (token.kind === 'chord') {
      const rootNote = normalize(token.value.rootNote)
      const attrNote = token.value.attrNote === '' ? 'major' : token.value.attrNote
      if (!(rootNote in chords)) {
        errors.push('Unkown root note: ' + rootNote)
      } else if (!(attrNote in chords[rootNote])) {
        errors.push('Unkown chord: ' + token.value.rootNote + token.value.attrNote)
      }
    }
  }
  return errors
}

const convertChart = function (tokens, chords) {
  const charts = []
  for (const token of tokens) {
    if (token.kind === 'chord') {
      const rootNote = normalize(token.value.rootNote)
      const attrNote = token.value.attrNote === '' ? 'major' : token.value.attrNote
      if (!(rootNote in chords)) {
        charts.push({
          kind: 'error',
          value: token.value,
          index: token.index
        })
      } else if (!(attrNote in chords[rootNote])) {
        charts.push({
          kind: 'error',
          value: token.value,
          index: token.index
        })
      } else {
        const pos = chords[rootNote][attrNote].positions['0']
        const value = {
          name: token.value.rootNote + token.value.attrNote,
          frets: pos.frets,
          fingers: pos.fingers,
          baseFret: pos.baseFret
        }
        charts.push({
          kind: token.kind,
          value: value,
          index: token.index
        })
      }
    } else {
      charts.push(token)
    }
  }
  return charts
}

export default new Vuex.Store({
  state: {
    key: 0,
    keyMin: -6,
    keyMax: 6,
    chords: chords,
    text: '',
    tokens: [],
    errors: [],
    charts: ''
  },
  mutations: {
    key_up (state) {
      if (state.key < state.keyMax) {
        state.key++
      }
    },
    key_down (state) {
      if (state.key > state.keyMin) {
        state.key--
      }
    },
    key_reset (state) {
      state.key = 0
    }
  },
  actions: {
    key_up (context) {
      context.commit('key_up')
    },
    key_down (context) {
      context.commit('key_down')
    },
    key_reset (context) {
      context.commit('key_reset')
    },
    parse (context, text) {
      context.state.text = text
      const tokens = tokenize(text)
      context.state.tokens = tokens
      const errors = validate(tokens, context.state.chords)
      context.state.errors = errors
      const charts = convertChart(tokens, context.state.chords)
      context.state.charts = charts
    }
  },
  modules: {
  }
})
