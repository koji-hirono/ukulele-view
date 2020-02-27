<template>
  <div id="app">
    <div id="edit">
      <key-control :min="-6" :max="6" :init="0" @change="changeKey"></key-control>
      <chart-form :value="text" @input="inputText"></chart-form>
    </div>
    <div id="chart">
      <chart-preview :charts="charts" @change="changePosition"></chart-preview>
    </div>
  </div>
</template>

<script>
import KeyControl from '@/components/KeyControl'
import ChartForm from '@/components/ChartForm'
import ChartPreview from '@/components/ChartPreview'
import parser from '@/lib/parser.js'

export default {
  name: 'Ukulele Chart',
  components: {
    KeyControl,
    ChartForm,
    ChartPreview
  },
  data () {
    return {
      charts: []
    }
  },
  computed: {
    text () {
      return parser.rebuildingText(this.charts)
    }
  },
  methods: {
    inputText (data) {
      this.charts = parser.parse(data)
    },
    changeKey (degree) {
      this.charts = parser.transpose(this.charts, degree)
    },
    changePosition ({ index, pos }) {
      const chord = this.charts.find(e => e.index === index)
      if (chord) {
        chord.value.curPos = pos
      }
    }
  }
}
</script>

<style>
#app {
  margin: 0;
  padding: 0;
  display: flex;
  font-family: Meiryo, sans-serif;
}
#edit {
  margin: 0 0;
  padding: 0 1em;
}
#chart {
  margin: 0 0;
  padding: 0.5em 1em;
  flex-grow: 1;
  background-color: #ffc;
}
</style>
