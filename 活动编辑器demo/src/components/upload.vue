<template>
<section>
  <input type="file" accept="image/*" @change="processFile($event)">
  <img class="img" :src="srcBase64" alt="">
</section>
</template>
<script>
export default {
  data () {
    return {
      srcBase64: ''
    }
  },
  mounted () {},
  methods: {
    processFile (event) {
      const _this = this
      const reads = new FileReader()
      reads.readAsDataURL(event.target.files[0])
      reads.onload = function (e) {
        _this.srcBase64 = this.result
        _this.$emit('imgBase64', this.result)
      }
    }
  }
}
</script>
<style lang="less" scoped>
.btn-file{
  width: 100px;
  height: 100px;
  border: 1px solid red;
}
.inputfile {
  opacity: 0;
}
.img{
  width: 100px;
  height: 100px;
}
</style>
/**
* @desc: 文件描述
* @author: zengtiansheng
*/
