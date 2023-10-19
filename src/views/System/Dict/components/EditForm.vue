<template>
  <Dialog
    :model-value="props.show"
    :title="title"
    :fullscreen="false"
    style="width: 500px"
    :max-height="160"
    @close="onClose"
  >
    <Form :schema="schema" @register="register" :rules="rules" :is-col="false">
      <template #dictGroup>
        <ElSelect v-model="dictGroup" allow-create filterable>
          <ElOption v-for="item in props.groupList" :key="item" :label="item" :value="item" />
        </ElSelect>
      </template>
    </Form>
    <template #footer>
      <ElButton type="primary" :loading="loading" @click="onSave">确认</ElButton>
      <ElButton @click="onClose">取消</ElButton>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { computed, reactive, unref, ref, onMounted } from 'vue'
import { ElButton, ElMessage, ElSelect, ElOption } from 'element-plus'
import { Dialog } from '@/components/Dialog'
import { Form } from '@/components/Form'
import { useValidator } from '@/hooks/web/useValidator'
import { DictInfoType } from '@/api/sys/types'
import { saveDictApi } from '@/api/sys'
import { useForm } from '@/hooks/web/useForm'
import { FormSchema } from '@/types/form'
// import { useIcon } from '@/hooks/web/useIcon'

interface Props {
  show: boolean
  groupList: string[]
  row?: DictInfoType
}

const props = defineProps<Props>()
const emit = defineEmits(['close'])

const { required } = useValidator()
const loading = ref(false)
const currentRow = computed(() => props.row)
const dictGroup = ref<string>()

const title = computed(() => {
  return props.row ? '编辑字典' : '新增字典'
})

const rules = {
  name: [required()],
  dictGroup: [{ type: String }, { required: true }]
}

const schema = reactive<FormSchema[]>([
  { field: 'dictGroup', label: '分组', component: 'Select' },
  { field: 'name', label: '字典名称', component: 'Input' },
  { field: 'remark', label: '描述', component: 'Input' }
])

const { register, elFormRef, methods } = useForm()

onMounted(async () => {
  methods.setValues(currentRow.value as DictInfoType)
  dictGroup.value = currentRow.value?.dictGroup
  console.log(props.groupList)
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
  dict.dictGroup = dictGroup.value
  if (currentRow.value && currentRow.value.id) {
    dict.id = currentRow.value.id
  }
  saveDictApi(dict as DictInfoType)
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
