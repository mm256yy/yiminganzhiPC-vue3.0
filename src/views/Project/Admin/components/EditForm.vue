<template>
  <Dialog
    :model-value="props.show"
    :title="title"
    :fullscreen="false"
    style="width: 800px"
    :max-height="270"
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
import { ProjectDtoType } from '@/api/project/types'
import { saveProjectApi } from '@/api/project'
import { useForm } from '@/hooks/web/useForm'
import { FormSchema } from '@/types/form'

interface Props {
  show: boolean
  row?: ProjectDtoType
}

const props = defineProps<Props>()
const emit = defineEmits(['close'])

const { required } = useValidator()
const loading = ref(false)
const currentRow = ref(props.row)

const title = computed(() => {
  return props.row ? '新增项目' : '维护项目'
})

const rules = {
  name: [required()],
  description: [required()]
}

const schema = reactive<FormSchema[]>([
  {
    field: 'name',
    label: '项目名称',
    component: 'Input',
    componentProps: {
      style: {
        width: '60%'
      },
      placeholder: '请输入项目名称'
    }
  },
  {
    field: 'description',
    label: '简介',
    component: 'Input',
    componentProps: {
      style: {
        width: '100%'
      },
      type: 'textarea',
      rows: 10,
      placeholder: '请输入项目简介'
    }
  }
])

const { register, elFormRef, methods } = useForm()

onMounted(async () => {
  methods.setValues(currentRow.value as ProjectDtoType)
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
  const project = (await methods.getFormData()) || {}
  if (currentRow.value && currentRow.value.id) {
    project.id = currentRow.value.id
  }
  saveProjectApi(project as ProjectDtoType)
    .then(() => {
      ElMessage.success('保存项目成功')
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
