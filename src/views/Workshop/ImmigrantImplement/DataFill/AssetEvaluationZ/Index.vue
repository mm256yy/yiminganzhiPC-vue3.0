<template>
  <WorkContentWrap>
    <!-- 只征地不搬迁 -- 资产评估 -->
    <div class="table-wrap !py-12px !mt-0px">
      <div class="center">
        <div>镜岭水库青苗评估汇总表</div>
      </div>
      <div>
        使用权人{{ householder }}，属坝址周边村只征地不搬迁农户及单位，青苗评估共有{{
          lengths?.length
        }}个地块，面积{{ areaNumber?.toFixed(2) }}㎡，株数{{ plantsNumber }}株，金额{{ price }}元。
      </div>
      <div>详见地块明细如下:</div>
      <div class="table-wrap">
        <Table
          selection
          :data="tableObject"
          :columns="allSchemas.tableColumns"
          row-key="id"
          headerAlign="center"
          align="center"
          highlightCurrentRow
        />
      </div>
      <div class="flex"> <span>评估单位： </span><span>评估人员：</span></div>
    </div>
    <!-- <div v-else class="table-wrap !py-12px !mt-0px no-data"
      >该户资产评估还未完成，无法查看评估报告!</div
    > -->
  </WorkContentWrap>
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted, toRaw, watch, nextTick } from 'vue'
import { useAppStore } from '@/store/modules/app'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { Table } from '@/components/Table'
import { findLandAppendantList } from '@/api/AssetEvaluation/gird-service'
import { WorkContentWrap } from '@/components/ContentWrap'
const props = defineProps<PropsType>()
interface PropsType {
  doorNo: string
  baseInfo: any
}
const tableObject = ref<any>()
let data = reactive<any>([])
let lengths = ref<any>()
let areaNumber = ref<any>()
let plantsNumber = ref<any>()
let price = ref<any>()
let householder = ref<any>()
const appStore = useAppStore()
const projectId = appStore.currentProjectId
const schema = reactive<CrudSchema[]>([
  // table字段 分割
  {
    field: 'index',
    type: 'index',
    label: '序号',
    search: {
      show: false
    }
  },
  {
    field: 'rightHolder',
    label: '使用权人',
    search: {
      show: false
    }
  },
  {
    field: 'sheetNumber',
    label: '图幅号',
    width: 180,
    search: {
      show: false
    }
  },
  {
    field: 'landNumber',
    label: '编号',
    search: {
      show: false
    }
  },
  {
    field: 'landName',
    label: '地名',
    width: 190,
    search: {
      show: false
    }
  },
  {
    field: 'householder',
    label: '青苗户主',
    search: {
      show: false
    }
  },
  {
    field: 'breed',
    label: '品种',
    search: {
      show: false
    }
  },
  {
    field: 'shapeArea',
    label: '面积',
    search: {
      show: false
    }
  },
  {
    field: 'number',
    label: '株数',
    search: {
      show: false
    }
  },
  {
    field: 'compensationAmount',
    label: '金额',
    search: {
      show: false
    }
  },
  {
    field: 'remark',
    label: '备注',
    search: {
      show: false
    }
  }
])

const { allSchemas } = useCrudSchemas(schema)
const requestList = async () => {
  const list = await findLandAppendantList({
    projectId,
    status: 'implementation',
    doorNo: props.doorNo
  })
  tableObject.value = list
}
watch(
  () => tableObject.value,
  (val) => {
    data = toRaw(val)
    lengths.value = [...new Map(data?.map((item) => [item.landNumber, item])).values()]
    let arr = data?.filter((obj, index, self) => {
      return self.findIndex((o) => o.landNumber == obj.landNumber) == index
    })
    areaNumber.value = arr?.reduce(
      (accumulator, currentValue) => accumulator + currentValue.shapeArea,
      0
    )
    plantsNumber.value = data?.reduce(
      (accumulator, currentValue) => accumulator + currentValue.number,
      0
    )
    price.value = data?.reduce(
      (accumulator, currentValue) => accumulator + currentValue.compensationAmount,
      0
    )
    householder.value = data ? data[0].householder : '-'
  },
  {
    immediate: true,
    deep: true
  }
)

onMounted(() => {
  requestList()
})
</script>
<style lang="less" scoped>
.center {
  display: flex;
  font-size: 26px;
  font-weight: bold;
  color: #333;
  justify-content: center;
}

.flex {
  display: flex;
  justify-content: space-between;
}

.no-data {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 200px;
  font-size: 15px;
}
</style>
