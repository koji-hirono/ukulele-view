import chord from '@/lib/chord.js'

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

const transpose = function (tokens, degree) {
  const newTokens = []
  for (const token of tokens) {
    if (token.kind === 'chord') {
      const newRootNote = chord.transpose(token.value.rootNote, degree)
      if (newRootNote !== token.value.rootNote) {
        newTokens.push({
          kind: token.kind,
          value: {
            rootNote: newRootNote,
            attrNote: token.value.attrNote,
            frets: ''
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

const validate = function (tokens) {
  const errors = []
  for (const token of tokens) {
    if (token.kind === 'chord') {
      if (!chord.findPositions(token.value.rootNote, token.value.attrNote)) {
        errors.push('Unknown chord: ' + token.value.rootNote + token.value.attrNote)
      }
    }
  }
  return errors
}

const findPosition = function (positions, frets) {
  for (const pos of positions) {
    if (pos.frets.length !== frets.length) {
      return null
    }
    const f = pos.frets.map(e => e + pos.baseFret - 1)
    let found = true
    for (let i = 0; i < f.length; i++) {
      if (f[i] !== frets[i]) {
        found = false
        break
      }
    }
    if (found) {
      return pos
    }
  }
  return null
}

const convertChart = function (tokens) {
  const charts = []
  for (const token of tokens) {
    if (token.kind === 'chord') {
      const origName = token.value.rootNote + token.value.attrNote
      const positions = chord.findPositions(token.value.rootNote,
        token.value.attrNote)
      if (!positions) {
        charts.push({
          kind: 'error',
          value: token.value,
          index: token.index
        })
      } else {
        let curPos
        if (token.value.frets !== '') {
          const frets = Array.prototype.map.call(
            token.value.frets, c => parseInt(c))
          curPos = findPosition(positions, frets)
          if (!curPos) {
            const max = Math.max(...frets)
            const baseFret = max < 5 ? 1 : max - 3
            curPos = {
              frets: frets.map(e => e - baseFret + 1),
              baseFret: baseFret
            }
          }
        } else {
          curPos = positions[0]
        }
        const value = {
          name: origName,
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

const convertTextFrets = function (frets, baseFret) {
  return frets.map(e => String(e + baseFret - 1)).join('')
}

const rebuildingText = function (charts) {
  let text = ''
  for (const chart of charts) {
    if (chart.kind === 'chord') {
      const value = chart.value
      text += value.name
      if (value.curPos !== value.positions[0]) {
        text += '@' + convertTextFrets(value.curPos.frets, value.curPos.baseFret)
      }
    } else {
      text += chart.value
    }
  }
  return text
}

export default {
  tokenize,
  validate,
  transpose,
  convertChart,
  convertTextFrets,
  rebuildingText
}
