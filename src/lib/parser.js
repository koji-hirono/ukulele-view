import chord from '@/lib/chord.js'

const parseAttrNote = function (text) {
  if (text === undefined) {
    return ''
  }
  return text
}

const parseFrets = function (text) {
  if (text === undefined) {
    return null
  }
  const frets = []
  let multiDigits = false
  let value = 0
  for (let index = 0; index < text.length; index++) {
    const ch = text[index]
    switch (ch) {
      case '@':
        break
      case '(':
        multiDigits = true
        break
      case ')':
        multiDigits = false
        frets.push(value)
        value = 0
        break
      case 'x':
        frets.push(-1)
        break
      case '0':
      case '1':
      case '2':
      case '3':
      case '4':
      case '5':
      case '6':
      case '7':
      case '8':
      case '9':
        if (multiDigits) {
          value = value * 10 + parseInt(ch)
        } else {
          frets.push(parseInt(ch))
        }
        break
    }
  }
  return frets
}

const findPosition = function (positions, frets) {
  for (const pos of positions) {
    const f = pos.frets
    if (f.length !== frets.length) {
      return null
    }
    for (let i = 0; i < f.length; i++) {
      if (f[i] !== frets[i]) {
        return pos
      }
    }
  }
  return null
}

const parseChords = function (r) {
  if (!r) {
    return null
  }
  const text = r.text.slice(r.start, r.end)
  const offset = r.start
  let lineNum = r.lineNum
  const specs = [
    ['chord', '[A-G][#b]?[a-zA-Z0-9_()]*(?:@[x0-9()]+)?'],
    ['space', '[ \\t]+'],
    ['newline', '\\n'],
    ['word', '[^ \\t\\n]+']
  ]
  const tokreg = specs.map(e => '(' + e[1] + ')').join('|')
  const re = new RegExp(tokreg, 'ug')
  const tokens = []
  let m
  while ((m = re.exec(text)) != null) {
    let kind = specs.find((e, i) => m[i + 1] !== undefined)[0]
    let value
    if (kind === 'chord') {
      const ma = m[0].match(/^([A-G][#b]?)([a-zA-Z0-9_()]*)(@[x0-9()]+)?$/u)
      const rootNote = ma[1]
      const attrNote = parseAttrNote(ma[2])
      const frets = parseFrets(ma[3])
      const positions = chord.findPositions(rootNote, attrNote)
      if (!positions) {
        kind = 'word'
        value = m[0]
      } else {
        let curPos
        if (frets) {
          curPos = findPosition(positions, frets)
          if (!curPos) {
            curPos = {
              frets: frets
            }
          }
        } else {
          curPos = positions[0]
        }
        value = {
          name: rootNote + attrNote,
          rootNote: rootNote,
          attrNote: attrNote,
          frets: frets,
          curPos: curPos,
          positions: positions
        }
      }
    } else if (kind === 'space') {
      continue
    } else if (kind === 'newline') {
      lineNum++
      continue
    } else {
      value = m[0]
    }
    tokens.push({
      kind: kind,
      value: value,
      index: offset + m.index,
      length: m[0].length,
      lineNum: lineNum
    })
  }
  return tokens
}

const parseLyrics = function (r) {
  if (!r) {
    return null
  }
  return {
    kind: 'lyrics',
    value: r.text.slice(r.start, r.end),
    index: r.start,
    lineNum: r.lineNum
  }
}

const parse = function (text) {
  const State = {
    OUT: 0,
    IN: 1
  }
  const chart = []
  let chartItem = []
  let escaped = false
  let chords = null
  let lyrics = null
  let state = State.OUT
  let lineNum = 1

  for (let index = 0; index < text.length; index++) {
    const ch = text[index]
    if (ch === '\\') {
      if (escaped) {
        escaped = false
      } else {
        escaped = true
        continue
      }
    } else if (ch === ' ' || ch === '\t') {
      continue
    } else if (ch === '\r' || ch === '\n') {
      lineNum++
      continue
    } else if (ch === ';') {
      if (chords || lyrics) {
        chartItem.push({
          chords: parseChords(chords),
          lyrics: parseLyrics(lyrics)
        })
        chart.push(chartItem)
        chartItem = []
      }
      chords = null
      lyrics = null
      continue
    }

    switch (state) {
      case State.OUT:
        if (ch === '[') {
          state = State.IN
          if (chords || lyrics) {
            chartItem.push({
              chords: parseChords(chords),
              lyrics: parseLyrics(lyrics)
            })
            chords = null
            lyrics = null
          }
          chords = {
            text: text,
            start: index + 1,
            end: index + 1,
            lineNum: lineNum
          }
        } else {
          if (!lyrics) {
            lyrics = {
              text: text,
              start: index,
              end: index + 1,
              lineNum: lineNum
            }
          } else {
            lyrics.end = index + 1
          }
        }
        break
      case State.IN:
        if (ch === ']') {
          state = State.OUT
        } else {
          chords.end = index + 1
        }
        break
    }
  }

  if (chords || lyrics) {
    chartItem.push({
      chords: parseChords(chords),
      lyrics: parseLyrics(lyrics)
    })
    chart.push(chartItem)
  }

  return chart
}

const transpose = function (chart, degree) {
  return chart.map(chartLine => chartLine.map(chartItem => {
    return {
      chords: chartItem.chords ? chartItem.chords.map(c => {
        if (c.kind !== 'chord') {
          return c
        }
        const newRootNote = chord.transpose(c.value.rootNote, degree)
        if (newRootNote === c.value.rootNote) {
          return c
        }
        const name = newRootNote + c.value.attrNote
        const positions = chord.findPositions(newRootNote, c.value.attrNote)
        return {
          kind: c.kind,
          value: {
            name: name,
            rootNote: newRootNote,
            attrNote: c.value.attrNote,
            curPos: positions[0],
            positions: positions
          },
          length: c.length,
          index: c.index
        }
      }) : null,
      lyrics: chartItem.lyrics
    }
  }))
}

const convertTextFrets = function (frets) {
  return frets.map(e => {
    if (e === 0) {
      return String(e)
    } else if (e === -1) {
      return 'x'
    } else if (e >= 10) {
      return '(' + String(e) + ')'
    } else {
      return String(e)
    }
  }).join('')
}

const rebuildingText = function (chart, text) {
  let newText = ''
  let start = 0
  for (const chartLine of chart) {
    for (const chartItem of chartLine) {
      if (chartItem.chords) {
        for (const e of chartItem.chords) {
          if (e.kind === 'chord') {
            const value = e.value
            let word = value.name
            if (value.curPos !== value.positions[0]) {
              word += '@'
              word += convertTextFrets(value.curPos.frets)
            }
            newText += text.slice(start, e.index)
            newText += word
            start = e.index + e.length
          }
        }
      }
    }
  }
  newText += text.slice(start)
  return newText
}

export default {
  parse,
  transpose,
  rebuildingText
}
