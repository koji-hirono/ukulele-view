<template>
  <div class="container">
    <span v-for="chart in charts" v-bind:key="chart">
      <span v-if="chart.kind === 'chord'">
        <a href="#" @click.prevent="selectChord(chart.value)">
          <ChordDiagram
            v-bind:name="chart.value.name"
            v-bind:frets="chart.value.curPos.frets"
            v-bind:fingers="chart.value.curPos.fingers"
            v-bind:baseFret="chart.value.curPos.baseFret"
          ></ChordDiagram>
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
        <div v-for="(pos, i) in selectedChord.positions" :key="pos">
          <input type="radio" :id="i" :value="pos"
             v-model="selectedChord.curPos">
          <label :for="i">
            <ChordDiagram
              v-bind:name="selectedChord.name"
              v-bind:frets="pos.frets"
              v-bind:fingers="pos.fingers"
              v-bind:baseFret="pos.baseFret"
            ></ChordDiagram>
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
      selectedChord: null
    }
  },
  components: {
    ChordDiagram,
    Modal
  },
  computed: {
    charts () {
      return this.$store.getters.charts
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
