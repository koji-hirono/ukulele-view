<template>
  <div id="app">
    <key-control></key-control>
    <chart-form></chart-form>
    <chart></chart>
  </div>
</template>

<script>
import KeyControl from '@/components/KeyControl'
import ChartForm from '@/components/ChartForm'
import Chart from '@/components/Chart'

export default {
  name: 'Ukulele Chart',
  components: {
    KeyControl,
    ChartForm,
    Chart
  }
}
</script>

<style>
#app {
}
</style>
