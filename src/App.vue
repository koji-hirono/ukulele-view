<template>
  <div id="app">
    <div id="edit">
      <div id="control">
        <key-control :min="-6" :max="6" :init="0" @change="changeKey"
        ></key-control>
        <div id="menu">
          <upload-button @change="loadFile"></upload-button>
          <download-button :name="name" :text="text"></download-button>
        </div>
      </div>
      <chart-form :value="text" @input="inputText"></chart-form>
    </div>
    <div id="chart">
      <chart-preview :chart="chart" @change="changePosition"></chart-preview>
    </div>
  </div>
</template>

<script>
import UploadButton from '@/components/UploadButton'
import DownloadButton from '@/components/DownloadButton'
import KeyControl from '@/components/KeyControl'
import ChartForm from '@/components/ChartForm'
import ChartPreview from '@/components/ChartPreview'
import parser from '@/lib/parser.js'

export default {
  name: 'Ukulele Chart',
  components: {
    UploadButton,
    DownloadButton,
    KeyControl,
    ChartForm,
    ChartPreview
  },
  data () {
    return {
      name: '',
      text: '',
      chart: []
    }
  },
  methods: {
    loadFile ({ name, text }) {
      this.name = name
      this.text = text
      this.chart = parser.parse(this.text)
    },
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
  padding: 0 1rem;
}
#control {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}
#menu {
  display: flex;
}
#chart {
  margin: 0 0;
  padding: 0.5rem 1rem;
  flex-grow: 1;
  background-color: #ffc;
}
</style>
