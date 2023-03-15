<template>
  <ContentWrap>
    <div class="flex w-full justify-between">
      <ContentWrap title="角色管理" class="w-7/10 min-w-500px mr-20px">
        <Search
          :schema="allSchemas.searchSchema"
          @search="setSearchParams"
          @reset="setSearchParams"
        />

        <div class="flex items-center justify-between pb-18px">
          <div class="text-size-14px"> 角色列表 </div>
          <ElButton :icon="addIcon" type="primary" @click="onAddRole">新增角色</ElButton>
        </div>
        <Table
          border
          v-model:pageSize="tableObject.size"
          v-model:currentPage="tableObject.currentPage"
          :pagination="{
            total: tableObject.total
          }"
          :loading="tableObject.loading"
          :data="tableObject.tableList"
          :columns="allSchemas.tableColumns"
          :showOverflowTooltip="false"
          tableLayout="auto"
          row-key="id"
          headerAlign="center"
          align="center"
          highlightCurrentRow
          @register="register"
          @row-click="onRowClick"
        >
          <template #action="{ row }">
            <TableEditColumn :row="row" @edit="onEditRole(row)" @delete="onDelMenu" />
            <!-- <ElSpace>
              <ElTooltip content="关联菜单" placement="top">
                <ElButton size="small" circle :icon="relationIcon" @click="onRowClick(row)" />
              </ElTooltip>
            </ElSpace> -->
          </template>
        </Table>
      </ContentWrap>
      <ElCard class="content-wrap flex-1" shadow="never">
        <template #header>
          <div class="flex items-center justify-between">
            <span class="text-16px font-700">菜单分配</span>
            <div>
              <ElButton
                size="small"
                type="primary"
                :disabled="!tableObject.currentRow?.id"
                @click="onSaveMenu"
                >保存</ElButton
              >
              <ElButton size="small" type="default" @click="onResetChecked">重置</ElButton>
            </div>
          </div>
        </template>
        <div v-if="tableObject.currentRow" class="flex items-center pb-18px text-size-14px"
          >当前选中角色: {{ tableObject.currentRow.name }}</div
        >
        <!--    -->
        <ElTree
          v-loading="treeLoading"
          :check-strictly="isCheck"
          ref="menuTreeRef"
          :data="menuTree"
          show-checkbox
          default-expand-all
          node-key="id"
          highlight-current
        />
      </ElCard>
    </div>
    <RoleEditForm
      :show="dialog"
      :actionType="actionType"
      :row="tableObject.currentRow"
      @close="onFormPupClose"
      @submit="onSubmit"
    />
  </ContentWrap>
</template>

<script setup lang="ts">
import { watch, reactive, ref, onMounted } from 'vue'
import { useAppStore } from '@/store/modules/app'
import { ElButton, ElMessage, ElCard, ElTree, ElMessageBox } from 'element-plus'
import { ContentWrap } from '@/components/ContentWrap'
import { Search } from '@/components/Search'
import { Table, TableEditColumn } from '@/components/Table'
import RoleEditForm from './components/RoleEditForm.vue'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { useTable } from '@/hooks/web/useTable'
import { useIcon } from '@/hooks/web/useIcon'
import { getAllMenuApi } from '@/api/sys/index'
import {
  searchRoleListApi,
  deleteRoleApi,
  createRoleApi,
  updateRoleApi,
  getRoleRelationMenu,
  setRoleRelationMenu
} from '@/api/sys/role/service'
import type { RoleType, RoleMenuType } from '@/api/sys/role/types'

type LabelValueType = { label: string; id: number; children?: LabelValueType[] }
const isCheck = ref(false)
const appStore = useAppStore()
const dialog = ref(false) // 弹窗标识
const actionType = ref<'add' | 'edit'>('add') // 操作类型
const menuTree = ref<LabelValueType[]>([]) // 菜单树
const treeLoading = ref(false)
const menuTreeRef = ref()
const addIcon = useIcon({ icon: 'ant-design:plus-outlined' })
// const relationIcon = useIcon({ icon: 'tabler:circles-relation' })

const { register, tableObject, methods } = useTable({
  getListApi: searchRoleListApi,
  delListApi: deleteRoleApi
})
const { getList, setSearchParams } = methods

tableObject.params = {
  projectId: appStore.currentProjectId
}

getList()

const loadMenuTree = () => {
  treeLoading.value = true

  getAllMenuApi()
    .then((res: LabelValueType[]) => {
      menuTree.value = res
    })
    .finally(() => {
      treeLoading.value = false
    })
}

onMounted(() => {
  // 权限限制
  if (!appStore.getIsProjectAdmin) {
    ElMessageBox.confirm('你在当前项目中无权限')
      .then(() => {
        window.location.href = '/#/dashboard/home'
      })
      .catch(() => {
        window.location.href = '/#/dashboard/home'
      })
    return
  }

  loadMenuTree()
})

const schema = reactive<CrudSchema[]>([
  {
    field: 'blurry',
    label: '名称',
    search: {
      show: true,
      component: 'Input',
      componentProps: {
        placeholder: '输入角色名称或者描述搜索'
      }
    },
    form: {
      show: false
    },
    detail: {
      show: false
    },
    table: {
      show: false
    }
  },
  {
    field: 'name',
    label: '角色名称',
    search: {
      show: false
    },
    form: {
      show: false
    },
    detail: {
      show: false
    }
  },
  {
    field: 'code',
    label: '角色代码',
    search: {
      show: false
    },
    form: {
      show: false
    },
    detail: {
      show: false
    }
  },
  {
    field: 'remark',
    label: '描述',
    width: '300px',
    search: {
      show: false
    },
    form: {
      show: false
    },
    detail: {
      show: false
    }
  },
  {
    field: 'reserve',
    label: '是否保留角色',
    formatter: (_, __, cellValue: boolean) => {
      return cellValue ? '是' : '否'
    },
    labelMessage: '保留角色不可修改',
    table: {}
  },
  {
    field: 'action',
    label: '操作',
    fixed: 'right',
    width: '130px',
    search: {
      show: false
    },
    form: {
      show: false
    },
    detail: {
      show: false
    }
  }
])

const { allSchemas } = useCrudSchemas(schema)

const onDelMenu = async (row: RoleType | null, multiple: boolean) => {
  tableObject.currentRow = row
  const { delList, getSelections } = methods
  const selections = await getSelections()
  await delList(
    multiple ? selections.map((v) => v.id) : [tableObject.currentRow?.id as number],
    multiple
  )
  onResetChecked()
}

const onAddRole = () => {
  actionType.value = 'add'
  tableObject.currentRow = null
  dialog.value = true
}

const onEditRole = (row: RoleType) => {
  actionType.value = 'edit'
  tableObject.currentRow = row
  dialog.value = true
}

const onFormPupClose = () => {
  dialog.value = false
}

const onSubmit = async (data: RoleType) => {
  if (actionType.value === 'add') {
    await createRoleApi(data)
  } else {
    await updateRoleApi({
      ...data,
      id: tableObject.currentRow?.id as number
    })
  }
  ElMessage.success('操作成功！')
  dialog.value = false
  getList()
}

const onRowClick = (row: RoleType) => {
  tableObject.currentRow = row
  treeLoading.value = true
  isCheck.value = true

  getRoleRelationMenu(row.id)
    .then((res) => {
      if (res && res.length) {
        const menuIds = res.map((item) => item.menuId)
        setCheckedKeys(menuIds)

        isCheck.value = false
      } else {
        setCheckedKeys([])
      }
    })
    .finally(() => {
      treeLoading.value = false
    })
}

const getCheckedKeys = () => {
  console.log(menuTreeRef.value, 'menuTreeRef.value')

  return menuTreeRef.value?.getCheckedKeys()
}

const getCurrentNode = () => {
  return menuTreeRef.value?.getHalfCheckedKeys()
}
const setCheckedKeys = (keys) => {
  menuTreeRef.value?.setCheckedKeys(keys, false)
}

const onResetChecked = () => {
  menuTreeRef.value?.setCheckedKeys([], false)
}

const saveRoleMenuRelation = (data: RoleMenuType[]) => {
  setRoleRelationMenu(data).then(() => {
    ElMessage.success('菜单配置成功!')
  })
}

const onSaveMenu = () => {
  if (!tableObject.currentRow?.id) {
    return
  }
  console.log()
  const menuIds2 = getCurrentNode() //半选中的
  const menuIds = getCheckedKeys()
  menuIds.push(...menuIds2)
  let roleMenuArray: RoleMenuType[] = []
  if (menuIds && menuIds.length) {
    roleMenuArray = menuIds.map((id) => {
      return {
        roleId: tableObject.currentRow?.id,
        menuId: id
      }
    })
  }
  saveRoleMenuRelation(roleMenuArray)
}

watch(
  () => tableObject.currentRow,
  (row) => {
    if (!row) {
      onResetChecked()
    }
  },
  {
    immediate: true
  }
)
</script>
