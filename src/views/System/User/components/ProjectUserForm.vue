<template>
  <el-dialog v-model="show" title="用户项目" append-to-body @close="onClose" width="720px">
    <el-form ref="form" :model="row" :inline="true" label-width="100px" :rules="rules">
      <el-form-item prop="projectId" label="关联项目">
        <el-select v-model="row.projectId" @change="onProjectChange">
          <el-option v-for="p in projects" :label="p.name" :value="p.id" :key="p.id" />
        </el-select>
      </el-form-item>
      <!-- <el-form-item prop="projectRole" label="项目权限">
        <el-select v-model="row.projectRole">
          <el-option label="项目管理员" :value="ProjectRoleEnum.PROJECT_ADMIN" />
          <el-option label="普通用户" :value="ProjectRoleEnum.NORMAL_USER" />
        </el-select>
      </el-form-item> -->
      <el-form-item prop="orgId" label="所属组织">
        <el-tree-select
          v-model="row.orgId"
          :data="orgs"
          :props="defaultProps"
          default-expand-all
          @node-click="onNodeClick"
          :expand-on-click-node="false"
        />
      </el-form-item>
      <el-form-item prop="roleIds" label="所属角色">
        <el-select v-model="row.roleIds" multiple>
          <el-option v-for="r in roles" :label="r.name" :value="r.id" :key="r.id" />
        </el-select>
      </el-form-item>
      <el-form-item prop="position" label="岗位" style="width: 290px">
        <el-input v-model="row.position" placeholder="项目中的岗位名称" />
      </el-form-item>
      <el-form-item prop="dingId" label="钉钉号">
        <el-input v-model="row.dingId" placeholder="钉钉组织中的用户 ID" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" small @click="onSave">确认</el-button>
      <el-button small @click="onClose">取消</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ProjectUserType, RoleType } from '@/api/sys/types'
import {
  ElButton,
  ElDialog,
  ElForm,
  ElSelect,
  ElOption,
  ElInput,
  ElFormItem,
  ElTreeSelect
} from 'element-plus'
import { ref, onMounted, watch, unref } from 'vue'
import { listProjectApi } from '@/api/project'
import { ProjectDtoType } from '@/api/project/types'
import { ProjectRoleEnum } from '@/api/sys/types'
import { getOrgTreeApi, getAllRoleApi } from '@/api/sys'
import { TreeNodeType } from '@/api/common'
import { useValidator } from '@/hooks/web/useValidator'

interface Props {
  show: boolean
  projectUser?: ProjectUserType
}

interface ProjectUser extends ProjectUserType {
  roleIds?: number[]
}

const props = defineProps<Props>()
const emit = defineEmits(['close', 'save'])

const form = ref<ComponentRef<typeof ElForm>>()
const { required } = useValidator()
const rules = {
  projectId: [required()],
  projectRole: [required()],
  orgId: [required()],
  roleIds: [required()]
}
const show = ref(props.show)
const row = ref<ProjectUser>(
  props.projectUser || {
    projectId: undefined,
    projectRole: ProjectRoleEnum.NORMAL_USER,
    orgId: undefined,
    position: '',
    dingId: undefined,
    roleIds: [],
    mapJson: '',
    mapPic: ''
  }
)
const defaultProps = {
  children: 'children',
  label: 'label',
  value: 'id'
}
const projects = ref<ProjectDtoType[]>([])
const orgs = ref<TreeNodeType[]>([])
const roles = ref<RoleType[]>([])

watch(
  () => props.show,
  () => {
    show.value = props.show
  }
)

onMounted(async () => {
  projects.value = await (await listProjectApi({ page: 0, size: 100 })).content
  if (row.value.projectId) {
    const pId: any = row.value.projectId
    row.value.projectName = projects.value.find((x) => x.id === pId)?.name
    orgs.value = [await getOrgTreeApi(pId)]
    roles.value = await getAllRoleApi(pId)

    const arr: any = row.value.roles
    row.value.roles = []
    arr.forEach((item) => {
      row.value.roleIds?.push(item.id)
    })
  }
})

const onProjectChange = async (pId: number) => {
  row.value.orgId = undefined
  row.value.roles = []
  row.value.projectName = projects.value.find((x) => x.id === pId)?.name
  orgs.value = [await getOrgTreeApi(pId)]
  roles.value = await getAllRoleApi(pId)
  // row.value.roleIds = [roles.value[0].id]
}

const onNodeClick = (data: TreeNodeType) => {
  row.value.orgName = data.label
}

const onSave = () => {
  form.value?.validate((valid) => {
    if (valid) {
      if (row.value.roles) {
        row.value.roles = row.value.roleIds?.map((id: number) => ({
          id,
          name: roles.value.find((r) => r.id === id)?.name
        }))
      }
      emit('save', unref(row.value))
    } else {
      return
    }
  })
}

const onClose = () => {
  show.value = false
  emit('close')
}
</script>
