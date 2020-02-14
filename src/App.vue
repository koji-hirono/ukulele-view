<template>
  <div id="app">
    <KeyControl></KeyControl>
    <ChartForm></ChartForm>
    <Chart></Chart>
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
