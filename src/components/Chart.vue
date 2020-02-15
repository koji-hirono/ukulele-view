<template>
  <div class="container">
    <span v-for="chart in charts" v-bind:key="chart">
      <span v-if="chart.kind === 'chord'">
        <ChordDiagram
          v-bind:name="chart.value.name"
          v-bind:frets="chart.value.frets"
          v-bind:fingers="chart.value.fingers"
          v-bind:baseFret="chart.value.baseFret"
        ></ChordDiagram>
      </span>
      <span v-else-if="chart.kind === 'word'">{{chart.value | escapeChar}}</span>
      <span class="space" v-else-if="chart.kind === 'space'" v-text="chart.value">
      </span>
      <br v-else-if="chart.kind === 'newline'">
    </span>
  </div>
</template>

<script>
import ChordDiagram from '@/components/ChordDiagram'

export default {
  name: 'Chart',
  components: {
    ChordDiagram
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
  }
}
</script>

<style scoped>
.container {
}
.space {
  white-space: pre;
}
</style>
