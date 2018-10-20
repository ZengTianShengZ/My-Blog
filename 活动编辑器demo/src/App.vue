<template>
  <div id="app">
    <Home/>
  </div>
</template>
<script>
import Home from '@/views/Home'
export default {
  components: {
    Home
  }
}
</script>

<style lang="less">
html, body {
  width: 100%;
  height: 100%;
}
* {
  margin: 0;
  padding: 0;
}
#app {
  width: 100%;
  height: 100%;
}
</style>
