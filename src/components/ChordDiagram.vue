<template>
  <svg width="80" height="60" viewBox="0 0 80 60">
    <!-- chord name -->
    <text x="0" y="11" font-size="10">{{ name }}</text>

    <g transform="translate(0,18)">
      <!-- open string -->
      <circle v-show="openStringVisible[3]"
          cx="3" cy="0" r="2" fill="#fff" stroke="#000"/>
      <circle v-show="openStringVisible[2]"
          cx="3" cy="10" r="2" fill="#fff" stroke="#000"/>
      <circle v-show="openStringVisible[1]"
          cx="3" cy="20" r="2" fill="#fff" stroke="#000"/>
      <circle v-show="openStringVisible[0]"
          cx="3" cy="30" r="2" fill="#fff" stroke="#000"/>
      <!-- frame -->
      <g transform="translate(8, 0)">
        <!-- string -->
        <line x1="0" y1="0" x2="70" y2="0" stroke="#000"/>
        <line x1="0" y1="10" x2="70" y2="10" stroke="#000"/>
        <line x1="0" y1="20" x2="70" y2="20" stroke="#000"/>
        <line x1="0" y1="30" x2="70" y2="30" stroke="#000"/>
        <!-- fret -->
        <!-- 0 -->
        <line v-show="!baseFretVisible" x1="0" y1="0" x2="0" y2="30"
            stroke="#888"/>
        <g transform="translate(3, 0)">
          <line x1="0" y1="0" x2="0" y2="30" stroke="#888"/>
          <line x1="14" y1="0" x2="14" y2="30" stroke="#888"/>
          <line x1="28" y1="0" x2="28" y2="30" stroke="#888"/>
          <line x1="42" y1="0" x2="42" y2="30" stroke="#888"/>
          <line x1="56" y1="0" x2="56" y2="30" stroke="#888"/>

          <!-- base fret -->
          <text v-show="baseFretVisible" x="7" y="40"
              text-anchor="middle" font-size="9">{{ baseFret }}</text>

          <!-- close string -->
          <circle v-show="closedStringVisible[3]"
              :cx="fret_x[3]" cy="0" r="3" fill="#000"/>
          <circle v-show="closedStringVisible[2]"
              :cx="fret_x[2]" cy="10" r="3" fill="#000"/>
          <circle v-show="closedStringVisible[1]"
              :cx="fret_x[1]" cy="20" r="3" fill="#000"/>
          <circle v-show="closedStringVisible[0]"
              :cx="fret_x[0]" cy="30" r="3" fill="#000"/>
        </g>
      </g>
    </g>
  </svg>
</template>

<script>
export default {
  name: 'ChordDiagram',
  props: {
    name: String,
    frets: Object,
    fingers: Object,
    baseFret: Number
  },
  computed: {
    closedStringVisible () {
      const a = {}
      for (const k in this.frets) {
        a[k] = this.frets[k] > 0
      }
      return a
    },
    openStringVisible () {
      const a = {}
      for (const k in this.frets) {
        a[k] = this.frets[k] === 0
      }
      return a
    },
    baseFretVisible () {
      return this.baseFret !== 1
    },
    fret_x () {
      const a = {}
      for (const k in this.frets) {
        a[k] = (this.frets[k] - 1) * 14 + 7
      }
      return a
    }
  }
}
</script>

<style scoped>
</style>
