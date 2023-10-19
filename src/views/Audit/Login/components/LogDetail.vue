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
          <ElFormItem label="城市:">
            <div>{{ currentRow?.city }}</div>
          </ElFormItem>
        </ElCol>
        <ElCol :span="9">
          <ElFormItem label="类型:">
            <div>{{ currentRow?.type === 1 ? '登录' : '退出' }}</div>
          </ElFormItem>
        </ElCol>
      </ElRow>
      <ElRow>
        <ElCol :span="6">
          <ElFormItem label="是否成功:">
            {{ currentRow?.success ? '是' : '否' }}
          </ElFormItem>
        </ElCol>
        <ElCol :span="9">
          <ElFormItem label="平台名称:">
            <div>{{ currentRow?.platformName }}</div>
          </ElFormItem>
        </ElCol>
        <ElCol :span="9">
          <ElFormItem label="系统名称:">
            <div>{{ currentRow?.osName }}</div>
          </ElFormItem>
        </ElCol>
      </ElRow>
      <ElRow>
        <ElCol :span="6">
          <ElFormItem label="IP:">
            {{ currentRow?.ip }}
          </ElFormItem>
        </ElCol>
        <ElCol :span="9">
          <ElFormItem label="请求ID:">
            <div>{{ currentRow?.requestId }}</div>
          </ElFormItem>
        </ElCol>
        <ElCol :span="9">
          <ElFormItem label="响应码:">
            <div>{{ currentRow?.code }}</div>
          </ElFormItem>
        </ElCol>
      </ElRow>
      <ElRow>
        <ElCol :span="24">
          <ElFormItem label="token:">
            {{ currentRow?.token }}
          </ElFormItem>
        </ElCol>
      </ElRow>
      <ElRow>
        <ElCol :span="24">
          <ElFormItem label="调用的方法名:">
            {{ currentRow?.methodName }}
          </ElFormItem>
        </ElCol>
      </ElRow>
      <ElRow>
        <ElCol :span="24">
          <ElFormItem label="请求路径:">
            {{ currentRow?.path }}
          </ElFormItem>
        </ElCol>
      </ElRow>
      <ElRow>
        <ElCol :span="24">
          <ElFormItem label="用户请求头:">
            {{ currentRow?.userAgent }}
          </ElFormItem>
        </ElCol>
      </ElRow>
      <ElRow>
        <ElCol :span="24">
          <ElFormItem label="登录请求的内容:">
            {{ currentRow?.body }}
          </ElFormItem>
        </ElCol>
      </ElRow>
      <ElRow>
        <ElCol :span="8">
          <ElFormItem label="浏览器名称:">
            {{ currentRow?.browserName }}
          </ElFormItem>
        </ElCol>
        <ElCol :span="8">
          <ElFormItem label="浏览器版本:">
            <div>{{ currentRow?.browserVersion }}</div>
          </ElFormItem>
        </ElCol>
        <ElCol :span="8">
          <ElFormItem label="浏览器引擎名称:">
            <div>{{ currentRow?.engineName }}</div>
          </ElFormItem>
        </ElCol>
      </ElRow>
      <ElRow>
        <ElCol :span="8">
          <ElFormItem label="浏览器引擎版本:">
            {{ currentRow?.engineVersion }}
          </ElFormItem>
        </ElCol>
        <ElCol :span="8">
          <ElFormItem label="创建时间:">
            <div>{{ formatDate(currentRow?.createTime || '') }}</div>
          </ElFormItem>
        </ElCol>
      </ElRow>
    </ElForm>
  </Dialog>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { ElRow, ElCol, ElFormItem, ElForm } from 'element-plus'
import { Dialog } from '@/components/Dialog'
import { LoginLogInfoType } from '@/api/audit/login/types'
import { formatDate } from '@/utils'

interface Props {
  show: boolean
  row?: LoginLogInfoType
}

const props = defineProps<Props>()
const emit = defineEmits(['close'])

const currentRow = computed(() => props.row)

onMounted(async () => {
  console.log(currentRow.value)
})

const onClose = () => {
  emit('close')
}
</script>
