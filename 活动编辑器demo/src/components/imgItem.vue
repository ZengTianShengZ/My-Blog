<template>
<section ref="imgItem" class="section-img-item" v-dragging>
  <img class="img-content" ref="imgContent" :src="imgItem" alt="">
  <div class="edit-wrap">
    <i class="i-edit i-top-left" @mousedown.stop="mouseDown"></i>
    <i class="i-edit i-top-right" @mousedown.stop="mouseDown"></i>
    <i class="i-edit i-bottom-left" @mousedown.stop="mouseDown"></i>
    <i class="i-edit i-bottom-right" @mousedown.stop="mouseDown"></i>
  </div>
</section>
</template>
<script>
export default {
  props: {
    imgItem: {
      type: String,
      default () {
        return ''
      }
    }
  },
  data () {
    return {
      contentWidth: ''
    }
  },
  mounted () {},
  methods: {
    mouseDown (ev) {
      const refImgItem = this.$refs.imgItem
      const imgContent = this.$refs.imgContent
      let disX = ev.clientX
      let disY = ev.clientY
      document.onmousemove = function (ev) {
        let clientWidth = refImgItem.clientWidth
        let clientHeight = refImgItem.clientHeight
        refImgItem.style.width = clientWidth + (disX - ev.clientX) + 'px'
        refImgItem.style.height = clientHeight + (disY - ev.clientY) + 'px'
        imgContent.style.width = clientWidth + (disX - ev.clientX) + 'px'
        imgContent.style.height = clientHeight + (disY - ev.clientY) + 'px'
        disX = ev.clientX
        disY = ev.clientY
      }
      document.onmouseup = function () {
        document.onmousemove = null
        document.onmouseup = null
      }
    }
  }
}
</script>
<style lang="less" scoped>
@iSize: 20px;
.section-img-item{
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
  cursor: pointer;
}
.section-img-item::after{
  position: absolute;
  top: 0;
  left: 0;
  content: '';
  width: 100%;
  height: 100%;
  // background: rgba(0,0,0,0.1);
}
.edit-wrap{
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  border: 1px  dashed  rgb(122, 122, 122);
  .i-edit{
    position: absolute;
    width: @iSize;
    height: @iSize;
    background: rgb(168, 168, 168);
  }
  .i-top-left{
    top: -@iSize;
    left: -@iSize;
  }
  .i-top-right{
    top: -@iSize;
    right: -@iSize;
  }
  .i-bottom-left{
    bottom: -@iSize;
    left: -@iSize;
  }
  .i-bottom-right{
    bottom: -@iSize;
    right: -@iSize;
  }
}
</style>
/**
* @desc: 文件描述
* @author: zengtiansheng
*/
