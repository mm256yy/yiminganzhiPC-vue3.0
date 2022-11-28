<template>
  <ContentWrap title="政策法规管理">
    <Search :schema="allSchemas.searchSchema" @search="setSearchParams" @reset="setSearchParams" />

    <div class="flex items-center justify-between pb-18px">
      <div class="text-size-14px"> 政策法规列表 </div>
      <ElButton :icon="addIcon" type="primary" @click="onAddMenu">新增</ElButton>
    </div>
    <Table
      border
      @register="register"
      :data="tableObject.tableList"
      :columns="allSchemas.tableColumns"
      :loading="tableObject.loading"
      :showOverflowTooltip="false"
      tableLayout="auto"
      row-key="id"
      headerAlign="center"
      align="center"
    >
      <template #title="{ row }">
        <ElPopper v-if="row.title && Array.isArray(row.title)" trigger="hover">
          <div v-for="item in row.title" :key="item.name">
            <div>{{ item.name }}</div>
          </div>
        </ElPopper>
        <div v-else>{{ row.title }}</div>
      </template>
      <template #time="{ row }">
        {{ formatDateTime(row.time) }}
      </template>
      <template #valid="{ row }">
        {{ row.valid ? '有效' : '无效' }}
      </template>
      <template #action="{ row }">
        <TableEditColumn :row="row" @edit="onEditMenu(row)" @delete="onDelMenu" />
      </template>
    </Table>

    <EditForm
      :show="menuPup"
      :row="tableObject.currentRow"
      :actionType="actionType"
      @close="onFormPupClose"
      @submit="onSubmit"
    />
  </ContentWrap>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { useAppStore } from '@/store/modules/app'
import { ElButton, ElMessageBox, ElMessage, ElPopper } from 'element-plus'
import { ContentWrap } from '@/components/ContentWrap'
import { Search } from '@/components/Search'
import { Table, TableEditColumn } from '@/components/Table'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { useTable } from '@/hooks/web/useTable'
import { useIcon } from '@/hooks/web/useIcon'
import { formatDateTime } from '@/utils'
// import { listProjectApi } from '@/api/project'
import {
  getPolicyListApi,
  addPolicyApi,
  updatePolicyApi,
  delPolicyByIdApi
} from '@/api/project/policy/service'
import EditForm from './components/EditForm.vue'

import type { PolicyDtoType } from '@/api/project/policy/types'

const appStore = useAppStore()
// const projects = ref<Array<{ label: string; value: number }>>([])
const menuPup = ref(false) // 弹窗标识
const actionType = ref<'add' | 'edit'>('add') // 操作类型
const addIcon = useIcon({ icon: 'ant-design:plus-outlined' })

const { register, tableObject, methods } = useTable({
  getListApi: getPolicyListApi,
  delListApi: delPolicyByIdApi
})
const { getList, setSearchParams } = methods
tableObject.params = {
  size: 100,
  projectId: appStore.getCurrentProjectId
}

getList()

// const loadProject = () => {
//   return listProjectApi({ page: 0, size: 100 }).then((res) => {
//     const pjs = res.content.map((p) => {
//       return {
//         value: p.id,
//         label: p.name
//       }
//     })
//     pjs.unshift({
//       label: '默认项目',
//       value: 0
//     })
//     projects.value = pjs
//     return pjs
//   })
// }

onMounted(() => {
  // 权限限制
  if (!appStore.getIsSysAdmin && !appStore.getIsProjectAdmin) {
    ElMessageBox.confirm('你在当前项目中无权限')
      .then(() => {
        window.location.href = '/#/dashboard/home'
      })
      .catch(() => {
        window.location.href = '/#/dashboard/home'
      })
  }
})

const schema = reactive<CrudSchema[]>([
  {
    field: 'id',
    label: '序号',
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
    field: 'title',
    label: '标题',
    search: {
      show: true,
      component: 'Input'
    },
    form: {
      show: false
    },
    detail: {
      show: false
    }
  },
  {
    field: 'docNo',
    label: '文号',
    search: {
      show: true,
      component: 'Input'
    },
    form: {
      show: false
    },
    detail: {
      show: false
    }
  },
  {
    field: 'type',
    label: '类型'
  },
  {
    field: 'projectId',
    label: '所属项目'
  },
  {
    field: 'issuingAgency',
    label: '发布机构',
    search: {
      show: true,
      component: 'Input'
    },
    form: {
      show: false
    },
    detail: {
      show: false
    }
  },
  {
    field: 'valid',
    label: '有效性',
    search: {
      show: true,
      component: 'Select',
      componentProps: {
        options: [
          {
            label: '有效',
            value: 1
          },
          {
            label: '无效',
            value: 0
          }
        ]
      }
    },
    form: {
      show: false
    },
    detail: {
      show: false
    }
  },
  {
    field: 'publicityTime',
    label: '公开时间',
    search: {
      show: true,
      component: 'DatePicker',
      componentProps: {
        type: 'daterange'
      }
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
    fixed: 'right',
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

const onDelMenu = async (row: PolicyDtoType | null, multiple: boolean) => {
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

const onEditMenu = (row: PolicyDtoType) => {
  actionType.value = 'edit'
  tableObject.currentRow = row
  menuPup.value = true
}

const onFormPupClose = () => {
  menuPup.value = false
}

const onSubmit = async (data: PolicyDtoType) => {
  if (actionType.value === 'add') {
    await addPolicyApi(data)
  } else {
    await updatePolicyApi({
      ...data,
      id: tableObject.currentRow?.id as number
    })
  }
  ElMessage.success('操作成功！')
  menuPup.value = false
  getList()
}
</script>
