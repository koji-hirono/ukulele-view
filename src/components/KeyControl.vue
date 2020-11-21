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
  props: {
    min: Number,
    max: Number,
    init: Number
  },
  data () {
    return {
      cur: 0
    }
  },
  computed: {
    keyRange () {
      const a = []
      for (let i = this.min; i <= this.max; i++) {
        a.push(i)
      }
      return a
    }
  },
  methods: {
    keyDown () {
      if (this.cur > this.min) {
        this.$emit('change', -1)
        this.cur--
      }
    },
    keyUp () {
      if (this.cur < this.max) {
        this.$emit('change', 1)
        this.cur++
      }
    },
    keyReset () {
      if (this.cur !== 0) {
        this.$emit('change', 0 - this.cur)
        this.cur = 0
      }
    },
    keyClass (key) {
      if (key === 0) {
        return 'zero'
      } else if (key === this.cur) {
        return 'active'
      } else {
        return 'notactive'
      }
    }
  },
  mounted () {
    this.cur = this.init
  }
}
</script>

<style scoped>
.container {
  margin: 0.5rem 0;
  padding: 0.5rem 0;
  display: flex;
  width: max-content;
  flex-direction: column;
}
.control-bar {
  margin: 0.5rem 0;
  display: flex;
  justify-content: space-between;
}
.control-button {
  width: 2rem;
  height: 2rem;
  font-size: 14pt;
  font-family: Helvetica, Arial, sans-serif;
  text-align: center;
  border-radius: 50%;
  border-style: none;
  filter: drop-shadow(4px 4px 4px rgba(0, 0, 0, 0.4));
  background-color: #333;
  color: #fff;
  cursor: pointer;
}
.control-button:active {
  transform: translateY(4px);
  filter: none;
}
.meter {
  cursor: default;
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
