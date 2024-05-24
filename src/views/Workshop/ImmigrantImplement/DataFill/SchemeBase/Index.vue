<!-- eslint-disable vue/no-lone-template -->
<template>
  <div>
    <!-- 模拟安置 -->
    <div class="imitate-step-tab">
      <div
        class="step-item"
        :class="{ active: stepIndex === item.id }"
        v-for="item in stepArray"
        :key="item.id"
        @click="stepClick(item.id)"
      >
        <div class="number" v-if="!item.done">{{ item.id }}</div>

        <div class="done" v-else>
          <img class="icon" src="@/assets/imgs/done_icon.png" alt="✅" />
        </div>
        <div class="name">{{ item.name }}</div>
        <div class="next" v-if="stepArray.length - 1 >= item.id"></div>
      </div>
    </div>

    <div class="imitate-step-cont">
      <!-- 生产安置 step -->
      <div class="step-cont-production" v-if="stepIndex === 2">
        <el-table :data="tableData" style="width: 100%">
          <el-table-column prop="name" label="姓名" />
          <el-table-column prop="relationText" label="与户主关系" />
          <el-table-column prop="sex" label="性别">
            <template #default="scope">
              {{ scope.row.sex == '1' ? '男' : '女' }}
            </template>
          </el-table-column>
          <el-table-column prop="card" label="身份证" />
          <el-table-column prop="censusTypeText" label="户籍类别" />
          <el-table-column prop="populationNatureText" label="人口性质" />
          <el-table-column prop="settingWay" label="安置方式">
            <template #default="scope">
              <el-select
                v-model="scope.row.settingWay"
                placeholder="请选择"
                v-if="isShow(scope.row)"
              >
                <el-option
                  v-for="item in filterWay(scope.row)"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                  :disabled="item.disabled"
                />
              </el-select>
              <div v-else></div>
            </template>
          </el-table-column>
          <el-table-column prop="settingRemark" label="备注">
            <template #default="scope">
              <el-input
                v-model="scope.row.settingRemark"
                placeholder="请输入"
                v-if="isShow(scope.row)"
              />
            </template>
          </el-table-column>
        </el-table>

        <div class="btn-wrap">
          <div class="btn" @click="stepNext"> 确认 </div>
        </div>
      </div>

      <!-- 搬迁安置 step -->
      <div class="step-cont-move" v-else-if="stepIndex === 1">
        <div class="common-wrap">
          <div class="common-head">
            <div class="icon"></div>
            <div class="tit">搬迁安置方式</div>
          </div>

          <div class="common-cont">
            <div class="common-form-item">
              <div class="common-label">户型类型：</div>
              <div class="common-value">
                <el-radio-group v-model="houseType">
                  <el-radio
                    size="large"
                    v-for="item in filterHouseType()"
                    :key="item.id"
                    :label="item.id"
                    >{{ item.name }}</el-radio
                  >
                </el-radio-group>
              </div>
            </div>

            <template v-if="houseType === HouseType.homestead">
              <Homestead
                :data="tableData"
                :immigrantSettle="immigrantSettle"
                :doorNo="props.doorNo"
                :baseInfo="props.baseInfo"
                :dataList="dataList"
                @submit="immigrantSettleSubmit"
              />
            </template>

            <template v-if="houseType === HouseType.flat">
              <Apartment
                :data="tableData"
                :immigrantSettle="immigrantSettle"
                :doorNo="props.doorNo"
                :baseInfo="props.baseInfo"
                :dataList="dataList"
                @submit="immigrantSettleSubmit"
              />
            </template>

            <template v-if="houseType === HouseType.oneself">
              <FindSelf
                view-type="default"
                :immigrantSettle="immigrantSettle"
                :data="tableData"
                :doorNo="props.doorNo"
                :baseInfo="props.baseInfo"
                @submit="immigrantSettleSubmit"
              />
            </template>

            <template v-if="houseType === HouseType.concentrate">
              <CenterSupport
                :data="tableData"
                :immigrantSettle="immigrantSettle"
                :doorNo="props.doorNo"
                :baseInfo="props.baseInfo"
                @submit="immigrantSettleSubmit"
              />
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, computed, watch } from 'vue'
import {
  ElTable,
  ElTableColumn,
  ElInput,
  ElSelect,
  ElOption,
  ElMessage,
  ElRadioGroup,
  ElRadio
} from 'element-plus'
import {
  getSimulateDemographicApi,
  saveSimulateDemographicApi,
  getSimulateImmigrantSettleApi,
  saveSimulateImmigrantSettleApi
} from '@/api/workshop/datafill/mockResettle-service'

import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { resettleHouseType, HouseType, apartmentArea } from '../config'

import Homestead from './components/Homestead.vue'
import Apartment from './components/Apartment.vue'
import FindSelf from './components/FindSelf.vue'
import CenterSupport from './components/CenterSupport.vue'
import { useDictStoreWithOut } from '@/store/modules/dict'
import { cloneDeep } from 'lodash-es'
import { getPlacementPointByIdApi } from '@/api/systemConfig/placementPoint-service'
const dictStore = useDictStoreWithOut()

const dictObj = computed(() => dictStore.getDictObj)

dayjs.extend(relativeTime)

interface PropsType {
  doorNo: string
  baseInfo: any
}

const dataList = ref<any>()
const props = defineProps<PropsType>()

// 步骤条
const stepArray = ref([
  {
    id: 1,
    name: '选择搬迁安置方式',
    done: false
  },
  {
    id: 2,
    name: '选择生产安置方式',
    done: false
  }
])
// 步骤条选中
const stepIndex = ref(1)

// 表格数据
const tableData: any = ref([])
const immigrantSettle = ref<any>()
const houseType = ref<HouseType>(HouseType.homestead)

watch(
  () => props.baseInfo,
  (val) => {
    if (val) {
      console.log(val, 'baseInfo数据是什么？')
    }
  },
  {
    deep: true,
    immediate: true
  }
)
// 查询人口列表
const getPeopleList = async () => {
  const res = await getSimulateDemographicApi({
    doorNo: props.doorNo,
    status: props.baseInfo.status
  })
  if (res && res.content) {
    const notFill = res.content.filter((item) => !item.settingWay)
    if (!notFill) {
      stepArray.value[1].done = true
    }
    tableData.value = res.content
  }
  console.log(tableData.value, 'bbbqq')
}

// 查询安置信息
const getSimulateImmigrantSettle = async () => {
  const res = await getSimulateImmigrantSettleApi(props.doorNo)
  console.log(res, '搬迁安置信息')
  if (res) {
    houseType.value = res.houseAreaType
    immigrantSettle.value = res
    stepArray.value[0].done = true
  }
}

onMounted(() => {
  getPeopleList()
  getSimulateImmigrantSettle()
})

/**
 * 根据户主人口性质过滤安置类型
 */
const filterHouseType = () => {
  const population = tableData.value.find((item) => item.relation === '1')
  // 农村移民
  if (population && population.populationNature !== '1') {
    return resettleHouseType.map((item) => {
      if (item.id === HouseType.homestead) {
        item.disabled = true
      }
      return item
    })
  }
  return resettleHouseType
}

/**
 * 安置方式过滤
 */
// const filterWay = (data) => {
//   const arr = cloneDeep(dictObj.value[375]).map((item) => {
//     // 农村移民的 其他性质
//     // const notFarmer = data.populationNature !== '1'
//     // if (
//     //   notFarmer &&
//     //   item.value === '1' &&
//     //   immigrantSettle.value &&
//     //   immigrantSettle.value.settingAddress !== apartmentArea[1].id
//     // ) {
//     //   item.disabled = true
//     // }
//     // if (data.age < 14 && item.value !== '3') {
//     //   item.disabled = true
//     // }
//     // if (item.value == '1' && !notFarmer) {
//     //   item.disabled = true
//     // }
//     // return item
//     item.disabled = false
//     if (data.isProductionLand != '1' && item.value == '1') {
//       item.disabled = true
//     }
//     if (data.populationNature != '1' && item.value == '1') {
//       item.disabled = true
//     }
//     if (data.age < 14 && item.value == '2') {
//       item.disabled = true
//     }
//     // if (data.age < 14 && item.value != '3') {
//     //   item.disabled = true
//     // }
//     return item
//   })
//   console.log(arr, data)

//   return arr
// }
const filterWay = (data) => {
  const arr = cloneDeep(dictObj.value[375]).map((item) => {
    // 农村移民的 其他性质
    item.disabled = false
    const notFarmer = data.populationNature !== '1'
    if (notFarmer && item.value === '1') {
      item.disabled = true
    }
    if (item.value === '1' && data.isProductionLand != '1') {
      item.disabled = true
    }
    data.age = data.birthday ? parseInt(dayjs(data.birthday).fromNow().replace(/\D+/, '')) : 0
    if (data.age < 14 && item.value !== '3' && item.value != '1') {
      item.disabled = true
    }
    if (item.value == '1' && (houseType.value == 'concentrate' || houseType.value == 'oneself')) {
      item.disabled = true
    }
    return item
  })
  return arr
}
const stepClick = (id) => {
  getSimulateImmigrantSettle()
  stepIndex.value = id
  // if (stepIndex.value == 1) {
  //   console.log(dataList.value, '点击成功')
  // }
}

/**
 * 生产安置确认
 */
const emit = defineEmits(['updateData'])
const stepNext = async () => {
  // 校验数据
  const notFillArray = tableData.value.filter((item) => !item.settingWay)
  if (notFillArray && notFillArray.length) {
    ElMessage.info('请选择安置方式')
    return
  }
  // const data = tableData.value.map((item) => {
  //   return {
  //     id: item.id,
  //     demographicId: item.demographicId,
  //     settingWay: item.settingWay,
  //     settingRemark: item.settingRemark
  //   }
  // })
  const res = await saveSimulateDemographicApi(tableData.value)
  console.log('安置方式更新结果', res)
  if (res) {
    ElMessage.success('生产安置保存成功!')
    emit('updateData')
  }
}

/**
 * 搬迁安置确认
 */
let isProductionLand = ref()
const immigrantSettleSubmit = async (params: any) => {
  const res = await saveSimulateImmigrantSettleApi(params)
  console.log('搬迁安置确认结果', res)
  if (res) {
    ElMessage.success('搬迁安置保存成功!')
    stepIndex.value += 1
  }
  const datas: any = await getPlacementPointByIdApi(params.settleAddress)
  isProductionLand.value = datas.isProductionLand
  dataList.value = res
  console.log(datas.isProductionLand, 'bbq')
  await getPeopleList()
}
const isShow = (row) => {
  return row.populationNatureText != '增计人口'
}
</script>

<style lang="less" scoped>
.flex-center-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

.imitate-step-tab {
  display: flex;
  width: 1200px;
  height: 56px;
  padding: 0 100px;
  margin: 16px auto;
  background: #fff;
  align-items: center;
  justify-content: center;

  .step-item {
    display: flex;
    align-items: center;
    margin-right: 10px;
    cursor: pointer;

    .number {
      .flex-center-center();

      width: 36px;
      height: 36px;
      font-size: 16px;
      font-weight: 500;
      color: #666666;
      background: #fff;
      border: 1px solid #ebebeb;
      border-radius: 50%;
    }

    .done {
      width: 36px;
      height: 36px;

      .icon {
        width: 36px;
        height: 36px;
      }
    }

    .name {
      .flex-center-center();
      margin: 0 16px;
      font-size: 16px;
      color: #666666;
      word-wrap: none;
      white-space: nowrap;
    }

    .next {
      width: 614px;
      height: 1px;
      background-color: #ebebeb;
    }

    &.active {
      .number {
        color: #fff;
        background: #3e73ec;
        border: 1px solid #3e73ec;
        border-radius: 50%;
      }

      .name {
        color: #171718;
      }
    }
  }
}

.imitate-step-cont {
  padding: 0 16px 16px;

  .btn-wrap {
    .flex-center-center();
    padding: 16px;

    .btn {
      .flex-center-center();
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
}

.common-wrap {
  background-color: #fff;
  border: 1px solid #ebebeb;

  .common-head {
    display: flex;
    width: 100%;
    height: 32px;
    padding: 0 16px;
    background: #f6f6f6;
    border-bottom: 1px solid #ebebeb;
    border-radius: 4px 4px 0px 0px;
    opacity: 1;
    align-items: center;

    .icon {
      width: 4px;
      height: 16px;
      margin-right: 8px;
      background: linear-gradient(90deg, #3e73ec 0%, #ffffff 100%);
      border-radius: 3px 3px 3px 3px;
    }

    .tit {
      font-size: 14px;
      font-weight: 500;
      color: #131313;
    }
  }

  .common-cont {
    padding: 0 28px;
  }
}

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
}

:deep(.el-dialog__body) {
  padding: 0 0 35px;
}
</style>
