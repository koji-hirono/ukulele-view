<template>
  <div class="button">
    <a :href="url" :download="name">
      <svg width="30" height="30" viewBox="0 0 100 100">
        <!-- arrow -->
        <line x1="50" y1="20" x2="50" y2="60" stroke="#000"
          stroke-linecap="round"
          stroke-width="10"/>
        <line x1="35" y1="50" x2="50" y2="60" stroke="#000"
          stroke-linecap="round"
          stroke-width="10"/>
        <line x1="65" y1="50" x2="50" y2="60" stroke="#000"
          stroke-linecap="round"
          stroke-width="10"/>
        <!-- box -->
        <line x1="20" y1="60" x2="20" y2="80" stroke="#000"
          stroke-linecap="round"
          stroke-width="10"/>
        <line x1="80" y1="60" x2="80" y2="80" stroke="#000"
          stroke-linecap="round"
          stroke-width="10"/>
        <line x1="20" y1="80" x2="80" y2="80" stroke="#000"
          stroke-linecap="round"
          stroke-width="10"/>
      </svg>
    </a>
  </div>
</template>

<script>
export default {
  name: 'DownloadButton',
  props: {
    name: String,
    text: String
  },
  computed: {
    url () {
      if (this.text === '') {
        return ''
      }
      const blob = new Blob([this.text], { type: 'text/plain' })
      return URL.createObjectURL(blob)
    }
  }
}
</script>

<style scoped>
.button {
  margin: 1em 0.25em;
  padding: 3px;
  text-decolation: none;
  border: solid 1px #888;
  border-radius: 5px;
  filter: drop-shadow(2px 2px 2px rgba(0, 0, 0, 0.2));
  color: #000;
  background-color: #fff;
}
.button:active {
  transform: translateY(4px);
  filter: none;
}
.button:hover {
  filter: invert(75%) drop-shadow(2px 2px 2px rgba(0, 0, 0, 0.2));
}
</style>
