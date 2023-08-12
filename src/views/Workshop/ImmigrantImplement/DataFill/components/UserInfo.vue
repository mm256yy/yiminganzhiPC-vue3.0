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
        <!-- 居民户信息中的模拟安置没有完成状态 -->
        <div
          v-if="!(type === 'PeasantHousehold' && tabCurrentId === 3)"
          :class="{
            status: true,
            success: fillingStatus === '1'
          }"
        >
          <span class="point"></span>
          {{ fillingStatus === '1' ? '已完成' : '未完成' }}
        </div>
      </ElSpace>
    </div>

    <!-- 居民户基础信息 -->
    <div class="other mt-15px" v-if="type === 'PeasantHousehold'" style="display: block">
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
      v-if="type === 'PeasantHousehold' && tabCurrentId === 0"
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
      v-if="type === 'PeasantHousehold' && tabCurrentId === 3"
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
      v-if="tabCurrentId === 8 || tabCurrentId === 9 || tabCurrentId === 10 || tabCurrentId === 11"
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

    <div class="other" v-if="type === 'Enterprise'">
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

    <div class="other" v-if="type === 'IndividualB'">
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

    <div class="other" v-if="type === 'Village'">
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
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { ElRow, ElCol, ElSpace } from 'element-plus'
import { filterViewDoorNo, fmtStr } from '@/utils/index'

interface PropsType {
  baseInfo: any
  type: any
  doorNo: string
  tabCurrentId
  householdId: number
  fillingStatus: string
}

const props = defineProps<PropsType>()
const infoData = ref<any>({ icon: 'mdi:user-circle' })

onMounted(() => {
  if (props.type === 'PeasantHousehold') {
    infoData.value = { icon: 'mdi:user-circle' }
  } else if (props.type === 'Enterprise') {
    infoData.value = { icon: 'carbon:enterprise' }
  } else if (props.type === 'IndividualB') {
    infoData.value = { icon: 'material-symbols:add-business' }
  } else if (props.type === 'Village') {
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
