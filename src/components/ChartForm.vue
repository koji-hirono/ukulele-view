<template>
  <div>
    <textarea class="edit" :value="text" @input="inputText"></textarea>
  </div>
</template>

<script>
export default {
  name: 'ChartForm',
  computed: {
    text () {
      return this.$store.getters.text
    }
  },
  methods: {
    inputText (ev) {
      this.$store.dispatch('parse', ev.target.value)
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
