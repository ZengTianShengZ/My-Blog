<template>
<section class="section">
  <div v-for="(item,index) in imgList" :key="index">
    <ImgItem :imgItem='item'/>
  </div>
</section>
</template>
<script>
import ImgItem from '@/components/imgItem'

export default {
  components: {
    ImgItem
  },
  props: {
    imgList: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {}
  },
  mounted () {},
  methods: {}
}
</script>
<style lang="less" scoped>
.section{
  position: relative;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
/**
* @desc: 文件描述
* @author: zengtiansheng
*/
