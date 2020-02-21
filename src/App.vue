<template>
  <div id="app">
    <key-control></key-control>
    <chart-form></chart-form>
    <chart-view></chart-view>
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
}
</style>
