<!--
 * @Author: baike
 * @LastEditors: baike
-->
<template>
  <div class="right_info">
    <div class="right_info_top">
      <Label>
        <template #title>
          <img class="xm_img" src="../../../../assets/imgs/homes/zj.png" alt="" />
        </template>
        <template #info>
          <view class="right_slot">
            <view class="right_text">查看更多</view>
            <view>
              <img class="look_icon" src="../../../../assets/imgs/homes/icon.png" alt=""
            /></view>
          </view>
        </template>
      </Label>
    </div>
    <div class="right_info_con">
      <Label>
        <template #title>
          <img class="xm_img" src="../../../../assets/imgs/homes/jd.png" alt="" />
        </template>
        <template #info>
          <view class="right_slot">
            <view class="right_text">查看更多</view>
            <view>
              <img class="look_icon" src="../../../../assets/imgs/homes/icon.png" alt=""
            /></view>
          </view>
        </template>
      </Label>
    </div>
    <div class="right_info_bom">
      <div class="bom_box_top">
        <img class="img_box" src="../../../../assets/imgs/homes/zh.png" alt="" />
      </div>
      <div class="bom_box_top">
        <img class="img_box" src="../../../../assets/imgs/homes/dsj.png" alt="" />
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import Label from './label.vue'
</script>

<style lang="less" scoped>
.right_info {
  .xm_img {
    width: 74px;
    height: 15px;
  }
  .right_slot {
    display: flex;
    cursor: pointer;
    .look_icon {
      width: 16px;
      height: 16px;
      margin-top: 2px;
    }
  }
  .right_info_top {
    width: 620px;
    height: 312px;
    background: #ffffff;
    box-shadow: 0px 3px 3px 0px rgba(62, 115, 236, 0.3);
    border-radius: 8px 8px 8px 8px;
    opacity: 1;
    border: 2px solid rgba(62, 115, 236, 0.7);
    margin-bottom: 12px;
    box-sizing: border-box;
  }
  .right_info_con {
    width: 620px;
    height: 402px;
    background: #ffffff;
    box-shadow: 0px 3px 3px 0px rgba(62, 115, 236, 0.3);
    border-radius: 8px 8px 8px 8px;
    opacity: 1;
    box-sizing: border-box;

    border: 2px solid rgba(62, 115, 236, 0.7);
  }
  .bom_box_top {
    margin-top: 12px;
    width: 620px;
    height: 100px;
    background: #ffffff;
    box-shadow: 0px 3px 3px 0px rgba(62, 115, 236, 0.3);
    border-radius: 8px 8px 8px 8px;
    opacity: 1;
    box-sizing: border-box;
    padding: 8px;
    border: 2px solid rgba(62, 115, 236, 0.7);
    .img_box {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
