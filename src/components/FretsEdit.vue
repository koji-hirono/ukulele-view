<template>
  <div>
    <h1>Settings</h1>
    <h3>Select default position</h3>
    <select :value="name" @input="inputName">
      <option value="">-</option>
      <option v-for="key in keynames" :key="key" :value="key">
        {{ key }}
      </option>
    </select>
    <frets-selection
      :name="name"
      :positions="positions"
      :selected="selected"
      @change="changeFrets"
    ></frets-selection>
    <button v-if="name !== ''" @click="save" type="button">Save</button>
    <div v-show="status">{{ status }}</div>
  </div>
</template>

<script>
import chordTable from '@/assets/ukulele_chords.json'
import chord from '@/lib/chord.js'
import FretsSelection from '@/components/FretsSelection'

export default {
  name: 'FretsEdit',
  components: {
    FretsSelection
  },
  data () {
    return {
      name: '',
      selected: null,
      selectedIndex: 0,
      status: ''
    }
  },
  computed: {
    keynames () {
      const s = []
      for (const name in chordTable) {
        s.push(name)
      }
      return s
    },
    positions () {
      if (this.name === '') {
        return []
      }
      return chordTable[this.name]
    }
  },
  methods: {
    inputName (ev) {
      this.status = ''
      this.name = ev.target.value
      this.selected = chordTable[this.name][0]
    },
    changeFrets (index) {
      this.selected = chordTable[this.name][index]
      this.selectedIndex = index
    },
    save () {
      chord.swapPosition(this.name, 0, this.selectedIndex)
      const value = JSON.stringify(chordTable[this.name])
      localStorage.setItem('note-' + this.name, value)
      this.status = 'saved'
      this.name = ''
      this.selected = null
    }
  }
}
</script>

<style scoped>
.status {

}
</style>
