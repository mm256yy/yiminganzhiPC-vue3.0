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
      <!-- <template #projectId>
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
      </template> -->
    </Form>
    <template #footer>
      <ElButton type="primary" :loading="loading" @click="onSave">确认</ElButton>
      <ElButton @click="onClose">取消</ElButton>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
// import { useAppStore } from '@/store/modules/app'
import { computed, reactive, unref, ref, onMounted } from 'vue'
import { ElButton, ElMessage } from 'element-plus'
import { Dialog } from '@/components/Dialog'
import { Form } from '@/components/Form'
import { useValidator } from '@/hooks/web/useValidator'
import { FamilyIncomeInfoType } from '@/api/sys/familyIncome/types'
import { saveFamilyIncomeApi } from '@/api/sys/familyIncome/service'
import { useForm } from '@/hooks/web/useForm'
import { FormSchema } from '@/types/form'
// const appStore = useAppStore()

interface Props {
  typeList2: any
  tabType: string
  show: boolean
  // projectId: number
  // projectList: Array<{ label: string; value: number }>
  row?: FamilyIncomeInfoType
}

const props = defineProps<Props>()
const emit = defineEmits(['close'])

const { required } = useValidator()
const loading = ref(false)
const currentRow = ref(props.row)
// const projectId = ref(props.projectId)

const title = computed(() => {
  return props.row ? '编辑家庭收入项' : '新增家庭收入项'
})

const rules = {
  name: [required()],
  type: [required()],
  sort: [required()]
  // projectId: [{ type: Number }, { required: appStore.getIsSysAdmin }]
}
const typeList = ref<any>([
  { label: '第一产业收入', value: 1 },
  { label: '第二、三产业收入', value: 2 },
  { label: '其它', value: 3 }
])

const schema = reactive<FormSchema[]>([
  // {
  //   field: 'projectId',
  //   label: '所属项目',
  //   component: 'Select',
  //   formItemProps: {
  //     style: { width: '450px' }
  //   },
  //   componentProps: {
  //     placeholder: '选择收入项大类',
  //     options: props.projectList
  //   }
  // },
  {
    field: 'type',
    label: '类别',
    component: 'Select',
    formItemProps: {
      style: { width: '450px' }
    },
    componentProps: {
      placeholder: '选择收入项大类',
      options: props.tabType == 'PeasantHousehold' ? typeList : props.typeList2
    }
  },
  {
    field: 'name',
    label: '收入项名称',
    component: 'Input',
    formItemProps: {
      style: { width: '450px' }
    }
  },
  {
    field: 'sort',
    label: '排序',
    component: 'Input',
    formItemProps: {
      style: { width: '450px' }
    }
  }
])

const { register, elFormRef, methods } = useForm()

onMounted(async () => {
  methods.setValues(currentRow.value as FamilyIncomeInfoType)
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
  const familyIncome = (await methods.getFormData()) || {}
  // familyIncome.projectId = projectId.value
  // 修改
  if (currentRow.value && currentRow.value.id) {
    familyIncome.id = currentRow.value.id
  }
  saveFamilyIncomeApi(familyIncome as FamilyIncomeInfoType, props.tabType)
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
</script>
