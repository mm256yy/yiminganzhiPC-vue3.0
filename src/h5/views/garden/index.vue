<template>
  <div class="flex-col page">
    <div v-if="false" class="flex-col group_garden">
      <div class="flex-col relative section" v-for="i in dataList" :key="i.id">
        <ElImage
          class="garden-section"
          :src="i.pic != '[]' ? JSON.parse(i.pic)[0].url : ''"
          fit="cover"
          alt="美丽家园"
        />
        <div class="equal-division">
          <div class="group-garden-item" @click="toLink('planEffect', { id: i.pic })">
            <img class="image_garden-item" :src="planEffectSrc" />
            <span class="garden-item-txt">规划效果</span>
          </div>
          <div class="horiz-divider"></div>
          <div class="group-garden-item">
            <img class="image_garden-item" :src="iconVrLive" />
            <span class="garden-item-txt">VR实景</span>
          </div>
          <div class="horiz-divider"></div>
          <div class="group-garden-item">
            <img class="image_garden-item" :src="iconSmartSite" />
            <span class="garden-item-txt">智慧工地</span>
          </div>
        </div>
      </div>
    </div>
    <Expect :title="expectStr" />
  </div>
</template>
<script lang="ts" setup>
import { ElImage } from 'element-plus'
import planEffectSrc from '@/h5/assets/imgs/icon_plan_effect.png'
import iconSmartSite from '@/h5/assets/imgs/icon_smart_site.png'
import iconVrLive from '@/h5/assets/imgs/icon_vr_live.png'
import { useRouter } from 'vue-router'
import { onMounted, ref } from 'vue'
import { getsettleAddress } from './service'
import Expect from '@/h5/components/Expect/index.vue'

const { push } = useRouter()

const expectStr = '建设中，敬请期待...'

const toLink = (routeName: string, query = {}) => {
  push({
    name: routeName,
    query
  })
}
let dataList: any = ref({})
let getsettleAddressX = async () => {
  let data = await getsettleAddress()
  dataList.value = data.content
  console.log(data.content)
}
onMounted(() => {
  getsettleAddressX()
})
</script>

<style lang="less" scoped>
.page {
  height: 100vh;
  padding: 20px 0;
  overflow-x: hidden;
  overflow-y: auto;
  background-color: #f2f6ff;

  .group_garden {
    padding: 0 30px;

    .section {
      border-radius: 16px;
      box-shadow: 0px 0px 28px #0000000d;

      .garden-section {
        height: 240px;
        overflow: hidden;
        background-color: #ebebeb;
        border-radius: 16px 16px 0px 0px;
      }

      .equal-division {
        display: flex;
        padding: 22px 8px;
        background-color: #ffffff;
        border-radius: 0px 0px 16px 16px;
        align-items: center;

        .group-garden-item {
          flex: 1 auto;
          display: flex;
          padding: 10px 24px;
          align-items: center;

          .image_garden-item {
            width: 48px;
            height: 48px;
            border-radius: 48px;
          }

          .garden-item-txt {
            padding-left: 10px;
            font-size: 28px;
            line-height: 26px;
            color: #131313;
          }
        }

        .horiz-divider {
          width: 2px;
          height: 28px;
          margin: 20px 0;
          background-color: #ebebeb;
          flex-shrink: 0;
        }
      }
    }
  }
}
</style>
