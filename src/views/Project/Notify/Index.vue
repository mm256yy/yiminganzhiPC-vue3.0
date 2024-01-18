<template>
  <ContentWrap title="消息通知">
    <Search :schema="allSchemas.searchSchema" @search="setSearchParams" @reset="setSearchParams" />

    <div class="flex items-center justify-between pb-18px">
      <div class="text-size-14px"> 消息列表 </div>
      <ElSpace>
        <!-- v-hasPermi="['news:add']" -->
        <ElButton :icon="addIcon" type="primary" @click="onAddRow">新增</ElButton>
      </ElSpace>
    </div>
    <Table
      border
      v-model:pageSize="tableObject.size"
      v-model:currentPage="tableObject.currentPage"
      :pagination="{
        total: tableObject.total
      }"
      :loading="tableObject.loading"
      :data="changTableList(tableObject.tableList)"
      :columns="allSchemas.tableColumns"
      tableLayout="auto"
      row-key="id"
      headerAlign="center"
      align="center"
      highlightCurrentRow
      @register="register"
    >
      <template #coverPic="{ row }">
        <img :src="row.coverPic" alt="封面" style="height: 80px" />
      </template>
      <template #type="{ row }">
        <div> {{ getTypeText(row.type) }} </div>
      </template>
      <template #hasTop="{ row }">
        <div> {{ row.hasTop ? '是' : '否' }} </div>
      </template>
      <template #status="{ row }">
        <div> {{ row.status == 0 ? '草稿' : '正文' }} </div>
      </template>
      <template #content="{ row }">
        <div class="cursor-pointer text-[#409eff]" @click="viewNews(row)"> 查看 </div>
      </template>
      <template #createdDate="{ row }">
        <div>
          {{ row.createdDate ? dayjs(row.createdDate).format('YYYY-MM-DD HH:mm:ss') : '-' }}</div
        >
      </template>
      <template #sendDate="{ row }">
        <div> {{ row.sendDate ? dayjs(row.sendDate).format('YYYY-MM-DD HH:mm:ss') : '-' }}</div>
      </template>
      <!-- v-hasPermi="['news:delete']" -->
      <template #action="{ row }">
        <TableEditColumn :row="row" @edit="onEditRow(row)" @delete="onDelRow" />
      </template>
    </Table>

    <ElDialog
      title="文章内容查看"
      :model-value="dialog"
      :width="800"
      @close="dialog = false"
      alignCenter
      appendToBody
    >
      <div v-html="content"></div>
    </ElDialog>
  </ContentWrap>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useAppStore } from '@/store/modules/app'
import { ElButton, ElDialog, ElSpace } from 'element-plus'
import { ContentWrap } from '@/components/ContentWrap'
import { Search } from '@/components/Search'
import { Table, TableEditColumn } from '@/components/Table'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { useTable } from '@/hooks/web/useTable'
import { useIcon } from '@/hooks/web/useIcon'
import { getNotifyApi, delNotifyByIdApi } from '@/api/project/Notify/service'
import type { PolicyDtoType } from '@/api/project/Notify/types'
import { useRouter } from 'vue-router'
import { listDictDetailApi } from '@/api/sys/index'
import dayjs from 'dayjs'
// import { useAppStoreWithOut } from '@/store/modules/app'

// const appStore2 = useAppStoreWithOut()
// const permissions = appStore2.getPermissions
const appStore = useAppStore()
const { push } = useRouter()
const addIcon = useIcon({ icon: 'ant-design:plus-outlined' })
const content = ref('')
const dialog = ref(false)
const newsTypes = ref<any[]>([])

const dictName = 'news' // 字典名称

const { register, tableObject, methods } = useTable({
  getListApi: getNotifyApi,
  delListApi: delNotifyByIdApi
})
const { getList, setSearchParams } = methods

tableObject.params = {
  sort: ['releaseTime', 'desc']
}

getList()

const changTableList = (list) => {
  return list.map((item) => {
    try {
      item.coverPic = item.coverPic ? JSON.parse(item.coverPic)[0].url : ''
      return item
    } catch (err) {
      return item
    }
  })
}

const getNewsDict = async () => {
  const res = await listDictDetailApi({
    name: dictName,
    projectId: appStore.getCurrentProjectId
  })
  if (res && res.dictValList) {
    newsTypes.value = res.dictValList
    console.log(newsTypes.value, '下拉数据')
  }
}

getNewsDict()

const schema = reactive<CrudSchema[]>([
  {
    field: 'index',
    type: 'index',
    label: '序号'
  },
  {
    field: 'sendDate',
    label: '发送时间',
    search: {
      show: true,
      component: 'DatePicker',
      componentProps: {
        type: 'daterange',
        valueFormat: 'YYYY-MM-DD'
      }
    }
  },
  {
    field: 'title',
    label: '标题',
    search: {
      show: true,
      component: 'Input'
    }
  },
  {
    field: 'type',
    label: '接收对象',
    search: {
      show: true,
      component: 'Select',
      componentProps: {
        options: newsTypes as any
      }
    }
  },
  {
    field: 'status',
    label: '状态',
    search: {
      show: false,
      component: 'Input'
    }
  },
  {
    field: 'createdDate',
    label: '创建时间',
    search: {
      show: false,
      component: 'DatePicker',
      componentProps: {
        type: 'daterange',
        valueFormat: 'YYYY-MM-DD'
      }
    }
  },
  //   {
  //     field: 'hasShow',
  //     label: '是否展示',
  //     search: {
  //       show: false
  //     }
  //   },
  //   {
  //     field: 'hasTop',
  //     label: '是否置顶',
  //     search: {
  //       show: false
  //     }
  //   },
  {
    field: 'content',
    label: '详情',
    search: {
      show: false
    }
  },
  {
    field: 'action',
    label: '操作',
    fixed: 'right',
    width: '100px',
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
// const deletBtn = ref()
// const editBtn = ref()
// onMounted(() => {
//   if (
//     permissions.find((item) => {
//       return item == 'news:delete'
//     })
//   ) {
//     deletBtn.value = true
//   } else {
//     deletBtn.value = false
//   }

//   if (
//     permissions.find((item) => {
//       return item == 'news:update'
//     })
//   ) {
//     editBtn.value = true
//   } else {
//     editBtn.value = false
//   }
// })
const onDelRow = async (row: PolicyDtoType | null, multiple: boolean) => {
  tableObject.currentRow = row
  const { delList, getSelections } = methods
  const selections = await getSelections()
  await delList(
    multiple ? selections.map((v) => v.id) : [tableObject.currentRow?.id as number],
    multiple
  )
}

const onAddRow = () => {
  push('/Project/Notify/Detail')
}

const onEditRow = (row: PolicyDtoType) => {
  push(`/Project/Notify/Detail?id=${row.id}`)
}

const viewNews = (row: PolicyDtoType) => {
  // content.value = row.content
  // dialog.value = true
  push(`/Project/Notify/Detail?id=${row.id}`)
}

const getTypeText = (val) => {
  return newsTypes.value.find((item) => item.value === val)?.label || ''
}
</script>
