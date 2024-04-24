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
      <div v-if="props.type == 'Landlord'">
        关联个体户：
        <ElLink
          class="pl-8px text-size-14px text-[#1C5DF1]"
          v-for="(item, index) in props.baseInfo.relateIndividualName?.split(',')"
          :key="item"
          @click="fillData('IndividualB', props.baseInfo.relateIndividualName, index)"
          style="color: #1c5df1"
        >
          {{ item }}&nbsp;&nbsp;&nbsp;&nbsp;
        </ElLink>
      </div>
      <div v-if="props.type == 'Landlord'">
        关联企业：<ElLink
          class="pl-8px text-size-14px text-[#1C5DF1]"
          v-for="(item, index) in props.baseInfo.relateCompanyName?.split(',')"
          :key="item"
          @click="fillData('Enterprise', props.baseInfo.relateCompanyName, index)"
          style="color: #1c5df1"
        >
          {{ item }}&nbsp;&nbsp;&nbsp;&nbsp;
        </ElLink>
      </div>
      <div
        v-if="props.type == 'Enterprise' || props.type == 'IndividualB'"
        @click="fillData('PeasantHousehold', props.baseInfo.householderName)"
      >
        关联居民户：
        <span class="pl-8px text-size-14px text-[#1C5DF1]">{{
          props.baseInfo.householderName || ''
        }}</span>
      </div>
      <ElSpace>
        <ElButton type="primary" @click="printReport"> 打印报表 </ElButton>
        <ElButton type="primary" @click="onDocumentation"> 档案上传 </ElButton>
        <div
          v-if="props.role === 'assessor'"
          :class="{
            status: true,
            success: props.datarole?.houseAllStatus === '1'
          }"
        >
          <span class="point"></span>
          {{ props.datarole?.houseAllStatus === '1' ? '已评估' : '未评估' }}
        </div>
        <div
          v-else
          :class="{
            status: true,
            success: props.datarole?.landAllStatus === '1'
          }"
        >
          <span class="point"></span>
          {{ props.datarole?.landAllStatus === '1' ? '已评估' : '未评估' }}
        </div>
        <div
          v-if="props.role === 'assessor'"
          :class="{
            status: true,
            success: props.baseInfo.houseImplementEscalationStatus === '1'
          }"
        >
          <span class="point"></span>
          {{ props.baseInfo.houseImplementEscalationStatus === '1' ? '报告已上传' : '报告未上传' }}
        </div>
        <div
          v-else
          :class="{
            status: true,
            success: props.baseInfo.landImplementEscalationStatus === '1'
          }"
        >
          <span class="point"></span>
          {{ props.baseInfo.landImplementEscalationStatus === '1' ? '报告已上传' : '报告未上传' }}
        </div>
      </ElSpace>
    </div>

    <!-- 居民户基础信息 -->
    <div class="other mt-15px" v-if="type == 'Landlord'" style="display: block">
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

    <div class="other" v-if="type == 'VillageInfoC'">
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
    <!-- 资产评估 -->
    <div class="other" style="display: block">
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
        <el-col :span="6" v-if="type != 'IndividualB'">
          <div class="info-item">
            <div class="tit">土地基本情况评估合计：</div>
            <div class="txt">{{ fmtStr(props.baseInfo.landTotalAmount, '（元）') }}</div>
          </div>
        </el-col>
        <el-col :span="6" v-if="type != 'IndividualB'">
          <div class="info-item">
            <div class="tit">土地青苗及附着物评估合计：</div>
            <div class="txt">{{ fmtStr(props.baseInfo.assetAppendantTotalAmount, '（元）') }}</div>
          </div>
        </el-col>
        <el-col :span="6" v-if="type == 'Landlord'">
          <div class="info-item">
            <div class="tit">坟墓评估合计：</div>
            <div class="txt">{{ fmtStr(props.baseInfo.graveTotalAmount, '（元）') }}</div>
          </div>
        </el-col>
        <el-col :span="6" v-if="type != 'Landlord' && type != 'VillageInfoC'">
          <div class="info-item">
            <div class="tit">设备设施评估合计：</div>
            <div class="txt">{{ fmtStr(props.baseInfo.equipmentTotalAmount, '（元）') }}</div>
          </div>
        </el-col>
        <el-col :span="6" v-if="type != 'Landlord'">
          <div class="info-item">
            <div class="tit">基础设施评估合计：</div>
            <div class="txt">{{ fmtStr(props.baseInfo.infrastructureTotalAmount, '（元）') }}</div>
          </div>
        </el-col>
        <el-col :span="6" v-if="type != 'Landlord' && type != 'VillageInfoC'">
          <div class="info-item">
            <div class="tit">其他评估合计：</div>
            <div class="txt">{{ fmtStr(props.baseInfo.otherTotalAmount, '（元）') }}</div>
          </div>
        </el-col>
        <el-col :span="6" v-if="type == 'VillageInfoC'">
          <div class="info-item">
            <div class="tit">小型专项及农副业设施评估合计：</div>
            <div class="txt">{{ fmtStr(props.baseInfo.facTotalAmount, '（元）') }}</div>
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
  </div>

  <!-- 档案上传 -->
  <OnDocumentation :show="showDialog" :door-no="props.doorNo" :type="type" @close="close" />
  <PrintReport
    :show="inExportDialog"
    @close="inExportDialogClose"
    :list="exportList"
    :type="type"
  />
</template>

<script lang="ts" setup>
import { ref, onMounted, watch } from 'vue'
import { ElRow, ElCol, ElSpace, ElButton } from 'element-plus'
import { fmtStr } from '@/utils/index'
import OnDocumentation from '../OnDocumentation/Index.vue'
import PrintReport from '@/views/Workshop/components/PrintReport.vue'
import { getExportReportApi } from '@/api/workshop/export/service'
import { useRouter } from 'vue-router'
const { push } = useRouter()

interface PropsType {
  doorNo: string
  baseInfo: any
  type: string
  householdId: number
  estimateStatus: string
  role: string
  datarole: any
}
interface exportListType {
  name: string
  value: string | number
}
const exportList = ref<exportListType[]>([
  {
    name: '房屋评估表',
    value: 'assetEval_company_house'
  },
  {
    name: '房屋装修表',
    value: 'assetEval_company_fitup'
  },
  {
    name: '附属物调查表',
    value: 'assetEval_company_appendage'
  },
  {
    name: '基础设施评估表',
    value: 'assetEval_company_infra'
  },
  {
    name: '零星林果木调查表',
    value: 'assetEval_company_tree'
  },
  {
    name: '其他评估表',
    value: 'assetEval_company_other'
  },
  {
    name: '设施设备表',
    value: 'assetEval_company_equipment'
  }
])
const inExportDialog = ref(false)
const inExportDialogClose = () => {
  inExportDialog.value = false
}
const props = defineProps<PropsType>()
const infoData = ref<any>({ icon: 'mdi:user-circle' })
const showDialog = ref(false)
const emit = defineEmits(['updateData'])
const parmas = ref<any>({
  type: null,
  doorNo: null
})
// 档案上传
const onDocumentation = () => {
  showDialog.value = true
}

// 打印报表
const printReport = async () => {
  // inExportDialog.value = true
  console.log('打印数据')
  if (props.type == 'Landlord') {
    parmas.value = {
      type: 'exportHouseEvalHousehold',
      doorNo: props.doorNo
    }
  } else if (props.type == 'Enterprise') {
    parmas.value = {
      type: 'exportHouseEvalCompany',
      doorNo: props.doorNo
    }
  } else if (props.type == 'IndividualB') {
    parmas.value = {
      type: 'exportHouseEvalIndividual',
      doorNo: props.doorNo
    }
  } else if (props.type == 'VillageInfoC') {
    parmas.value = {
      type: 'exportHouseEvalVillage',
      doorNo: props.doorNo
    }
  } else if (props.type == 'LandNoMoveL') {
    parmas.value = {
      type: 'exportHouseEvalLand', //type不详，后端暂未开发
      doorNo: props.doorNo
    }
  }
  console.log(props.type, '传递的type')
  const res = await getExportReportApi(parmas.value)
  getRes(res)
}

const getRes = (res: any) => {
  let filename = res.headers
  filename = filename['content-disposition']
  filename = filename.split(';')[1].split('filename=')[1]
  filename = decodeURIComponent(filename)
  let elink = document.createElement('a')
  document.body.appendChild(elink)
  elink.style.display = 'none'
  elink.download = filename
  let blob = new Blob([res.data])
  const URL = window.URL || window.webkitURL
  elink.href = URL.createObjectURL(blob)
  elink.click()
  document.body.removeChild(elink)
  URL.revokeObjectURL(elink.href)
}
// 关闭档案弹窗
const close = (flag: boolean) => {
  showDialog.value = false
  if (flag == true) {
    emit('updateData')
  }
}

onMounted(() => {
  console.log(props.type, 'type测试')
  if (props.type == 'Landlord') {
    infoData.value = { icon: 'mdi:user-circle' }
  } else if (props.type == 'Enterprise') {
    infoData.value = { icon: 'carbon:enterprise' }
  } else if (props.type == 'IndividualB') {
    infoData.value = { icon: 'material-symbols:add-business' }
  } else if (props.type == 'VillageInfoC') {
    infoData.value = { icon: 'ic:round-holiday-village' }
  }
})
watch(
  () => props.baseInfo.implementEscalationStatus,
  (val) => {
    console.log(val)
    console.log(props.baseInfo, '测试传输数据')
  },
  { deep: true }
)
const fillData = (row, name: any, index?: any) => {
  if (!name) return false
  console.log(row)
  if (row == 'IndividualB') {
    push({
      name: 'AssetEvaDataFill',
      query: {
        projectId: 56,
        householdId: props.baseInfo.relateIndividualId.split(',')[index],
        doorNo: props.baseInfo.relateIndividualDoorNo.split(',')[index],
        type: 'IndividualB'
      }
    })
  } else if (row == 'Enterprise') {
    push({
      name: 'AssetEvaDataFill',
      query: {
        projectId: 56,
        householdId: props.baseInfo.relateCompanyId.split(',')[index],
        doorNo: props.baseInfo.relateCompanyDoorNo.split(',')[index],
        type: 'Enterprise'
      }
    })
  } else {
    push({
      name: 'AssetEvaDataFill',
      query: {
        projectId: 56,
        householdId: props.baseInfo.householderId,
        doorNo: props.baseInfo.householderDoorNo,
        type: 'Landlord'
      }
    })
  }
  console.log(1)
}
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
