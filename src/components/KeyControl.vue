<template>
  <div class="container">
    <div>
      <button type="button" @click="keyDown">&#x266D;</button>
      <button type="button" @click="keyReset">&#x266E;</button>
      <button type="button" @click="keyUp">&#x266F;</button>
    </div>
    <div>
      <span v-for="key in keyRange" :key="key" :class="keyClass(key)">
        {{ keyIcon(key) }}
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'KeyControl',
  computed: {
    keyCurrent () {
      return this.$store.state.key
    },
    keyRange () {
      const a = []
      for (let i = this.$store.state.keyMin; i <= this.$store.state.keyMax; i++) {
        a.push(i)
      }
      return a
    }
  },
  methods: {
    keyDown () {
      this.$store.dispatch('keyDown')
    },
    keyUp () {
      this.$store.dispatch('keyUp')
    },
    keyReset () {
      this.$store.dispatch('keyReset')
    },
    keyIcon (key) {
      if (key === this.keyCurrent) {
        return '●'
      } else {
        return '○'
      }
    },
    keyClass (key) {
      if (key === 0) {
        return 'zero'
      } else if (key === this.keyCurrent) {
        return 'active'
      } else {
        return 'notactive'
      }
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
.zero {
  color: #338;
}
</style>
