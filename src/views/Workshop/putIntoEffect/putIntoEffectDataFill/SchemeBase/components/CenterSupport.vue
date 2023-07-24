<template>
  <div class="homestead-wrap">
    <div class="common-form-group">
      <div class="common-form-item">
        <div class="common-label">户主：</div>
        <div class="common-value"> 王小虎 </div>
      </div>

      <div class="common-form-item">
        <div class="common-label">户内人口：</div>
        <div class="common-value"> 4 </div>
      </div>

      <div class="common-form-item">
        <div class="common-label">迁出地：</div>
        <div class="common-value"> fdsadsa </div>
      </div>

      <div class="common-form-item">
        <div class="common-label">联系方式：</div>
        <div class="common-value"> 2345554 </div>
      </div>
    </div>

    <div class="common-form-item">
      <div class="common-label">集中供养：</div>
      <div class="common-value"> 该户选择集中供养 </div>
    </div>
  </div>
</template>

<script lang="ts" setup></script>

<style lang="less" scoped>
.common-form-group {
  display: flex;
  align-items: center;
}

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
}
</style>
