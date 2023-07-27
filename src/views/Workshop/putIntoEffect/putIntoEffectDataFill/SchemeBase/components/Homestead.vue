<template>
  <div class="homestead-wrap">
    <div class="common-form-item">
      <div class="common-label">宅基地安置人数：</div>
      <div class="common-value">
        {{ resettlePeopleInfo.total }}人，其中该户农村移民 ：{{
          resettlePeopleInfo.farmer
        }}
        人，随迁人口：{{ resettlePeopleInfo.trailing }}人
      </div>
    </div>

    <div class="common-form-item">
      <div class="common-label">可安置建筑面积：</div>
      <div class="common-value"> {{ resettlePeopleInfo.total * 40 }}㎡ </div>
    </div>

    <div class="common-form-item">
      <div class="common-label">可选安置点：</div>
      <div class="common-value">
        <el-radio-group v-model="settleAddress">
          <el-radio :label="item.id" size="large" v-for="item in resettleArea" :key="item.id">
            {{ item.name }}
          </el-radio>
        </el-radio-group>
        <div class="blue-row">
          <div
            class="blue-view"
            v-for="item in resettleArea"
            :key="item.id"
            @click="viewAreaDetail(item.id)"
            >地块详情</div
          >
        </div>
      </div>
    </div>

    <div class="common-form-item">
      <div class="common-label">可选安置点：</div>
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
      <div class="btn" @click="submitResettle">确定，进入下一步</div>
    </div>

    <el-dialog v-model="areaDetailPup" title="安置点详情" width="900">
      <AreaDetail />
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue'
import { ElRadioGroup, ElRadio, ElDialog } from 'element-plus'
import { resettleArea, homesteadAreaSize, HouseType } from './config'
import AreaDetail from './AreaDetail.vue'

interface PropsType {
  data: any
  doorNo: string
  immigrantSettle: any
  fromResettleConfirm?: boolean
}

const emit = defineEmits(['submit'])
const props = defineProps<PropsType>()
const areaDetailPup = ref(false)
const settleAddress = ref('1')
const areaType = ref('1')

watch(
  () => props.immigrantSettle,
  (val) => {
    if (val) {
      const { areaType: area, settleAddress: settleArea } = val
      areaType.value = area
      settleAddress.value = settleArea
    }
  },
  {
    deep: true,
    immediate: true
  }
)

const resettlePeopleInfo = computed(() => {
  let farmer = 0
  let trailing = 0
  if (props.data && props.data.length) {
    props.data.forEach((item) => {
      // 农村移民
      if (item.populationNature === '1') {
        farmer++
      }
      // 农业随迁
      if (item.populationNature === '3') {
        trailing++
      }
    })
  }

  return {
    total: props.data.length,
    farmer,
    trailing
  }
})

const areaSizeArray = computed(() => {
  const len = props.data.length
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

const viewAreaDetail = (id: string) => {
  console.log(id, 'id')
  areaDetailPup.value = true
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
