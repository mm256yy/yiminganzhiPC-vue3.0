<template>
  <div class="homestead-wrap">
    <div class="common-form-item">
      <div class="common-label">宅基地安置人数：</div>
      <div class="common-value"> 5人，其中该户农村移民 ：2 人，随迁人口：3人 </div>
    </div>

    <div class="common-form-item">
      <div class="common-label">可安置建筑面积：</div>
      <div class="common-value"> 200㎡ </div>
    </div>

    <div class="common-form-item">
      <div class="common-label">可选安置点：</div>
      <div class="common-value">
        <el-radio-group v-model="radio1">
          <el-radio :label="item.id" size="large" v-for="item in resettleArea" :key="item.id">
            {{ item.name }}
          </el-radio>
        </el-radio-group>
        <div class="blue-row">
          <div class="blue-view" v-for="item in resettleArea" :key="item.id">地块详情</div>
        </div>
      </div>
    </div>

    <div class="common-form-item">
      <div class="common-label">可选安置点：</div>
      <div class="common-value">
        <el-radio-group v-model="radio2">
          <el-radio size="large" v-for="item in homesteadAreaSize" :key="item.id" :label="item.id"
            >{{ item.name }}{{ item.unit }}</el-radio
          >
        </el-radio-group>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { ElRadioGroup, ElRadio } from 'element-plus'
import { resettleArea, homesteadAreaSize } from './config'

const radio1 = ref(1)
const radio2 = ref(2)
</script>

<style lang="less" scoped>
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

  .blue-row {
    display: flex;
    align-items: center;

    .blue-view {
      width: 130px;
      padding-left: 20px;
      line-height: 16px;
      color: #3e73ec;
      cursor: pointer;
      user-select: none;
    }
  }
}
</style>
