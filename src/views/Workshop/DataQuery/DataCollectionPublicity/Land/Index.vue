<template>
  <WorkContentWrap>
    <div class="search-form-wrap">
      <!-- <Search
        :schema="allSchemas.searchSchema"
        :defaultExpand="false"
        :expand-field="'card'"
        @search="onSearch"
        @reset="resetSearch"
      />
      <ElButton type="primary" @click="onExport">数据导出</ElButton> -->
      镜岭水库工程土地调查表
    </div>

    <!-- <div class="line"></div> -->

    <div class="table-wrap" v-loading="loading">
      <el-table
        :data="tableDataList"
        border
        :height="getHeight(tableDataList)"
        style="width: 100%"
        :span-method="objectSpanMethod"
      >
        <el-table-column prop="locationType" label="功能区" align="center" header-align="center" />
        <el-table-column prop="plotNo" label="地块号" align="center" header-align="center" />
        <el-table-column prop="plowland" label="权属单位" align="center" header-align="center">
          <el-table-column prop="town" label="乡(镇、街道)" align="center" header-align="center" />
          <el-table-column
            prop="companyName"
            label="单位名称"
            align="center"
            header-align="center"
          />
        </el-table-column>
        <el-table-column prop="landType" label="土地性质" align="center" header-align="center">
          <!-- {{ landType == '5' ? '集体' : '-' }} -->
        </el-table-column>
        <el-table-column prop="totalArea" label="总面积" align="center" header-align="center" />
        <el-table-column label="农用地" align="center">
          <el-table-column
            v-for="(item1, index1) in tableColData"
            :key="index1"
            align="center"
            :prop="item1.prop"
            :label="item1.label"
          >
            <!-- <el-table-column prop="livePerson" label="合计" align="center" header-align="center" /> -->
            <template v-if="item1.children">
              <el-table-column
                v-for="(item2, index2) in item1.children"
                :key="index2"
                :prop="item2.prop"
                :label="item2.label"
                align="center"
              />
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="建设用地" align="center">
          <el-table-column
            v-for="(item1, index1) in tableColBuildData"
            :key="index1"
            align="center"
            :prop="item1.prop"
            :label="item1.label"
          >
            <template v-if="item1.children">
              <el-table-column
                v-for="(item2, index2) in item1.children"
                :key="index2"
                :prop="item2.prop"
                :label="item2.label"
                align="center"
              />
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="未利用地" align="center">
          <el-table-column
            v-for="(item1, index1) in tableColNoneData"
            :key="index1"
            align="center"
            :prop="item1.prop"
            :label="item1.label"
          >
            <template v-if="item1.children">
              <el-table-column
                v-for="(item2, index2) in item1.children"
                :key="index2"
                :prop="item2.prop"
                :label="item2.label"
                align="center"
              />
            </template>
          </el-table-column>
        </el-table-column>
      </el-table>
    </div>
  </WorkContentWrap>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import { useAppStore } from '@/store/modules/app'
import { ElTable, ElTableColumn } from 'element-plus'
import { WorkContentWrap } from '@/components/ContentWrap'
// import { Search } from '@/components/Search'
import { useTable } from '@/hooks/web/useTable'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { screeningTree } from '@/api/workshop/village/service'
import { getLandInfoApi } from '@/api/workshop/dataQuery/landInfo-service'
import { ParamsType } from '@/api/workshop/dataQuery/landInfo-types'
import { exportTypes } from '../config'

const appStore = useAppStore()
const projectId = appStore.currentProjectId
const tableDataList = ref<any[]>([])
const villageTree = ref<any[]>([])
const loading = ref<boolean>(false)
const emit = defineEmits(['export'])

const { tableObject } = useTable({
  getListApi: getLandInfoApi
})

tableObject.params = {
  projectId
}
const tableColData = ref<any>([
  {
    prop: 'summationAgricultural',
    label: '合计'
  },
  {
    label: '耕地',
    children: [
      {
        prop: 'subtotalPlowland',
        label: '小计'
      },
      {
        prop: 'paddy',
        label: '水田'
      },
      {
        prop: 'dryLand',
        label: '旱地'
      }
    ]
  },
  {
    label: '园地',
    children: [
      {
        prop: 'subtotalGarden',
        label: '小计'
      },
      {
        prop: 'orchard',
        label: '果园'
      },
      {
        prop: 'teaPlantation',
        label: '茶园'
      },
      {
        prop: 'otherGardens',
        label: '其他园地'
      }
    ]
  },
  {
    label: '林地',
    children: [
      {
        prop: 'subtotalWoodlands',
        label: '小计'
      },
      {
        prop: 'arborLand',
        label: '乔木林地'
      },
      {
        prop: 'bambooForestLand',
        label: '竹林地'
      },
      {
        prop: 'bushland',
        label: '灌木林地'
      },
      {
        prop: 'otherWoodlands',
        label: '其他林地'
      }
    ]
  },
  {
    label: '草地',
    children: [
      {
        prop: 'subtotalGrassland',
        label: '小计'
      },
      {
        prop: 'otherGrassland',
        label: '其他草地'
      }
    ]
  },
  {
    label: '交通用地',
    children: [
      {
        prop: 'subtotalTraffic',
        label: '小计'
      },
      {
        prop: 'ruralRoad',
        label: '农村道路'
      }
    ]
  },
  {
    label: '水域及水利设施用地',
    children: [
      {
        prop: 'subtotalWater',
        label: '小计'
      },
      {
        prop: 'pondSurface',
        label: '坑塘水面'
      },
      {
        prop: 'ditch',
        label: '沟渠'
      }
    ]
  },
  {
    label: '其他用地',
    children: [
      {
        prop: 'subtotalOther',
        label: '小计'
      },
      {
        prop: 'fieldRidge',
        label: '田坎'
      },
      {
        prop: 'facilityAgriculturalLand',
        label: '设施农用地'
      }
    ]
  }
])
const tableColBuildData = ref<any>([
  {
    label: '合计',
    prop: 'summationConstruction'
  },
  {
    label: '商服用地',
    children: [
      {
        prop: 'subtotalCommercial',
        label: '小计'
      },
      // {
      //   prop: 'roomNumber0',
      //   label: '零售商业用地'
      // },
      // {
      //   prop: 'liveDays0',
      //   label: '批发市场用地'
      // },
      // {
      //   prop: 'liveDays0',
      //   label: '餐饮用地'
      // },
      // {
      //   prop: 'livePerson0',
      //   label: '旅馆用地'
      // },
      // {
      //   prop: 'roomNumber0',
      //   label: '商务金融用地'
      // },
      // {
      //   prop: 'liveDays0',
      //   label: '娱乐用地'
      // },
      {
        prop: 'otherCommercialLand',
        label: '其他商服用地'
      }
    ]
  },
  {
    label: '工矿仓储用地',
    children: [
      {
        prop: 'subtotalStorage',
        label: '小计'
      },
      // {
      //   prop: 'liveDays0',
      //   label: '采矿用地'
      // },
      // {
      //   prop: 'liveDays0',
      //   label: '盐田'
      // },
      {
        prop: 'storageLand',
        label: '仓储用地'
      },
      {
        prop: 'industrialLand',
        label: '工业用地'
      }
    ]
  },
  {
    label: '住宅用地',
    children: [
      {
        prop: 'subtotalDwelling',
        label: '小计'
      },
      // {
      //   prop: 'roomNumber0',
      //   label: '城镇住宅用地'
      // },
      {
        prop: 'homestead',
        label: '农村宅基地'
      }
    ]
  },
  {
    label: '公共管理与公共服务用地',
    children: [
      {
        prop: 'subtotalPublic',
        label: '小计'
      },
      {
        prop: 'governmentPublicationLand',
        label: '机关团体新闻出版用地'
      },
      // {
      //   prop: 'liveDays0',
      //   label: '新闻出版用地'
      // },
      // {
      //   prop: 'roomNumber0',
      //   label: '教育用地'
      // },
      // {
      //   prop: 'liveDays0',
      //   label: '科研用地'
      // },
      // {
      //   prop: 'roomNumber0',
      //   label: '医疗卫生用地'
      // },
      // {
      //   prop: 'liveDays0',
      //   label: '社会福利用地'
      // },
      // {
      //   prop: 'roomNumber0',
      //   label: '文化设施用地'
      // },
      // {
      //   prop: 'liveDays0',
      //   label: '体育用地'
      // },
      // {
      //   prop: 'roomNumber0',
      //   label: '公园与绿地'
      // },
      {
        prop: 'publicFacilitiesLand',
        label: '公用设施用地'
      }
    ]
  },
  {
    label: '特殊用地',
    children: [
      {
        prop: 'subtotalSpecial',
        label: '小计'
      },
      // {
      //   prop: 'roomNumber0',
      //   label: '军事设施工地'
      // },
      // {
      //   prop: 'liveDays0',
      //   label: '领事馆用地'
      // },
      // {
      //   prop: 'roomNumber0',
      //   label: '监教场所用地'
      // },
      {
        prop: 'specialLand',
        label: '特殊用地'
      }
      // {
      //   prop: 'roomNumber0',
      //   label: '宗教用地'
      // },
      // {
      //   prop: 'liveDays0',
      //   label: '殡葬用地'
      // },
      // {
      //   prop: 'roomNumber0',
      //   label: '风景名胜设施用地'
      // }
    ]
  },
  {
    label: '交通运输用地',
    children: [
      {
        prop: 'subtotalConstructionTraffic',
        label: '小计'
      },
      {
        prop: 'constructionHighway',
        label: '公路用地'
      },
      {
        prop: 'constructionVillageRoad',
        label: '城镇村道路用地'
      },
      {
        prop: 'constructionTransportationService',
        label: '交通服务场站用地'
      }
    ]
  },
  {
    label: '水域及水利设施用地',
    children: [
      {
        prop: 'subtotalConstructionWater',
        label: '小计'
      },
      {
        prop: 'constructionWaterBuildind',
        label: '水工建筑用地'
      }
    ]
  }
])
const tableColNoneData = ref<any>([
  {
    label: '合计',
    prop: 'summationUnused'
  },
  {
    label: '水域及水利设施用地',
    children: [
      {
        prop: 'subtotalUnused',
        label: '小计'
      },
      {
        prop: 'unusedRiver',
        label: '河流水面'
      },
      {
        prop: 'unusedReservoir',
        label: '水库水面'
      },
      {
        prop: 'unusedInland',
        label: '内陆滩涂'
      }
    ]
  }
])
const schema = reactive<CrudSchema[]>([
  {
    field: 'villageCode',
    label: '所属区域',
    search: {
      show: true,
      component: 'TreeSelect',
      componentProps: {
        data: villageTree,
        nodeKey: 'code',
        props: {
          value: 'code',
          label: 'name'
        },
        showCheckbox: false,
        checkStrictly: false,
        checkOnClickNode: false
      }
    },
    table: {
      show: false
    }
  },
  {
    field: 'householdName',
    label: '村集体名称',
    search: {
      show: true,
      component: 'Input',
      componentProps: {
        placeholder: '请输入村集体名称'
      }
    },
    table: {
      show: false
    }
  },
  {
    field: 'type',
    label: '类型',
    search: {
      show: true,
      component: 'Select',
      componentProps: {
        placeholder: '请选择类型',
        options: [
          {
            label: '集体土地',
            value: 'collectiveness'
          },
          {
            label: '国有土地',
            value: 'stateOwned'
          }
        ]
      }
    },
    table: {
      show: false
    }
  }
])

const { allSchemas } = useCrudSchemas(schema)
const objectSpanMethod = ({ rowIndex, columnIndex }: any) => {
  if (columnIndex === 0) {
    if (rowIndex == 6 || rowIndex == 7 || rowIndex == 8) {
      return {
        rowspan: 1,
        colspan: 5
      }
    } else {
      return {
        rowspan: 1,
        colspan: 1
      }
    }
  } else if (columnIndex === 1) {
    if (rowIndex == 6 || rowIndex == 7 || rowIndex == 8) {
      return {
        rowspan: 0,
        colspan: 0
      }
    }
  } else if (columnIndex === 2) {
    if (rowIndex == 6 || rowIndex == 7 || rowIndex == 8) {
      return {
        rowspan: 0,
        colspan: 0
      }
    }
  } else if (columnIndex === 3) {
    if (rowIndex == 6 || rowIndex == 7 || rowIndex == 8) {
      return {
        rowspan: 0,
        colspan: 0
      }
    }
  } else if (columnIndex === 4) {
    if (rowIndex == 6 || rowIndex == 7 || rowIndex == 8) {
      return {
        rowspan: 0,
        colspan: 0
      }
    }
  }
}
/**
 * 计算 table 的高度
 * @param arr 当前 table 的数据
 */
const getHeight = (arr: any) => {
  if (arr.length === 0) {
    return 150
  } else if (arr.length > 9) {
    return 500
  } else {
    return 'auto'
  }
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

/**
 * 获取表格数据
 * @param params 查询参数
 * villageCode 所属区域 code
 * householdName 村集体名称
 */
const getTableList = (params: ParamsType) => {
  loading.value = true
  getLandInfoApi(params)
    .then((res: any) => {
      if (res) {
        tableDataList.value = res
        console.log(tableDataList.value, '111111111111111')
        // tableDataList.value = [
        //   {
        //     gardenPlot: '集体',
        //     forestLand: 10,
        //     livePerson: 5,
        //     livePerson0: 1,
        //     roomNumber0: 2,
        //     liveDays0: 3
        //   },
        //   {
        //     gardenPlot: '集体',
        //     forestLand: 10,
        //     livePerson: 5,
        //     livePerson0: 1,
        //     roomNumber0: 2,
        //     liveDays0: 3
        //   },
        //   {
        //     gardenPlot: '集体',
        //     forestLand: 10,
        //     livePerson: 5,
        //     livePerson0: 1,
        //     roomNumber0: 2,
        //     liveDays0: 3
        //   },
        //   {
        //     gardenPlot: '集体',
        //     forestLand: 10,
        //     livePerson: 5,
        //     livePerson0: 1,
        //     roomNumber0: 2,
        //     liveDays0: 3
        //   },
        //   {
        //     gardenPlot: '国有',
        //     forestLand: 10,
        //     livePerson: 5,
        //     livePerson0: 1,
        //     roomNumber0: 2,
        //     liveDays0: 3
        //   },
        //   {
        //     gardenPlot: '集体',
        //     forestLand: 10,
        //     livePerson: 5,
        //     livePerson0: 1,
        //     roomNumber0: 2,
        //     liveDays0: 3
        //   }
        // ]
        let result = tableDataList.value.reduce((total, value, index, arr) => {
          if (arr[index].landType == '5') {
            for (let i in tableDataList.value[0]) {
              total[i] = value[i] + (total[i] ? total[i] : 0)
            }
          }
          return total
        }, [])
        let result1 = tableDataList.value.reduce((total, value, index, arr) => {
          if (arr[index].landType == '4') {
            for (let i in tableDataList.value[0]) {
              total[i] = value[i] + (total[i] ? total[i] : 0)
            }
          }
          return total
        }, [])
        let result2 = tableDataList.value.reduce((total, value) => {
          for (let i in tableDataList.value[0]) {
            total[i] = value[i] + (total[i] ? total[i] : 0)
          }
          return total
        }, [])

        tableDataList.value.push(result, result1, result2)
        tableDataList.value.forEach((item, index) => {
          if (index == tableDataList.value.length - 3) {
            item.householdName = '集体总计'
          } else if (index == tableDataList.value.length - 2) {
            item.householdName = '国有总计'
          } else if (index == tableDataList.value.length - 1) {
            item.householdName = '总计'
          }
        })
        console.log(result, result1, result2, '11111111111111111')
      }
    })
    .finally(() => {
      loading.value = false
    })
}

// const onSearch = (data) => {
//   // 处理参数
//   let params = {
//     ...data
//   }

//   // 需要重置一次params
//   tableObject.params = {
//     projectId
//   }
//   if (!params.householdName) {
//     delete params.householdName
//   }
//   if (!params.type) {
//     delete params.type
//   }
//   if (params.villageCode) {
//     // 拿到对应的参数key
//     findRecursion(villageTree.value, params.villageCode, (item) => {
//       if (item) {
//         params[getParamsKey(item.districtType)] = params.villageCode
//       }
//       getTableList({ ...params })
//     })
//   } else {
//     delete params.villageCode
//     getTableList({ ...params })
//   }
// }

// 重置
// const resetSearch = () => {
//   getTableList({})
// }

// 数据导出
const onExport = () => {
  emit('export', villageTree.value, exportTypes.ground)
}

// 获取所属区域数据(行政村列表)
const getVillageTree = async () => {
  const list = await screeningTree(projectId, 'adminVillage')
  villageTree.value = list || []
  return list || []
}

// 递归查找
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

onMounted(() => {
  getVillageTree()
  getTableList({})
})
</script>
<style lang="less" scoped>
.search-form-wrap {
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bolder;
}

.table-wrap {
  margin-top: 0;
}

.line {
  width: 100%;
  height: 10px;
  background-color: #e7edfd;
}
</style>
