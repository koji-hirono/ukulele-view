<template>
  <div>
    <textarea v-model="text" cols="60" rows="14"></textarea>
  </div>
</template>

<script>
export default {
  name: 'ChartForm',
  data () {
    return {
      text: ''
    }
  }
}
</script>

<style scoped>
textarea {
  font-family: monospace;
  font-size: 1.5em;
  white-space: pre;
}
</style>
