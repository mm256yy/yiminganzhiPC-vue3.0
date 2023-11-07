<template>
  <div :class="[prefixCls, `${prefixCls}--${configGlobal?.size}`]">
    <ElInputNumber placeholder="请输入" class="inp-num" v-model="val1" :controls="false" />
    <div class="line"></div>
    <ElInputNumber placeholder="请输入" class="inp-num" v-model="val2" :controls="false" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { ElInputNumber, ElMessage } from 'element-plus'
import { useConfigGlobal } from '@/hooks/web/useConfigGlobal'
import { useDesign } from '@/hooks/web/useDesign'

interface PropsType {
  modelValue: Array<number | undefined>
}

const { getPrefixCls } = useDesign()

const prefixCls = getPrefixCls('input-range')

const props = defineProps<PropsType>()

// 输入框的值
const val1 = ref<number | undefined>()
const val2 = ref<number | undefined>()

const { configGlobal } = useConfigGlobal()

const emit = defineEmits(['update:modelValue'])

// const val1Change = (val: number | undefined) => {
//   console.log(val, 'val')
//   if (val2.value !== undefined && val !== undefined) {
//     if (val >= val2.value) {
//       val1.value = 0
//       return
//     }
//   }
//   val1.value = val
// }

// const val2Change = (val: number | undefined) => {
//   if (val1.value !== undefined && val !== undefined) {
//     if (val <= val1.value) {
//       val2.value = 0
//       return
//     }
//   }
//   val2.value = val
// }

watch(
  () => props.modelValue,
  (val: Array<number | undefined>) => {
    val1.value = val[0] || undefined
    val2.value = val[1] || undefined
  }
)

// 监听
watch([val1, val2], ([value1, value2]) => {
  if (value1 !== undefined && value2 !== undefined) {
    if (value1 >= value2) {
      ElMessage.info('第一个值不得大于第二个值')
      emit('update:modelValue', [undefined, undefined])
      return
    } else {
      emit('update:modelValue', [value1, value2])
    }
  } else {
    emit('update:modelValue', [value1, value2])
  }
})
</script>

<style lang="less" scoped>
@prefix-cls: ~'@{namespace}-input-range';

.@{prefix-cls} {
  display: flex;
  align-items: center;
  justify-content: space-between;

  .inp-num {
    width: 93px;
  }

  .line {
    width: 4px;
    height: 1px;
    margin: 0 8px;
    background-color: #dcdfe6;
  }
  :deep(.@{elNamespace}-input__clear) {
    margin-left: 5px;
  }
}
</style>
