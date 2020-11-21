import chordTable from '@/assets/ukulele_chords.json'

const pitches = [
  'C', 'C#', 'D', 'D#',
  'E', 'F', 'F#', 'G',
  'G#', 'A', 'A#', 'B'
]

const pitchIndex = {
  C: 0,
  'C#': 1,
  Db: 1,
  D: 2,
  'D#': 3,
  Eb: 3,
  E: 4,
  F: 5,
  'F#': 6,
  Gb: 6,
  G: 7,
  'G#': 8,
  Ab: 8,
  A: 9,
  'A#': 10,
  Bb: 10,
  B: 11
}

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

const transpose = function (note, degree) {
  const index = pitchIndex[note]
  if (index === undefined) {
    return note
  }

  const newIndex = (index + degree + 12) % 12
  if (newIndex === index) {
    return note
  }

  return pitches[newIndex]
}

const findPositions = function (rootNote, attr) {
  const name = normalizeRoot(rootNote) + normalizeAttr(attr)

  if (!(name in chordTable)) {
    return null
  }

  return chordTable[name]
}

const swapPosition = function (name, a, b) {
  if (!(name in chordTable)) {
    return
  }

  const positions = chordTable[name]

  if (a >= positions.length) {
    return
  }

  if (b >= positions.length) {
    return
  }

  const t = chordTable[name][a]
  chordTable[name][a] = chordTable[name][b]
  chordTable[name][b] = t
}

export default {
  transpose,
  findPositions,
  swapPosition
}
