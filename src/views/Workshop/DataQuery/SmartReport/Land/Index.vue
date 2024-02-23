<template>
  <WorkContentWrap>
    <MigrateCrumb :titles="titles" />
    <div class="table-wrap" v-loading="loading">
      <div class="flex items-center justify-between pb-12px">
        <div class="table-left-title">土地信息统计表</div>
        <ElButton type="primary" @click="onExport"> 数据导出 </ElButton>
      </div>
      <el-table
        :data="tableDataList"
        border
        style="width: 100%; min-height: 700px"
        :span-method="objectSpanMethod"
        show-summary
        height="700"
      >
        <el-table-column
          prop="locationType"
          label="功能区"
          show-overflow-tooltip
          align="center"
          header-align="center"
        />
        <el-table-column
          prop="plotNo"
          label="地块号"
          show-overflow-tooltip
          align="center"
          header-align="center"
        />
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
          <template #default="{ row }">{{
            row.landType == '5' ? '集体' : row.landType == '4' ? '国家' : '-'
          }}</template>
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
import { ref, onMounted } from 'vue'
import { useAppStore } from '@/store/modules/app'
import { ElTable, ElTableColumn, ElButton } from 'element-plus'
import { WorkContentWrap } from '@/components/ContentWrap'
import { useTable } from '@/hooks/web/useTable'
import { screeningTree } from '@/api/workshop/village/service'
import { getLandInfoApi, exportReportApi } from '@/api/workshop/dataQuery/landInfo-service'
import { ParamsType } from '@/api/workshop/dataQuery/landInfo-types'
import MigrateCrumb from '@/views/Workshop/AchievementsReport/components/MigrateCrumb.vue'

const appStore = useAppStore()
const projectId = appStore.currentProjectId
const tableDataList = ref<any[]>([])
const villageTree = ref<any[]>([])
const loading = ref<boolean>(false)
const emit = defineEmits(['export'])
const titles = ['智能报表', '实物成果', '土地', '土地信息']
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
      {
        prop: 'specialLand',
        label: '特殊用地'
      }
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

const objectSpanMethod = ({ rowIndex, columnIndex }: any) => {
  if (columnIndex === 1) {
    if (rowIndex == 29 || rowIndex == 30 || rowIndex == 31) {
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
  } else if (columnIndex === 0) {
    if (rowIndex == 29 || rowIndex == 30 || rowIndex == 31) {
      return {
        rowspan: 0,
        colspan: 0
      }
    }
  } else if (columnIndex === 2) {
    if (rowIndex == 29 || rowIndex == 30 || rowIndex == 31) {
      return {
        rowspan: 0,
        colspan: 0
      }
    }
  } else if (columnIndex === 3) {
    if (rowIndex == 29 || rowIndex == 30 || rowIndex == 31) {
      return {
        rowspan: 0,
        colspan: 0
      }
    }
  } else if (columnIndex === 4) {
    if (rowIndex == 29 || rowIndex == 30 || rowIndex == 31) {
      return {
        rowspan: 0,
        colspan: 0
      }
    }
  }
}

// // 合计
// const getSummaries = (params: any) => {
//   const { columns, data } = params
//   const sums: string[] = []
//   columns.forEach((column, index) => {
//     if (index === 0) {
//       sums[index] = '合计'
//       return
//     }
//     if (index < 5) {
//       sums[index] = ''
//       return
//     }
//     const values = data.map((item) => Number(item[column.property]))
//     if (!values.every((value) => Number.isNaN(value))) {
//       sums[index] = `${values.reduce((prev, curr) => {
//         const value = Number(curr)
//         if (!Number.isNaN(value)) {
//           return (prev + curr).toFixed(2)
//         } else {
//           return prev.toFixed(2)
//         }
//       }, 0)}`
//     }
//   })

//   return sums
// }

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
        let result = tableDataList.value.reduce((total, value, index, arr) => {
          if (arr[index].landType == '5') {
            for (let i in tableDataList.value[0]) {
              total[i] = value[i] + (total[i] ? total[i] : 0)
            }
          }
          const resultTotal = total.fixed(2)
          return resultTotal
        }, {})
        let result1 = tableDataList.value.reduce((total, value, index, arr) => {
          if (arr[index].landType == '4') {
            for (let i in tableDataList.value[0]) {
              total[i] = value[i] + (total[i] ? total[i] : 0)
            }
          }
          const resultTotal = total.fixed(2)
          return resultTotal
        }, {})
        let result2 = tableDataList.value.reduce((total, value) => {
          for (let i in tableDataList.value[0]) {
            total[i] = value[i] + (total[i] ? total[i] : 0)
          }
          const resultTotal = total.fixed(2)
          return resultTotal
        }, {})

        tableDataList.value.push(result, result1, result2)
        tableDataList.value.forEach((item, index) => {
          if (index == tableDataList.value.length - 3) {
            item.plotNo = '集体总计'
            item.companyName = ''
            item.town = ''
            item.plowland = ''
            item.landType = ''
          } else if (index == tableDataList.value.length - 2) {
            item.plotNo = '国有总计'
            item.companyName = ''
            item.town = ''
            item.plowland = ''
            item.landType = ''
          } else if (index == tableDataList.value.length - 1) {
            item.plotNo = '总计'
            item.companyName = ''
            item.town = ''
            item.plowland = ''
            item.landType = ''
          }
        })
      }
    })
    .finally(() => {
      loading.value = false
    })
}

// 获取所属区域数据(行政村列表)
const getVillageTree = async () => {
  const list = await screeningTree(projectId, 'adminVillage')
  villageTree.value = list || []
  return list || []
}

const onExport = async () => {
  const res = await exportReportApi({})
  let filename = res.headers
  filename = filename['content-disposition']
  filename = filename.split(';')[1].split('filename=')[1]
  filename = decodeURIComponent(filename)
  let elink = document.createElement('a')
  document.body.appendChild(elink)
  elink.style.display = 'none'
  elink.download = filename
  let blob = new Blob([res.data])
  const URL = window.URL || window.webkitURL
  elink.href = URL.createObjectURL(blob)
  elink.click()
  document.body.removeChild(elink)
  URL.revokeObjectURL(elink.href)
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
