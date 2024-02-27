<template>
  <div class="flex-col page">
    <div class="flex-col group_step">
      <div v-for="(item, index) in stepList" :key="index" class="step-list">
        <div class="step" :style="{ background: getTypeBgColor(item.field) }">
          <img style="width: 25px; height: 25px" :src="getTypeImage(item.field)" />
          <div class="step-word" :style="{ color: getTypeNameColor(item.field) }">
            {{ item.name }}
          </div>
        </div>
        <img width="20" height="48" v-if="index < 7" :src="iconArrowDownSrc" alt="向下箭头" />
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ElImage } from 'element-plus'
import { onMounted, ref } from 'vue'
import { getH5ImmigrantFilling } from './service'
import circleUndoSrc from '@/h5/assets/imgs/icon_circle_undo.png'
import circleDoneSrc from '@/h5/assets/imgs/icon_circle_done.png'
import iconArrowDownSrc from '@/h5/assets/imgs/icon_arrow_down.png'

let stepList = ref<any[]>([
  {
    name: '资格认定',
    field: 'qualificationStatus',
    value: null
  },
  {
    name: '资产评估',
    field: 'estimateeStatus',
    value: null
  },
  {
    name: '安置确认',
    field: 'arrangementStatus',
    value: null
  },
  {
    name: '择址确认',
    field: 'chooseStatus',
    value: null
  },
  {
    name: '腾空过渡',
    field: 'excessSoarStatus',
    value: null
  },
  {
    name: '动迁协议',
    field: 'agreementStatus',
    value: null
  },
  {
    name: '搬迁安置',
    field: 'relocateArrangementStatus',
    value: null
  },
  {
    name: '生产安置',
    field: 'productionArrangementStatus',
    value: null
  }
])

const getTypeImage = (value: any) => {
  return value && value === '1' ? circleDoneSrc : circleUndoSrc
}

const getTypeBgColor = (value: any) => {
  return value && value === '1' ? '#3E73EC' : '#FFFFFF'
}

const getTypeNameColor = (value: any) => {
  return value && value === '1' ? '#FFFFFF' : '#131313'
}

let requestImmigrantFilling = async () => {
  let data = await getH5ImmigrantFilling()
  stepList.value = stepList.value.map((item) => {
    return {
      name: item.name,
      value: data[item.field]
    }
  })
}
onMounted(() => {
  requestImmigrantFilling()
})
</script>

<style lang="less" scoped>
.page {
  height: 100vh;
  padding: 20px 0;
  overflow-x: hidden;
  overflow-y: auto;
  background-color: #f2f6ff;

  .group_step {
    padding: 30px;

    .step-list {
      align-items: center;
      display: flex;
      justify-content: center;
      flex-direction: column;

      .step {
        display: flex;
        // width: 270px;
        height: 104px;
        padding: 30px;
        background: #3e73ec;
        border-radius: 16px;
        align-items: center;

        .step-word {
          margin-left: 24px;
          font-size: 34px;
          font-weight: 400;
          line-height: 40px;
        }
      }
    }
  }
}
</style>
