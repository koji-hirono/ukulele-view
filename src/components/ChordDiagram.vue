<template>
  <svg width="70" height="60" viewBox="0 0 70 60">
    <!-- chord name -->
    <text v-if="name" x="0" y="11" font-size="10">{{ name }}</text>

    <g transform="translate(0,18)">
      <!-- open string -->
      <circle v-if="openStringVisible[0]"
          cx="3" cy="0" r="2" fill="#fff" stroke="#000"/>
      <circle v-if="openStringVisible[1]"
          cx="3" cy="10" r="2" fill="#fff" stroke="#000"/>
      <circle v-if="openStringVisible[2]"
          cx="3" cy="20" r="2" fill="#fff" stroke="#000"/>
      <circle v-if="openStringVisible[3]"
          cx="3" cy="30" r="2" fill="#fff" stroke="#000"/>
      <line v-if="muteStringVisible[0]"
          x1="1" y1="0" x2="5" y2="5" stroke="#000"/>
      <line v-if="muteStringVisible[0]"
          x1="1" y1="5" x2="5" y2="0" stroke="#000"/>
      <line v-if="muteStringVisible[1]"
          x1="1" y1="10" x2="5" y2="15" stroke="#000"/>
      <line v-if="muteStringVisible[1]"
          x1="1" y1="15" x2="5" y2="10" stroke="#000"/>
      <line v-if="muteStringVisible[2]"
          x1="1" y1="20" x2="5" y2="25" stroke="#000"/>
      <line v-if="muteStringVisible[2]"
          x1="1" y1="25" x2="5" y2="20" stroke="#000"/>
      <line v-if="muteStringVisible[3]"
          x1="1" y1="30" x2="5" y2="35" stroke="#000"/>
      <line v-if="muteStringVisible[3]"
          x1="1" y1="35" x2="5" y2="30" stroke="#000"/>
      <!-- frame -->
      <g transform="translate(8, 0)">
        <!-- string -->
        <line x1="0" y1="0" x2="60" y2="0" stroke="#000"/>
        <line x1="0" y1="10" x2="60" y2="10" stroke="#000"/>
        <line x1="0" y1="20" x2="60" y2="20" stroke="#000"/>
        <line x1="0" y1="30" x2="60" y2="30" stroke="#000"/>
        <!-- nut -->
        <line v-if="!baseFretVisible" x1="0" y1="0" x2="0" y2="30"
            stroke="#888"/>
        <g transform="translate(3, 0)">
          <!-- fret -->
          <line x1="0" y1="0" x2="0" y2="30" stroke="#888"/>
          <line x1="14" y1="0" x2="14" y2="30" stroke="#888"/>
          <line x1="28" y1="0" x2="28" y2="30" stroke="#888"/>
          <line x1="42" y1="0" x2="42" y2="30" stroke="#888"/>
          <line x1="56" y1="0" x2="56" y2="30" stroke="#888"/>

          <!-- base fret -->
          <text v-if="baseFretVisible" x="7" y="40"
              text-anchor="middle" font-size="9">{{ baseFret }}</text>

          <!-- close string -->
          <circle v-if="closedStringVisible[0]"
              :cx="fretX[0]" cy="0" r="3" fill="#000"/>
          <circle v-if="closedStringVisible[1]"
              :cx="fretX[1]" cy="10" r="3" fill="#000"/>
          <circle v-if="closedStringVisible[2]"
              :cx="fretX[2]" cy="20" r="3" fill="#000"/>
          <circle v-if="closedStringVisible[3]"
              :cx="fretX[3]" cy="30" r="3" fill="#000"/>
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
    frets: Array
  },
  computed: {
    baseFret () {
      const max = Math.max(...this.frets)
      return max < 5 ? 1 : max - 3
    },
    fretIndexs () {
      return this.frets.map(e => {
        if (e <= 0) {
          return e
        } else {
          return e - this.baseFret + 1
        }
      })
    },
    closedStringVisible () {
      return this.fretIndexs.map(e => e > 0)
    },
    openStringVisible () {
      return this.fretIndexs.map(e => e === 0)
    },
    muteStringVisible () {
      return this.fretIndexs.map(e => e === -1)
    },
    baseFretVisible () {
      return this.baseFret !== 1
    },
    fretX () {
      return this.fretIndexs.map(e => (e - 1) * 14 + 7)
    }
  }
}
</script>

<style scoped>
</style>
