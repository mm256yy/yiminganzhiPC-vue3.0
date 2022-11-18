<template>
  <ContentWrap>
    <div class="flex">
      <Search
        :schema="allSchemas.searchSchema"
        @search="setSearchParams"
        @reset="setSearchParams"
      />
      <ElButton :icon="addIcon" type="primary" @click="onAddMenu">新增</ElButton>
    </div>

    <Table
      border
      @register="register"
      :data="tableObject.tableList"
      :columns="allSchemas.tableColumns"
      :loading="tableObject.loading"
      :showOverflowTooltip="false"
      row-key="id"
      headerAlign="center"
      align="center"
    >
      <template #action="{ row }">
        <TableEditColumn :row="row" @edit="onEditMenu(row)" @delete="onDelMenu" />
      </template>
    </Table>

    <MenuForm
      :show="menuPup"
      :row="tableObject.currentRow"
      :actionType="actionType"
      @close="onFormPupClose"
      @submit="onSubmit"
    />
  </ContentWrap>
</template>

<script setup lang="ts">
import { h, watch, reactive, ref, onMounted } from 'vue'
import { useAppStore } from '@/store/modules/app'
import { useProjectStoreWithOut } from '@/store/modules/project'
import { ElButton, ElMessageBox, ElMessage } from 'element-plus'
import { ContentWrap } from '@/components/ContentWrap'
import { Search } from '@/components/Search'
import { Table, TableEditColumn } from '@/components/Table'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { useTable } from '@/hooks/web/useTable'
import { useIcon } from '@/hooks/web/useIcon'
import { useMenuStoreWithOut } from '@/store/modules/menu'
import { listProjectApi } from '@/api/project'
import { getSearchMenuApi, deleteMenuApi, updateMenuApi, createMenuApi } from '@/api/sys/index'
import type { MenuDtoType } from '@/api/sys/types'

import { MenuForm } from './components'

const appStore = useAppStore()
const projectStore = useProjectStoreWithOut()
const menuStore = useMenuStoreWithOut()
const menuPup = ref(false) // 弹窗标识
const actionType = ref<'add' | 'edit'>('add') // 操作类型
const addIcon = useIcon({ icon: 'ant-design:plus-outlined' })

const { register, tableObject, methods } = useTable({
  getListApi: getSearchMenuApi,
  delListApi: deleteMenuApi
})
const { getList, setSearchParams } = methods
tableObject.params = {
  size: 100,
  projectId: appStore.getCurrentProjectId
}

getList()

watch(
  () => tableObject.tableList,
  (list) => {
    menuStore.setMenuTree(list)
  },
  {
    immediate: true
  }
)

const loadProject = async () => {
  return await listProjectApi({ page: 0, size: 100 }).then((res) => {
    const projects = res.content.map((p) => {
      return {
        value: p.id,
        label: p.name
      }
    })
    projects.unshift({
      label: '默认项目',
      value: 0
    })
    // 存入项目列表信息
    projectStore.setProjects(projects)
    return projects
  })
}

onMounted(() => {
  // 权限限制
  if (!appStore.getIsSysAdmin) {
    ElMessageBox.confirm('你在当前项目中无权限')
      .then(() => {
        window.location.href = '/#/dashboard/home'
      })
      .catch(() => {})
  }
})

const schema = reactive<CrudSchema[]>([
  {
    field: 'projectId',
    label: '项目',
    search: {
      show: true,
      component: 'Select',
      value: appStore.getCurrentProjectId,
      api: async (): Promise<any> => {
        return loadProject()
      }
    },
    table: {
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
    field: 'blurry',
    label: '菜单名称',
    search: {
      show: true,
      component: 'Input'
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
    label: '类目名称',
    search: {
      show: false
    },
    form: {
      show: false
    },
    detail: {
      show: false
    },
    align: 'left',
    width: '225px'
  },
  {
    field: 'icon',
    label: '图标',
    search: {
      show: false
    },
    form: {
      show: false
    },
    detail: {
      show: false
    },
    formatter: (_: Recordable, __: MenuDtoType, cellValue: number) => {
      return h('span', {
        'data-icon': cellValue,
        class: 'iconify',
        style: 'margin: 0 auto; font-size: 24px'
      })
    }
  },
  {
    field: 'sort',
    label: '排序',
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
    field: 'componentName',
    label: '组件名',
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
    field: 'permission',
    label: '权限标识',
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
    field: 'path',
    label: '路径',
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
    field: 'iframe',
    label: '外链',
    search: {
      show: false
    },
    form: {
      show: false
    },
    detail: {
      show: false
    },
    formatter: (_: Recordable, __: MenuDtoType, cellValue: number) => {
      return cellValue ? '是' : '否'
    }
  },
  {
    field: 'cache',
    label: '缓存',
    search: {
      show: false
    },
    form: {
      show: false
    },
    detail: {
      show: false
    },
    formatter: (_: Recordable, __: MenuDtoType, cellValue: number) => {
      return cellValue ? '是' : '否'
    }
  },
  {
    field: 'hidden',
    label: '可见',
    formatter: (_: Recordable, __: MenuDtoType, cellValue: number) => {
      return !cellValue ? '是' : '否'
    },
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
    field: 'action',
    label: '操作',
    search: {
      show: false
    },
    form: {
      show: false
    },
    detail: {
      show: false
    },
    width: '100px'
  }
])

const { allSchemas } = useCrudSchemas(schema)

const onDelMenu = async (row: MenuDtoType | null, multiple: boolean) => {
  tableObject.currentRow = row
  const { delList, getSelections } = methods
  const selections = await getSelections()
  await delList(
    multiple ? selections.map((v) => v.id) : [tableObject.currentRow?.id as number],
    multiple
  )
}

const onAddMenu = () => {
  actionType.value = 'add'
  menuPup.value = true
}

const onEditMenu = (row: MenuDtoType) => {
  actionType.value = 'edit'
  tableObject.currentRow = row
  menuPup.value = true
}

const onFormPupClose = () => {
  menuPup.value = false
}

const onSubmit = async (data: MenuDtoType) => {
  if (actionType.value === 'add') {
    await createMenuApi(data)
  } else {
    await updateMenuApi({
      ...data,
      id: tableObject.currentRow?.id as number
    })
  }
  ElMessage.success('操作成功！')
  menuPup.value = false
  getList()
}
</script>
