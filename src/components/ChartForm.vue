<template>
  <div>
    <textarea v-bind:value="text" v-on:input="inputText" cols="50" rows="10"></textarea>
    <ul v-if="errors.length != 0">
      <li class="error" v-for="error in errors" v-bind:key="error">{{ error }}</li>
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
textarea {
  font-family: monospace;
  font-size: 1.5em;
  white-space: pre;
}
.error {
  color: #c33;
}
</style>
