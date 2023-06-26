<template>
  <WorkContentWrap>
    <div> </div>
    <div class="table-wrap !py-12px !mt-0px">
      <div class="flex items-center justify-between pb-12px">
        <div> </div>
        <ElSpace>
          <ElButton :icon="editIcon" type="primary" @click="onedit">编辑</ElButton>
          <ElButton :icon="saveIcon" @click="onsave">保存</ElButton>
        </ElSpace>
      </div>
      <div class="formBox">
        <ElForm
          class="form"
          ref="formRef"
          :model="formData"
          label-width="130px"
          :label-position="'right'"
          :rules="rules"
        >
          <div class="titleBox">
            <span class="text">基础信息</span>
          </div>
          <div class="flblock">
            <ElFormItem label="总计建筑面积：" prop="totalArea">
              <ElInput v-model="formData.totalArea" placeholder="输入">
                <template #append>㎡</template>
              </ElInput>
            </ElFormItem>
            <ElFormItem label="住宅建筑面积：" prop="houseArea">
              <ElInput v-model="formData.houseArea" placeholder="输入">
                <template #append>㎡</template>
              </ElInput>
            </ElFormItem>
            <ElFormItem label="土地面积总计：" prop="landArea">
              <ElInput v-model="formData.landArea" placeholder="输入">
                <template #append>亩</template>
              </ElInput>
            </ElFormItem>
            <ElFormItem label="耕地面积：" prop="arableLandArea">
              <ElInput v-model="formData.arableLandArea" placeholder="输入">
                <template #append>亩</template>
              </ElInput>
            </ElFormItem>
            <ElFormItem label="园地、林地面积：" prop="woodLandArea">
              <ElInput v-model="formData.woodLandArea" placeholder="输入">
                <template #append>亩</template>
              </ElInput>
            </ElFormItem>
            <ElFormItem label="未利用土地面积：" prop="uselessArea">
              <ElInput v-model="formData.uselessArea" placeholder="输入">
                <template #append>亩</template>
              </ElInput>
            </ElFormItem>
          </div>
          <div class="titleBox">
            <span class="text">安置房信息</span>
          </div>
          <div>
            <div style="display: flex; align-items: center">
              <ElFormItem label="安置房人数：" prop="agricultureResettlementNum">
                <ElInput v-model.number="formData.agricultureResettlementNum" placeholder="输入">
                  <template #append>人</template>
                </ElInput>
              </ElFormItem>
              <ElFormItem label="增计选房人数：" prop="increasesMeterNum">
                <ElInput v-model.number="formData.increasesMeterNum" placeholder="输入">
                  <template #append>人</template>
                </ElInput>
              </ElFormItem>
              <ElFormItem label="增计依据：" prop="increasesMeterRemark">
                <ElInput
                  v-model="formData.increasesMeterRemark"
                  placeholder="输入"
                  class="!w-350px"
                />
              </ElFormItem>
            </div>
            <div style="display: flex; align-items: center">
              <ElFormItem label="储藏室数量：" prop="storeroomNum">
                <ElInput v-model.number="formData.storeroomNum" placeholder="输入">
                  <template #append>间</template>
                </ElInput>
              </ElFormItem>
              <ElFormItem label="储藏室金额：" prop="storeroomAmount">
                <ElInput v-model="formData.storeroomAmount" placeholder="输入">
                  <template #append>元</template>
                </ElInput>
              </ElFormItem>
            </div>
          </div>
          <div class="titleBox">
            <span class="text">第四条 补偿费、补助费及奖励费</span>
          </div>
          <div>
            <div class="sub_title">（一）补偿费</div>
            <div>
              <ElFormItem label="偿费总计：" prop="feeSum" label-width="194px">
                <ElInput v-model.number="formData.feeSum" placeholder="输入" class="!w-250px">
                  <template #append>元</template>
                </ElInput>
              </ElFormItem>
            </div>
          </div>
          <div>
            <div class="sub_title">（二）补助费</div>
            <div class="label item-label">1、搬迁补助费：</div>
            <div class="item">
              <ElFormItem label="农村移民和农业随迁人口：" label-width="194px" prop="accountName">
                <ElInput v-model="formData.trailingNum" placeholder="输入" class="!w-250px">
                  <template #append>人</template>
                </ElInput>
              </ElFormItem>
              <ElFormItem label="补助费合计：" prop="accountName" label-width="194px">
                <ElInput disabled v-model="relocationFee" placeholder="输入" class="!w-250px">
                  <template #append>元</template>
                </ElInput>
              </ElFormItem>
            </div>
            <div class="label item-label">2、过渡期补助费：</div>
            <div class="item item--noflex">
              <div class="item-right">
                <ElFormItem label="农村移民和农业随迁人口：" label-width="194px" prop="accountName">
                  <ElInput
                    v-model.number="formData.trailingNum"
                    placeholder="输入"
                    class="!w-250px"
                  >
                    <template #append>人</template>
                  </ElInput>
                </ElFormItem>
                <ElFormItem label="小计：" label-width="194px" prop="transitionRuralFee">
                  <ElInput
                    v-model.number="transitionRuralFee"
                    placeholder="输入"
                    class="!w-250px"
                    disabled
                  >
                    <template #append>元</template>
                  </ElInput>
                </ElFormItem>
                <ElFormItem label="非农随迁人口：" label-width="194px" prop="unTrailingNum">
                  <ElInput
                    v-model.number="formData.unTrailingNum"
                    placeholder="输入"
                    class="!w-250px"
                  >
                    <template #append>人</template>
                  </ElInput>
                </ElFormItem>
                <ElFormItem label="小计：" label-width="194px" prop="transitionUnRuralFee">
                  <ElInput
                    v-model.number="transitionUnRuralFee"
                    placeholder="输入"
                    class="!w-250px"
                    disabled
                  >
                    <template #append>元</template>
                  </ElInput>
                </ElFormItem>
                <ElFormItem label="过渡期补助费合计：" label-width="194px" prop="subsidiesFeeSum">
                  <ElInput
                    v-model.number="subsidiesFeeSum"
                    placeholder="输入"
                    class="!w-250px"
                    disabled
                  >
                    <template #append>元</template>
                  </ElInput>
                </ElFormItem>
              </div>
            </div>
            <div class="label item-label">3、临时安置补助费：</div>
            <div class="item">
              <div class="item-block">
                <ElFormItem
                  label="选房人数（不含增计选房）："
                  label-width="194px"
                  prop="roomSelectionNum"
                >
                  <ElInput
                    v-model.number="formData.roomSelectionNum"
                    placeholder="输入"
                    class="!w-250px"
                  >
                    <template #append>人</template>
                  </ElInput>
                </ElFormItem>
                <ElFormItem label="每月临时补助费小计：" label-width="170px" prop="resettlementFee">
                  <ElInput
                    v-model.number="resettlementFee"
                    placeholder="输入"
                    class="!w-250px"
                    disabled
                  >
                    <template #append>元</template>
                  </ElInput>
                </ElFormItem>
              </div>
            </div>
            <div class="label item-label">5、其他补助费：</div>
            <div class="item item--noflex">
              <div class="item-right">
                <ElFormItem label="自谋出路安置人数：" label-width="194px" prop="seekWayNum">
                  <ElInput v-model.number="formData.seekWayNum" placeholder="输入" class="!w-250px">
                    <template #append>人</template>
                  </ElInput>
                </ElFormItem>
                <ElFormItem label="自谋出路安置补助费小计：" label-width="194px" prop="accountName">
                  <ElInput v-model="seekWayFree" disabled placeholder="输入" class="!w-250px">
                    <template #append>元</template>
                  </ElInput>
                </ElFormItem>
                <ElFormItem label="自谋职业安置人数：" label-width="194px" prop="workNum">
                  <ElInput v-model.number="formData.workNum" placeholder="输入" class="!w-250px">
                    <template #append>人</template>
                  </ElInput>
                </ElFormItem>
                <ElFormItem label="自谋职业安置补助费小计：" label-width="194px" prop="accountName">
                  <ElInput disabled v-model="workFree" placeholder="输入" class="!w-250px">
                    <template #append>元</template>
                  </ElInput>
                </ElFormItem>
                <ElFormItem label="其他补助费合计：" label-width="194px" prop="otherFeeSum">
                  <ElInput
                    disabled
                    v-model.number="otherFeeSum"
                    placeholder="输入"
                    class="!w-250px"
                  >
                    <template #append>元</template>
                  </ElInput>
                </ElFormItem>
              </div>
            </div>
          </div>
          <div>
            <div class="sub_title">（三）奖励费</div>
            <div class="label item-label">签约奖</div>
            <div class="item">
              <ElFormItem label="行政村名称：" label-width="194px" prop="villageCode">
                <ElSelect
                  :filter-method="handleSearch"
                  filterable
                  v-model="formData.villageCode"
                  class="!w-250px"
                  clearable
                  placeholder="请先搜索后选择行政村名称"
                >
                  <ElOption
                    v-for="(item, index) in village"
                    :key="index"
                    :label="item.name"
                    :value="item.code"
                  />
                </ElSelect>
              </ElFormItem>
            </div>
          </div>
          <div>
            <div class="sub_title">（四）补偿费、补助费及奖励费的支付</div>
            <div class="item">
              <ElFormItem
                label="付搬迁补助费、过渡期补助费、其他补助费合计："
                label-width="320px"
                prop="otherFeeSum"
              >
                <ElInput v-model="allFee" disabled placeholder="输入" class="!w-250px">
                  <template #append>元</template>
                </ElInput>
              </ElFormItem>
            </div>
          </div>
          <div class="titleBox">
            <span class="text">其他约定</span>
          </div>
          <ElFormItem label="其他约定：" prop="remark">
            <ElInput v-model="formData.remark" type="textarea" :rows="5" placeholder="输入" />
          </ElFormItem>
        </ElForm>
      </div>
    </div>
  </WorkContentWrap>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { WorkContentWrap } from '@/components/ContentWrap'
import {
  ElMessage,
  ElButton,
  ElSpace,
  ElFormItem,
  ElInput,
  ElForm,
  ElSelect,
  ElOption
} from 'element-plus'
import { useIcon } from '@/hooks/web/useIcon'
import {
  addAgreeInfoApi,
  updateAgreeInfoApi,
  getAgreeInfoApi,
  getDistrictApi
} from '@/api/putIntoEffect/agreeInfo/service'

interface PropsType {
  doorNo: string
  baseInfo: any
}
const props = defineProps<PropsType>()
const editIcon = useIcon({ icon: 'material-symbols:edit-square-outline-rounded' })
const saveIcon = useIcon({ icon: 'mingcute:save-line' })
const defaultValue = {
  totalArea: 0,
  arableLandArea: 0,
  woodLandArea: 0,
  uselessArea: 0,
  agricultureResettlementNum: null,
  increasesMeterNum: null,
  increasesMeterRemark: '',
  accountName: '',
  storeroomAmount: 0,
  feeSum: null,
  unTrailingNum: null,
  roomSelectionNum: null,
  seekWayNum: null,
  workNum: null,
  villageCode: '',
  remark: '',
  storeroomNum: 0,
  trailingNum: 0,
  houseArea: 0,
  landArea: 0,
  villageCodeText: ''
}
let formData = ref(defaultValue)
let relocationFee = computed(() => {
  return formData.value.trailingNum ? (formData.value.trailingNum * 1200).toFixed(2) : 0
})

let transitionRuralFee = computed(() => {
  return formData.value.trailingNum ? (formData.value.trailingNum * 4320).toFixed(2) : 0
})

let transitionUnRuralFee = computed(() => {
  return formData.value.unTrailingNum ? (formData.value.unTrailingNum * 3000).toFixed(2) : 0
})
let subsidiesFeeSum = computed(() => {
  return (
    (transitionRuralFee.value ? Number(transitionRuralFee.value) : 0) +
    (transitionUnRuralFee.value ? Number(transitionUnRuralFee.value) : 0)
  ).toFixed(2)
})
let resettlementFee = computed(() => {
  return formData.value.roomSelectionNum ? (formData.value.roomSelectionNum * 450).toFixed(2) : 0
})
let seekWayFree = computed(() => {
  return formData.value.seekWayNum ? (formData.value.seekWayNum * 15000).toFixed(2) : 0
})
let workFree = computed(() => {
  return formData.value.workNum ? (formData.value.workNum * 3000).toFixed(2) : 0
})
let otherFeeSum = computed(() => {
  return (
    (seekWayFree.value ? Number(seekWayFree.value) : 0) +
    (workFree.value ? Number(workFree.value) : 0)
  ).toFixed(2)
})

let allFee = computed(() => {
  const tempRelocationFee = Number(relocationFee.value)
  const tempSubsidiesFeeSum = Number(subsidiesFeeSum.value)
  const tempOtherFeeSum = Number(otherFeeSum.value)
  const sum = tempRelocationFee + tempSubsidiesFeeSum + tempOtherFeeSum
  return isNaN(sum) ? 0 : sum
})
const getDetails = async (type: string) => {
  const res = await getAgreeInfoApi(props.doorNo)
  if (res) {
    formData.value = Object.assign({}, formData, res)
    formData.value.trailingNum = res.trailingNum
  }
  if (type === 'init') {
    dictAdministration(formData.value?.villageCodeText)
  }
}
const handleSearch = (e) => {
  dictAdministration(e)
}
interface VillageType {
  name: string
  code: string | number
}
let village = ref<VillageType[]>([])
const dictAdministration = async (name?: string) => {
  getDistrictApi(name).then((res) => {
    village.value = res.content
  })
}
getDetails('init')
const onsave = () => {
  const { projectId, status, id: householdId } = props.baseInfo
  const {
    arableLandArea,
    storeroomAmount,
    totalArea,
    uselessArea,
    woodLandArea,
    storeroomNum,
    houseArea,
    landArea
  } = formData.value
  const data = JSON.parse(JSON.stringify(formData.value))
  delete data.id
  const params = {
    projectId,
    status,
    householdId,
    doorNo: props.doorNo,
    ...data,
    arableLandArea: Number(arableLandArea),
    storeroomAmount: Number(storeroomAmount),
    totalArea: Number(totalArea),
    houseArea: Number(houseArea),
    landArea: Number(landArea),
    storeroomNum: Number(storeroomNum),
    uselessArea: Number(uselessArea),
    woodLandArea: Number(woodLandArea),
    relocationFee: relocationFee.value,
    transitionRuralFee: transitionRuralFee.value,
    transitionUnRuralFee: transitionUnRuralFee.value,
    subsidiesFeeSum: subsidiesFeeSum.value,
    resettlementFee: resettlementFee.value,
    seekWayFree: seekWayFree.value,
    workFree: workFree.value,
    otherFeeSum: otherFeeSum.value
  }
  addAgreeInfoApi(params).then(() => {
    ElMessage.success('保存成功！')
    getDetails('save')
  })
}

const rules = ref()
const onedit = () => {
  const { projectId, status, id: householdId } = props.baseInfo
  const { arableLandArea, storeroomAmount, totalArea, uselessArea, woodLandArea, storeroomNum } =
    formData.value
  const params = {
    projectId,
    status,
    householdId,
    doorNo: props.doorNo,
    ...formData.value,
    arableLandArea: Number(arableLandArea),
    storeroomAmount: Number(storeroomAmount),
    totalArea: Number(totalArea),
    storeroomNum: Number(storeroomNum),
    uselessArea: Number(uselessArea),
    woodLandArea: Number(woodLandArea),
    relocationFee: relocationFee.value,
    transitionRuralFee: transitionRuralFee.value,
    transitionUnRuralFee: transitionUnRuralFee.value,
    subsidiesFeeSum: subsidiesFeeSum.value,
    resettlementFee: resettlementFee.value,
    seekWayFree: seekWayFree.value,
    workFree: workFree.value,
    otherFeeSum: otherFeeSum.value
  }
  updateAgreeInfoApi(params)
    .then(() => {
      ElMessage.success('修改成功！')
      getDetails('update')
    })
    .catch((e) => {
      console.log(e, 'sss')
    })
}
</script>
<style lang="less" scoped>
:deep(.el-dialog__body) {
  padding-right: 60px;
  padding-left: 60px;
}

:deep(.el-form-item) {
  padding: 0 10px;
}

.formBox {
  border: 1px solid #ebebeb;
  border-radius: 4px;
  opacity: 1;

  .titleBox {
    height: 32px;
    padding-left: 15px;
    margin: 0px 0 16px;
    line-height: 32px;
    background: #f5f7fa;
    box-shadow: 0px 1px 0px 0px rgba(235, 235, 235, 1);

    .text {
      padding-left: 15px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-size: 17px;
      font-weight: 600;
      color: #171718;

      border-left: 4px solid rgba(62, 115, 236, 1) !important;
    }
  }
}

:deep(.el-form-item__content) {
  flex-wrap: nowrap;
}

.item {
  display: flex;
  height: 60px;
  padding-left: 60px;
  align-items: center;

  .item-block {
    display: flex;
    justify-content: space-between;
    width: calc(100% - 195px);
  }

  .label {
    width: 190px;
  }

  .item-right {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    padding-left: 26px;
  }
}

.item--noflex {
  align-items: flex-start;
  height: auto;
}

.item-label {
  padding-top: 20px !important;
  padding-left: 60px !important;
}

.titleBox--bgcolor {
  margin-bottom: 0 !important;
}

.bgcolor {
  padding: 20px;
  background: #edf5ff;
}

.flblock {
  display: flex;
  flex-wrap: wrap;
}
</style>
