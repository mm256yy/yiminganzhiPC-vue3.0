<template>
  <Dialog
    :model-value="props.show"
    :title="title"
    :fullscreen="false"
    style="width: 500px"
    :max-height="145"
    @close="onClose"
  >
    <Form :schema="schema" @register="register" :rules="rules" :is-col="false" />
    <template #footer>
      <ElButton type="primary" :loading="loading" @click="onSave">确认</ElButton>
      <ElButton @click="onClose">取消</ElButton>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { computed, reactive, unref, ref, onMounted } from 'vue'
import { ElButton, ElMessage } from 'element-plus'
import { Dialog } from '@/components/Dialog'
import { Form } from '@/components/Form'
import { useValidator } from '@/hooks/web/useValidator'
import { AppendantInfoType } from '@/api/sys/appendant/types'
import { saveAppendantApi } from '@/api/sys/appendant/service'
import { useForm } from '@/hooks/web/useForm'
import { FormSchema } from '@/types/form'

interface Props {
  show: boolean
  row?: AppendantInfoType
}

const props = defineProps<Props>()
const emit = defineEmits(['close'])

const { required } = useValidator()
const loading = ref(false)
const currentRow = ref(props.row)

const title = computed(() => {
  return props.row ? '编辑附属物' : '新增附属物'
})

const rules = {
  name: [required()],
  size: [required()],
  unit: [required()]
}

const schema = reactive<FormSchema[]>([
  { field: 'name', label: '项目', component: 'Input' },
  { field: 'size', label: '规格', component: 'Input' },
  { field: 'unit', label: '单位', component: 'Input' },
  { field: 'sort', label: '排序', component: 'Input' }
])

const { register, elFormRef, methods } = useForm()

onMounted(async () => {
  methods.setValues(currentRow.value as AppendantInfoType)
})

const onSave = async () => {
  const formRef = unref(elFormRef)
  await formRef?.validate(async (isValid) => {
    if (isValid) {
      doSave()
    }
  })
}

const doSave = async () => {
  loading.value = true
  const appendant = (await methods.getFormData()) || {}
  // 修改
  if (currentRow.value && currentRow.value.id) {
    appendant.id = currentRow.value.id
  }
  saveAppendantApi(appendant as AppendantInfoType)
    .then(() => {
      ElMessage.success('保存附属物成功')
      onClose()
    })
    .catch(() => {
      loading.value = false
    })
}

const onClose = () => {
  emit('close')
}
</script>
