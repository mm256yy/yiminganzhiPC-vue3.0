<template>
  <WorkContentWrap>
    <div class="table-wrap">
      <div class="flex items-center justify-between pb-12px">
        <div> 选择待合并户：</div>
        <div
          ><ElButton type="primary" @click="select">选择</ElButton
          ><ElButton type="primary" @click="selectsum">确认</ElButton></div
        >
      </div>
      <ElTable
        :data="tableData"
        border
        style="width: 100%"
        @selection-change="handleSelectionChange"
        ref="multipleTableRef"
      >
        <ElTableColumn type="selection" width="55" />
        <ElTableColumn prop="name" label="户主姓名" />
        <ElTableColumn prop="showDoorNo" label="户号" />
        <ElTableColumn prop="villageName" label="行政村" />
        <ElTableColumn prop="familyMembers" label="家庭成员">
          <template #default="{ row }"> {{ joninFamily(row.familyMembers) }}</template>
        </ElTableColumn>
        <ElTableColumn prop="address" label="户籍地址" />
        <ElTableColumn fixed="right" label="操作">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="handleClick(row)">删除</el-button>
          </template>
        </ElTableColumn>
      </ElTable>
      <div class="pb-12px pt-12px">
        <div> <ElSwitch v-model="switchs" @change="switchChange" /> 是否指定新户主</div>
        <div style="margin: 10px 0" v-show="switchs && tableData.length > 1"
          >指定新户主、户号及行政村：</div
        >
        <div style="margin: 10px 0" v-show="switchs && tableData.length > 1">
          <span style="margin-right: 10px">
            选择自然村：
            <ElCascader
              v-model="form.value"
              :options="options"
              @change="handleChange"
              :props="{ label: 'name', value: 'code' }"
            />
          </span>
        </div>
        <div style="margin: 10px 0" v-show="switchs && tableData.length > 1">
          <span style="margin-right: 10px">
            选择新户主：
            <ElSelect v-model="form.valueFamliy" placeholder=" 选择新户主：">
              <ElOption
                v-for="item in form.options"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </ElSelect>
          </span>
          <span>
            新户号:&nbsp;&nbsp;
            <ElInput
              v-model="form.doorn"
              placeholder="输入新户号后四位"
              style="width: 200px"
              maxlength="4"
            />
          </span>
        </div>
      </div>
      <div style="color: red">说明：人口和房屋信息合并，附属物和零星林果木等信息累加。</div>
    </div>
    <ElDialog v-model="dialogTableVisible" title="选择居民户" width="900px" max-height="900px">
      <div
        style="
          display: flex;
          width: 100%;
          margin-bottom: 10px;
          justify-content: space-between;
          align-items: center;
        "
      >
        <div class="search-form-wrap">
          <Search :schema="allSchemas.searchSchema" @search="onSearch" @reset="setSearchParamss" />
        </div>
        <ElButton type="primary" @click="selectAdd">确认</ElButton>
      </div>
      <Table
        ref="tabalRef"
        :loading="tableObject.loading"
        :data="tableObject.tableList"
        :columns="allSchemas.tableColumns"
        row-key="id"
        headerAlign="center"
        align="center"
        highlightCurrentRow
        defaultExpandAll
        @register="register"
        :selection="true"
      >
        <template #familyMembers="{ row }"> {{ joninFamily(row.familyMembers) }}</template>
      </Table>
    </ElDialog>
  </WorkContentWrap>
</template>

<script setup lang="ts">
import {
  ElButton,
  ElTable,
  ElTableColumn,
  ElSwitch,
  ElSelect,
  ElOption,
  ElMessage,
  ElDialog,
  ElCascader,
  ElInput
} from 'element-plus'
import { Search } from '@/components/Search'

import { getSeparateList, postMerge } from '@/api/fundManage/fundPayment-service'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { useTable } from '@/hooks/web/useTable'
import { ref, reactive, onMounted } from 'vue'
import { useAppStore } from '@/store/modules/app'
import { Table } from '@/components/Table'
import { getVillageTreeApi } from '@/api/workshop/village/service'
const appStore = useAppStore()
let multipleTableRef = ref()
let tabalRef = ref()
let tableData: any = ref([])
let switchs = ref(false)
let dialogTableVisible = ref(false)
let options = ref()
let form: any = reactive({
  value: '',
  valueFamliy: '',
  doorn: '',
  selenctTable: [],
  options: [],
  gridData: [
    {
      name: '张三',
      address: '北京市海淀区中关村'
    },
    {
      name: '李四',
      address: '北京市海淀区西城区'
    },
    {
      name: '王五',
      address: '北京市海淀区东城区'
    }
  ]
})
const getdistrictTree = async () => {
  const list = await getVillageTreeApi(projectId)
  options.value = list || []
  return list || []
}
onMounted(() => {
  getdistrictTree()
})
const projectId = appStore.currentProjectId
const schema = reactive<CrudSchema[]>([
  {
    field: 'blurry',
    label: '输入农户',
    search: {
      show: true,
      component: 'Input',
      componentProps: {
        placeholder: '可输入姓名 / 户号 '
      }
    },
    table: {
      show: false
    },
    detail: {
      show: false
    },
    form: {
      show: false
    }
  },
  {
    field: 'name',
    label: '户主姓名',
    search: {
      show: false
    }
  },
  {
    field: 'showDoorNo',
    label: '户号',
    search: {
      show: false
    }
  },
  {
    field: 'villageName',
    label: '行政村',
    search: {
      show: false
    }
  },
  {
    field: 'familyMembers',
    label: '家庭成员',
    search: {
      show: false
    }
  },
  {
    field: 'address',
    label: '户籍地址',
    search: {
      show: false
    }
  }
])
let { allSchemas } = useCrudSchemas(schema)
const { register, tableObject, methods } = useTable({
  getListApi: getSeparateList,
  delListApi: getSeparateList
})
const { getList, setSearchParams } = methods
tableObject.params = {
  projectId
}
let switchChange = (val) => {
  if (val && tableData.value.length < 2) {
    ElMessage({
      message: '选择用户小于2',
      type: 'warning'
    })
    switchs.value = false
  }
}
let select = () => {
  // tabalRef.value?.selections = tableData.value
  setSearchParams({ type: 'PeasantHousehold' })
  dialogTableVisible.value = true
  setTimeout(() => {
    setSelection()
  }, 1000)
}
let setSelection = () => {
  console.log(tableData.value)

  tabalRef.value.setSelection(tableData.value)
}
let selectAdd = () => {
  dialogTableVisible.value = false
  console.log(tabalRef.value.selections)
  tableData.value = tableData.value.concat(tabalRef.value.selections)
  console.log(tableData.value)

  tableData.value = tableData.value.reduce((pre, item) => {
    if (pre.find((pix) => pix.id == item.id)) {
      return pre
    } else {
      pre.push(item)
      return pre
    }
  }, [])

  // tabalRef.value.selections = []
  form.options = tableData.value.reduce((pre, item) => {
    pre = pre.concat(item.familyMembers)
    return pre
  }, [])
}
let joninFamily = (row) => {
  return row.reduce((prev, cur) => {
    prev = prev + cur.name + ','
    return prev
  }, '')
}
const handleChange = (value) => {
  console.log(value)
}
let handleSelectionChange = (val) => {
  console.log(multipleTableRef)
  if (val.length > 1) {
    multipleTableRef.value.toggleRowSelection(val[0], undefined)
  }
  form.selenctTable = val
}
let selectsum = () => {
  if (form.selenctTable.length == 0 && !switchs.value) {
    ElMessage({
      message: '请选择户主',
      type: 'warning'
    })
  } else if (switchs.value && !form.value) {
    ElMessage({
      message: '请选择自然村',
      type: 'warning'
    })
  } else if (switchs.value && !form.valueFamliy) {
    ElMessage({
      message: '请选择新户主',
      type: 'warning'
    })
  } else if (switchs.value && !form.doorn) {
    ElMessage({
      message: '请选择新户号',
      type: 'warning'
    })
  } else {
    let params = {
      doorNos: [],
      type: '',
      doorNo: '',
      villageCode: '',
      householderId: 0,
      virutalVillageCode: ''
    }
    params.doorNos = tableData.value.map((item) => item.doorNo)
    if (switchs.value) {
      params.type = '2'
      params.doorNo = form.doorn
      params.householderId = form.valueFamliy
      params.villageCode = form.value[2]
      params.virutalVillageCode = form.value[3]
    } else {
      params.type = '1'
      params.doorNo = form.selenctTable.map((item) => item.doorNo)[0]
      form.selenctTable[0].familyMembers.forEach((item) => {
        if (item.name == form.selenctTable[0].name) {
          params.householderId = item.id
        }
      })
      params.villageCode = form.selenctTable[0].villageCode
    }

    console.log(params)
    postMerge(params).then((res) => {
      console.log(res)
      if (res) {
        ElMessage({
          message: '合并成功',
          type: 'success'
        })
        tableData.value = []
        switchs.value = false
      }
    })
  }
}
const onSearch = (data) => {
  //解决是否户主relation入参变化
  let searchData = JSON.parse(JSON.stringify(data))
  console.log(searchData)

  if (searchData.relation == '1') {
    searchData.relation = ['is', 1]
  } else if (searchData.relation == '0') {
    searchData.relation = ['not', 1]
  } else {
    delete searchData.relation
  }
  const findRecursion = (data, code, callback) => {
    if (!data || !Array.isArray(data)) return null
    data.forEach((item, index, arr) => {
      if (item.code === code) {
        return callback(item, index, arr)
      }
      if (item.children) {
        return findRecursion(item.children, code, callback)
      }
    })
  }

  const getParamsKey = (key: string) => {
    const map = {
      Country: 'areaCode',
      Township: 'townCode',
      Village: 'villageCode', // 行政村 code
      NaturalVillage: 'virutalVillageCode' // 自然村 code
    }
    return map[key]
  }
  // 处理参数
  let params = {
    ...searchData
  }
  tableObject.params = {
    projectId
  }
  for (let i in params) {
    if (!params[i]) {
      delete params[i]
    }
  }
  setSearchParams({ ...params, type: 'PeasantHousehold' })
}
let setSearchParamss = () => {
  tableObject.params = {}
  setSearchParams({ type: 'PeasantHousehold' })
}
let handleClick = (row) => {
  console.log(row)
  tableData.value = tableData.value.filter((item) => {
    return item.doorNo != row.doorNo
  })
}
</script>

<style lang="less" scoped>
.view-upload {
  display: flex;
  height: 32px;
  padding: 0 10px;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-color-1);
  white-space: nowrap;
  cursor: default;
  background: #ffffff;
  border: 1px solid #ebebeb;
  border-radius: 4px;
  box-shadow: 0px 1px 4px 0px rgba(202, 205, 215, 0.68);
  align-items: center;
}

.file-list {
  height: 210px;
  overflow-y: scroll;

  .file-item {
    display: flex;
    padding: 5px 16px;
    margin-bottom: 8px;
    font-size: 14px;
    color: var(--text-color-1);
    border-bottom: 1px solid #ebebeb;
    align-items: center;

    .m-lr-20px {
      margin: 0 20px;
    }

    .file-name {
      text-align: justify;
      word-break: break-all;
    }

    .number {
      font-weight: 500;
      color: var(--el-color-primary);
    }

    .flex-none {
      flex: none;
    }
  }
}

.ElButton-form-wrap {
  display: block;
  padding: var(--distance-base);
  margin-top: 10px;
  background-color: #fff;
  border-radius: 4px;
}

.numFont {
  font-size: 14px;
}

.max-header {
  width: 1000px;
}

:deep(.el-dialog__body) {
  padding-top: 10px;
}
</style>
