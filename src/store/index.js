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
    ['chord', '[A-G][#b]?[a-zA-Z0-9_()]*(?:@\\d+)?'],
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
      const ma = m[0].match(/^([A-G][#b]?)([a-zA-Z0-9_()]*)(@\d+)?$/u)
      const rootNote = ma[1]
      const attrNote = ma[2]
      const frets = ma[3]
      value = {
        rootNote: rootNote,
        attrNote: attrNote !== undefined ? attrNote : '',
        frets: frets !== undefined ? frets.slice(1) : ''
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
        const newFrets = index !== newIndex ? '' : token.value.frets
        newTokens.push({
          kind: token.kind,
          value: {
            rootNote: pitches[newIndex],
            attrNote: token.value.attrNote,
            frets: newFrets
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
        const positions = chords[rootNote][attrNote].positions
        let curPos
        if (token.value.frets !== '') {
          const frets = Array.prototype.map.call(
            token.value.frets, c => parseInt(c))
          const max = Math.max(...frets)
          const baseFret = max < 5 ? 1 : max - 3
          curPos = {
            frets: {
              0: ((frets[3] === undefined) ? 0 : frets[3]) - baseFret + 1,
              1: ((frets[2] === undefined) ? 0 : frets[2]) - baseFret + 1,
              2: ((frets[1] === undefined) ? 0 : frets[1]) - baseFret + 1,
              3: ((frets[0] === undefined) ? 0 : frets[0]) - baseFret + 1
            },
            fingers: {
              0: 0,
              1: 0,
              2: 0,
              3: 0
            },
            baseFret: baseFret
          }
        } else {
          curPos = positions[0]
        }
        const value = {
          name: token.value.rootNote + token.value.attrNote,
          curPos: curPos,
          positions: positions
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
      if (value.frets !== '') {
        text += '@' + value.frets
      }
    } else {
      text += token.value
    }
  }
  return text
}

const convertTextFrets = function (frets, baseFret) {
  return '' +
    (frets[3] + baseFret - 1) +
    (frets[2] + baseFret - 1) +
    (frets[1] + baseFret - 1) +
    (frets[0] + baseFret - 1)
}

export default new Vuex.Store({
  state: {
    key: 0,
    keyMin: -6,
    keyMax: 6,
    chords: chords,
    tokens: []
  },
  mutations: {
    key_up (state) {
      if (state.key < state.keyMax) {
        state.tokens = transpose(state.tokens, 1)
        state.key++
      }
    },
    key_down (state) {
      if (state.key > state.keyMin) {
        state.tokens = transpose(state.tokens, -1)
        state.key--
      }
    },
    key_reset (state) {
      if (state.key !== 0) {
        state.tokens = transpose(state.tokens, 0 - state.key)
        state.key = 0
      }
    }
  },
  getters: {
    errors (state) {
      return validate(state.tokens, state.chords)
    },
    charts (state) {
      return convertChart(state.tokens, state.chords)
    },
    text (state) {
      return rebuildingText(state.tokens)
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
      context.state.tokens = tokenize(text)
    },
    setChartPos (context, { index, pos }) {
      context.state.tokens.forEach(e => {
        if (e.index === index) {
          e.value.frets = convertTextFrets(pos.frets, pos.baseFret)
        }
      })
    }
  },
  modules: {
  }
})
