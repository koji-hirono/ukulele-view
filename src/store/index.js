import Vue from 'vue'
import Vuex from 'vuex'
import chords from '@/assets/ukulele_chords.json'

Vue.use(Vuex)

const normalizeRoot = function (note) {
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

// '' empty string   major
// m                 minor
// 7                 7
// M7                maj7
// m7                m7
// dim               dim
// m7(b5)            m7b5
// aug               aug
// sus4              sus4
// 6                 6
// 7(9)              9
// M7(9)             maj9
// mM7               mmaj7
// add9              add9
const normalizeAttr = function (attr) {
  switch (attr) {
    case '':
      return 'major'
    case 'm':
      return 'minor'
    case 'M7':
      return 'maj7'
    case 'm7(b5)':
      return 'm7b5'
    case '7(9)':
      return '9'
    case 'M7(9)':
      return 'maj9'
    case 'mM7':
      return 'mmaj7'
    default:
      return attr
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

const transpose = function (tokens, key) {
  const pitches = [
    'C', 'C#', 'D', 'D#',
    'E', 'F', 'F#', 'G',
    'G#', 'A', 'A#', 'B'
  ]
  const pitchIndex = {
    C: 0,
    'C#': 1,
    D: 2,
    'D#': 3,
    E: 4,
    F: 5,
    'F#': 6,
    G: 7,
    'G#': 8,
    A: 9,
    'A#': 10,
    B: 11
  }
  const newTokens = []
  for (const token of tokens) {
    if (token.kind === 'chord') {
      const rootNote = normalizeRoot(token.value.rootNote)
      const index = pitchIndex[rootNote]
      if (index !== undefined) {
        const newIndex = (index + key + 12) % 12
        newTokens.push({
          kind: token.kind,
          value: {
            rootNote: pitches[newIndex],
            attrNote: token.value.attrNote
          },
          index: token.index
        })
      } else {
        newTokens.push(token)
      }
    } else {
      newTokens.push(token)
    }
  }
  return newTokens
}

const validate = function (tokens, chords) {
  const errors = []
  for (const token of tokens) {
    if (token.kind === 'chord') {
      const rootNote = normalizeRoot(token.value.rootNote)
      const attrNote = normalizeAttr(token.value.attrNote)
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
      const rootNote = normalizeRoot(token.value.rootNote)
      const attrNote = normalizeAttr(token.value.attrNote)
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

const rebuildingText = function (tokens) {
  let text = ''
  for (const token of tokens) {
    if (token.kind === 'chord') {
      const value = token.value
      text += value.rootNote + value.attrNote
    } else {
      text += token.value
    }
  }
  return text
}

export default new Vuex.Store({
  state: {
    key: 0,
    keyMin: -6,
    keyMax: 6,
    chords: chords,
    parsedTokens: []
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
  getters: {
    tokens (state) {
      return transpose(state.parsedTokens, state.key)
    },
    errors (state, getters) {
      return validate(getters.tokens, state.chords)
    },
    charts (state, getters) {
      return convertChart(getters.tokens, state.chords)
    },
    text (state, getters) {
      return rebuildingText(getters.tokens)
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
      context.state.parsedTokens = tokenize(text)
    }
  },
  modules: {
  }
})
