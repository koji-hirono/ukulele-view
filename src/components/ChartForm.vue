<template>
  <div>
    <textarea class="edit" :value="value" spellcheck="false" @input="inputText"
    ></textarea>
  </div>
</template>

<script>
export default {
  name: 'ChartForm',
  props: {
    value: String
  },
  methods: {
    inputText (event) {
      this.$emit('input', event.target.value)
    }
  }
}
</script>

<style scoped>
.edit {
  width: 30em;
  height: 70vh;
  font-family: monospace;
  font-size: 11pt;
  white-space: pre;
}
</style>
