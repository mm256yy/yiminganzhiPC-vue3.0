<template>
  <Dialog
    :model-value="props.show"
    :title="title"
    :fullscreen="false"
    style="width: 800px"
    :max-height="470"
    @close="onClose"
  >
    <Form :schema="schema" @register="register" :rules="rules" :is-col="true" />
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
import { getDistrictChildrenApi } from '@/api/district'

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
  return props.row ? '维护项目' : '新增项目'
})

const rules = {
  name: [required()],
  description: [required()],
  reservoirName: [required()],
  reservoirCode: [required()],
  projectType: [required()],
  townCode: [required()]
}

// const townCode = ref()
const districtTree = ref<string[] | null>()
const defaultProps = {
  value: 'code',
  label: 'name'
  // disabled: (node) => {
  //   return node && node.data && node.data.hasChild && node.level !== 3
  // },
  // isLeaf: (node) => {
  //   return node.level === 3
  // }
}

const loadDistrictNode = async (node: any, resolve: any) => {
  if (node.level === 3) {
    resolve([])
    return
  }
  let parentId
  if (node && node.level == 0) {
    parentId = 0
  } else {
    parentId = node.data.id
  }
  const childrenList = await getDistrictChildrenApi(parentId)
  resolve(childrenList)
}

const schema = reactive<FormSchema[]>([
  {
    field: 'name',
    label: '项目名称',
    component: 'Input'
  },
  {
    field: 'reservoirName',
    label: '水库名称',
    component: 'Input'
  },
  {
    field: 'showName',
    label: '项目简称',
    component: 'Input'
  },
  {
    field: 'reservoirCode',
    label: '水库编码',
    component: 'Input'
  },
  {
    field: 'projectType',
    label: '工程类型',
    component: 'Select',
    componentProps: {
      style: {
        width: '100%'
      },
      options: [
        { label: '水电工程', value: 'Hydropowerproject' },
        { label: '水利枢纽', value: 'HydroJunction' }
      ]
    }
  },
  {
    field: 'townCode',
    label: '所属区域',
    colProps: { span: 12 },
    component: 'TreeSelect',
    componentProps: {
      lazy: true,
      multiple: true,
      nodeKey: 'code',
      load: loadDistrictNode,
      props: defaultProps,
      defaultExpandedKeys: districtTree,
      style: { width: '100%', 'margin-right': '10px' }
    }
  },
  {
    field: 'description',
    label: '简介',
    component: 'Input',
    colProps: { span: 24 },
    componentProps: {
      style: {
        width: '100%'
      },
      type: 'textarea',
      rows: 10
    }
  }
])

const { register, elFormRef, methods } = useForm()

onMounted(async () => {
  const townCode = currentRow.value?.townCode ? currentRow.value.townCode.split(',') : []
  districtTree.value = currentRow.value?.districtTree?.join(',').split(',') || []
  methods.setValues({
    ...currentRow.value,
    townCode
  })
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
  project.townCode = project.townCode.join(',')
  if (currentRow.value && currentRow.value.id) {
    project.id = currentRow.value.id
  }
  saveProjectApi(project as ProjectDtoType)
    .then(() => {
      ElMessage.success('保存项目成功')
      onClose()
    })
    .finally(() => {
      loading.value = false
    })
}

const onClose = () => {
  emit('close')
}
</script>
