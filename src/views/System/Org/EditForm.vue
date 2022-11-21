<template>
  <Dialog
    :model-value="props.show"
    :title="title"
    :fullscreen="false"
    style="width: 500px"
    :max-height="240"
    @close="onClose"
  >
    <Form :schema="schema" @register="register" :rules="rules" :is-col="false">
      <template #parentId>
        <ElTreeSelect
          v-model="parentOrgId"
          :data="orgTree"
          :props="defaultProps"
          :render-after-expand="false"
          :expand-on-click-node="false"
          check-strictly
          @current-change="handleNodeChange"
        />
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
import { ElButton, ElMessage, ElTreeSelect } from 'element-plus'
import { Dialog } from '@/components/Dialog'
import { Form } from '@/components/Form'
import { useValidator } from '@/hooks/web/useValidator'
import { orgInfoType } from '@/api/sys/types'
import { saveOrgApi } from '@/api/sys'
import { useForm } from '@/hooks/web/useForm'
import { FormSchema } from '@/types/form'
import { useAppStore } from '@/store/modules/app'
import { TreeNodeType } from '@/api/common'
// import { useIcon } from '@/hooks/web/useIcon'

interface Props {
  show: boolean
  orgTree: TreeNodeType[]
  row?: orgInfoType
}

const props = defineProps<Props>()
const emit = defineEmits(['close'])

const { required } = useValidator()
const loading = ref(false)
const currentRow = ref(props.row)
const parentOrgId = ref<number | undefined>(undefined)
const defaultProps = reactive({
  children: 'children',
  value: 'id',
  label: 'label'
})

const title = computed(() => {
  return props.row ? '编辑部门' : '新增部门'
})

const rules = {
  name: [required()],
  parentId: [{ type: Number }, { required: true }],
  sortNum: [{ type: Number }, { required: true }],
  enabled: [{ type: Boolean }, { required: true }]
}

const schema = reactive<FormSchema[]>([
  { field: 'name', label: '部门名称', component: 'Input' },
  { field: 'parentId', label: '上级部门', colProps: { span: 24 } },
  { field: 'sortNum', label: '排序', component: 'Input', value: 0 },
  { field: 'enabled', label: '是否启用', component: 'Switch', value: true },
  { field: 'remark', label: '描述', component: 'Input' }
])

const { register, elFormRef, methods } = useForm()

onMounted(async () => {
  methods.setValues(currentRow.value as orgInfoType)
  if (props.row) {
    parentOrgId.value = props.row.parentId
  }
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
  const org = (await methods.getFormData()) || {}
  org.parentId = parentOrgId
  if (currentRow.value && currentRow.value.id) {
    org.id = currentRow.value.id
  } else {
    org.projectId = useAppStore().getCurrentProjectId
  }
  saveOrgApi(org as orgInfoType)
    .then(() => {
      ElMessage.success('保存部门成功')
      onClose()
    })
    .catch(() => {
      loading.value = false
    })
}

const onClose = () => {
  emit('close')
}

const handleNodeChange = (data) => {
  parentOrgId.value = data.data.id
}
</script>
