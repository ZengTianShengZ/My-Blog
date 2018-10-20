export default {
  install (Vue, options) {
    Vue.directive('dragging', {
      bind (el, binding, vnode, oldVnode) {
        // 逻辑...
      },
      inserted (el) {
        el.onmousedown = function (ev) {
          let disX = ev.clientX - el.offsetLeft
          let disY = ev.clientY - el.offsetTop
          document.onmousemove = function (ev) {
            let l = ev.clientX - disX
            let t = ev.clientY - disY
            el.style.left = l + 'px'
            el.style.top = t + 'px'
          }
          document.onmouseup = function () {
            document.onmousemove = null
            document.onmouseup = null
          }
        }
      },
      unbind () {

      }
    })
  }
}
