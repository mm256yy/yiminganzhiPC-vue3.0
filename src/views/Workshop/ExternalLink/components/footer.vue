<!--
 * @Author: baike
 * @LastEditors: baike
-->
<template>
  <div class="footer">
    <span>Copyright ©2015 zdwp All Rights Reserved.</span>
    <span class="text_a">浙ICP备10000403号-1</span>
    <span>浙公网安备 33010202000111号</span>
    <span class="text_b">网站建设运维：浙水设计</span>
    <span class="text_c">联系我们</span>
  </div>
</template>
<script lang="ts" setup></script>

<style lang="less" scoped>
.footer {
  // display: flex;
  text-align: center;
  font-size: 14px;
  font-family: PingFang SC, PingFang SC;
  font-weight: 400;
  color: rgba(19, 19, 19, 0.4);
  line-height: 16px;
  margin-top: 15px;
  .text_a {
    margin: 0 45px 0 16px;
  }
  .text_b {
    margin-right: 48px;
  }
  .text_c {
    font-family: PingFang SC, PingFang SC;
    font-weight: 400;
    color: #3e73ec;
    line-height: 16px;
    background-image: linear-gradient(
      to bottom,
      transparent calc(100% - 2px),
      #3e73ec 2px,
      #3e73ec calc(100% - 1px),
      transparent 1px
    );
    background-repeat: repeat-x;
    background-position: bottom;
    cursor: pointer;
  }
}
</style>
