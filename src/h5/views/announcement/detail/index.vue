<template>
  <div class="flex-col app-container">
    <div class="flex-col flex-auto group-detail">
      <div class="flex-col section">
        <span class="section-title">浙江省镜岭水库第一次选房通知公告公示时间为2023年8月13日</span>
        <span class="self-start section-time">2022-9-24</span>
        <div class="flex-col group-content">
          <img
            class="image-detail"
            src="https://codefun-proj-user-res-1256085488.cos.ap-guangzhou.myqcloud.com/64e83d955a7e3f0310414dfe/64e842454d98100011acce52/16929431167655394822.png"
          />
          <span class="section-content">
            浙江省气象信息网络中心浙江省气象监测预报能力提升工程(数字化预报项目)-集约化高性能计算系统建设中标公告
            2022年06月30日 16:43 来源:中国政府采购网 【打印】 【显示公告正文】【显示公告概要】
            公告概要: 公告信息: 采购项目名称
            浙江省气象监测预报能力提升工程(数字化预报项目)-集约化高性能计算系统建设 品目
            服务/租赁服务(不带操作员)/计算机设备和软件租赁服务 采购单位 浙江省气象信息网络中心
            行政区域 滨江区 公告时间 2022年06月30日 16:43
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup></script>

<style lang="less" scoped>
.group-detail {
  padding-top: 24px;
  overflow-y: auto;

  .section {
    padding: 32px 20px 32px 32px;
    background-color: #ffffff;

    .section-title {
      font-size: 36px;
      font-weight: 700;
      line-height: 44px;
      color: #333333;
    }

    .section-content {
      margin-top: 16px;
      font-family: PingFang SC;
      font-size: 28px;
      line-height: 48px;
      line-height: 40px;
      color: #666666;
    }

    .section-time:extend(.section-content) {
      font-family: PingFang SC;
      font-size: 28px;
      line-height: 48px;
      color: #666666;
    }

    .group-content {
      margin-top: 32px;

      .image-detail {
        width: 682px;
        height: 382px;
        margin-right: 16px;
        margin-left: 4px;
      }
    }
  }
}
</style>
