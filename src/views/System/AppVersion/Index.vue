<template>
  <ContentWrap title="APP版本管理">
    <div class="flex justify-between">
      <Search
        :schema="allSchemas.searchSchema"
        @search="setSearchParams"
        @reset="setSearchParams"
      />
      <ElButton :icon="addIcon" type="primary" @click="onAddItem">发布新版</ElButton>
    </div>

    <Table
      border
      v-model:pageSize="tableObject.size"
      v-model:currentPage="tableObject.currentPage"
      :pagination="{
        total: tableObject.total
      }"
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
      <template #publish="{ row }">
        <el-tag effect="dark" :type="row.publish ? 'success' : 'info'">
          {{ row.publish ? '已发布' : '未发布' }}
        </el-tag>
      </template>
      <template #action="{ row }">
        <TableEditColumn :row="row" @edit="onEditItem(row)" @delete="onDelItem" />
      </template>
    </Table>

    <EditForm
      v-if="editFormPup"
      :show="editFormPup"
      :row="tableObject.currentRow"
      :actionType="actionType"
      @close="onFormPupClose"
      @submit="onSubmit"
    />
  </ContentWrap>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import dayjs from 'dayjs'
import { ElButton, ElMessage, ElTag } from 'element-plus'
import { ContentWrap } from '@/components/ContentWrap'
import { Search } from '@/components/Search'
import { Table, TableEditColumn } from '@/components/Table'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { useTable } from '@/hooks/web/useTable'
import { useIcon } from '@/hooks/web/useIcon'
import {
  listAppVersionApi,
  deleteAppVersionApi,
  addAppVersionApi,
  updateAppVersionApi
} from '@/api/appVersion/index'
import type { AppVersionDtoType } from '@/api/appVersion/types'
import EditForm from './EditForm.vue'

const editFormPup = ref(false) // 弹窗标识
const actionType = ref<'add' | 'edit'>('add') // 操作类型
const addIcon = useIcon({ icon: 'ant-design:plus-outlined' })

const { register, tableObject, methods } = useTable({
  getListApi: listAppVersionApi,
  delListApi: deleteAppVersionApi
})
const { getList, setSearchParams } = methods
tableObject.params = {
  size: 100
}

getList()

const schema = reactive<CrudSchema[]>([
  {
    field: 'version',
    label: '版本',
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
  // 表格字段
  {
    type: 'index',
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
    field: 'appId',
    label: '应用ID',
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
    label: '更新标题',
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
    field: 'version',
    label: '应用版本',
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
    field: 'platform',
    label: '应用平台',
    labelMessage: 'fdsa',
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
    field: 'publish',
    label: '发布状态',
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
    field: 'createTime',
    label: '上传时间',
    search: {
      show: false
    },
    form: {
      show: false
    },
    detail: {
      show: false
    },
    formatter: (_: Recordable, __: AppVersionDtoType, cellValue: string) => {
      return cellValue ? dayjs(cellValue).format('YYYY-MM-DD HH:mm:ss') : ''
    }
  },
  {
    field: 'remark',
    label: '备注',
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

const onDelItem = async (row: AppVersionDtoType, multiple: boolean) => {
  tableObject.currentRow = row
  const { delList, getSelections } = methods
  const selections = await getSelections()
  await delList(multiple ? selections.map((v) => v.id) : [tableObject.currentRow.id], multiple)
}

const onAddItem = () => {
  actionType.value = 'add'
  tableObject.currentRow = null
  editFormPup.value = true
}

const onEditItem = (row: AppVersionDtoType) => {
  actionType.value = 'edit'
  tableObject.currentRow = row
  editFormPup.value = true
}

const onFormPupClose = () => {
  editFormPup.value = false
}

const onSubmit = async (data: AppVersionDtoType) => {
  console.log(data, '参数')
  if (actionType.value === 'add') {
    data.createTime = dayjs()
    await addAppVersionApi(data)
  } else {
    await updateAppVersionApi({
      ...data,
      id: tableObject.currentRow?.id as number
    })
  }
  ElMessage.success('操作成功！')
  editFormPup.value = false
  getList()
}
</script>
