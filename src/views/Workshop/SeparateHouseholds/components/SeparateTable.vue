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
          <ElButton type="primary" @click="submit"> 提交 </ElButton>
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
          <el-select
            v-model="row.name"
            class="m-2"
            placeholder="Select"
            @change="(val) => handelSelectchange(row, val)"
          >
            <el-option
              v-for="item in row.familyMembers"
              :key="item.id"
              :value="item.name"
              :disabled="handelselenceKey(row, item)"
              >{{ item.name }}
            </el-option>
          </el-select>
        </template>
        <template #doorNo="{ row }">
          <el-input
            v-model="row.doorNo"
            maxlength="4"
            placeholder="填入户号"
            type="textnumber"
            :disabled="!row.pid"
          >
            <template #prepend v-if="row.pid">{{ row.noDoor }}</template>
          </el-input>
        </template>
        <template #totalPrice="{ row }">
          <el-checkbox-group v-model="row.listBoy" @change="(val) => handelchange(row, val)">
            <el-checkbox
              v-for="i in row.familyMembers"
              :label="i.name"
              :key="i.id"
              :disabled="handelCheckboxKey(row, i)"
              @change="(val) => handelchanges(row, val, i)"
              >{{ i.name }}
            </el-checkbox>
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
import { getSeparateList, postSeparate } from '@/api/fundManage/fundPayment-service'
import { getVillageTreeApi } from '@/api/workshop/village/service'
const appStore = useAppStore()
const projectId = appStore.currentProjectId
let tabalRef = ref()
const districtTree = ref<any[]>([])
const { register, tableObject, methods } = useTable({
  getListApi: getSeparateList,
  delListApi: getSeparateList
})
const { getList, setSearchParams } = methods

tableObject.params = {
  projectId,
  type: 'PeasantHousehold'
}

const getdistrictTree = async () => {
  const list = await getVillageTreeApi(projectId)
  districtTree.value = list || []
  return list || []
}
onMounted(() => {
  getdistrictTree()

  getList().then(() => {
    tableObject.tableList.forEach((item: any) => {
      item.listBoy = []
      item.familyMembers.forEach((i: any) => {
        item.listBoy.push(i.name)
      })
    })
  })
})

const schema = reactive<CrudSchema[]>([
  {
    field: 'blurry',
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
    width: 340,
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
    field: 'villageName',
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
  tableObject.params = { ...params, type: 'PeasantHousehold' }
  getList().then(() => {
    tableObject.tableList.forEach((item: any) => {
      item.listBoy = []
      item.familyMembers.forEach((i: any) => {
        item.listBoy.push(i.name)
      })
    })
  })
}
let setSearchParamss = () => {
  tableObject.params = { type: 'PeasantHousehold', projectId }
  getList().then(() => {
    tableObject.tableList.forEach((item: any) => {
      item.listBoy = []
      item.familyMembers.forEach((i: any) => {
        item.listBoy.push(i.name)
      })
    })
  })
}
let handleEdit = (row) => {
  tableObject.tableList.forEach((item: any) => {
    if (item.showDoorNo === row.showDoorNo) {
      let index = item.children ? item.children.length + 1 : 1
      item.children
        ? item.children.push({
            showDoorNo: row.showDoorNo + index,
            name: '',
            doorNo: '',
            villageName: row.villageName,
            villageCode: row.villageCode,
            totalPrice: row.totalPrice,
            action: '删除',
            pid: row.showDoorNo,
            familyMembers: row.familyMembers,
            listBoy: [],
            noDoor: row.doorNo.slice(0, 5)
          })
        : (item.children = [
            {
              showDoorNo: row.showDoorNo + index,
              name: '',
              doorNo: '',
              villageName: row.villageName,
              villageCode: row.villageCode,
              totalPrice: row.totalPrice,
              action: '删除',
              pid: row.showDoorNo,
              familyMembers: row.familyMembers,
              listBoy: [],
              noDoor: row.doorNo.slice(0, 5)
            }
          ])
    }
  })
  console.log(tableObject, row)
}
let handleDel = (row) => {
  tableObject.tableList.forEach((item: any) => {
    if (item.showDoorNo === row.pid) {
      item.children.splice(
        item.children.findIndex((i: any) => i.showDoorNo === row.showDoorNo),
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
    let list = tableObject.tableList.filter((item) => item.showDoorNo == row.pid)
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

  return nameList.indexOf(value.name) != -1 ? true : false
}
let handelchange = (row, val) => {
  let nameList: any = []
  let list: any = []
  if (row.pid) {
    list = tableObject.tableList.filter((item) => item.showDoorNo == row.pid)
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

  if (nameList.length > list[0].familyMembers.length) {
    if (row.pid) {
      tableObject.tableList.forEach((item: any) => {
        if (item.showDoorNo === row.pid) {
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
        if (item.showDoorNo === row.showDoorNo) {
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
      if (item.showDoorNo === row.pid) {
        item.children.forEach((res) => {
          if (res.showDoorNo == row.showDoorNo) {
            res.listBoy.push(i.name)
          }
        })
      }
    })
  } else if (!val) {
    tableObject.tableList.forEach((item: any) => {
      if (item.showDoorNo === row.showDoorNo) {
        item.listBoy.push(i.name)
      }
    })
  }
}
let handelCheckboxKey = (row, key) => {
  let list: any = []
  let nameList: any = []
  if (row.pid) {
    list = tableObject.tableList.filter((item) => item.showDoorNo == row.pid)
  } else {
    list = [row]
  }
  list.forEach((item: any) => {
    nameList.push(item.name)
    if (item.children) {
      item.children.forEach((i: any) => {
        nameList.push(i.name)
      })
    }
  })

  return nameList.indexOf(key.name) != -1 ? true : false
}
let handelSelectchange = (row, key) => {
  if (row.listBoy.indexOf(key) == -1) {
    row.listBoy.push(key)
    handelchange(row, row.listBoy)
  }
}
let submit = () => {
  let list: any = []
  let parent: any = []
  list = tableObject.tableList.filter((item) => item.children)
  console.log(list)
  parent = list.reduce((pre: any, cur: any) => {
    let m: any = { oldHousehold: {}, newHouseholdList: [] }
    m.oldHousehold = {
      householderId: cur.familyMembers.filter((item: any) => item.name === cur.name)[0].id,
      familyIds: valueKey(cur.familyMembers, cur.listBoy),
      doorNo: cur.doorNo,
      villageCode: cur.villageCode
    }
    cur.children.forEach((item: any) => {
      m.newHouseholdList.push({
        householderId: item.familyMembers.filter((b: any) => b.name === item.name)[0].id,
        familyIds: valueKey(item.familyMembers, item.listBoy),
        doorNo: item.doorNo,
        villageCode: item.villageCode
      })
    })
    pre.push(m)
    return pre
  }, [])
  console.log(parent)
  postSeparate(parent).then((res: any) => {
    console.log(res)
    setSearchParams({ type: 'PeasantHousehold' })
  })
}
let valueKey = (arr, value) => {
  let m = value.reduce((pre: any, cur: any) => {
    pre.push(arr.filter((item: any) => item.name === cur)[0].id)
    return pre
  }, [])
  return m
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
