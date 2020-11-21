<template>
  <div class="button">
    <label>
      <svg width="30" height="30" viewBox="0 0 100 100">
        <!-- arrow -->
        <line x1="50" y1="20" x2="50" y2="60" stroke="#000"
          stroke-linecap="round"
          stroke-width="10"/>
        <line x1="35" y1="30" x2="50" y2="20" stroke="#000"
          stroke-linecap="round"
          stroke-width="10"/>
        <line x1="65" y1="30" x2="50" y2="20" stroke="#000"
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
      <input type="file" class="input-file" @change="changeFile">
    </label>
  </div>
</template>

<script>
export default {
  name: 'UploadButton',
  data () {
    return {
      name: '',
      text: ''
    }
  },
  methods: {
    changeFile (e) {
      const files = e.target.files || e.dataTransfer.files
      this.name = files[0].name
      this.uploadFile(files[0])
    },
    uploadFile (file) {
      const reader = new FileReader()
      const vm = this
      reader.onload = e => {
        vm.text = e.target.result
        vm.$emit('change', { name: vm.name, text: vm.text })
      }
      reader.readAsText(file)
    }
  }
}
</script>

<style scoped>
.button {
  margin: 1rem 0.25rem;
  padding: 3px;
  text-decolation: none;
  border: solid 1px #888;
  border-radius: 5px;
  filter: drop-shadow(2px 2px 2px rgba(0, 0, 0, 0.2));
  color: #000;
  background-color: #fff;
  cursor: pointer;
}
.button label {
  cursor: pointer;
}
.button:active {
  transform: translateY(4px);
  filter: none;
}
.button:hover {
  filter: invert(75%) drop-shadow(2px 2px 2px rgba(0, 0, 0, 0.2));
}
.input-file {
  display: none;
}
</style>
