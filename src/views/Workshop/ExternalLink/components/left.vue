<!--
 * @Author: baike
 * @LastEditors: baike
-->
<template>
  <div class="letf_info">
    <div class="header">
      <Label>
        <template #title>
          <img class="xm_img" src="../../../../assets/imgs/homes/xm.png" alt="" />
        </template>
        <template #info>
          <ElSelect
            clearable
            filterable
            v-model="reason"
            class="w-full"
            @change="tabVillage"
            placeholder="全域"
            @clear="clearInput"
          >
            <ElOption
              v-for="item in villageLists"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            />
          </ElSelect>
        </template>
      </Label>
      <div class="con_box">
        工程永久用地总面积为14375.60亩(国有土地2146.65亩、集体土地12228.95亩)，其中工程建设区和水库淹没区共14087.30亩，涉及绍兴市柯桥区69.73亩，嵊州市28.61亩，新昌县13969.13亩，磐安县19.82亩。
        工程管理区范围内补偿土地总面积288.30亩，涉及绍兴市柯桥区8.99亩，嵊州市13.14亩，新昌县266.17亩。
      </div>
    </div>
    <div class="contain">
      <Label>
        <template #title>
          <img class="xm_img" src="../../../../assets/imgs/homes/ym.png" alt="" />
        </template>
      </Label>
    </div>
  </div>
</template>
<script lang="ts" setup>
import Label from './label.vue'
import { ref, onMounted } from 'vue'
import {
  getLeadershipScreen,
  feedbackList,
  getVillageList
} from '@/api/AssetEvaluation/leader-side'
import { ElTabs, ElTabPane, ElSelect, ElOption } from 'element-plus'

onMounted(() => {
  villageList()
  //getToken()
})

const reason = ref()
const villageLists = ref<any>([])
const landScreenDtoListObj = ref<any>({})

const villageList = async () => {
  villageLists.value = await getVillageList({})
}

const tabVillage = () => {}

const clearInput = () => {}
</script>

<style lang="less" scoped>
.letf_info {
  .header {
    width: 620px;
    height: 182px;
    background: #ffffff;
    box-shadow: 0px 3px 3px 0px rgba(62, 115, 236, 0.3);
    border-radius: 8px 8px 8px 8px;
    opacity: 1;
    border: 2px solid rgba(62, 115, 236, 0.7);
    box-sizing: border-box;
    margin-bottom: 13px;

    .w-full {
      width: 80px;
      height: 24px;
    }
    .con_box {
      padding: 16px;
      font-size: 14px;
      font-family: PingFang SC, PingFang SC;
      font-weight: 400;
      color: #171718;
      line-height: 20px;
    }
  }
  .xm_img {
    width: 74px;
    height: 20px;
    // margin-top: 2px;
  }
  .contain {
    width: 620px;
    height: 755px;
    background: #ffffff;
    box-shadow: 0px 3px 3px 0px rgba(62, 115, 236, 0.3);
    border-radius: 8px 8px 8px 8px;
    opacity: 1;
    border: 2px solid rgba(62, 115, 236, 0.7);
  }
}
</style>
