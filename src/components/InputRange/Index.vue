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
  modelValue: Array<number | null>
}

const { getPrefixCls } = useDesign()

const prefixCls = getPrefixCls('input-range')

const props = defineProps<PropsType>()

// 输入框的值
const val1 = ref<any>()
const val2 = ref<any>()

const { configGlobal } = useConfigGlobal()

const emit = defineEmits(['update:modelValue'])

// const val1Change = (val: number | null) => {
//   console.log(val, 'val')
//   if (val2.value !== null && val !== null) {
//     if (val >= val2.value) {
//       val1.value = 0
//       return
//     }
//   }
//   val1.value = val
// }

// const val2Change = (val: number | null) => {
//   if (val1.value !== null && val !== null) {
//     if (val <= val1.value) {
//       val2.value = 0
//       return
//     }
//   }
//   val2.value = val
// }

watch(
  () => props.modelValue,
  (val: Array<number | null>) => {
    console.log(val, 'bbq')

    val1.value = val[0]
    val2.value = val[1]
  }
)

// 监听
watch([val1, val2], ([value1, value2]) => {
  console.log(value1, value2, 'bbq')

  if (value1 && value2) {
    if (value1 >= value2) {
      ElMessage.info('第一个值不得大于第二个值')
      emit('update:modelValue', [null, null])
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
