<template>
  <div class="container">
    <div>
      <button type="button" v-on:click="transpose_down">&#x266D;</button>
      <button type="button" v-on:click="transpose_reset">&#x266E;</button>
      <button type="button" v-on:click="transpose_up">&#x266F;</button>
    </div>
    <div>
      <span v-for="k in keyRange" v-bind:key="k">
        <span v-if="k == key" class="active">
          ●
        </span>
        <span v-else class="notactive">
          ○
        </span>
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'KeyControl',
  data () {
    return {
      key: 0,
      keyRange: [-6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6]
    }
  },
  methods: {
    transpose_down () {
      if (this.key > -6) {
        this.key--
      }
    },
    transpose_up () {
      if (this.key < 6) {
        this.key++
      }
    },
    transpose_reset () {
      this.key = 0
    }
  }
}
</script>

<style scoped>
.container {
  margin: 0.5em;
  padding: 0.5em;
}
button {
  margin: 0.5em 0.5em 0.5em 0.5em;
  width: 2em;
  height: 2em;
  font-size: 16pt;
  text-align: center;
  border-radius: 50%;
  border: none;
  background-color: #ccc;
  color: #000;
}
button:active {
  -webkit-transform: translateY(4px);
  transform: translateY(4px);
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.2);
}
.active {
  color: #c33;
}
.notactive {
  color: #ccc;
}
</style>
