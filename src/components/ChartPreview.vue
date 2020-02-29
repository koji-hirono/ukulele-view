<template>
  <div class="container">
    <div v-for="(chartLine, i) in chart" :key="i" class="chart-line">
      <div v-for="(chartItem, j) in chartLine" :key="j" class="chart-item">
        <div v-if="chartItem.chords && chartItem.chords.length > 0" class="chord">
          <span v-for="(chord, k) in chartItem.chords" :key="k">
            <span v-if="chord.kind === 'chord'">
              <a href="#" @click.prevent="selectChord(chord)">
                <chord-diagram
                  :name="chord.value.name"
                  :frets="chord.value.curPos.frets"
                  :baseFret="chord.value.curPos.baseFret"
                ></chord-diagram>
              </a>
            </span>
            <span v-else-if="chord.kind === 'word'">{{ chord.value | escapeChar }}</span>
          </span>
        </div>
        <div v-else class="chord">&nbsp;</div>
        <div v-if="chartItem.lyrics" class="lyrics">
          <div>{{ chartItem.lyrics.value }}</div>
        </div>
      </div>
    </div>
    <base-modal v-if="showModal" @close="showModal = false">
      <h3 slot="header">Select position</h3>
      <div slot="body">
        <div v-for="(pos, i) in selectedPositions" :key="i">
          <label>
            <input type="radio" :value="pos"
              :checked="isChecked(pos)"
              class="selectpos"
              @change="selectPos(pos)">
            <chord-diagram
              :name="selectedChord.value.name"
              :frets="pos.frets"
              :baseFret="pos.baseFret"
              class="selectpos"
            ></chord-diagram>
          </label>
        </div>
      </div>
    </base-modal>
  </div>
</template>

<script>
import ChordDiagram from '@/components/ChordDiagram'
import BaseModal from '@/components/BaseModal'

export default {
  name: 'ChartView',
  components: {
    ChordDiagram,
    BaseModal
  },
  props: {
    chart: Array
  },
  data () {
    return {
      showModal: false,
      selectedChord: null
    }
  },
  computed: {
    selectedPositions () {
      return this.selectedChord.value.positions
    }
  },
  filters: {
    escapeChar (s) {
      return s[0] === '\\' ? s.slice(1) : s
    }
  },
  methods: {
    selectChord (chord) {
      this.selectedChord = chord
      this.showModal = true
    },
    selectPos (pos) {
      this.$emit('change', {
        index: this.selectedChord.index,
        pos: pos
      })
      this.selectedChord.value.curPos = pos
    },
    isChecked (pos) {
      const curPos = this.selectedChord.value.curPos
      if (curPos.baseFret !== pos.baseFret) {
        return false
      }
      if (curPos.frets[0] !== pos.frets[0]) {
        return false
      }
      if (curPos.frets[1] !== pos.frets[1]) {
        return false
      }
      if (curPos.frets[2] !== pos.frets[2]) {
        return false
      }
      if (curPos.frets[3] !== pos.frets[3]) {
        return false
      }
      return true
    }
  }
}
</script>

<style scoped>
.container {
}
.chart-line {
  display: flex;
  align-items: flex-end;
}
.chart-item {
  display: flex;
  flex-direction: column;
  width: max-content;
}
.chord {
}
.lyrics {
  margin: 0 0.25em;
}
.space {
  white-space: pre;
}
.selectpos {
  vertical-align: middle;
}
.error {
  color: #888;
  font-family: monospace;
  text-decoration: wavy underline #c33;
}
</style>
