<template>
  <div id="app">
    <div id="edit">
      <key-control></key-control>
      <chart-form></chart-form>
    </div>
    <div id="chart">
      <chart-view></chart-view>
    </div>
  </div>
</template>

<script>
import KeyControl from '@/components/KeyControl'
import ChartForm from '@/components/ChartForm'
import ChartView from '@/components/ChartView'

export default {
  name: 'Ukulele Chart',
  components: {
    KeyControl,
    ChartForm,
    ChartView
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
