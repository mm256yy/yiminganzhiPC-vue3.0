<template>
  <div class="flex-col page">
    <div class="flex-col flex-auto section-member">
      <div class="flex-col list">
        <div class="flex-col list-item">
          <div class="flex-row row-field">
            <span class="userName">陈画礼</span>
            <div class="flex-col items-center role-txt">
              <span class="role role-owner">户主</span>
            </div>
          </div>
          <div class="flex-row row-field">
            <span class="label-left">人口性质</span>
            <span class="label-right">农村移民</span>
          </div>
          <div class="flex-row row-field">
            <span class="label-left">性别</span>
            <span class="label-right">男</span>
          </div>
          <div class="flex-row row-field">
            <span class="label-left">民族</span>
            <span class="label-right">汉族</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// import { ref } from 'vue'
// import type {MemberDtoType} from './type'

// const memberList = ref<MemberDtoType[]>([])
</script>

<style lang="less" scoped>
.page {
  height: 100vh;
  overflow-x: hidden;
  overflow-y: auto;
  background-color: #f2f6ff;

  .section-member {
    padding-top: 32px;
    overflow-y: auto;

    .list {
      padding: 0 32px;

      .list-item {
        padding: 32px 48px;
        margin-top: 10px;
        background-color: #ffffff;
        border-radius: 16px;
        box-shadow: 0px 0px 16px #0000000d;

        .row-field {
          height: 52px;
          padding: 15px 9;
          line-height: 52px;
        }

        .userName {
          padding-right: 24px;
          font-size: 36px;
          font-weight: bold;
          color: #363a44;
        }

        .role-txt {
          height: 36px;
          padding: 0 12px;
          margin-top: 5px;
          border: solid 2px #fec44c;
          border-radius: 4px;

          .role {
            height: 36px;
            font-size: 24px;
            line-height: 36px;
            color: #3e73ec;
            text-align: center;

            &.role-owner {
              color: #ffab00;
            }
          }
        }

        .label-left {
          width: 112px;
          font-size: 28px;
          font-weight: 400;
          color: #666666;
          text-align: right;
        }

        .label-right {
          padding-left: 24px;
          font-size: 28px;
          font-weight: 400;
          color: #131313;
        }
      }
    }
  }
}
</style>
