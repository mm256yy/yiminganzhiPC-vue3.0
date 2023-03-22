<template>
  <div class="ScreenAdapter" :style="style">
    <slot></slot>
  </div>
</template>
<script>
export default {
  name: '',
  //参数注入
  props: {
    width: {
      type: String,
      default: '1440'
    },
    height: {
      type: String,
      default: '810'
    },
    bgUrl: {
      type: String
    },
    padding: {
      type: String,
      default: '0'
    },
    isFull: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      style: {
        width: this.width + 'px',
        height: this.height + 'px',
        transform: 'scale(1) translate(-50%, -50%)',
        background: ` url(${this.bgUrl}) no-repeat center`,
        backgroundSize: 'cover',
        padding: this.padding
      }
    }
  },
  mounted() {
    this.setScale()
    window.onresize = this.Debounce(this.setScale, 1000)
  },
  methods: {
    Debounce: (fn, t) => {
      const delay = t || 500
      let timer
      return function () {
        const args = arguments
        if (timer) {
          clearTimeout(timer)
        }
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        // const context = this
        timer = setTimeout(() => {
          timer = null
          fn.apply(this, args)
        }, delay)
      }
    },
    // 获取放大缩小比例
    getScale() {
      const w = window.innerWidth / this.width
      const h = window.innerHeight / this.height
      if (this.isFull) {
        return [w, h]
      }
      return w < h ? w : h
    },
    // 设置比例
    setScale() {
      if (this.isFull) {
        var arr = this.getScale()
        console.log(arr)
        this.style.transform = 'scale(' + arr[0] + ',' + arr[1] + ') translate(-50%, 0%)'
      } else {
        this.style.transform = 'scale(' + this.getScale() + ') translate(-50%, 0%)'
      }
    }
  }
}
</script>
<style lang="less" scoped>
* {
  padding: 0;
  margin: 0;
}

.ScreenAdapter {
  // color: #fff;
  position: absolute;
  top: 0%;
  left: 50%;
  box-sizing: border-box;
  transition: 0.3s;
  transform-origin: 0 0;
}
</style>
