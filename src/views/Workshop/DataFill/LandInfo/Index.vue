<template>
  <WorkContentWrap>
    <div class="table-wrap !py-12px !mt-0px" v-loading="loading">
      <div class="flex items-center justify-between pb-12px">
        <div> </div>
        <ElSpace>
          <ElButton :icon="addIcon" type="primary" :loading="loading" @click="onSave">
            保存
          </ElButton>
        </ElSpace>
      </div>
      <ElTable :data="tableList" highlightCurrentRow>
        <ElTableColumn
          label="地类(单位)"
          prop="landTypeText"
          align="center"
          header-align="center"
        />
        <ElTableColumn label="国有土地面积" prop="gylandArea" align="center" header-align="center">
          <template #default="{ row }">
            <ElInputNumber :min="0" v-model="row.gylandArea" :precision="2" />
          </template>
        </ElTableColumn>
        <ElTableColumn label="集体土地面积" prop="jtlandArea" align="center" header-align="center">
          <template #default="{ row }">
            <ElInputNumber :min="0" v-model="row.jtlandArea" :precision="2" />
          </template>
        </ElTableColumn>
        <ElTableColumn label="合计" prop="" align="center" header-align="center">
          <template #default="{ row }">
            <span>{{ computedTotal(row.gylandArea, row.jtlandArea) }}</span>
          </template>
        </ElTableColumn>
      </ElTable>
    </div>
  </WorkContentWrap>
</template>

<script lang="ts" setup>
import { WorkContentWrap } from '@/components/ContentWrap'
import { ref } from 'vue'
import { ElTable, ElTableColumn, ElInputNumber, ElButton, ElSpace, ElMessage } from 'element-plus'
import { useIcon } from '@/hooks/web/useIcon'
import {
  getLandInfoDetailtApi,
  saveLandInfoListApi
} from '@/api/workshop/datafill/landInfo-service'

import { LandInfoListType } from '@/api/workshop/datafill/landInfo-types'

interface PropsType {
  doorNo: string
  status: string
}

const props = defineProps<PropsType>()
const addIcon = useIcon({ icon: 'ant-design:plus-outlined' })
const tableList = ref<LandInfoListType[]>([])
const loading = ref<boolean>(false)

const landType = [
  {
    label: '耕地（亩）',
    props: 'plowland'
  },
  {
    label: '园地（亩）',
    props: 'gardenPlot'
  },
  {
    label: '林地（亩）',
    props: 'forestLand'
  },
  {
    label: '交通运输用地（亩）',
    props: 'trafficLand'
  },
  {
    label: '水域及水利设施用地（亩）',
    props: 'watersLand'
  },
  {
    label: '草地（亩）',
    props: 'meadow'
  },
  {
    label: '商业服务业设施用地（亩）',
    props: 'commerceLand'
  },
  {
    label: '工矿用地（亩）',
    props: 'mineLand'
  },
  {
    label: '住宅用地（亩）',
    props: 'dwellingLand'
  },
  {
    label: '公共管理与公共服务用地（亩）',
    props: 'serviceLand'
  },
  {
    label: '公用设施用地（亩）',
    props: 'facilityLand'
  },
  {
    label: '特殊用地（亩）',
    props: 'specialLand'
  }
]

const getList = () => {
  getLandInfoDetailtApi({ doorNo: props.doorNo, status: props.status }).then((res) => {
    if (res && res.length) {
      genNewArr(res)
    }
  })
}

getList()

/**
 * 生成一个新的数组
 * @param arr 原数组
 */
const genNewArr = (arr: any) => {
  let newArr: any = []
  landType.map((item: any, index: number) => {
    arr?.map((data: any) => {
      if (data.type === 'collectiveness') {
        newArr[index] = {
          collectiveId: data.id,
          collectiveUid: data.uid,
          collectiveType: data.type,
          doorNo: data.doorNo,
          householdId: data.householdId,
          projectId: data.projectId,
          status: data.status,
          landTypeText: item.label,
          jtlandArea: data[item.props]
        }
      } else if (data.type === 'stateOwned') {
        newArr[index] = {
          ...newArr[index],
          ownedId: data.id,
          ownedUid: data.uid,
          ownedType: data.type,
          gylandArea: data[item.props]
        }
      }
    })
  })
  tableList.value = [...newArr]
}

/**
 * 土地面积合计
 * @param gylandArea 国有土地面积
 * @param jtlandArea 集体土地面积
 */
const computedTotal = (gylandArea: number, jtlandArea: number) => {
  gylandArea = gylandArea ? gylandArea : 0
  jtlandArea = jtlandArea ? jtlandArea : 0
  return Number(gylandArea) + Number(jtlandArea)
}

// 生成需要提交的参数
const genSubmitParams = async () => {
  let obj1: any = {}
  let obj2: any = {}
  let arr: any = []
  tableList.value?.map((item: any, index: number) => {
    if (item.landTypeText === landType[index].label) {
      obj1[landType[index].props] = item.jtlandArea
      obj1.id = item.collectiveId
      obj1.doorNo = item.doorNo
      obj1.uid = item.collectiveUid
      obj1.status = item.status
      obj1.type = item.collectiveType
      obj1.projectId = item.projectId
      obj1.householdId = item.householdId

      obj2[landType[index].props] = item.gylandArea
      obj2.id = item.ownedId
      obj2.doorNo = item.doorNo
      obj2.uid = item.ownedUid
      obj2.status = item.status
      obj2.type = item.ownedType
      obj2.projectId = item.projectId
      obj2.householdId = item.householdId
    }
  })
  arr.push(obj1, obj2)
  tableList.value = [...arr]
}

// 保存
const onSave = async () => {
  loading.value = true
  await genSubmitParams()
  saveLandInfoListApi(tableList.value)
    .then(() => {
      loading.value = false
      ElMessage.success('保存成功！')
      getList()
    })
    .catch(() => {
      loading.value = false
    })
}
</script>

<style lang="less" scoped>
:deep(.el-pagination) {
  display: none;
}
</style>
