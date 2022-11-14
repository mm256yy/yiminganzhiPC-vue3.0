<template>
  <Dialog :model-value="props.show" :title="title" style="width: 780px" @close="onClose">
    <Form :schema="schema" @register="register" :rules="rules">
      <template #project>
        <ContentWrap title="关联项目">
          <div class="flex relative w-700px">
            <div class="absolute right-10px top-[-65px]">
              <el-button circle :icon="addIcon" small type="success" @click="onAddProjectUser" />
            </div>
          </div>
          <el-table :data="projectUsers" size="small">
            <el-table-column prop="projectName" label="项目名称" />
            <el-table-column prop="projectRole" label="项目权限">
              <template #default="scope">
                <el-tag
                  :type="
                    scope.row.projectRole === ProjectRoleEnum.PROJECT_ADMIN ? 'primary' : 'info'
                  "
                >
                  {{ getProjectRoleName(scope.row.projectRole) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="orgName" label="所属组织" />
            <el-table-column prop="roles" label="角色" header-align="center" align="center">
              <template #default="scope">
                <el-space :wrap="true">
                  <el-tag v-for="r in scope.row.roles" :key="r.id">{{ r.name }}</el-tag>
                </el-space>
              </template>
            </el-table-column>
            <el-table-column prop="position" label="岗位" />
            <el-table-column label="操作">
              <template #default="scope">
                <el-button
                  size="small"
                  circle
                  type="primary"
                  :icon="editIcon"
                  @click="onEditProjectUser(scope.row)"
                />
                <el-button
                  size="small"
                  type="danger"
                  circle
                  :icon="deleteIcon"
                  @click="onDeleteProjectUser(scope.row)"
                />
              </template>
            </el-table-column>
          </el-table>
        </ContentWrap>
      </template>
    </Form>
    <ProjectUserForm
      v-if="showProjectUserForm"
      :show="showProjectUserForm"
      :project-user="currentProjectUser"
      @close="onCloseProjectUser"
      @save="onSaveProjectUser"
    />
    <template #footer>
      <ElButton type="primary" :loading="loading" @click="onSave">确认</ElButton>
      <ElButton @click="onClose">取消</ElButton>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { computed, reactive, unref, ref, onMounted } from 'vue'
import {
  ElButton,
  ElTable,
  ElTableColumn,
  ElTag,
  ElSpace,
  ElMessageBox,
  ElMessage
} from 'element-plus'
import { Dialog } from '@/components/Dialog'
import { Form } from '@/components/Form'
import { ContentWrap } from '@/components/ContentWrap'
import { useValidator } from '@/hooks/web/useValidator'
import { SystemRoleEnum, UserInfoType, ProjectUserType, ProjectRoleEnum } from '@/api/sys/types'
import { getProjectRoleName, saveUserApi } from '@/api/sys'
import { useForm } from '@/hooks/web/useForm'
import { FormSchema } from '@/types/form'
import { useAppStore } from '@/store/modules/app'
import { useIcon } from '@/hooks/web/useIcon'
import ProjectUserForm from './ProjectUserForm.vue'

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
const editIcon = useIcon({ icon: 'ant-design:edit-outlined' })
const deleteIcon = useIcon({ icon: 'ant-design:delete-outlined' })
const showProjectUserForm = ref(false)
const currentProjectUser = ref<ProjectUserType>()
const projectUsers = ref<ProjectUserType[] | undefined>(props.row?.projectUsers)
const currentRow = ref(props.row)

const title = computed(() => {
  return props.row ? '编辑用户' : '新增用户'
})

const rules = {
  userName: [required()],
  nickName: [required()],
  sex: [required()],
  enabled: [{ type: 'boolean', required: true }]
}

const schema = reactive<FormSchema[]>([
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
    value: true,
    component: 'Switch'
    // componentProps: {
    //   options: [
    //     { label: '是', value: true },
    //     { label: '否', value: false }
    //   ]
    // }
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
  methods.setValues(currentRow.value as UserInfoType)
})

const onAddProjectUser = () => {
  currentProjectUser.value = undefined
  showProjectUserForm.value = true
}

const onEditProjectUser = (row: ProjectUserType) => {
  currentProjectUser.value = row
  showProjectUserForm.value = true
}

const onDeleteProjectUser = (row: ProjectUserType) => {
  ElMessageBox.confirm('确定要移除吗?')
    .then(() => {
      if (projectUsers.value) {
        const idx = projectUsers.value.findIndex((x) => x.projectId === row.projectId)
        projectUsers.value.splice(idx, 1)
      }
    })
    .catch(() => {})
}

const onCloseProjectUser = () => {
  showProjectUserForm.value = false
}

const onSaveProjectUser = (data: ProjectUserType) => {
  let item = projectUsers.value?.find((x) => x.projectId === data.projectId)
  if (item) {
    item = Object.assign(item, data)
  } else {
    projectUsers.value?.push(data)
  }
  showProjectUserForm.value = false
}

const onSave = async () => {
  const formRef = unref(elFormRef)
  await formRef?.validate(async (isValid) => {
    if (isValid) {
      loading.value = true
      const user = (await methods.getFormData()) || {}
      user.projectUsers = unref(projectUsers)
      if (currentRow.value && currentRow.value.id) {
        user.id = currentRow.value.id
      }
      saveUserApi(user as UserInfoType)
        .then(() => {
          ElMessage.success('保存用户成功')
          onClose()
        })
        .catch(() => {
          loading.value = false
        })
    }
  })
}

const onClose = () => {
  emit('close')
}
</script>
