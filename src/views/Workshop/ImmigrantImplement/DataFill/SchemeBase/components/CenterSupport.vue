<template>
  <div class="homestead-wrap">
    <div class="common-form-group">
      <div class="common-form-item">
        <div class="common-label">户主：</div>
        <div class="common-value">
          {{ baseInfo.name || '' }}
        </div>
      </div>

      <div class="common-form-item">
        <div class="common-label">户内人口：</div>
        <div class="common-value"> {{ baseInfo.familyNum }} </div>
      </div>

      <div class="common-form-item">
        <div class="common-label">迁出地：</div>
        <div class="common-value"> {{ baseInfo.address || '' }} </div>
      </div>

      <div class="common-form-item">
        <div class="common-label">联系方式：</div>
        <div class="common-value">
          {{ baseInfo.phone || '' }}
        </div>
      </div>
      <div class="common-form-item">
        <div class="common-label"><span style="color: red"> *</span>养老院：</div>
        <div class="common-value">
          <el-select v-model="nursingHome" class="m-2" placeholder="请选择养老院" size="large">
            <el-option
              v-for="item in nursingHomeList[416]"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
      </div>
    </div>

    <div class="common-form-item">
      <div class="common-label">集中供养：</div>
      <div class="common-value"> 该户选择集中供养 </div>
    </div>

    <div class="btn-wrap">
      <div class="btn" @click="submitResettle">
        {{ fromResettleConfirm ? '确定' : '确定，进入下一步' }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { HouseType } from '../../config'
import { ElSelect, ElOption, ElMessage } from 'element-plus'
import { ref, computed, onMounted } from 'vue'
import { useDictStoreWithOut } from '@/store/modules/dict'
import { getSimulateImmigrantSettleApi } from '@/api/workshop/datafill/mockResettle-service'
interface PropsType {
  baseInfo: any
  doorNo: string
  immigrantSettle: any
  fromResettleConfirm?: boolean
}
onMounted(() => {
  getSimulateImmigrantSettle()
})
// 查询安置信息
const getSimulateImmigrantSettle = async () => {
  const res = await getSimulateImmigrantSettleApi(props.doorNo)
  nursingHome.value = res.nursingHome.toString()
}

const emit = defineEmits(['submit'])
const props = defineProps<PropsType>()
const nursingHome = ref('')

const dictStore = useDictStoreWithOut()

const nursingHomeList = computed(() => dictStore.getDictObj)
const open = () => {
  ElMessage('请选择养老院')
}
const submitResettle = async () => {
  if (!nursingHome.value) return open()
  const params: any = {
    houseAreaType: HouseType.concentrate,
    doorNo: props.doorNo
  }
  if (props.immigrantSettle && props.immigrantSettle.id) {
    params.id = props.immigrantSettle.id
  }
  const ScreeningObj = nursingHomeList.value[416].find((item) => item.value === nursingHome.value)
  params.nursingHome = ScreeningObj && ScreeningObj.value
  emit('submit', params)
}
</script>

<style lang="less" scoped>
.common-form-group {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
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
</style>
