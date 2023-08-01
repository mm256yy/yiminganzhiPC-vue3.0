<template>
  <div class="farming-wrap">
    <div class="farming-head">
      <div class="title">农业安置</div>
      <ElSpace>
        <ElButton v-if="hasFarmingResettle" type="primary" @click="onSortSave">档案上传</ElButton>
      </ElSpace>
    </div>

    <div class="common-wrap">
      <div class="common-head">
        <div class="icon"></div>
        <div class="tit">生产用地</div>
      </div>

      <div class="common-cont">
        <div class="base-info">
          <div class="base-item">
            <div class="label">区块：</div>
            <div class="value">{{
              productionLandInfo ? productionLandInfo.settleAddress : ''
            }}</div>
          </div>
          <div class="base-item">
            <div class="label">地块编号：</div>
            <div class="value">{{ productionLandInfo ? productionLandInfo.landNo : '' }}</div>
          </div>
          <div class="base-item">
            <div class="label">面积：</div>
            <div class="value">{{ productionLandInfo ? productionLandInfo.landArea : '' }}</div>
          </div>
        </div>
      </div>

      <div class="common-head">
        <div class="icon"></div>
        <div class="tit">农业安置办理</div>
      </div>

      <div class="common-cont">
        <div class="flex-center" v-if="!hasFarmingResettle">
          <div class="txt">该户无农业安置</div>
        </div>
        <div class="flex-center" v-else-if="hasFarmingResettle && farmingResettleStatus === '0'">
          <Icon icon="gis:flag-start" color="#999999" :size="20" />
          <div class="txt">该户农业安置办理未完成</div>
        </div>
        <div class="flex-center" v-else-if="hasFarmingResettle && farmingResettleStatus === '1'">
          <Icon icon="gis:flag-start" color="#3E73EC" :size="20" />
          <div class="txt">该户农业安置办理已完成</div>
        </div>
      </div>
    </div>

    <FarmingArchives
      :door-no="props.doorNo"
      :show="farmingArchivesPup"
      @close="farmingArchivesClose"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElSpace, ElButton } from 'element-plus'
import { getProduceLandInfoApi } from '@/api/putIntoEffect/produce'
import FarmingArchives from './farmingArchives.vue'
import { getDocumentApi } from '@/api/putIntoEffect/empty'
import { getDemographicListApi } from '@/api/workshop/population/service'

interface PropsType {
  doorNo: string
  baseInfo: any
}

const props = defineProps<PropsType>()
const farmingArchivesPup = ref<boolean>(false)
const productionLandInfo = ref<any>(null)
const hasFarmingResettle = ref<boolean>(false) // 是否存在 农业安置的人
const farmingResettleStatus = ref<'0' | '1'>('0')

// 获取档案数据
const getFarming = () => {
  getDocumentApi(props.doorNo).then((res: any) => {
    // console.log(res, '档案数据')
    if (res && res.agriculturePic) {
      // 有安置凭证 则为已经安置
      farmingResettleStatus.value = '1'
    }
  })
}

// 获取列表数据
const getList = () => {
  getDemographicListApi({
    projectId: props.baseInfo.projectId,
    page: 0,
    size: 50,
    doorNo: props.doorNo,
    settingWay: '1', // 农业 安置方式
    isDelete: '0'
  }).then((res) => {
    hasFarmingResettle.value = res.content.length > 0
  })
}

const init = async () => {
  const res = await getProduceLandInfoApi(props.doorNo)
  // console.log(res, '生产用地详情')
  if (res) {
    productionLandInfo.value = res
  }
}

onMounted(() => {
  init()
  getList()
  getFarming()
})

const onSortSave = () => {
  farmingArchivesPup.value = true
}

const farmingArchivesClose = () => {
  farmingArchivesPup.value = false
}
</script>

<style lang="less" scoped>
.farming-wrap {
  padding: 16px;
  margin-top: 16px;
  background-color: #ffffff;
}

.farming-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 12px;

  .title {
    font-size: 16px;
    font-weight: 500;
    color: #171717;
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
    padding: 40px 28px;
  }
}

.base-info {
  display: flex;
  align-items: center;

  .base-item {
    flex: 33%;
    display: flex;
    align-items: center;

    .label {
      width: 100px;
      font-size: 14px;
      font-weight: 600;
      color: #131313;
    }

    .value {
      font-size: 14px;
      color: #131313;
    }
  }
}

.flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

.txt {
  margin-left: 10px;
  font-size: 14px;
  color: #171717;
}
</style>
