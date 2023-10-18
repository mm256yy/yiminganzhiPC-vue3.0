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
import { DictDetailType } from '@/api/sys/types'
import { saveDictDetailApi } from '@/api/sys'
import { useForm } from '@/hooks/web/useForm'
import { FormSchema } from '@/types/form'

interface Props {
  show: boolean
  row?: DictDetailType
  projectId: number
  dictId: number
}

const props = defineProps<Props>()
const emit = defineEmits(['close'])

const { required } = useValidator()
const loading = ref(false)
const currentRow = computed(() => props.row)

const title = computed(() => {
  return props.row ? '编辑字典详情' : '新增字典详情'
})

const rules = {
  label: [required()],
  value: [required()],
  sort: [required()]
}

const schema = reactive<FormSchema[]>([
  { field: 'label', label: '字典标签', component: 'Input' },
  { field: 'value', label: '字典值', component: 'Input' },
  { field: 'sort', label: '排序', component: 'Input' }
])

const { register, elFormRef, methods } = useForm()

onMounted(async () => {
  methods.setValues(currentRow.value as DictDetailType)
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
  const dict = (await methods.getFormData()) || {}
  // 修改
  if (currentRow.value && currentRow.value.id) {
    dict.id = currentRow.value.id
  } else {
    // 新增时给项目id赋值
    dict.projectId = props.projectId
    dict.dictId = props.dictId
  }
  saveDictDetailApi(dict as DictDetailType, props.projectId)
    .then(() => {
      ElMessage.success('保存字典成功')
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
