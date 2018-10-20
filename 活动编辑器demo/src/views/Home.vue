<template>
  <div class="home">
    <Upload class="upload" @imgBase64="getImgBase64"/>
    <Canvas :imgList='imgList' class="canvas"/>
  </div>
</template>

<script>
// @ is an alias to /src
import Canvas from '@/components/canvas'
import Upload from '@/components/upload'

export default {
  components: {
    Canvas,
    Upload
  },
  data () {
    return {
      imgList: []
    }
  },
  methods: {
    getImgBase64 (data) {
      this.imgList.push(data)
    }
  }
}
</script>
<style lang="less" scoped>
.home {
  display: flex;
  width: 100%;
  height: 100%;
  // padding: 100px;
}
.upload{
  width: 300px;
  height: 100%;
}
.canvas{
  width: 750px;
  height: 100%;
  border: 1px solid rgb(231, 231, 231)
}
</style>
