<template>
  <div class="house-pic">
    <div class="pic-img-box">
      <div class="pic-img"></div>
    </div>
    <div class="house-info">
      <div class="house-info-item">
        <div class="tit">4室2厅</div>
        <div class="txt">底层(共24层）</div>
      </div>

      <div class="house-info-item">
        <div class="tit">65㎡</div>
        <div class="txt">精装修</div>
      </div>

      <div class="house-info-item">
        <div class="tit">南北朝向</div>
        <div class="txt">2023年竣工</div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.house-pic {
  padding: 26px 30px 0;

  .house-info {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    padding: 16px 30px;

    .house-info-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 267px;
      height: 49px;
      margin-right: 20px;

      .tit {
        font-size: 18px;
        font-weight: bold;
        color: #171718;
      }

      .txt {
        margin-top: 4px;
        font-size: 14px;
        color: rgba(19, 19, 19, 0.4);
      }

      &:last-child {
        margin-right: 0;
      }
    }
  }

  .pic-img-box {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    padding: 12px 0;

    .pic-img {
      width: 447px;
      height: 396px;
      background-color: #999;
    }
  }
}
</style>
