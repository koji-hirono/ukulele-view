<template>
  <div>
    <div v-for="(pos, i) in positions" :key="pos">
      <label>
        <input
          :value="pos"
          :checked="isChecked(pos)"
          @change="selectPos(i)"
          class="selectpos"
          type="radio">
        <chord-diagram
          :name="name"
          :frets="pos.frets"
          class="selectpos"
        ></chord-diagram>
      </label>
    </div>
  </div>
</template>

<script>
import ChordDiagram from '@/components/ChordDiagram'

export default {
  name: 'FretsSelection',
  components: {
    ChordDiagram
  },
  props: {
    name: String,
    positions: Array,
    selected: Object
  },
  methods: {
    selectPos (i) {
      this.$emit('change', i)
    },
    isChecked (pos) {
      if (this.selected === null) {
        return false
      }
      for (let i = 0; i < 4; i++) {
        if (pos.frets[i] !== this.selected.frets[i]) {
          return false
        }
      }
      return true
    }
  }
}
</script>

<style scoped>
.selectpos {
  vertical-align: middle;
}
</style>
