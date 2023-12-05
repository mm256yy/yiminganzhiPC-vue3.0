<template>
  <ContentWrap title="乡愁征文">
    <Search :schema="allSchemas.searchSchema" @search="setSearchParams" @reset="setSearchParams" />

    <div class="flex items-center justify-between pb-18px">
      <div class="text-size-14px"> 乡愁列表 </div>
      <ElSpace>
        <!-- v-hasPermi="['news:add']" -->
        <!-- <ElButton :icon="addIcon" type="primary" @click="onAddRow">新增文章</ElButton> -->
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
      <!-- <template #coverPic>
        <img
          src="http://192.168.1.128:4000/src/assets/imgs/logo.png"
          alt="封面"
          style="height: 80px"
        />
      </template> -->
      <template #type="{ row }">
        <div> {{ getTypeText(row.type) }} </div>
      </template>
      <template #top="{ row }">
        <div> {{ row.top == '1' ? '是' : '否' }} </div>
      </template>
      <template #showable="{ row }">
        <div> {{ row.showable == '1' ? '是' : '否' }} </div>
      </template>
      <template #publishTime="{ row }">
        <div>
          {{ row.publishTime ? dayjs(row.publishTime).format('YYYY-MM-DD HH:mm:ss') : '-' }}</div
        >
      </template>
      <template #content="{ row }">
        <div class="cursor-pointer text-[#409eff]" @click="viewNews(row)"> 查看 </div>
      </template>
      <!-- v-hasPermi="['news:delete']" -->
      <template #action="{ row }">
        <!-- <TableEditColumn :row="row" @edit="onEditRow(row)" @delete="onDelRow" /> -->
        <div style="display: flex">
          <el-button type="primary" link @click="onEditRow(row)">审核</el-button>
          <el-button type="danger" link @click="onDelRow(row, false)"> 删除 </el-button>
        </div>
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
import { getNewsListApi, delNewsByIdApi } from '@/api/project/Homesickness/service'
import type { NewsDtoType } from '@/api/project/news/types'
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
  getListApi: getNewsListApi,
  delListApi: delNewsByIdApi
})
const { getList, setSearchParams } = methods

;(tableObject.params = {
  sort: ['publishTime', 'desc']
}),
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
    console.log(res, 'res')
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
    field: 'title',
    label: '标题',
    search: {
      show: true,
      component: 'Input'
    }
  },
  {
    field: 'coverPic',
    label: '封面图',
    search: {
      show: false
    }
  },
  {
    field: 'type',
    label: '类型',
    search: {
      show: false
      // component: 'Select',
      // componentProps: {
      //   options: newsTypes as any
      // }
    }
  },
  {
    field: 'author',
    label: '发布者',
    search: {
      show: true,
      component: 'Input'
    }
  },
  {
    field: 'publishTime',
    label: '发布时间',
    search: {
      show: false
      // component: 'DatePicker',
      // componentProps: {
      //   type: 'daterange',
      //   valueFormat: 'YYYY-MM-DD'
      // }
    }
  },
  {
    field: 'showable',
    label: '是否展示',
    search: {
      show: false
    }
  },
  {
    field: 'top',
    label: '是否置顶',
    search: {
      show: false
    }
  },
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
const onDelRow = async (row: any, multiple: boolean) => {
  tableObject.currentRow = row
  const { delList, getSelections } = methods
  const selections = await getSelections()
  await delList(
    multiple ? selections.map((v) => v.id) : [tableObject.currentRow?.id as number],
    multiple
  )
}
const onAddRow = () => {
  push('/Project/Homesickness/Detail')
}

const onEditRow = (row: NewsDtoType) => {
  push(`/Project/Homesickness/Detail?id=${row.id}`)
}

const viewNews = (row: NewsDtoType) => {
  content.value = row.content
  dialog.value = true
}

const getTypeText = (val) => {
  return newsTypes.value.find((item) => item.value === val)?.label || ''
}
</script>
