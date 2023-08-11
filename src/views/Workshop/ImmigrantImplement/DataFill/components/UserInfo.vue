<template>
  <div class="user-info">
    <div class="base">
      <div class="user">
        <Icon :icon="infoData.icon" color="#3E73EC" />
        <div class="pl-12px text-size-16px text-[#000]">{{ props.baseInfo.name }}</div>
        <div class="pl-8px text-size-14px text-[#1C5DF1]">
          {{ filterViewDoorNo(props.baseInfo) }}
        </div>
      </div>
      <ElSpace>
        <ElButton
          :icon="printIcon"
          v-if="type == 'PeasantHousehold' || type == 'Enterprise' || type == 'IndividualB'"
          type="primary"
          class="!bg-[#30A952] !border-[#30A952]"
          @click="onPrint"
        >
          打印
        </ElButton>
        <ElButton
          v-if="baseInfo.fillStatus === FillStatus.Fill"
          type="primary"
          :icon="EscalationIcon"
          @click="onReportData"
        >
          填报完成
        </ElButton>
        <div
          :class="{
            status: true,
            success: props.baseInfo.fillStatus === FillStatus.Fill
          }"
        >
          <span class="point"></span>
          {{ props.baseInfo.fillStatus === FillStatus.Fill ? '已填报' : '未填报' }}
        </div>
      </ElSpace>
    </div>

    <!-- 居民户基础信息 -->
    <div class="other mt-15px" v-if="type == 'PeasantHousehold'" style="display: block">
      <el-row>
        <el-col :span="6">
          <div class="info-item">
            <div class="tit">行政村名称：</div>
            <div class="txt">{{ fmtStr(props.baseInfo.villageText) }}</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="info-item">
            <div class="tit">自然村名称：</div>
            <div class="txt">{{ fmtStr(props.baseInfo.virutalVillageText) }}</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="info-item">
            <div class="tit">户籍册编号：</div>
            <div class="txt">{{ fmtStr(props.baseInfo.householdNumber) }}</div>
          </div>
        </el-col>
        <el-col :span="6"
          ><div class="info-item">
            <div class="tit">所在位置：</div>
            <div class="txt">{{ fmtStr(props.baseInfo.locationTypeText) }}</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="info-item">
            <div class="tit">联系方式：</div>
            <div class="txt">{{ fmtStr(props.baseInfo.phone) }}</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="info-item">
            <div class="tit">家庭人数：</div>
            <div class="txt">{{ fmtStr(props.baseInfo.familyNum, '人') }}</div>
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- 资产评估 -->
    <div
      class="other"
      v-if="type == 'PeasantHousehold' && tabCurrentId == 0"
      style="display: block"
    >
      <el-row>
        <el-col :span="6">
          <div class="info-item">
            <div class="tit">房屋主体评估合计：</div>
            <div class="txt">{{ fmtStr(props.baseInfo.houseTotalAmount, '（元）') }}</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="info-item">
            <div class="tit">房屋装修评估合计：</div>
            <div class="txt">{{ fmtStr(props.baseInfo.fitUpTotalAmount, '（元）') }}</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="info-item">
            <div class="tit">房屋附属设施评估合计：</div>
            <div class="txt">{{ fmtStr(props.baseInfo.appendantTotalAmount, '（元）') }}</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="info-item">
            <div class="tit">零星（林）果木评估合计：</div>
            <div class="txt">{{ fmtStr(props.baseInfo.treeTotalAmount, '（元）') }}</div>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <div class="info-item">
            <div class="tit">土地基本情况评估合计：</div>
            <div class="txt">{{ fmtStr(props.baseInfo.landTotalAmount, '（元）') }}</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="info-item">
            <div class="tit">土地青苗及附着物评估合计：</div>
            <div class="txt">{{ fmtStr(props.baseInfo.assetAppendantTotalAmount, '（元）') }}</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="info-item">
            <div class="tit">坟墓评估合计：</div>
            <div class="txt">{{ fmtStr(props.baseInfo.graveTotalAmount, '（元）') }}</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="info-item">
            <div class="tit">资产评估总计：</div>
            <div class="txt">{{ fmtStr(props.baseInfo.totalAmount, '（元）') }}</div>
          </div>
        </el-col>
      </el-row>
    </div>

    <div
      class="other"
      v-if="type == 'PeasantHousehold' && tabCurrentId == 3"
      style="display: block"
    >
      <el-row>
        <el-col :span="6">
          <div class="info-item">
            <div class="tit">开户名：</div>
            <div class="txt">{{ props.baseInfo.accountName || '-' }}</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="info-item">
            <div class="tit">开户行：</div>
            <div class="txt">{{ props.baseInfo.bankName || '-' }}</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="info-item">
            <div class="tit">银行账户：</div>
            <div class="txt">{{ props.baseInfo.bankAccount || '-' }}</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="info-item">
            <div class="tit">迁前地址：</div>
            <div class="txt"></div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="info-item">
            <div class="tit">安置住址：</div>
            <div class="txt"></div>
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- 腾空过渡、搬迁安置、生产安置、相关手续 -->
    <div
      class="other"
      v-if="tabCurrentId == 8 || tabCurrentId == 9 || tabCurrentId == 10 || tabCurrentId == 11"
      style="display: block"
    >
      <el-row>
        <el-col :span="6">
          <div class="info-item">
            <div class="tit">迁前地址：</div>
            <div class="txt"></div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="info-item">
            <div class="tit">安置住址：</div>
            <div class="txt"></div>
          </div>
        </el-col>
      </el-row>
    </div>

    <div class="other" v-if="type == 'Enterprise'">
      <div class="info-item">
        <div class="tit">县（市/区）：</div>
        <div class="txt">{{ props.baseInfo.areaCodeText || '-' }}</div>
      </div>
      <div class="info-item">
        <div class="tit">行政村：</div>
        <div class="txt">{{ props.baseInfo.villageText || '-' }}</div>
      </div>
      <div class="info-item">
        <div class="tit">所在位置：</div>
        <div class="txt">{{ props.baseInfo.locationTypeText || '-' }}</div>
      </div>
      <div class="info-item">
        <div class="tit">法人：</div>
        <div class="txt">{{ props.baseInfo.legalPersonName || '-' }}</div>
      </div>
    </div>

    <div class="other" v-if="type == 'IndividualB'">
      <div class="info-item">
        <div class="tit">县（市/区）：</div>
        <div class="txt">{{ props.baseInfo.areaCodeText || '-' }}</div>
      </div>
      <div class="info-item">
        <div class="tit">行政村：</div>
        <div class="txt">{{ props.baseInfo.villageText || '-' }}</div>
      </div>
      <div class="info-item">
        <div class="tit">所在位置：</div>
        <div class="txt">{{ props.baseInfo.locationTypeText || '-' }}</div>
      </div>
      <div class="info-item">
        <div class="tit">法人：</div>
        <div class="txt">{{ props.baseInfo.legalPersonName || '-' }}</div>
      </div>
    </div>

    <div class="other" v-if="type == 'village'">
      <div class="info-item">
        <div class="tit">县（市/区）：</div>
        <div class="txt">{{ props.baseInfo.areaCodeText || '-' }}</div>
      </div>
      <div class="info-item">
        <div class="tit">行政村：</div>
        <div class="txt">{{ props.baseInfo.villageText || '-' }}</div>
      </div>
      <div class="info-item">
        <div class="tit">所在位置：</div>
        <div class="txt">{{ props.baseInfo.locationTypeText || '-' }}</div>
      </div>
      <div class="info-item">
        <div class="tit">联系方式：</div>
        <div class="txt">{{ props.baseInfo.phone || '-' }}</div>
      </div>
    </div>

    <Print
      :show="printDialog"
      :landlordIds="[householdId]"
      @close="onPrintDialogClose"
      :baseInfo="baseInfo"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { ElRow, ElCol, ElMessage, ElSpace, ElButton } from 'element-plus'
import { FillStatus } from '../config'
import { filterViewDoorNo, fmtStr } from '@/utils/index'
import { useIcon } from '@/hooks/web/useIcon'
import Print from './Print.vue'
import { reportLandlordApi } from '@/api/putIntoEffect/putIntoEffectDataFill/service'

interface PropsType {
  baseInfo: any
  type: any
  tabCurrentId
  householdId: number
}

const props = defineProps<PropsType>()
const reportDialog = ref<boolean>(false)
const printDialog = ref<boolean>(false)
const reportResult = ref<string[]>([])

const EscalationIcon = useIcon({ icon: 'carbon:send-alt' })
const printIcon = useIcon({ icon: 'ion:print-outline' })
const infoData = ref<any>({ icon: 'mdi:user-circle' })

const emit = defineEmits(['updateData'])

// 填报完成
const onReportData = async () => {
  const result = await reportLandlordApi(props.householdId)
  if (result && Array.isArray(result)) {
    reportDialog.value = true
    reportResult.value = result
  } else {
    ElMessage.success('填报成功！')
    emit('updateData')
  }
}

const onPrint = () => {
  printDialog.value = true
}

const onPrintDialogClose = () => {
  printDialog.value = false
}

onMounted(() => {
  if (props.type == 'PeasantHousehold') {
    infoData.value = { icon: 'mdi:user-circle' }
  } else if (props.type == 'Enterprise') {
    infoData.value = { icon: 'carbon:enterprise' }
  } else if (props.type == 'IndividualB') {
    infoData.value = { icon: 'material-symbols:add-business' }
  } else if (props.type == 'village') {
    infoData.value = { icon: 'ic:round-holiday-village' }
  }
})
</script>

<style lang="less" scoped>
.user-info {
  min-height: 88px;
  padding-bottom: 10px;
  margin-top: 14px;
  background: #edf5ff;
  border: 1px solid #e8eaf0;
  border-radius: 4px;

  .base {
    display: flex;
    height: 50px;
    padding: 0 16px;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px dotted #999;

    .user {
      display: flex;
      align-items: center;
    }

    .status {
      display: flex;
      height: 30px;
      padding: 0 13px 0 10px;
      font-size: 14px;
      color: #ff2d2d;
      background: #ffffff;
      border: 1px solid #ff5d5d;
      border-radius: 5px;
      align-items: center;

      .point {
        width: 6px;
        height: 6px;
        margin-right: 5px;
        background: #ff6767;
        border-radius: 50%;
      }

      &.success {
        color: #30a952;
        border: 1px solid #30a952;

        .point {
          background: #30a952;
        }
      }
    }
  }

  .other {
    display: flex;
    padding: 0 16px;
    box-sizing: border-box;
    align-items: center;

    .info-item {
      display: flex;
      margin-right: 40px;
      font-size: 14px;
      line-height: 28px;
      color: #000;
      align-items: center;

      .tit {
        color: rgb(171, 173, 175);
      }

      .txt {
        font-weight: 500;
      }
    }
  }
}
</style>
