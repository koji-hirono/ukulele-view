<template>
  <div>
    <div>
      <router-link to="/">Top</router-link>
      |
      <router-link to="/settings">Settings</router-link>
    </div>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
import chordTable from '@/assets/ukulele_chords.json'

export default {
  name: 'UkuleleChart',
  mounted () {
    for (const name in chordTable) {
      const value = localStorage.getItem('note-' + name)
      if (value !== null) {
        chordTable[name] = JSON.parse(value)
      }
    }
  }
}
</script>

<style>
</style>
