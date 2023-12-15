<!--
 * @Author: baike
 * @LastEditors: baike
-->
<template>
  <div class="container_box">
    <div class="cin_top"></div>
    <div class="con_box">
      <Label>
        <template #title>
          <img class="xm_img" src="../../../../assets/imgs/homes/news.png" alt="" /> </template
      ></Label>
    </div>
    <div class="con_bom">
      <Label>
        <template #title>
          <img class="xm_img" src="../../../../assets/imgs/homes/xx.png" alt="" /> </template
      ></Label>
    </div>
  </div>
</template>
<script lang="ts" setup>
import Label from './label.vue'
</script>

<style lang="less" scoped>
.container_box {
  .xm_img {
    width: 74px;
    height: 20px;
    // margin-top: 2px;
  }
  .cin_top {
    width: 620px;
    height: 360px;
    background: red;
    border-radius: 8px 8px 8px 8px;
    margin-bottom: 12px;
  }
  .con_box {
    width: 620px;
    height: 298px;
    background: #ffffff;
    box-shadow: 0px 3px 3px 0px rgba(62, 115, 236, 0.3);
    margin-bottom: 12px;
    box-sizing: border-box;
    border-radius: 8px 8px 8px 8px;

    opacity: 1;
    border: 2px solid rgba(62, 115, 236, 0.7);
  }
  .con_bom {
    width: 620px;
    height: 268px;
    background: #ffffff;
    box-shadow: 0px 3px 3px 0px rgba(62, 115, 236, 0.3);
    box-sizing: border-box;

    border-radius: 8px 8px 8px 8px;
    opacity: 1;
    border: 2px solid rgba(62, 115, 236, 0.7);
  }
}
</style>
