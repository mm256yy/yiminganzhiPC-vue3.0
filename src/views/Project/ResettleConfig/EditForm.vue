<template>
  <Dialog
    :model-value="props.show"
    :title="title"
    :fullscreen="false"
    style="width: 500px"
    :max-height="200"
    @close="onClose"
  >
    <Form :schema="schema" @register="register" :rules="rules" :is-col="false">
      <template #projectId>
        <ElSelect
          style="width: 490px"
          v-if="appStore.getIsSysAdmin"
          placeholder="选择项目"
          v-model="projectId"
        >
          <ElOption
            v-for="item in projectList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </ElSelect>
      </template>
      <template #type>
        <ElSelect
          style="width: 490px"
          placeholder="请填写或选择安置类型"
          allow-create
          filterable
          v-model="type"
          @change="getChildList"
        >
          <ElOption label="搬迁安置" value="搬迁安置" />
          <ElOption label="生产安置" value="生产安置" />
        </ElSelect>
      </template>
      <template #way>
        <ElSelect
          style="width: 490px"
          placeholder="请填写或选择安置方式"
          allow-create
          filterable
          v-model="way"
        >
          <ElOption v-for="item in currWayList" :key="item" :label="item" :value="item" />
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
import { useAppStore } from '@/store/modules/app'
import { computed, reactive, unref, ref, onMounted } from 'vue'
import { ElButton, ElMessage, ElSelect, ElOption } from 'element-plus'
import { Dialog } from '@/components/Dialog'
import { Form } from '@/components/Form'
import { useValidator } from '@/hooks/web/useValidator'
import { ResettleConfigInfoType } from '@/api/project/resettleConfig/types'
import { saveResettleConfigApi } from '@/api/project/resettleConfig/service'
import { useForm } from '@/hooks/web/useForm'
import { FormSchema } from '@/types/form'
const appStore = useAppStore()

interface Props {
  show: boolean
  projectId: number
  projectList: Array<{ label: string; value: number }>
  row?: ResettleConfigInfoType
}

const props = defineProps<Props>()
const emit = defineEmits(['close'])

const { required } = useValidator()
const loading = ref(false)
const currentRow = ref(props.row)
const projectId = ref(props.projectId)
const type = ref('')
const way = ref('')

const wayObj = reactive({
  搬迁安置: ['宅基地安置', '公寓安置'],
  生产安置: ['市内县外', '县内安置（有土）', '县内安置（无土）', '自谋出路']
})
const currWayList = ref<Array<string>>([])

const title = computed(() => {
  return props.row ? '编辑安置意愿配置' : '新增安置意愿配置'
})

const rules = {
  way: [{ type: String }, { required: true }],
  type: [{ type: String }, { required: true }],
  area: [required()],
  projectId: [{ type: Number }, { required: appStore.getIsSysAdmin }]
}

const schema = reactive<FormSchema[]>([
  {
    field: 'projectId',
    label: '所属项目',
    component: 'Select',
    formItemProps: {
      style: { width: '450px' }
    },
    componentProps: {
      placeholder: '选择项目',
      options: props.projectList
    }
  },
  {
    field: 'type',
    label: '安置类型',
    component: 'Select',
    formItemProps: {
      style: { width: '450px' }
    }
  },
  {
    field: 'way',
    label: '安置方式',
    component: 'Select',
    formItemProps: {
      style: { width: '450px' }
    }
  },
  {
    field: 'area',
    label: '安置区域',
    component: 'Input',
    formItemProps: {
      style: { width: '450px' }
    }
  }
])

const { register, elFormRef, methods } = useForm()

onMounted(async () => {
  methods.setValues(currentRow.value as ResettleConfigInfoType)
  type.value = props.row ? props.row.type : ''
  way.value = props.row ? props.row.way : ''
  getChildList(type.value)
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
  const resettleConfig = (await methods.getFormData()) || {}
  resettleConfig.projectId = projectId.value
  resettleConfig.type = type.value
  resettleConfig.way = way.value
  // 修改
  if (currentRow.value && currentRow.value.id) {
    resettleConfig.id = currentRow.value.id
  }
  saveResettleConfigApi(resettleConfig as ResettleConfigInfoType)
    .then(() => {
      ElMessage.success('保存成功')
      onClose()
    })
    .catch(() => {
      loading.value = false
    })
}

const onClose = () => {
  emit('close')
}

const getChildList = (val: string) => {
  way.value = ''
  currWayList.value = wayObj[val]
}
</script>
