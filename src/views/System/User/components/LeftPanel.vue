<template>
  <div :class="prefixCls" class="h-full">
    <el-tabs v-model="activeTab">
      <el-tab-pane v-if="appStore.getIsProjectAdmin && orgData" label="组织" name="org">
        <el-tree
          :props="defaultProps"
          :data="orgData"
          default-expand-all
          :expand-on-click-node="false"
          :highlight-current="true"
          @node-click="orgNodeClick"
        />
      </el-tab-pane>
      <el-tab-pane v-if="appStore.getIsProjectAdmin && roleData" label="角色" name="role">
        <el-tree
          :props="defaultProps"
          :data="roleData"
          default-expand-all
          :highlight-current="true"
          :expand-on-click-node="false"
          @node-click="roleNodeClick"
        />
      </el-tab-pane>
      <el-tab-pane v-if="appStore.getIsSysAdmin && projectData" label="项目" name="project">
        <el-tree
          :props="defaultProps"
          :data="projectData"
          default-expand-all
          :highlight-current="true"
          :expand-on-click-node="false"
          @node-click="projectNodeClick"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useDesign } from '@/hooks/web/useDesign'
import { useAppStore } from '@/store/modules/app'
import { ElTabs, ElTabPane, ElTree } from 'element-plus'
import { listProjectApi } from '@/api/project'
import { TreeNodeType } from '@/api/common'
import { getOrgTreeApi, getAllRoleApi } from '@/api/sys'

const emit = defineEmits(['search'])

const { getPrefixCls } = useDesign()
const prefixCls = getPrefixCls('left-panel')
const appStore = useAppStore()

const activeTab = ref('')
const defaultProps = {
  children: 'children',
  label: 'label'
}
const orgData = ref<TreeNodeType[]>([])
const roleData = ref<TreeNodeType[]>([])
const projectData = ref<TreeNodeType[]>([])

onMounted(() => {
  if (appStore.getIsSysAdmin) {
    activeTab.value = 'project'
    loadProject()
  } else {
    activeTab.value = 'org'
    loadOrgs()
    loadRoles()
  }
})

const loadOrgs = async () => {
  orgData.value = [await getOrgTreeApi(appStore.getCurrentProjectId)]
}

const loadRoles = async () => {
  const root: TreeNodeType = { id: '-1', label: '项目角色', children: [] }
  const roles = await getAllRoleApi(appStore.getCurrentProjectId)
  roles.forEach((r) => {
    root.children?.push({
      id: r.id.toString(),
      label: r.name,
      children: []
    })
  })
  roleData.value = [root]
}

const loadProject = async () => {
  const root: TreeNodeType = { id: '-1', label: '项目列表', children: [] }
  const projects = await listProjectApi({ page: 0, size: 100 })
  projects.content.forEach((p) => {
    root.children?.push({
      id: p.id.toString(),
      label: p.name,
      children: []
    })
  })
  projectData.value = [root]
}

const orgNodeClick = (node: TreeNodeType) => {
  emit('search', { orgId: node.id === '-1' ? null : node.id })
}

const roleNodeClick = (node: TreeNodeType) => {
  emit('search', { roleId: node.id === '-1' ? null : node.id })
}

const projectNodeClick = (node: TreeNodeType) => {
  emit('search', { projectId: node.id === '-1' ? null : node.id })
}
</script>
