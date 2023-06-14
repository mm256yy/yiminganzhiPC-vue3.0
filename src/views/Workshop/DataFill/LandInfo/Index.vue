<template>
  <WorkContentWrap>
    <div class="table-wrap !py-12px !mt-0px">
      <div class="flex items-center justify-between pb-12px">
        <div> </div>
        <ElSpace>
          <ElButton :icon="addIcon" type="primary" :loading="loading" @click="onSave"
            >保存</ElButton
          >
        </ElSpace>
      </div>
      <Table
        :data="tableList"
        :columns="schema"
        row-key="id"
        headerAlign="center"
        align="center"
        highlightCurrentRow
      >
        <template #gylandArea="{ row }">
          <span v-if="row.type === 'stateOwned'">{{ row[row.props] }}</span>
          <span v-else></span>
        </template>
        <template #jtlandArea="{ row }">
          <span v-if="row.type === 'collectiveness'">{{ row[row.props] }}</span>
          <span v-else></span>
        </template>
        <template #total="{ row }">
          <span>{{ row[row.props] }}</span>
        </template>
      </Table>
    </div>
  </WorkContentWrap>
</template>

<script lang="ts" setup>
import { WorkContentWrap } from '@/components/ContentWrap'
import { reactive, ref } from 'vue'
import { ElButton, ElSpace, ElMessage } from 'element-plus'
import { Table } from '@/components/Table'
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
    tableList.value = res
    tableList.value?.forEach((item, index) => {
      item.landTypeText = landType[index].label
      item.objprops = landType[index].props
    })
  })
}
getList()
const schema = reactive([
  {
    field: 'landTypeText',
    label: '地类(单位)',
    search: {
      show: false
    }
  },
  {
    field: 'gylandArea',
    label: '国有土地面积',
    search: {
      show: false
    }
  },
  {
    field: 'jtlandArea',
    label: '集体土地面积',
    search: {
      show: false
    }
  },
  {
    field: 'total',
    label: '合计',
    search: {
      show: false
    }
  }
])

let loading = ref(false)

const onSave = async () => {
  loading.value = true
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
