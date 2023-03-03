<template>
  <Dialog
    :model-value="props.show"
    :title="title"
    :fullscreen="false"
    style="width: 780px"
    :max-height="maxHeight"
    @close="onClose"
  >
    <Form :schema="schema" @register="register" :rules="rules">
      <template #systemRole>
        <el-select v-model="systemRole" @change="systemRoleChange">
          <el-option label="系统管理员" :value="SystemRoleEnum.SYS_ADMIN" />

          <el-option label="项目管理员" :value="SystemRoleEnum.PROJECT_ADMIN" />
          <el-option label="普通用户" :value="SystemRoleEnum.NORMAL_USER" />
        </el-select>
      </template>
      <template #project v-if="relationFlag">
        <ContentWrap title="关联项目">
          <div class="flex relative w-700px">
            <div class="absolute right-10px top-[-65px]">
              <el-button circle :icon="addIcon" small type="success" @click="onAddProjectUser" />
            </div>
          </div>
          <el-table :data="projectUsers" size="small">
            <el-table-column prop="projectName" label="项目名称" />
            <!-- <el-table-column prop="projectRole" label="项目权限">
              <template #default="scope">
                <el-tag
                  :type="
                    scope.row.projectRole === ProjectRoleEnum.PROJECT_ADMIN ? 'success' : 'info'
                  "
                >
                  {{ getProjectRoleName(scope.row.projectRole) }}
                </el-tag>
              </template>
            </el-table-column> -->
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
    <el-form
      v-if="appStore.getIsProjectAdmin"
      ref="projectForm"
      :model="projectUser"
      label-width="90px"
    >
      <!-- <el-form-item label="项目权限" required>
        <el-col :span="11">
          <el-form-item prop="projectRole">
            <el-select v-model="projectUser.projectRole">
              <el-option label="项目管理员" :value="ProjectRoleEnum.PROJECT_ADMIN" />
              <el-option label="普通用户" :value="ProjectRoleEnum.NORMAL_USER" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-form-item> -->
      <el-col :span="12">
        <el-form-item prop="orgId" label="所属组织">
          <el-tree-select
            v-model="projectUser.orgId"
            :data="orgs"
            :props="defaultProps"
            default-expand-all
            :expand-on-click-node="false"
          />
        </el-form-item>
      </el-col>
      <el-form-item label="用户角色" required>
        <el-col :span="11">
          <el-form-item prop="roleId">
            <el-select v-model="projectUser.roleIds" multiple class="w-260px">
              <el-option v-for="r in roles" :label="r.name" :value="r.id" :key="r.id" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="position" label="岗位">
            <el-input v-model="projectUser.position" />
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item prop="dingId" label="钉钉id" class="w-260px">
        <el-input v-model="projectUser.dingId" />
      </el-form-item>
    </el-form>
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
import { computed, reactive, unref, ref, onMounted, watch } from 'vue'
import {
  ElCol,
  ElForm,
  ElFormItem,
  ElTreeSelect,
  ElInput,
  ElSelect,
  ElOption,
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
import {
  SystemRoleEnum,
  UserInfoType,
  ProjectUserType,
  ProjectRoleEnum,
  RoleType
} from '@/api/sys/types'
// getProjectRoleName,
import { saveUserApi, getOrgTreeApi, getAllRoleApi } from '@/api/sys'
import { TreeNodeType } from '@/api/common'
import { useForm } from '@/hooks/web/useForm'
import { FormSchema } from '@/types/form'
import { useAppStore } from '@/store/modules/app'
import { useIcon } from '@/hooks/web/useIcon'
import ProjectUserForm from './ProjectUserForm.vue'

interface Props {
  show: boolean
  row?: UserInfoType
}

interface ProjectUser extends ProjectUserType {
  roleIds?: number[]
}

const props = defineProps<Props>()
const emit = defineEmits(['close'])
const appStore = useAppStore()

const defaultProps = {
  children: 'children',
  label: 'label',
  value: 'id'
}

const { required } = useValidator()
const systemRole = ref()
const relationFlag = ref()
const projectForm = ref<ComponentRef<typeof ElForm>>()
const maxHeight = ref(appStore.getIsSysAdmin ? 500 : 300)
const loading = ref(false)
const addIcon = useIcon({ icon: 'ant-design:plus-circle-outlined' })
const editIcon = useIcon({ icon: 'ant-design:edit-outlined' })
const deleteIcon = useIcon({ icon: 'ant-design:delete-outlined' })
const showProjectUserForm = ref(false)
const currentProjectUser = ref<ProjectUserType>()
const projectUsers = ref<ProjectUserType[]>(props.row?.projectUsers || [])
const currentRow = ref(props.row)
const projectUser = ref<ProjectUser>(
  props.row?.projectUsers[0] || {
    projectId: appStore.getCurrentProjectId,
    projectRole: ProjectRoleEnum.NORMAL_USER,
    position: '',
    defaultProject: false,
    roles: [],
    roleIds: []
  }
)
const orgs = ref<TreeNodeType[]>([])
const roles = ref<RoleType[]>([])
const systemRoleFlag = ref<any>('')
const title = computed(() => {
  return props.row ? '编辑用户' : '新增用户'
})

const rules = {
  userName: [required()],
  nickName: [required()],
  sex: [required()]
  // enabled: [{ type: 'boolean', required: true }]
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
    label: '是否允许登录',
    value: true,
    component: 'Switch'
  },
  { field: 'phone', label: '电话', component: 'Input' }
])

const { register, elFormRef, methods } = useForm()
const systemRoleChange = async (val) => {
  systemRole.value = val
  let user = (await methods.getFormData()) || {}
  user.systemRole = systemRole.value
  methods.setValues(user as UserInfoType)
  const formRef = unref(elFormRef)
  // await formRef?.validate()
  formRef?.clearValidate()
}
watch(
  () => systemRole.value,
  async (val) => {
    if (val == 'SYS_ADMIN') {
      relationFlag.value = false
    } else {
      relationFlag.value = true
    }
  }
)
onMounted(async () => {
  systemRoleFlag.value = appStore.getUserInfo?.systemRole

  // 如果是系统管理员，则添加设置系统用户角色的选择, 并且如果是项目管理员，允许设置加入哪些项目，以及在这些项目中的信息
  // 如果是项目管理员，则只能修改用户在当前项目中的项目信息（项目中的角色，岗位，钉钉号等）
  if (appStore.getIsSysAdmin) {
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
  } else if (appStore.getIsProjectAdmin) {
    // 加载单项目的角色，组织信息
    orgs.value = [await getOrgTreeApi(appStore.getCurrentProjectId)]
    roles.value = await getAllRoleApi(appStore.getCurrentProjectId)
  }
  systemRole.value = currentRow.value?.systemRole

  methods.setValues(currentRow.value as UserInfoType)
  // 初始化项目管理员的项目信息
  if (appStore.getIsProjectAdmin && currentRow.value && currentRow.value.projectUsers.length > 0) {
    const first = currentRow.value.projectUsers.find(
      (x) => x.projectId === appStore.getCurrentProjectId
    )
    if (first) {
      projectUser.value.roleIds = first.roles?.map((x) => x.id)
      projectUser.value.orgId = first.orgId
      projectUser.value.projectRole = first.projectRole
      projectUser.value.position = first.position
      projectUser.value.dingId = first.dingId
      projectUser.value.projectId = first.projectId
      // console.log(projectUser.value.projectRole, '项目权限')
    }
  }
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
      if (appStore.getIsProjectAdmin) {
        unref(projectForm.value)?.validate((valid) => {
          if (valid) {
            doSave()
          }
        })
      } else {
        doSave()
      }
    }
  })
}

const doSave = async () => {
  loading.value = true
  const user = (await methods.getFormData()) || {}
  if (appStore.getIsProjectAdmin) {
    const pu = unref(projectUser.value)

    pu.roles = pu.roleIds?.map((x) => ({ id: x }))
    // user.systemRole = ProjectRoleEnum.NORMAL_USER
    user.systemRole = pu.projectRole
    user.projectUsers = [unref(projectUser.value)]
  } else {
    user.projectUsers = unref(projectUsers.value)
  }
  if (currentRow.value && currentRow.value.id) {
    user.id = currentRow.value.id
  }
  // if (appStore.getUserInfo != 'PROJECT_ADMIN') {
  //   user.systemRole = systemRole.value
  // }

  saveUserApi(user as UserInfoType)
    .then(() => {
      ElMessage.success('保存用户成功')
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
