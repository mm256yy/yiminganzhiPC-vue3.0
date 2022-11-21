<template>
  <ContentWrap title="组织管理">
    <div class="flex flex-wrap mb-5px">
      <ElButton type="primary" @click="onAddOrg">新增</ElButton>
    </div>
    <div>
      <ContentWrap>
        <el-table
          :data="tableData"
          :loading="loading"
          :tree-props="{ children: 'children' }"
          :header-cell-style="{ textAlign: 'left' }"
          header-align="center"
          style="width: 100%; margin-bottom: 20px"
          row-key="id"
          default-expand-all
        >
          <el-table-column prop="data.name" label="部门名称" width="" align="left" />
          <el-table-column prop="data.sortNum" label="排序" width="" align="left" />
          <el-table-column label="状态" width="" align="left">
            <template #default="scope">
              <el-tag v-if="scope.row.data.enabled" class="ml-2" type="success">启用</el-tag>
              <el-tag v-else class="ml-2" type="warn">停用</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="data.createdDate" label="创建时间" width="" align="left">
            <template #default="{ row }">
              {{ formatDate(row.data.createdDate) }}
            </template>
          </el-table-column>
          <el-table-column prop="data.remark" label="备注" width="300" align="left" />
          <el-table-column label="操作" align="left">
            <template #default="scope">
              <el-button
                size="small"
                circle
                type="primary"
                :icon="editIcon"
                @click="onEdit(scope.row.data)"
              />
              <el-button
                size="small"
                type="danger"
                circle
                :icon="deleteIcon"
                @click="onDelete(scope.row)"
              />
            </template>
          </el-table-column>
        </el-table>
      </ContentWrap>
    </div>
  </ContentWrap>
  <EditForm
    v-if="showEdit"
    :row="currentRow"
    :show="showEdit"
    :org-tree="treeData"
    @close="onClose"
  />
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useIcon } from '@/hooks/web/useIcon'
import { formatDate } from '@/utils'
// 公共组件
import { ElButton, ElMessageBox, ElMessage, ElTable, ElTag, ElTableColumn } from 'element-plus'
import { ContentWrap } from '@/components/ContentWrap'
// 接口及自定义数据类型
import { orgInfoType } from '@/api/sys/types'
import { TreeNodeType } from '@/api/common'
import { orgTreeApi, deleteOrgApi } from '@/api/sys'
import { useAppStore } from '@/store/modules/app'
import EditForm from './EditForm.vue'

const showEdit = ref(false)
let treeData = ref<TreeNodeType[]>([])
let tableData = ref<TreeNodeType[]>([])
let loading = ref<boolean>(false)
const currentRow = ref<orgInfoType>()
const editIcon = useIcon({ icon: 'ant-design:edit-outlined' })
const deleteIcon = useIcon({ icon: 'ant-design:delete-outlined' })

onMounted(() => {
  getList()
})

const getList = async () => {
  tableData.value = []
  loading.value = true
  const data = await orgTreeApi(useAppStore().getCurrentProjectId).finally(() => {
    loading.value = false
  })
  if (data) {
    treeData.value = [data]
    tableData.value = data.children ? data.children : []
  }
}

const onEdit = (row: orgInfoType) => {
  currentRow.value = row
  showEdit.value = true
}

const onDelete = (row: TreeNodeType) => {
  console.log(row)
  if (row.children && row.children.length > 0) {
    ElMessageBox.alert(`该部门下有子部门，不可以删除`)
  } else {
    ElMessageBox.confirm(`确定要删除组织 ${row.data.name} 吗？`)
      .then(async () => {
        await deleteOrgApi(row.data.id ?? 0)
        ElMessage.success('删除组织成功')
        getList()
      })
      .catch(() => {})
  }
}

const onAddOrg = () => {
  currentRow.value = undefined
  showEdit.value = true
}

const onClose = () => {
  showEdit.value = false
  getList()
}
</script>
