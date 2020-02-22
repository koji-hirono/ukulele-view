<template>
  <div class="container">
    <div class="control-bar">
      <div>
        <button type="button" class="control-button"
          @click="keyDown">&#x266D;</button>
      </div>
      <div>
        <button type="button" class="control-button"
          @click="keyReset">&#x266E;</button>
      </div>
      <div>
        <button type="button" class="control-button"
          @click="keyUp">&#x266F;</button>
      </div>
    </div>
    <div>
      <span v-for="key in keyRange" :key="key" :class="keyClass(key)" class="meter">
        ●
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
  margin: 0.5em 0;
  padding: 0.5em 0;
  display: flex;
  width: max-content;
  flex-direction: column;
}
.control-bar {
  margin: 0.5em 0;
  display: flex;
  justify-content: space-between;
}
.control-button {
  width: 2em;
  height: 2em;
  font-size: 14pt;
  font-family: Helvetica, Arial, sans-serif;
  text-align: center;
  border-radius: 50%;
  border-style: none;
  filter: drop-shadow(4px 4px 4px rgba(0, 0, 0, 0.4));
  background-color: #333;
  color: #fff;
}
.control-button:active {
  transform: translateY(4px);
  filter: none;
}
.meter {
}
.active {
  color: #c33;
}
.notactive {
  color: #ccc;
}
.zero {
  color: #3cf;
}
</style>
