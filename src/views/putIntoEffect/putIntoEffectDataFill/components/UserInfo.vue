<template>
  <div class="user-info">
    <div class="base">
      <div class="user">
        <Icon :icon="infoData.icon" color="#3E73EC" />
        <span class="pl-12px text-size-16px text-[#000]">{{ props.baseInfo.name }}</span>
        <span class="pl-8px text-size-14px text-[#1C5DF1]">{{ props.baseInfo.doorNo }}</span>
      </div>
      <div
        :class="{
          status: true,
          success: props.baseInfo.reportStatus === ReportStatus.ReportSucceed
        }"
        ><span class="point"></span
        >{{ props.baseInfo.reportStatus === ReportStatus.ReportSucceed ? '已填报' : '未填报' }}</div
      >
    </div>

    <div class="other" v-if="type == 'Landlord'" style="display: block">
      <el-row>
        <el-col :span="3">
          <div class="info-item">
            <div class="tit">行政村名称：</div>
            <div class="txt">{{ props.baseInfo.villageText || '-' }}</div>
          </div></el-col
        >
        <el-col :span="4">
          <div class="info-item">
            <div class="tit">自然村名称：</div>
            <div class="txt">{{ props.baseInfo.virutalVillageText || '-' }}</div>
          </div></el-col
        >
        <el-col :span="3" v-if="tabCurrentId != 3">
          <div class="info-item">
            <div class="tit">所属网格：</div>
            <div class="txt"></div>第一网格</div
          ></el-col
        >
        <el-col :span="4">
          <div class="info-item">
            <div class="tit">户籍册编号：</div>
            <div class="txt"></div> 1030034</div
          ></el-col
        >
        <el-col :span="3"
          ><div class="info-item">
            <div class="tit">所在位置：</div>
            <div class="txt">{{ props.baseInfo.locationTypeText || '-' }}</div>
          </div></el-col
        >
        <el-col :span="4">
          <div class="info-item">
            <div class="tit">联系电话：</div>
            <div class="txt">{{ props.baseInfo.phone || '-' }}</div>
          </div></el-col
        >
        <el-col :span="3">
          <div class="info-item">
            <div class="tit">家庭人数：</div>
            <div class="txt">{{ props.baseInfo.familyNum || '-' }}</div>
          </div></el-col
        >
      </el-row>
    </div>
    <div class="other" v-if="type == 'Landlord' && tabCurrentId == 3" style="display: block">
      <el-row>
        <el-col :span="3">
          <div class="info-item">
            <div class="tit">开户名：</div>
            <div class="txt"></div> </div
        ></el-col>
        <el-col :span="4">
          <div class="info-item">
            <div class="tit">开户行：</div>
            <div class="txt"></div> </div
        ></el-col>
        <el-col :span="4">
          <div class="info-item">
            <div class="tit">银行账户：</div>
            <div class="txt"></div> </div
        ></el-col>
        <el-col :span="6">
          <div class="info-item">
            <div class="tit">迁前地址：</div>
            <div class="txt"></div> </div
        ></el-col>
        <el-col :span="6">
          <div class="info-item">
            <div class="tit">安置住址：</div>
            <div class="txt"></div> </div
        ></el-col>
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

    <div class="other" v-if="type == 'villageInfoC'">
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
import { ElRow, ElCol } from 'element-plus'
import { ReportStatus } from '../config'
import { ref, onMounted } from 'vue'
interface PropsType {
  baseInfo: any
  type: any
  tabCurrentId
}

const infoData = ref<any>({ icon: 'mdi:user-circle' })
const props = defineProps<PropsType>()
onMounted(() => {
  if (props.type == 'Landlord') {
    infoData.value = { icon: 'mdi:user-circle' }
  } else if (props.type == 'Enterprise') {
    infoData.value = { icon: 'carbon:enterprise' }
  } else if (props.type == 'IndividualB') {
    infoData.value = { icon: 'material-symbols:add-business' }
  } else if (props.type == 'villageInfoC') {
    infoData.value = { icon: 'ic:round-holiday-village' }
  }
})
</script>

<style lang="less" scoped>
.user-info {
  min-height: 88px;
  margin-top: 14px;
  background: #f5f7fa;
  border: 1px solid #e8eaf0;
  border-radius: 4px;

  .base {
    display: flex;
    height: 40px;
    padding: 0 16px;
    background: rgba(237, 245, 255, 1);
    border-bottom: 1px dashed #e6ecf4;
    align-items: center;
    justify-content: space-between;

    .user {
      display: flex;
      align-items: center;
    }

    .status {
      display: flex;
      height: 24px;
      padding: 0 13px 0 10px;
      font-size: 12px;
      color: #ff2d2d;
      background: #ffffff;
      border: 1px solid #ff5d5d;
      border-radius: 14px;
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
    height: 48px;
    padding: 0 16px;
    align-items: center;
    background: rgba(237, 245, 255, 1);

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
