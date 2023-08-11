<template>
  <div class="signature-wrapper" v-show="show">
    <div class="content-wrapper">
      <div class="signature-title">电子签名</div>
      <div ref="canvasHW" class="canvas-box">
        <canvas
          ref="canvasF"
          @mousedown="mouseDown"
          @mousemove="mouseMove"
          @mouseup="mouseUp"
        ></canvas>
      </div>
      <div class="btn-wrapper">
        <div class="btn" @click="handleClose">取消</div>
        <div class="btn" @click="handleOverwrite">重签</div>
        <div class="btn" @click="handleSubmit">确认</div>
      </div>
    </div>
  </div>
</template>
<scrpit lang="ts" setup>
import { ref, onMounted } from 'vue'
import { ElDialog, ELButton, ElMessage } from 'element-plus'

/**
 * 业务场景：
 * 用户在页面使用电子签名进行文件的签收与信息的确认
 *
 * 实现思路：
 * 通过一个对话框的形式利用Canvas生成图片并通过toDataURL()
 * 转换成Base64的形式保存下来提交给后端进行保存
 *
 * 用的事件：
 * mousedown、mouseup、mousemove、touchstart、touchmove、touchend
 */

interface PropsType {
  show: boolean
}

const props = defineProps<PropsType>()
const points = ref<any[]>([])
const canvasTxt = ref<any>(null)
const stageInfo = ref<any>(null)
const startX = ref<number>(0)
const startY = ref<number>(0)
const moveX = ref<number>(0)
const moveY = ref<number>(0)
const isDown = ref<boolean>(false)
const strokeStyle = ref<string>('#000')
const lineWidth = ref<number>(2)
const canvasHW = ref<HTMLElement | null>(null)
const canvasF = ref<HTMLElement | null>(null)

const emit = defineEmits(['close', 'submit'])

// 初始化Canvas
const initCanvas = () => {
  let canvas = canvasF.value as HTMLElement
  // 获取画布的高度
  canvas.height = (canvasHW.value as HTMLElement).offsetHeight - 20
  // 获取画布的宽度
  canvas.width = (canvasHW.value as HTMLElement).offsetWidth - 20
  // 创建 context 对象
  canvasTxt.value = canvas.getContext('2d')
  stageInfo.value = canvas.getBoundingClientRect()
}

// 鼠标按下事件 - 准备绘画
const mouseDown = (ev: MouseEvent) => {
  ev = ev || event
  ev.preventDefault()
  if (ev) {
    let obj = {
      x: ev.offsetX,
      y: ev.offsetY
    }
    startX.value = obj.x
    startY.value = obj.y
    canvasTxt.value?.beginPath()
    canvasTxt.value?.moveTo(startX.value, startY.value)
    canvasTxt.value?.lineTo(obj.x, obj.y)
    canvasTxt.value?.stroke()
    canvasTxt.value?.closePath()
    points.value.push(obj)
    isDown.value = true
  }
}

// 鼠标移动事件 - 开始绘画
const mouseMove = (ev: MouseEvent) => {
  ev = ev || event
  ev.preventDefault()
  if (isDown.value) {
    let obj = {
      x: ev.offsetX,
      y: ev.offsetY
    }
    moveY.value = obj.y
    moveX.value = obj.x
    canvasTxt.value?.strokeStyle = strokeStyle.value
    canvasTxt.value?.lineWidth = lineWidth.value
    canvasTxt.value?.beginPath()
    canvasTxt.value?.moveTo(startX.value, startY.value)
    canvasTxt.value?.lineTo(obj.x, obj.y)
    canvasTxt.value?.stroke()
    canvasTxt.value?.closePath()
    startY.value = obj.y
    startX.value = obj.x
    points.value.push(obj)
  }
}

// 松开鼠标事件 - 停止绘画
const mouseUp = (ev: MouseEvent) => {
  ev = ev || event
  ev.preventDefault()
  if (ev) {
    let obj = {
      x: ev.offsetX,
      y: ev.offsetY
    }
    canvasTxt.value?.beginPath()
    canvasTxt.value?.moveTo(startX.value, startY.value)
    canvasTxt.value?.lineTo(obj.x, obj.y)
    canvasTxt.value?.stroke()
    canvasTxt.value?.closePath()
    points.value.push(obj)
    points.value.push({ x: -1, y: -1 })
    isDown.value = false
  }
}

// 取消
const handleClose = () => {
  handleOverwrite()
  emit('close')
}

// 重写
const handleOverwrite = () => {
  canvasTxt.value?.clearRect(
    0,
    0,
    (canvasF.value as HTMLElement).width,
    (canvasF.value as HTMLElement).height
  )
  points.value = []
}

// 提交
const handleSubmit = () => {
  if (points.value.length < 50) {
    if (points.value.length == 0) {
      ElMessage.error('请填写你的名称')
    }
    return
  }
  emit('submit', (canvasF.value as HTMLElement).toDataURL())
  handleOverwrite()
}

onMounted(() => {
  initCanvas()
})
</scrpit>

<script lang="ts">
import { ElMessage } from 'element-plus'

/**
 * 业务场景：
 * 用户在页面使用电子签名进行文件的签收与信息的确认
 *
 * 实现思路：
 * 通过一个对话框的形式利用Canvas生成图片并通过toDataURL()
 * 转换成Base64的形式保存下来提交给后端进行保存
 *
 * 用的事件：
 * mousedown、mouseup、mousemove、touchstart、touchmove、touchend
 */

interface DataType {
  points: any[]
  canvasTxt: any
  stageInfo: any
  startX: number
  startY: number
  moveY: number
  moveX: number
  isDown: boolean
  strokeStyle: string
  lineWidth: number
  [key: string]: any
}

export default {
  name: 'ESignature',
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      points: [],
      canvasTxt: null,
      stageInfo: null,
      startX: 0,
      startY: 0,
      moveY: 0,
      moveX: 0,
      isDown: false,
      strokeStyle: '#000',
      lineWidth: 2
    } as DataType
  },
  mounted() {
    this.initCanvas()
  },
  methods: {
    // 初始化Canvas
    initCanvas() {
      let canvas: any = this.$refs.canvasF
      // 获取画布的高度
      canvas.height = 280
      // 获取画布的宽度
      canvas.width = 540
      // 创建 context 对象
      this.canvasTxt = canvas.getContext('2d')
      this.stageInfo = canvas.getBoundingClientRect()
    },
    // 鼠标按下事件 - 准备绘画
    mouseDown(ev: MouseEvent) {
      ev = ev || event
      ev.preventDefault()
      if (ev) {
        let obj: any = {
          x: ev.offsetX,
          y: ev.offsetY
        }
        this.startX = obj.x
        this.startY = obj.y
        this.canvasTxt.beginPath()
        this.canvasTxt.moveTo(this.startX, this.startY)
        this.canvasTxt.lineTo(obj.x, obj.y)
        this.canvasTxt.stroke()
        this.canvasTxt.closePath()
        this.points.push(obj)
        this.isDown = true
      }
    },
    // 鼠标移动事件 - 开始绘画
    mouseMove(ev: MouseEvent) {
      ev = ev || event
      ev.preventDefault()
      if (this.isDown) {
        let obj: any = {
          x: ev.offsetX,
          y: ev.offsetY
        }
        this.moveY = obj.y
        this.moveX = obj.x
        this.canvasTxt.strokeStyle = this.strokeStyle
        this.canvasTxt.lineWidth = this.lineWidth
        this.canvasTxt.beginPath()
        this.canvasTxt.moveTo(this.startX, this.startY)
        this.canvasTxt.lineTo(obj.x, obj.y)
        this.canvasTxt.stroke()
        this.canvasTxt.closePath()
        this.startY = obj.y
        this.startX = obj.x
        this.points.push(obj)
      }
    },
    // 松开鼠标事件 - 停止绘画
    mouseUp(ev: MouseEvent) {
      ev = ev || event
      ev.preventDefault()
      if (ev) {
        let obj: any = {
          x: ev.offsetX,
          y: ev.offsetY
        }
        this.canvasTxt.beginPath()
        this.canvasTxt.moveTo(this.startX, this.startY)
        this.canvasTxt.lineTo(obj.x, obj.y)
        this.canvasTxt.stroke()
        this.canvasTxt.closePath()
        this.points.push(obj)
        this.points.push({ x: -1, y: -1 })
        this.isDown = false
      }
    },
    // 取消
    handleClose() {
      this.handleOverwrite()
      this.$emit('close')
    },
    // 重写
    handleOverwrite() {
      this.canvasTxt.clearRect(0, 0, 540, 280)
      this.points = []
    },
    // 提交
    handleSubmit() {
      if (this.points.length < 50) {
        if (this.points.length === 0) {
          ElMessage.error('请签名')
        }
        return
      }
      this.$emit('submit', (this.$refs.canvasF as any)?.toDataURL())
      this.handleOverwrite()
    }
  }
}
</script>
<style lang="less" scoped>
.signature-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10000000;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);

  .content-wrapper {
    width: 600px;
    height: 500px;
    padding: 10px 20px 20px 20px;
    margin: 30px auto;
    background-color: #fff;
    border-radius: 5px;
    box-sizing: border-box;

    .signature-title {
      width: 100%;
      height: 60px;
      font-size: 16px;
      line-height: 60px;
      color: #313133;
    }

    .canvas-box {
      width: 100%;
      height: 300px;
      border: 1px solid #999;
    }

    .btn-wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 30px;

      .btn {
        width: 60px;
        height: 32px;
        margin-right: 15px;
        font-size: 14px;
        line-height: 32px;
        color: #fff;
        text-align: center;
        cursor: pointer;
        background-color: #3e73ec;
        border-radius: 5px;

        &:active {
          opacity: 0.5;
        }
      }
    }
  }
}
</style>
