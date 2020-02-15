<template>
  <svg width="90" height="124" viewBox="0 0 90 124">
    <text x="0" y="18" font-size="18">{{ name }}</text>
    <text x="0" y="50" font-size="14"
      v-show="baseFretVisible">{{ baseFret }}</text>
    <g transform="translate(18,34)">
      <g transform="translate(0,2)">
        <rect height="80" width="2" x="0" fill="#888"></rect>
        <rect height="80" width="2" x="20" fill="#888"></rect>
        <rect height="80" width="2" x="40" fill="#888"></rect>
        <rect height="80" width="2" x="60" fill="#888"></rect>
      </g>
      <g transform="translate(0,2)">
        <rect height="2" width="62" y="0" fill="#888"></rect>
        <rect height="2" width="62" y="20" fill="#888"></rect>
        <rect height="2" width="62" y="40" fill="#888"></rect>
        <rect height="2" width="62" y="60" fill="#888"></rect>
        <rect height="2" width="62" y="80" fill="#888"></rect>
      </g>
      <g transform="translate(1,12)">
        <g v-for="(finger, i) in fingers" v-bind:key="i">
          <g v-bind:transform="'translate(' + (i * 20) + ',' + fret_y[i] + ')'"
             v-show="closedStringVisible[i]">
            <circle r="7"></circle>
            <text fill="white" y="4" text-anchor="middle">{{finger}}</text>
          </g>
        </g>
      </g>
      <g transform="translate(1,-10)">
        <g v-for="(v, i) in openStringVisible" v-bind:key="i">
          <circle v-bind:cx="i * 20" r="3"
            fill="none" stroke="black" stroke-width="1" v-show="v"></circle>
        </g>
      </g>
    </g>
    <line x1="17" y1="34" x2="81" y2="34" stroke="#000" stroke-width="6"
          stroke-linecap="round" v-show="!baseFretVisible"></line>
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
    fret_y () {
      const a = {}
      for (const k in this.frets) {
        a[k] = (this.frets[k] - 1) * 20
      }
      return a
    }
  }
}
</script>

<style scoped>
svg {
  font-size: 11px;
}
</style>
