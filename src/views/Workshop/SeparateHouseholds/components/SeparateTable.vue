<template>
  <WorkContentWrap>
    <div class="search-form-wrap">
      <Search :schema="allSchemas.searchSchema" @search="onSearch" @reset="setSearchParamss" />
    </div>

    <div class="table-wrap">
      <div class="flex items-center justify-between pb-12px">
        <div style="color: red">
          分户说明：人口分户；房屋、附属物和零星林果木等实物成果仍登记在原户主处!
        </div>
        <ElSpace>
          <ElButton type="primary"> 提交 </ElButton>
        </ElSpace>
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
        :row-style="handelStyle"
        :cell-style="handelCellStyle"
      >
        <template #name="{ row }">
          <el-select v-model="row.name" class="m-2" placeholder="Select">
            <el-option
              v-for="item in row.datalist"
              :key="item"
              :value="item"
              :disabled="handelselenceKey(row, item)"
            />
          </el-select>
        </template>
        <template #doorNo="{ row }">
          <el-input
            v-model="row.doorNo"
            maxlength="4"
            placeholder="填入户号"
            type="textnumber"
            :disabled="!row.pid"
          />
        </template>
        <template #totalPrice="{ row }">
          <el-checkbox-group v-model="row.listBoy" @change="(val) => handelchange(row, val)">
            <el-checkbox
              v-for="i in row.datalist"
              :label="i"
              :key="i"
              @change="(val) => handelchanges(row, val, i)"
            />
          </el-checkbox-group>
        </template>
        <template #action="{ row }">
          <el-button v-if="!row.action" type="primary" @click="handleEdit(row)" link
            >增加</el-button
          >
          <el-button v-else type="primary" @click="handleDel(row)" link>删除</el-button>
        </template>
      </Table>
    </div>
  </WorkContentWrap>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { useAppStore } from '@/store/modules/app'
import { ElButton, ElSelect, ElOption, ElInput, ElCheckboxGroup, ElCheckbox } from 'element-plus'
import { WorkContentWrap } from '@/components/ContentWrap'
import { Search } from '@/components/Search'
import { Table } from '@/components/Table'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { useTable } from '@/hooks/web/useTable'
import { deleteFunPayApi, getDetailsList } from '@/api/fundManage/fundPayment-service'
import { getVillageTreeApi } from '@/api/workshop/village/service'
const appStore = useAppStore()
const projectId = appStore.currentProjectId
let tabalRef = ref()
const districtTree = ref<any[]>([])
const { register, tableObject, methods } = useTable({
  getListApi: getDetailsList,
  delListApi: deleteFunPayApi
})
const { getList, setSearchParams } = methods

tableObject.params = {
  projectId
}

getList().then(() => {
  tableObject.tableList.forEach((item: any) => {
    item.datalist = ['吕亚连', 2, 3, 4, 5]
    item.listBoy = ['吕亚连', 2, 3, 4, 5]
  })
})

const getdistrictTree = async () => {
  const list = await getVillageTreeApi(projectId)
  districtTree.value = list || []
  return list || []
}
onMounted(() => {
  getdistrictTree()
})

const schema = reactive<CrudSchema[]>([
  {
    field: 'name',
    label: '输入待拆分农户',
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
    field: 'code',
    label: '所属区域',
    search: {
      show: true,
      component: 'TreeSelect',
      componentProps: {
        data: districtTree,
        nodeKey: 'code',
        props: {
          value: 'code',
          label: 'name'
        },
        showCheckbox: true,
        checkStrictly: true,
        checkOnClickNode: true
      }
    },
    table: {
      show: false
    }
  },

  // table
  {
    width: 80,
    field: 'index',
    type: 'index',
    label: '序号'
  },
  {
    field: 'name',
    label: '拟任户主姓名',
    search: {
      show: false
    }
  },
  {
    field: 'doorNo',
    label: '拟任户号',
    search: {
      show: false
    }
  },
  {
    field: 'villageText',
    label: '选定行政村',
    search: {
      show: false
    }
  },
  {
    field: 'totalPrice',
    label: '选择人口',
    search: {
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
    }
  }
])

let { allSchemas } = useCrudSchemas(schema)

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
  if (params.code) {
    findRecursion(districtTree.value, params.code, (item) => {
      if (item) {
        params[getParamsKey(item.districtType)] = params.code
      }
    })
    delete params.code
  }
  setSearchParams({ ...params })
}
let setSearchParamss = () => {
  tableObject.params = {}
  setSearchParams({})
}
let handleEdit = (row) => {
  tableObject.tableList.forEach((item: any) => {
    if (item.id === row.id) {
      let index = item.children ? item.children.length + 1 : 1
      item.children
        ? item.children.push({
            id: row.id + index,
            name: index + 1,
            doorNo: row.doorNo,
            villageText: row.villageText,
            totalPrice: row.totalPrice,
            action: '删除',
            pid: row.id,
            datalist: ['吕亚连', 2, 3, 4, 5]
          })
        : (item.children = [
            {
              id: row.id + index,
              name: index + 1,
              doorNo: row.doorNo,
              villageText: row.villageText,
              totalPrice: row.totalPrice,
              action: '删除',
              pid: row.id,
              datalist: ['吕亚连', 2, 3, 4, 5]
            }
          ])
    }
  })
  console.log(tableObject, row)
}
let handleDel = (row) => {
  tableObject.tableList.forEach((item: any) => {
    if (item.id === row.pid) {
      item.children.splice(
        item.children.findIndex((i: any) => i.id === row.id),
        1
      )
    }
  })
}
let handelStyle = ({ row }) => {
  if (row.pid) {
    return { background: '#e5e7eb' }
  }
}
let handelCellStyle = ({ columnIndex }) => {
  if (columnIndex == 4) {
    return {
      textAlign: 'left'
    }
  }
}
let handelselenceKey = (row: any, value) => {
  let nameList: any = []
  if (row.pid) {
    let list = tableObject.tableList.filter((item) => item.id == row.pid)
    nameList = list.reduce((pre: any, cur: any) => {
      pre.push(cur.name)
      if (cur.children) {
        pre = pre.concat(cur.children.map((i: any) => i.name))
      }
      return pre
    }, [])
  } else {
    nameList = [row].reduce((pre: any, cur: any) => {
      pre.push(cur.name)
      if (cur.children) {
        pre = pre.concat(cur.children.map((i: any) => i.name))
      }
      return pre
    }, [])
  }

  return nameList.indexOf(value) != -1 ? true : false
}
let handelchange = (row, val) => {
  let nameList: any = []
  let list: any = []
  if (row.pid) {
    list = tableObject.tableList.filter((item) => item.id == row.pid)
  } else {
    list = [row]
  }
  nameList = list.reduce((pre: any, cur: any) => {
    pre = pre.concat(cur.listBoy)
    if (cur.children) {
      pre = pre.concat(cur.children.map((i: any) => i.listBoy))
    }
    if (pre.some((items) => Array.isArray(items))) {
      pre = pre.flat(Infinity)
    }
    return pre
  }, [])
  if (nameList.length > 5) {
    val[val.length - 1]
    if (row.pid) {
      tableObject.tableList.forEach((item: any) => {
        if (item.id === row.pid) {
          if (item.listBoy.indexOf(val[val.length - 1]) != -1) {
            item.listBoy.splice(item.listBoy.indexOf(val[val.length - 1]), 1)
          } else {
            item.children.forEach((res) => {
              if (res.listBoy.indexOf(val[val.length - 1]) != -1) {
                res.listBoy.splice(res.listBoy.indexOf(val[val.length - 1]), 1)
              }
            })
          }
        }
      })
    } else {
      tableObject.tableList.forEach((item: any) => {
        if (item.id === row.id) {
          item.children.forEach((res) => {
            if (res.listBoy.indexOf(val[val.length - 1]) != -1) {
              res.listBoy.splice(res.listBoy.indexOf(val[val.length - 1]), 1)
            }
          })
        }
      })
    }
  }
}
let handelchanges = (row, val, i) => {
  console.log(row, val, i)
  if (row.pid && !val) {
    tableObject.tableList.forEach((item: any) => {
      if (item.id === row.pid) {
        item.children.forEach((res) => {
          if (res.id == row.id) {
            res.listBoy.push(i)
          }
        })
      }
    })
  } else if (!val) {
    tableObject.tableList.forEach((item: any) => {
      if (item.id === row.id) {
        item.listBoy.push(i)
      }
    })
  }
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
</style>
