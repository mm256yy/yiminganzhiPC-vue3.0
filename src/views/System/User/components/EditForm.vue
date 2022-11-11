<template>
  <Dialog
    :model-value="props.show"
    :title="title"
    :max-height="300"
    style="width: 700px"
    @close="onClose"
  >
    <Form :schema="schema" @register="register" :rules="rules" :model="row">
      <template #project>
        <ContentWrap title="关联项目">
          <div class="flex relative w-600px">
            <div class="absolute right-0 top-[-65px]">
              <ElButton circle :icon="addIcon" small type="primary" />
            </div>
          </div>
        </ContentWrap>
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
import { ElButton } from 'element-plus'
import { Dialog } from '@/components/Dialog'
import { Form } from '@/components/Form'
import { ContentWrap } from '@/components/ContentWrap'
import { useValidator } from '@/hooks/web/useValidator'
import { SystemRoleEnum, UserInfoType } from '@/api/sys/types'
import { useForm } from '@/hooks/web/useForm'
import { FormSchema } from '@/types/form'
import { useAppStore } from '@/store/modules/app'
import { useIcon } from '@/hooks/web/useIcon'

interface Props {
  show: boolean
  row?: UserInfoType
}

const props = defineProps<Props>()
const emit = defineEmits(['close'])
const appStroe = useAppStore()

const { required } = useValidator()
const loading = ref(false)
const addIcon = useIcon({ icon: 'ant-design:plus-circle-outlined' })

const title = computed(() => {
  return props.row ? '编辑用户' : '新增用户'
})

const rules = {
  userName: [required()],
  nickName: [required()],
  sex: [required()],
  enabled: [required]
}

const schema = reactive<FormSchema[]>([
  { field: 'id', hidden: true },
  { field: 'userName', label: '用户名', component: 'Input' },
  { field: 'nickName', label: '姓名', component: 'Input' },
  {
    field: 'sex',
    label: '性别',
    value: '男',
    component: 'Radio',
    componentProps: {
      options: [
        { label: '男', value: '男' },
        { label: '女', value: '女' }
      ]
    }
  },
  {
    field: 'enabled',
    label: '是否启用',
    value: '1',
    component: 'Radio',
    componentProps: {
      options: [
        { label: '是', value: '1' },
        { label: '否', value: '0' }
      ]
    }
  },
  { field: 'phone', label: '电话', component: 'Input' }
])

const { register, elFormRef, methods } = useForm()

onMounted(() => {
  // 如果是系统管理员，则添加设置系统用户角色的选择, 并且如果是项目管理员，允许设置加入哪些项目，以及在这些项目中的信息
  // 如果是项目管理员，则只能修改用户在当前项目中的项目信息（项目中的角色，岗位，钉钉号等）
  if (appStroe.getIsSysAdmin) {
    methods.addSchema({
      field: 'systemRole',
      label: '系统角色',
      component: 'Select',
      componentProps: {
        options: [
          { label: '系统管理员', value: SystemRoleEnum.SYS_ADMIN },
          { label: '项目管理员', value: SystemRoleEnum.PROJECT_ADMIN },
          { label: '普通用户', value: SystemRoleEnum.NORMAL_USER }
        ]
      }
    })
    rules['systemRole'] = [required()]
    methods.addSchema({ field: 'project', colProps: { span: 24 } })
  } else if (appStroe.getIsProjectAdmin) {
    // methods.addSchema({ field: 'project', colProps: { span: 24 } })
  }
})

const onSave = async () => {
  const formRef = unref(elFormRef)
  await formRef?.validate(async (isValid) => {
    if (isValid) {
      loading.value = true
      const data = methods.getFormData()
      console.log(data)
    }
  })
}

const onClose = () => {
  emit('close')
}
</script>
