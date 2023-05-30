<template>
  <Dialog
    :model-value="props.show"
    title="查看详情"
    :fullscreen="false"
    style="width: 1100px"
    @close="onClose"
  >
    <ElForm label-position="right" :model="currentRow" label-width="120px">
      <ElRow>
        <ElCol :span="6">
          <ElFormItem label="用户名:" prop="userName">
            {{ currentRow?.userName }}
          </ElFormItem>
        </ElCol>
        <ElCol :span="9">
          <ElFormItem label="姓名:">
            <div>{{ currentRow?.nickName }}</div>
          </ElFormItem>
        </ElCol>
        <ElCol :span="9">
          <ElFormItem label="模块:">
            <div>{{ currentRow?.module }}</div>
          </ElFormItem>
        </ElCol>
      </ElRow>
      <ElRow>
        <ElCol :span="6">
          <ElFormItem label="日志名称:">
            {{ currentRow?.name }}
          </ElFormItem>
        </ElCol>
        <ElCol :span="9">
          <ElFormItem label="IP:">
            <div>{{ currentRow?.ip }}</div>
          </ElFormItem>
        </ElCol>
        <ElCol :span="9">
          <ElFormItem label="类名:">
            <div>{{ currentRow?.className }}</div>
          </ElFormItem>
        </ElCol>
      </ElRow>
      <ElRow>
        <ElCol :span="6">
          <ElFormItem label="请求方法:">
            {{ currentRow?.requestMethod }}
          </ElFormItem>
        </ElCol>
        <ElCol :span="9">
          <ElFormItem label="方法名称:">
            <div>{{ currentRow?.methodName }}</div>
          </ElFormItem>
        </ElCol>
      </ElRow>
      <ElRow>
        <ElCol :span="24">
          <ElFormItem label="异常信息:">
            {{ currentRow?.exceptionMessage }}
          </ElFormItem>
        </ElCol>
      </ElRow>
      <ElRow>
        <ElCol :span="24">
          <ElFormItem label="字段:">
            {{ currentRow?.param }}
          </ElFormItem>
        </ElCol>
      </ElRow>
    </ElForm>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElRow, ElCol, ElFormItem, ElForm } from 'element-plus'
import { Dialog } from '@/components/Dialog'

interface Props {
  show: boolean
  row?: any
}

const props = defineProps<Props>()
const emit = defineEmits(['close'])

const currentRow = ref(props.row)
console.log(currentRow, 'ssss')

onMounted(async () => {
  console.log(currentRow.value, 'dddd')
})

const onClose = () => {
  emit('close')
}
</script>
