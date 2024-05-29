<template>
  <WorkContentWrap>
    <div class="search-form-wrap">
      <!-- <Search :schema="allSchemas.searchSchema" @search="onSearch" @reset="setSearchParamss" /> -->
    </div>
    <div class="search-form-wrap">
      <ElForm
        class="form"
        ref="formRef"
        :model="searchForm"
        label-width="160px"
        :label-position="'right'"
      >
        <ElRow>
          <ElCol :span="8">
            <ElFormItem label="选择房屋权属农户:" prop="blurry">
              <!-- <ElInput v-model="searchForm.name" class="!w-250px" /> -->
              <el-select
                v-model="blurry"
                filterable
                remote
                reserve-keyword
                placeholder="请输入户号/户主名称"
                :remote-method="remoteMethod"
                :loading="loading"
                @change="doorTypeChange"
                style="width: 400px"
              >
                <el-option
                  v-for="item in options"
                  :key="item.id"
                  :label="item.blurry"
                  :value="item.name"
                />
              </el-select>
            </ElFormItem>
          </ElCol>
          <ElCol :span="8">
            <ElFormItem label="选择房屋:" prop="house">
              <ElSelect
                clearable
                filterable
                v-model="house"
                class="!w-full"
                placeholder="请选择房屋"
              >
                <ElOption
                  v-for="item in houseLists"
                  :key="item.houseNo"
                  :label="item.houseNo"
                  :value="item.houseNo"
                />
              </ElSelect>
            </ElFormItem>
          </ElCol>
          <ElCol :span="16">
            <div>
              <ElButton type="primary" @click="onSearch">
                <Icon icon="ep:search" class="mr-5px" /> 查询
              </ElButton>
              <ElButton @click="setSearchParamss">
                <Icon icon="ep:refresh-right" class="mr-5px" /> 重置
              </ElButton>
            </div>
          </ElCol>
        </ElRow>
      </ElForm>
    </div>
    <div class="table-wrap">
      <div class="flex items-center justify-between pb-12px">
        <div style="color: red">
          当前拆分房屋{{ house ? house : '-' }}幢（建筑面积{{
            dataList ? dataList[0].landArea : '-'
          }}㎡，合法面积{{ dataList ? dataList[0].landLegalArea : '-' }}㎡，不合法面积{{
            dataList ? dataList[0].landIllegalArea : '-'
          }}㎡）
        </div>
        <ElSpace>
          <ElButton
            type="primary"
            @click="
              () => {
                dialog = true
                EditFormid = 3
              }
            "
          >
            房屋分权日志
          </ElButton>
          <ElButton type="primary" @click="add"> 提交 </ElButton>
        </ElSpace>
      </div>

      <Table
        ref="tabalRef"
        :loading="tableObject.loading"
        :data="dataList"
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
            v-model="blurry"
            filterable
            remote
            reserve-keyword
            placeholder="请输入户号/户主名称"
            :remote-method="remoteMethod"
            :loading="loading"
            @change="doorNoChange"
            style="width: 220px"
            v-if="row.action == '删除'"
          >
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.blurry"
              :value="item.name"
            />
          </el-select>
        </template>
        <template #landLegalArea="{ row }">
          <el-input
            v-model="row.landLegalArea"
            maxlength="4"
            placeholder="请输入面积"
            type="textnumber"
            @change="addLegitimate(row)"
          />
        </template>
        <template #landIllegalArea="{ row }">
          <el-input
            v-model="row.landIllegalArea"
            maxlength="4"
            placeholder="请输入面积"
            type="textnumber"
            @change="addLegitimate(row)"
          />
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
    <PropertyEditForm :show="dialog" :id="EditFormid" @close="onEditFormClose" />
    <el-dialog title="房屋产权分户信息" v-model="dialogVisible" width="500">
      <div style="display: flex; margin-bottom: 10px"> 是否对**的*房屋进行分权 </div>
      <ElForm
        class="form"
        ref="formRef"
        :model="form"
        label-width="120px"
        :label-position="'right'"
      >
        <ElFormItem label="分权备注" prop="remark" required>
          <ElInput v-model="form.remark" class="!w-350px" placeholder="请输入分权备注" />
        </ElFormItem>

        <ElFormItem label="分权原因" prop="reason" required>
          <ElSelect class="w-350px" v-model="form.reason">
            <ElOption
              v-for="item in dictObj[435]"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </ElSelect>
        </ElFormItem>
      </ElForm>
      <template #footer>
        <ElButton @click="onClose">取消</ElButton>
        <ElButton type="primary" @click="onSubmit">确认</ElButton>
      </template>
    </el-dialog>
  </WorkContentWrap>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted, computed } from 'vue'
import { useAppStore } from '@/store/modules/app'
import {
  ElButton,
  ElSelect,
  ElOption,
  ElInput,
  ElCheckboxGroup,
  ElCheckbox,
  ElDialog,
  ElForm,
  ElFormItem,
  ElRow,
  ElCol
} from 'element-plus'
import { WorkContentWrap } from '@/components/ContentWrap'
import { Search } from '@/components/Search'
import { Table } from '@/components/Table'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { useTable } from '@/hooks/web/useTable'
import {
  getSeparateList,
  postSeparate,
  findHouseUser, //查询农户
  findAll, //查询房屋
  separate //提交业务
} from '@/api/fundManage/fundPayment-service'
import { getVillageTreeApi } from '@/api/workshop/village/service'
import PropertyEditForm from './PropertyEditForm.vue'
import { useDictStoreWithOut } from '@/store/modules/dict'
const searchForm = ref<any>({
  blurry: '',
  house: ''
})
const house = ref<any>()
const blurry = ref<any>()
const dictStore = useDictStoreWithOut()
const dictObj = computed(() => dictStore.getDictObj)
let dialog = ref(false)
let EditFormid = ref()
const appStore = useAppStore()
const projectId = appStore.currentProjectId
let tabalRef = ref()
const districtTree = ref<any[]>([])
const dialogVisible = ref(false)
const { register, tableObject, methods } = useTable({
  getListApi: getSeparateList,
  delListApi: getSeparateList
})
const { getList, setSearchParams } = methods
const form = ref<any>({
  reason: '',
  remark: ''
})
tableObject.params = {
  projectId,
  type: 'PeasantHousehold'
}
const houseLists = ref<any>()
const loading = ref(false)
const options = ref<any[]>([])
const dataList = ref<any>()
const hoseDate = ref<any>()
const doorNoData = ref<any>()
const houseId = ref<any>()
const add = () => {
  // console.log(111111111111)
  dialogVisible.value = true
}
const onClose = () => {
  dialogVisible.value = false
}
const onSubmit = async () => {
  dialogVisible.value = false
  console.log(options.value, '旧数据')
  let parmas = {
    newHouseList: [
      {
        doorNo: 'jl1084324',
        landIllegalArea: 20,
        landLegalArea: 20
      }
    ],
    oldHouse: {
      doorNo: doorNoData.value,
      id: houseId.value,
      landIllegalArea: dataList.value[0].landIllegalArea,
      landLegalArea: dataList.value[0].landLegalArea
    },
    reason: form.value.reason,
    remark: form.value.remark,
    fileUrl: 'XXXXX'
  }
  console.log(parmas, '提交参数')
  // await separate(parmas).then((res) => {
  //   console.log('提交成功')
  // })
}
const getdistrictTree = async () => {
  const list = await getVillageTreeApi(projectId)
  districtTree.value = list || []
  return list || []
}
const addLegitimate = (row) => {
  console.log(row, '数据流')
  console.log(Number(row.landLegalArea) + Number(row.landIllegalArea), '合法数据')
  dataList.value[row.index].landArea = Number(row.landLegalArea) + Number(row.landIllegalArea)
  console.log(dataList.value, '表格数据')
  let newHouseList = []
  newHouseList = dataList.value.filter((item) => item.action == '删除')
  console.log(newHouseList, '提交新房数据')
  let arr = newHouseList.map((item: any) => {
    return {
      doorNo: '1111',
      landIllegalArea: item.landIllegalArea,
      landLegalArea: item.landLegalArea
    }
  })
  console.log(arr, '数组')
}
// const addIllegal = (row) => {
//   console.log(row, '非合法数据')
// }
// const getHoseList = async () =>{
//   const list = await findAll
// }
// const findHouseUserList = async () => {
//   const list = await findHouseUser({ blurry: '塘步' })
//   console.log(list, '农户列表')
//   return list || []
// }

// const getHoseList = async () => {
//   const list = await findAll({ doorNo: 'jl1084324', status: 'implementation' })
//   console.log(list, '房屋列表')
//   return list || []
// }
onMounted(() => {
  getdistrictTree()
  tableObject.loading = false
})
const doorTypeChange = (val) => {
  console.log(val, '测试数据下拉1')
  options.value.forEach((item) => {
    if (item.name == val) {
      doorNoData.value = item.doorNo
      houseId.value = item.id
      findAll({ doorNo: doorNoData.value, status: 'implementation' }).then((res) => {
        houseLists.value = res.content
        console.log(houseLists.value, '房子数据')
      })
    }
  })
}
const doorNoChange = (val) => {
  console.log(val, '测试数据下拉2')
  options.value.forEach((item) => {
    if (item.name == val) {
      let doorNo = item.doorNo
      // findAll({ doorNo: doorNo, status: 'implementation' }).then((res) => {
      //   // houseLists.value = res.content
      //   console.log(res.content, '房子数据')
      // })
      console.log(dataList.value.length, '表数据长度')
      console.log(doorNo, '户号是什么')
      dataList.value[dataList.value.length - 1].doorNo = doorNo
      console.log(dataList.value, '表数据')
    }
  })
}
const remoteMethod = (query: string) => {
  if (query) {
    loading.value = true
    findHouseUser({ blurry: query, page: 0, size: 10 }).then((res) => {
      loading.value = false
      options.value = res.content.map((item) => {
        return {
          id: item.id,
          name: item.name,
          doorNo: item.doorNo,
          blurry:
            item.doorNo +
            ' ' +
            item.name +
            ' ' +
            item.cityCodeText +
            ' ' +
            item.areaCodeText +
            ' ' +
            item.townCodeText +
            ' ' +
            item.villageText
        }
      })
      console.log(options.value, '农户数据')
    })
  } else {
    options.value = []
  }
}
const schema = reactive<CrudSchema[]>([
  {
    width: 340,
    field: 'name',
    label: '待获得产权户',
    search: {
      show: false
    }
  },
  {
    width: 340,
    field: 'landArea',
    label: '房屋建筑面积（㎡）',
    search: {
      show: false
    }
  },
  {
    field: 'landLegalArea',
    label: '房屋合法面积（㎡）',
    search: {
      show: false
    }
  },
  {
    field: 'landIllegalArea',
    label: '房屋不合法面积（㎡）',
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

const onSearch = () => {
  console.log(1, '测试查询功能')
  console.log(blurry.value, '测试农户')
  console.log(house.value, '测试房子')
  houseLists.value.forEach((item) => {
    if (item.houseNo == house.value) {
      // return {
      //   landArea: item.landArea,
      //   landLegalArea: item.landLegalArea,
      //   landIllegalArea: item.landIllegalArea
      // }
      dataList.value = [
        {
          index: 0,
          name: blurry.value + ' ' + doorNoData.value,
          landArea: item.landArea,
          landLegalArea: item.landLegalArea,
          landIllegalArea: item.landIllegalArea
        }
      ]
    }
  })
  console.log(hoseDate.value, 'bbq')
  console.log(dataList.value, '测试表数据')
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
  console.log(row, '新增row')
  dataList.value.push({
    index: dataList.value.length,
    name: 1,
    landArea: 0,
    landLegalArea: 0,
    landIllegalArea: 0,
    doorNo: '',
    action: '删除'
  })
}
let handleDel = (row) => {
  console.log(row, '删除row')
  dataList.value.splice(row.index, 1)
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
      householderId: cur.familyMembers.filter((item: any) => item.name === cur.name)[0]?.id,
      familyIds: valueKey(cur.familyMembers, cur.listBoy),
      doorNo: cur.doorNo,
      villageCode: cur.villageCode
    }
    cur.children.forEach((item: any) => {
      m.newHouseholdList.push({
        householderId: item.familyMembers.filter((b: any) => b.name === item.name)[0]?.id,
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
const onEditFormClose = (flag: boolean) => {
  console.log(flag)

  dialog.value = false
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
