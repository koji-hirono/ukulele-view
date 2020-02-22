<template>
  <div>
    <textarea class="edit" :value="text" @input="inputText"></textarea>
    <ul v-if="errors.length != 0">
      <li v-for="error in errors" :key="error" class="error">{{ error }}</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'ChartForm',
  computed: {
    text () {
      return this.$store.getters.text
    },
    errors () {
      return this.$store.getters.errors
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
.error {
  color: #c33;
}
</style>
