<template>
  <div class="homestead-wrap">
    <div class="common-form-item">
      <div class="common-label">宅基地安置人数：</div>
      <div class="common-value">
        <div class="value-center">
          <span v-if="baseInfo.familyNum">{{ baseInfo.familyNum }}人，</span>
          <span v-if="baseInfo.ruralMigrantNum"
            >其中该户农村移民 ：{{ baseInfo.ruralMigrantNum }} 人，</span
          >
          <span v-if="baseInfo.unruralMigrantNum"
            >非农移民：{{ baseInfo.unruralMigrantNum }}人，</span
          >
          <!-- <span v-if="baseInfo.farmingMigrantNum"
            >农业移民：{{ baseInfo.farmingMigrantNum }}人，</span
          > -->
          <span v-if="baseInfo.farmingMigrantNum"
            >农业随迁： {{ baseInfo.farmingMigrantNum }}人，</span
          >
          <span v-if="baseInfo.unfarmingMigrantNum"
            >非农业随迁：{{ baseInfo.unfarmingMigrantNum }}人，</span
          >
          <span v-if="baseInfo.addPopulationNum"
            >增计人口数：{{ baseInfo.addPopulationNum }}人，</span
          >
          <span v-if="baseInfo.otherPopulationNum"
            >其他人口数：{{ baseInfo.otherPopulationNum }}人，</span
          >
          <span v-if="baseInfo.propertyNum">财产户人数：{{ baseInfo.propertyNum }}人</span>
        </div>
      </div>
    </div>

    <div class="common-form-item">
      <div class="common-label">可选安置点：</div>
      <div class="common-value">
        <el-radio-group v-model="settleAddress">
          <el-radio
            :label="item.code"
            size="large"
            v-for="item in settleAddressList"
            :key="item.id"
          >
            {{ item.name }}
          </el-radio>
        </el-radio-group>
        <div class="blue-row">
          <div
            class="blue-view"
            v-for="item in settleAddressList"
            :key="item.id"
            @click="viewAreaDetail(Number(item.id))"
          >
            地块详情
          </div>
        </div>
      </div>
    </div>

    <div class="common-form-item">
      <div class="common-label">可选安置面积：</div>
      <div class="common-value">
        <el-radio-group v-model="areaType">
          <el-radio
            size="large"
            v-for="item in areaSizeArray"
            :key="item.id"
            :label="item.id"
            :disabled="item.disabled"
            >{{ item.name }}{{ item.unit }}</el-radio
          >
        </el-radio-group>
      </div>
    </div>

    <div class="btn-wrap">
      <div class="btn" @click="submitResettle">
        {{ fromResettleConfirm ? '确定' : '确定，进入下一步' }}
      </div>
    </div>

    <el-dialog v-model="areaDetailPup" title="安置点详情" width="900">
      <AreaDetail :placementPointInfo="placementPointInfo" ref="AreaDetailRef" />
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch, nextTick, onMounted } from 'vue'
import { ElRadioGroup, ElRadio, ElDialog } from 'element-plus'
import { homesteadAreaSize, HouseType } from '../../config'
import AreaDetail from './AreaDetail.vue'
import { useAppStore } from '@/store/modules/app'
import {
  getPlacementPointListApi,
  getPlacementPointByIdApi
} from '@/api/systemConfig/placementPoint-service'

import type { PlacementPointDtoType } from '@/api/systemConfig/placementPoint-types'
import { toNumber } from 'lodash-es'

interface PropsType {
  baseInfo: any
  doorNo: string
  immigrantSettle: any
  fromResettleConfirm?: boolean
  dataList?: any
}

const emit = defineEmits(['submit'])
const props = defineProps<PropsType>()
const areaDetailPup = ref(false)
const settleAddress = ref(1)
const AreaDetailRef: any = ref(null)
const areaType = ref('1')
const appStore = useAppStore()
const settleAddressList = ref<PlacementPointDtoType[]>([])

const getSettleAddressList = async () => {
  const params = {
    projectId: appStore.getCurrentProjectId,
    status: 'implementation',
    type: '1',
    size: 9999,
    page: 0
  }
  try {
    const result = await getPlacementPointListApi(params)
    settleAddressList.value = result.content
    console.log(settleAddressList.value, '测试数据')
  } catch {}
}

watch(
  () => props.immigrantSettle,
  (val) => {
    if (val) {
      console.log(val, 'kks')
      console.log(props.dataList, '测试数据', 'kks')
      if (props.dataList) {
        areaType.value = props.dataList.areaType
        settleAddress.value = val.settleAddress
      } else {
        // getSettleAddressList()
        const { areaType: area, settleAddressCode, settleAddress: settleAddresss } = val
        areaType.value = area
        settleAddress.value = settleAddressCode ? settleAddressCode : val.settleAddress
        // settleAddressList.value.find((item) => item.name == settleAddresss).code
        console.log(settleAddress.value, '测试呀')
      }
      console.log(settleAddress.value, 'kks', val)
    }
  },
  {
    deep: true,
    immediate: true
  }
)

const areaSizeArray = computed(() => {
  const len = props.baseInfo.familyNum
  const sizeArray = homesteadAreaSize.map((item) => {
    if (len >= item.needPeopleNumber) {
      item.disabled = false
    } else {
      item.disabled = true
    }
    return item
  })
  console.log(sizeArray, 'sizeArray')
  return sizeArray
})
const placementPointInfo = ref({})
const viewAreaDetail = async (id: number) => {
  const res = await getPlacementPointByIdApi(id)
  placementPointInfo.value = res as any
  areaDetailPup.value = true
  nextTick(() => {
    AreaDetailRef.value.init()
  })
}

const submitResettle = async () => {
  const params: any = {
    houseAreaType: HouseType.homestead,
    doorNo: props.doorNo,
    settleAddress: settleAddress.value,
    areaType: areaType.value
  }
  if (props.immigrantSettle && props.immigrantSettle.id) {
    params.id = props.immigrantSettle.id
  }
  emit('submit', params)
}

onMounted(() => {
  getSettleAddressList()
})
</script>

<style lang="less" scoped>
.common-form-item {
  display: flex;
  align-items: center;
  padding: 22px 0;
  border-bottom: 1px dotted #ebebeb;

  .common-label {
    width: 140px;
    font-size: 14px;
    line-height: 32px;
    color: #131313;
    text-align: right;
  }

  .common-value {
    flex: 1;
    font-size: 14px;
    color: #131313;
  }

  .blue-row {
    display: flex;
    align-items: center;

    .blue-view {
      width: 130px;
      padding-left: 20px;
      line-height: 16px;
      color: #3e73ec;
      cursor: pointer;
      user-select: none;
    }
  }
}

.btn-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;

  .btn {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 40px;
    padding: 0 26px;
    font-size: 16px;
    font-weight: 500;
    color: #ffffff;
    cursor: pointer;
    background: #3e73ec;
    border-radius: 4px 4px 4px 4px;
    user-select: none;
  }
}

:deep(.el-dialog__body) {
  padding: 0 0 35px;
}
</style>
