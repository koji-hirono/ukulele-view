<template>
  <div class="container">
    <span v-for="chart in charts" v-bind:key="chart.index">
      <span v-if="chart.kind === 'chord'">
        <a href="#" @click.prevent="selectChart(chart)">
          <chord-diagram
            v-bind:name="chart.value.name"
            v-bind:frets="chart.value.curPos.frets"
            v-bind:fingers="chart.value.curPos.fingers"
            v-bind:baseFret="chart.value.curPos.baseFret"
          ></chord-diagram>
        </a>
      </span>
      <span v-else-if="chart.kind === 'word'">{{chart.value | escapeChar}}</span>
      <span class="space" v-else-if="chart.kind === 'space'" v-text="chart.value">
      </span>
      <br v-else-if="chart.kind === 'newline'">
    </span>
    <modal v-if="showModal" @close="showModal = false">
      <h3 slot="header">Select Chord</h3>
      <div slot="body">
        <div v-for="(pos, i) in selectedPositions" :key="i">
          <input type="radio" :id="i" :value="pos"
             :checked="isChecked(pos)" @change="selectPos(pos)">
          <label :for="i">
            <chord-diagram
              v-bind:name="selectedChart.value.name"
              v-bind:frets="pos.frets"
              v-bind:fingers="pos.fingers"
              v-bind:baseFret="pos.baseFret"
            ></chord-diagram>
          </label>
        </div>
      </div>
    </modal>
  </div>
</template>

<script>
import ChordDiagram from '@/components/ChordDiagram'
import Modal from '@/components/Modal'

export default {
  name: 'Chart',
  data () {
    return {
      showModal: false,
      selectedChart: null
    }
  },
  components: {
    ChordDiagram,
    Modal
  },
  computed: {
    charts () {
      return this.$store.getters.charts
    },
    selectedPositions () {
      return this.selectedChart.value.positions
    }
  },
  filters: {
    escapeChar (s) {
      return s[0] === '\\' ? s.slice(1) : s
    }
  },
  methods: {
    selectChart (chart) {
      this.selectedChart = chart
      this.showModal = true
    },
    selectPos (pos) {
      this.$store.dispatch('setChartPos', {
        index: this.selectedChart.index,
        pos: pos
      })
      this.selectedChart.value.curPos = pos
    },
    isChecked (pos) {
      const curPos = this.selectedChart.value.curPos
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
.space {
  white-space: pre;
}
label {
  vertical-align: middle;
}
</style>
