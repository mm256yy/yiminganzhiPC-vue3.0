<!--
 * @Author: baike
 * @LastEditors: baike
-->
<template>
  <div class="label">
    <div class="title">
      <slot name="title"></slot>
    </div>
    <div class="right_info">
      <slot name="info"></slot>
    </div>
  </div>
</template>
<script lang="ts" setup></script>

<style lang="less" scoped>
.label {
  width: 100%;
  height: 46px;
  background: linear-gradient(180deg, #d5e1ff 0%, #ffffff 100%);
  border-radius: 8px 8px 0px 0px;
  opacity: 1;
  border: 1px solid #ffffff;
  display: flex;
  justify-content: space-between;
  padding: 12px 16px 0 16px;
  position: relative;
  .title {
    margin-left: 6px;
  }
  .title::before {
    content: '';
    width: 4px;
    height: 14px;
    background: #3e73ec;
    border-radius: 4px 4px 4px 4px;
    opacity: 1;
    display: block;
    color: #3e73ec;
    position: absolute;
    top: 16px;
    left: 12px;
  }
}
</style>
