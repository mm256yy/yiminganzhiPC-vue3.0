<template>
  <div class="user-info">
    <div class="base">
      <div class="user">
        <Icon :icon="infoData.icon" color="#3E73EC" />
        <div class="pl-12px text-size-16px text-[#000]">{{ props.baseInfo.name }}</div>
        <div class="pl-8px text-size-14px text-[#1C5DF1]">
          {{ props.baseInfo.showDoorNo }}
        </div>
      </div>
    </div>

    <!-- 居民户基础信息（居民户实施阶段只显示第一个tab的居民户基础信息） -->
    <div class="other mt-15px" v-if="type === '0'" style="display: block">
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
        <el-col :span="12">
          <div class="info-item">
            <div class="tit">户籍所在地：</div>
            <div class="txt">{{ fmtStr(props.baseInfo.address) }}</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="info-item">
            <div class="tit">所属网格：</div>
            <div class="txt"> {{ fmtStr(props.baseInfo?.gridmanName) }} </div>
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- <div class="other">
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
    </div> -->
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { ElRow, ElCol } from 'element-plus'
import { fmtStr } from '@/utils/index'

interface PropsType {
  baseInfo: any
  type: any
  doorNo: string
  householdId: number
}

const props = defineProps<PropsType>()
const infoData = ref<any>({ icon: 'mdi:user-circle' })

onMounted(() => {
  if (props.type === 'Household') {
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
