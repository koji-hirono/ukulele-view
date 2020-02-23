<template>
  <div class="container">
    <span v-for="chart in charts" :key="chart.index">
      <span v-if="chart.kind === 'chord'">
        <a href="#" @click.prevent="selectChart(chart)">
          <chord-diagram
            :name="chart.value.name"
            :frets="chart.value.curPos.frets"
            :baseFret="chart.value.curPos.baseFret"
          ></chord-diagram>
        </a>
      </span>
      <span v-else-if="chart.kind === 'word'">{{chart.value | escapeChar}}</span>
      <span v-else-if="chart.kind === 'space'" class="space" v-text="chart.value">
      </span>
      <br v-else-if="chart.kind === 'newline'">
    </span>
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
              :name="selectedChart.value.name"
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
  data () {
    return {
      showModal: false,
      selectedChart: null
    }
  },
  components: {
    ChordDiagram,
    BaseModal
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
.selectpos {
  vertical-align: middle;
}
</style>
