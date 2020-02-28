<template>
  <div id="app">
    <div id="edit">
      <key-control :min="-6" :max="6" :init="0" @change="changeKey"></key-control>
      <chart-form :value="text" @input="inputText"></chart-form>
    </div>
    <div id="chart">
      <chart-preview :chart="chart" @change="changePosition"></chart-preview>
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
      text: '',
      chart: []
    }
  },
  methods: {
    inputText (data) {
      this.text = data
      this.chart = parser.parse(data)
    },
    changeKey (degree) {
      this.chart = parser.transpose(this.chart, degree)
      this.text = parser.rebuildingText(this.chart, this.text)
      this.chart = parser.parse(this.text)
    },
    changePosition ({ index, pos }) {
      this.chart.forEach(chartLine => {
        chartLine.forEach(chartItem => {
          if (chartItem.chords) {
            const chord = chartItem.chords.find(c => c.index === index)
            if (chord) {
              chord.value.curPos = pos
            }
          }
        })
      })
      this.text = parser.rebuildingText(this.chart, this.text)
      this.chart = parser.parse(this.text)
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
