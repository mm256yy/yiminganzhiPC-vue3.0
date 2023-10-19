<template>
  <Dialog
    :model-value="props.show"
    title="项目设置"
    :fullscreen="false"
    style="width: 800px"
    :max-height="270"
    @close="onClose"
  >
    <el-tabs v-model="activeName" type="card" class="mr-20px" @tab-click="handleTabClick">
      <el-tab-pane label="钉钉配置" name="first" />
      <!-- <el-tab-pane label="其它配置" name="second" /> -->
    </el-tabs>
    <Form :schema="schema" @register="register" :rules="rules" :is-col="false" />
    <template #footer>
      <ElButton type="primary" :loading="loading" @click="onSave">确认</ElButton>
      <ElButton @click="onClose">取消</ElButton>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { reactive, unref, ref, onMounted, computed } from 'vue'
import { ElButton, ElMessage, ElTabs, ElTabPane } from 'element-plus'
import { Dialog } from '@/components/Dialog'
import { Form } from '@/components/Form'
import { useValidator } from '@/hooks/web/useValidator'
import { ProjectConfigType } from '@/api/project/types'
import { saveProjectConfigApi } from '@/api/project'
import { useForm } from '@/hooks/web/useForm'
import { FormSchema } from '@/types/form'
// import { nextTick } from 'process'

interface Props {
  show: boolean
  projectId?: number
  row?: ProjectConfigType
}

const props = defineProps<Props>()
const emit = defineEmits(['close'])

const { required } = useValidator()
const loading = ref(false)
const currentRow = computed(() => props.row)

const rules = {
  dingCorpId: [required()],
  dingAgentId: [required()],
  dingAppKey: [required()],
  dingAppSecret: [required()]
}

const schema = reactive<FormSchema[]>([
  {
    field: 'dingCorpId',
    label: '企业ID',
    component: 'Input',
    componentProps: {
      style: {
        width: '100%'
      },
      placeholder: '请输入钉钉组织的企业ID'
    }
  },
  {
    field: 'dingAgentId',
    label: '应用AgentId',
    component: 'Input',
    componentProps: {
      style: {
        width: '100%'
      },
      placeholder: '请输入钉钉应用的AgentID'
    }
  },
  {
    field: 'dingAppKey',
    label: '应用AppKey',
    component: 'Input',
    componentProps: {
      style: {
        width: '100%'
      },
      placeholder: '请输入钉钉应用的AppKey'
    }
  },
  {
    field: 'dingAppSecret',
    label: '应用AppSecret',
    component: 'Input',
    componentProps: {
      style: {
        width: '100%'
      },
      placeholder: '请输入钉钉应用AppSecret'
    }
  }
])

const { register, elFormRef, methods } = useForm()

let activeName = ref<string>('first')

onMounted(async () => {
  methods.setValues(currentRow.value as ProjectConfigType)
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
  const projectConfig = (await methods.getFormData()) || {}
  projectConfig.projectId = props.projectId
  if (currentRow.value) {
    projectConfig.id = currentRow.value.id
  }
  saveProjectConfigApi(projectConfig as ProjectConfigType)
    .then(() => {
      ElMessage.success('项目设置成功')
      onClose()
    })
    .catch(() => {
      loading.value = false
    })
}

const onClose = () => {
  emit('close')
}

const handleTabClick = () => {
  //
}
</script>
