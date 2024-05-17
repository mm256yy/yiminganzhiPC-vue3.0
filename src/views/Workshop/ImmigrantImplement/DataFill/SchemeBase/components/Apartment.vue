<template>
  <div class="apartment-wrap">
    <div class="common-form-item">
      <div class="common-label flex-center">公寓房安置人数：</div>
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
      <div class="common-label">可安置建筑面积：</div>
      <div class="common-value">
        <div class="value-center">{{ baseInfo.familyNum * 40 }}㎡ </div>
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
            :key="item.id * 1"
          >
            {{ item.name }}
          </el-radio>
        </el-radio-group>
        <div class="blue-row">
          <div
            class="blue-view"
            v-for="item in settleAddressList"
            :key="item.id"
            @click="viewAreaDetail(item.id)"
          >
            地块详情
          </div>
        </div>
      </div>
    </div>

    <div class="common-form-item" v-if="!props.fromResettleConfirm">
      <div class="common-label">推荐方案：</div>
      <div class="common-value">
        <div class="plan-table-wrap">
          <table>
            <!-- 第一行 -->
            <tr class="head-tr">
              <td colspan="2" class="column-w1 bold">搬迁安置</td>
              <td class="column-w3" v-for="(item, index) in tableData" :key="item.id">
                <div class="plan-tit" :class="{ active: item.isSelected }">
                  方案{{ index + 1 }}
                </div>
              </td>
            </tr>

            <tr>
              <td rowspan="4" class="column-w1 bold">套数</td>
              <td class="column-w2">70</td>
              <td class="column-w3" v-for="item in tableData" :key="item.id">
                {{ item.typeOneNum }}
              </td>
            </tr>

            <tr>
              <td class="column-w2">90</td>
              <td class="column-w3" v-for="item in tableData" :key="item.id">
                {{ item.typeTwoNum }}
              </td>
            </tr>

            <tr>
              <td class="column-w2">110</td>
              <td class="column-w3" v-for="item in tableData" :key="item.id">
                {{ item.typeThreeNum }}
              </td>
            </tr>

            <tr>
              <td class="column-w2">130</td>
              <td class="column-w3" v-for="item in tableData" :key="item.id">
                {{ item.typeFourNum }}
              </td>
            </tr>

            <tr>
              <td class="column-w1 bold" colspan="2">购房总面积</td>
              <td class="column-w3" v-for="item in tableData" :key="item.id">
                {{ item.areaTotal }}
              </td>
            </tr>

            <tr>
              <td class="column-w1" rowspan="3">金额</td>
              <td class="column-w2">购房金额估算</td>
              <td class="column-w3" v-for="item in tableData" :key="item.id">
                <div class="flex-center-center pointer" @click="viewBuyHouseClick(item.id)">
                  {{ item.preorderAmount }}
                  <Icon icon="ant-design:question-circle-filled" color="#DCDFE6" />
                </div>
              </td>
            </tr>

            <tr>
              <td class="column-w2">补偿补助估算</td>
              <td class="column-w3" v-for="item in tableData" :key="item.id">
                <div class="flex-center-center pointer" @click="viewSubsidyClick(item.id)">
                  {{ item.compensationAmount }}
                  <Icon icon="ant-design:question-circle-filled" color="#DCDFE6" />
                </div>
              </td>
            </tr>

            <tr>
              <td class="column-w2">差额</td>
              <td class="column-w3" v-for="item in tableData" :key="item.id">
                {{ item.differenceAmount }}
              </td>
            </tr>

            <tr>
              <td class="column-w1 bold" colspan="2">确定方案</td>
              <td class="column-w3" v-for="item in tableData" :key="item.type">
                <div
                  class="select-btn"
                  :class="{ active: item.isSelected }"
                  @click="selectPlan(item.type, item)"
                >
                  <div class="icon" v-if="!item.isSelected"></div>
                  <Icon v-else icon="ant-design:check-circle-filled" size="16" color="#3E73EC" />
                  <div class="txt">选择该方案</div>
                </div>
              </td>
            </tr>
          </table>
        </div>
      </div>
    </div>

    <div class="common-form-item">
      <div class="common-label">可选户型：</div>
      <div class="common-value">
        <div class="area-size">
          <div class="area-size-item" v-for="item in areaSize" :key="item.id">
            <div class="name"> {{ item.name }}{{ item.unit }} </div>
            <div class="ipt-wrap">
              <el-input-number v-model="item.num" :min="0" :max="100" />&nbsp;间
            </div>
            <div class="blue-row" @click="viewHousePicClick(item.id)">
              <div class="blue-view">户型详情</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="common-form-item">
      <div class="common-label">选定户型及数量：</div>
      <div class="common-value">
        <div class="info-item">
          根据您输入的安置人数：
          <span class="red">{{ baseInfo.familyNum }}</span> 人，选购总面积为：
          <span class="red">{{ totalArea }}</span> m²
        </div>

        <div class="info-item">
          选择选定户型为：
          <template v-for="item in areaSize" :key="item.id">
            <template v-if="item.num > 0">
              <span class="red">{{ item.name }}</span> {{ item.unit }}
              <span class="red">{{ item.num }}</span> 套
              <span>，</span>
            </template>
          </template>
        </div>

        <div class="info-item">
          剩余面积： <span class="red">{{ residueArea }}</span> ㎡ 超出面积：
          <span class="red">{{ exceedArea }}</span> m²
        </div>

        <div class="info-item">
          购房金额估算： <span class="red">{{ exceedArea * 1500 }}</span> 元
        </div>

        <div class="info-item"> 购房总金额=选购总面积“成本价+超出面积"市场优惠价 </div>
      </div>
    </div>

    <div class="common-form-item">
      <div class="common-label">说明：</div>
      <div class="common-value">
        <div class="desc-item">
          1、公寓房以户为单位按人口数安排建筑面积，标准为每人 40 平方米；
        </div>

        <div class="desc-item"> 2、仅选购一套公寓房的，可就近上靠一档选定房型; </div>

        <div class="desc-item">
          3、如需选购多套公寓房的，在扣除已购公寓房面积后的剩余购买面积达到公寓房型的一半面积以上时，才允许满套选购;
        </div>

        <div class="desc-item">
          4、实际选购面积在安排面积内以综合成本价购买，超出安排面积的部分以市场优惠价购买。
        </div>
      </div>
    </div>

    <div class="btn-wrap">
      <div class="btn" @click="submitResettle">
        {{ fromResettleConfirm ? '确定' : '确定，进入下一步' }}
      </div>
    </div>

    <el-dialog class="detail-pup" v-model="areaDetailPup" title="安置点详情" width="900">
      <AreaDetail :placementPointInfo="placementPointInfo" ref="AreaDetailRef" />
    </el-dialog>

    <el-dialog v-model="housePicPup" title="户型图" width="900">
      <HousePic />
    </el-dialog>

    <el-dialog v-model="pricePup" title="补偿补助金额估算" width="800">
      <FindSelf view-type="pup" />
    </el-dialog>

    <el-dialog v-model="buyHousePup" title="购房金额估算" width="800">
      <BuyHousePrice />
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import { ElRadioGroup, ElRadio, ElInputNumber, ElDialog, ElMessage } from 'element-plus'
import { getBestResettlePlanApi } from '@/api/workshop/datafill/mockResettle-service'

import { apartmentAreaSize, HouseType } from '../../config'
import AreaDetail from './AreaDetail.vue'
import HousePic from './HousePic.vue'
import FindSelf from './FindSelf.vue'
import BuyHousePrice from './BuyHousePrice.vue'
import type { PlacementPointDtoType } from '@/api/systemConfig/placementPoint-types'
import { useAppStore } from '@/store/modules/app'

import {
  getPlacementPointListApi,
  getPlacementPointByIdApi
} from '@/api/systemConfig/placementPoint-service'

interface PropsType {
  doorNo: string
  baseInfo: any
  immigrantSettle: any
  fromResettleConfirm?: boolean
}

const emit = defineEmits(['submit'])
const props = defineProps<PropsType>()
const settleAddress = ref(1)
const areaSize = ref(apartmentAreaSize)
const AreaDetailRef: any = ref(null)
const areaDetailPup = ref(false)
const housePicPup = ref(false)
const pricePup = ref(false)
const buyHousePup = ref(false)

// 方案数据
const tableData = ref<any>([])
const appStore = useAppStore()
const settleAddressList = ref<PlacementPointDtoType[]>([])

const getSettleAddressList = async () => {
  const params = {
    projectId: appStore.getCurrentProjectId,
    status: 'implementation',
    type: '2',
    size: 9999,
    page: 0
  }
  try {
    const result = await getPlacementPointListApi(params)
    settleAddressList.value = result.content
  } catch {}
}

const getPlans = async () => {
  const res = await getBestResettlePlanApi(props.doorNo)
  console.log(res, 'res')
  if (res) {
    tableData.value = res.map((item) => {
      item.isSelected = false
      return item
    })
  }
}

onMounted(() => {
  if (!props.fromResettleConfirm) {
    getPlans()
  }
  getSettleAddressList()
})

watch(
  () => props.immigrantSettle,
  (val) => {
    if (val) {
      console.log(val, 'val')
      const { typeOneNum, typeTwoNum, typeThreeNum, typeFourNum, settleAddressCode } = val

      settleAddress.value = val.settleAddressCode
      areaSize.value = areaSize.value.map((item, index) => {
        if (index === 0) {
          item.num = typeOneNum
        } else if (index === 1) {
          item.num = typeTwoNum
        } else if (index === 2) {
          item.num = typeThreeNum
        } else if (index === 3) {
          item.num = typeFourNum
        }
        return item
      })
    }
  },
  {
    deep: true,
    immediate: true
  }
)

// 总面积
const totalArea = computed(() => {
  let sum = 0
  areaSize.value.forEach((item) => {
    if (item.num > 0) {
      sum += item.name * item.num
    }
  })
  return sum
})

// 剩余面积
const residueArea = computed(() => {
  const residue = props.baseInfo.familyNum * 40 - totalArea.value
  return residue < 0 ? 0 : residue
})

// 超出面积
const exceedArea = computed(() => {
  const exceed = totalArea.value - props.baseInfo.familyNum * 40
  return exceed < 0 ? 0 : exceed
})

// 选择该方案
const selectPlan = (type: string, item: any) => {
  areaSize.value[0].num = item.typeOneNum
  areaSize.value[1].num = item.typeTwoNum
  areaSize.value[2].num = item.typeThreeNum
  areaSize.value[3].num = item.typeFourNum
  const real = tableData.value.map((item: any) => {
    if (item.type === type) {
      item.isSelected = !item.isSelected
    } else {
      item.isSelected = false
    }
    return item
  })
  tableData.value = [...real]
}
const placementPointInfo = ref({})
const viewAreaDetail = async (id: any) => {
  try {
    const res = await getPlacementPointByIdApi(id)
    placementPointInfo.value = res as any
    areaDetailPup.value = true
    nextTick(() => {
      AreaDetailRef.value.init()
    })
  } catch (error) {}
}

// 补偿补助明细
const viewSubsidyClick = (id: number) => {
  console.log(id, 'id')
  pricePup.value = true
}

// 购房金额明细
const viewBuyHouseClick = (id: number) => {
  console.log(id, 'id')
  buyHousePup.value = true
}

// 户型图
const viewHousePicClick = (id: string) => {
  console.log(id, 'id')
  housePicPup.value = true
}

// 提交
const submitResettle = async () => {
  let typeOneNum = 0
  let typeTwoNum = 0
  let typeThreeNum = 0
  let typeFourNum = 0

  const selectedPlanItem = tableData.value.find((item) => item.isSelected)
  if (selectedPlanItem) {
    typeOneNum = selectedPlanItem.typeOneNum
    typeTwoNum = selectedPlanItem.typeTwoNum
    typeThreeNum = selectedPlanItem.typeThreeNum
    typeFourNum = selectedPlanItem.typeFourNum
  } else {
    const areaItem = areaSize.value.find((item) => item.num > 0)
    if (!areaItem) {
      ElMessage.error('请选择公寓面积')
      return
    }
    areaSize.value.forEach((item, index) => {
      if (index === 0) {
        typeOneNum = item.num
      }
      if (index === 1) {
        typeTwoNum = item.num
      }
      if (index === 2) {
        typeThreeNum = item.num
      }
      if (index === 3) {
        typeFourNum = item.num
      }
    })
  }

  const params: any = {
    houseAreaType: HouseType.flat,
    doorNo: props.doorNo,
    settleAddress: settleAddress.value,
    typeOneNum,
    typeTwoNum,
    typeThreeNum,
    typeFourNum
  }
  if (props.immigrantSettle && props.immigrantSettle.id) {
    params.id = props.immigrantSettle.id
  }
  emit('submit', params)
}
</script>

<style lang="less" scoped>
.common-form-item {
  display: flex;
  padding: 22px 0;
  border-bottom: 1px dotted #ebebeb;

  .common-label {
    width: 140px;
    font-size: 14px;
    line-height: 32px;
    color: #131313;
    text-align: right;
    flex: none;
  }

  .flex-center {
    align-self: center;
  }

  .common-value {
    flex: 1;
    min-height: 32px;
    font-size: 14px;
    color: #131313;
  }
}

.flex-center-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

.pointer {
  cursor: pointer;
  user-select: none;
}

.area-size {
  .area-size-item {
    display: flex;
    align-items: center;
    margin-bottom: 16px;

    .name {
      width: 60px;
      margin-right: 10px;
      font-size: 14px;
      font-weight: 500;
      color: #171718;
    }

    .ipt-wrap {
      display: flex;
      align-items: center;
      width: 120px;
      margin-right: 30px;
    }
  }
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

.info-item {
  display: flex;
  font-size: 14px;
  font-weight: 500;
  line-height: 16px;
  color: #171718;
  align-items: center;

  .red {
    color: #e43030;
  }
}

.desc-item {
  font-size: 14px;
  line-height: 16px;
  color: #171718;
}

// 表格
.plan-table-wrap {
  table {
    /* 用于表格属性, 表示表格的两边框合并为一条 */
    border-collapse: collapse;
    border-right: 1px solid #ebebeb;
    border-bottom: 1px solid #ebebeb;
    /* 设置边缘间距0 */
    border-spacing: 0;
  }

  tr td {
    height: 40px;
    font-size: 14px;
    color: #171718;
    text-align: center;
    border-top: 1px solid #ebebeb;
    border-right: 1px solid #ebebeb;
    border-left: 1px solid #ebebeb;
  }

  .column-w1 {
    width: 153px;
    background: #f6f6f6;
  }

  .column-w2 {
    width: 160px;
  }

  .column-w3 {
    width: 273px;
  }

  .bold {
    font-weight: 500;
  }

  .blue {
    color: #3e73ec;
  }

  .plan-tit {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    color: #3e73ec;
    background: #f2f6ff;

    &.active {
      color: #fff;
      background: #3e73ec;
    }
  }

  .select-btn {
    display: flex;
    align-items: center;
    justify-content: center;

    .icon {
      width: 16px;
      height: 16px;
      background: #ffffff;
      border: 1px solid #dcdde6;
      border-radius: 50%;
    }

    .txt {
      margin-left: 10px;
      font-size: 14px;
      color: #171718;
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

.value-center {
  display: flex;
  align-items: center;
  height: 100%;
}

:deep(.el-dialog__body) {
  padding: 0 0 35px;
}
</style>
