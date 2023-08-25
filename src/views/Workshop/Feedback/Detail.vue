<template>
  <WorkContentWrap>
    <ElBreadcrumb separator="/">
      <ElBreadcrumbItem class="text-size-12px">问题列表</ElBreadcrumbItem>
      <ElBreadcrumbItem class="text-size-12px">问题详情</ElBreadcrumbItem>
    </ElBreadcrumb>

    <div class="detail-box">
      <div class="flex items-center justify-between pb-12px">
        <div class="table-left-title"> </div>
        <ElSpace>
          <ElButton type="primary" :icon="editIcon" @click="addReasonItem">新增意见</ElButton>
          <ElButton type="primary" :icon="editIcon" @click="addReason">填写意见</ElButton>
        </ElSpace>
      </div>

      <div class="common-wrap">
        <div class="common-head">
          <div class="icon"></div>
          <div class="tit">问题详情</div>
        </div>

        <div class="common-cont">
          <div class="common-form-item">
            <div class="common-form-item child">
              <div class="common-label">户主：</div>
              <div class="common-value"> 到底是发 </div>
            </div>

            <div class="common-form-item child">
              <div class="common-label">工作阶段：</div>
              <div class="common-value"> 到底是发 </div>
            </div>

            <div class="common-form-item child">
              <div class="common-label">提交时间：</div>
              <div class="common-value"> 到底是发 </div>
            </div>
          </div>

          <div class="common-form-item">
            <div class="common-label">问题描述：</div>
            <div class="common-value"> 到底是发 </div>
          </div>

          <div class="common-form-item">
            <div class="common-label">处理结果：</div>
            <div class="common-value"> 到底是发 </div>
          </div>
        </div>
      </div>

      <div class="common-wrap">
        <div class="common-head">
          <div class="icon"></div>
          <div class="tit">已读</div>
        </div>

        <div class="common-cont">
          <div class="common-form-item">
            <div class="common-label">用户名：</div>
            <div class="common-value"> 到底是发 </div>
          </div>
        </div>
      </div>

      <div class="common-wrap">
        <div class="common-head">
          <div class="icon"></div>
          <div class="tit">领导意见</div>
        </div>

        <div class="common-cont">
          <div class="reason-item">
            <div class="reason-lt">
              <img class="icon" src="@/assets/imgs/icon_role.png" alt="" />
              <div class="line"></div>
            </div>
            <div class="reason-rt">
              <div class="user-time">
                <div class="ure">张三</div>
                <div class="time">234-4442-222</div>
              </div>

              <div class="reason-cont">分手了咖啡了但是你你付款但是连卡佛那就是你</div>
            </div>
          </div>

          <div class="reason-item">
            <div class="reason-lt">
              <img class="icon" src="@/assets/imgs/icon_role.png" alt="" />
              <div class="line"></div>
            </div>
            <div class="reason-rt">
              <div class="user-time">
                <div class="ure">李四</div>
                <div class="time">234-4442-222</div>
              </div>

              <div class="reason-cont">分手了咖啡了但是你你付款但是连卡佛那就是你</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <EditForm :show="reasonShow" :action-type="'add'" @close="reasonShow = false" />

    <FeedbackForm :show="feedbackShow" :action-type="'add'" @close="feedbackShow = false" />
  </WorkContentWrap>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { ElBreadcrumb, ElBreadcrumbItem, ElSpace, ElButton } from 'element-plus'
import { WorkContentWrap } from '@/components/ContentWrap'
import { useIcon } from '@/hooks/web/useIcon'
import EditForm from './EditForm.vue'
import FeedbackForm from './FeedbackForm.vue'

const editIcon = useIcon({ icon: 'material-symbols:edit-square-outline-rounded' })
const reasonShow = ref<boolean>(false)
const feedbackShow = ref<boolean>(false)

const addReason = () => {
  reasonShow.value = true
}

const addReasonItem = () => {
  feedbackShow.value = true
}
</script>

<style lang="less" scoped>
.detail-box {
  padding: 8px;
  margin-top: 12px;
  background-color: #fff;
}

.common-wrap {
  background-color: #fff;
  border: 1px solid #ebebeb;

  .common-head {
    display: flex;
    width: 100%;
    height: 32px;
    padding: 0 16px;
    background: #f6f6f6;
    border-bottom: 1px solid #ebebeb;
    border-radius: 4px 4px 0px 0px;
    opacity: 1;
    align-items: center;

    .icon {
      width: 4px;
      height: 16px;
      margin-right: 8px;
      background: linear-gradient(90deg, #3e73ec 0%, #ffffff 100%);
      border-radius: 3px 3px 3px 3px;
    }

    .tit {
      font-size: 14px;
      font-weight: 500;
      color: #131313;
    }
  }

  .common-cont {
    padding: 0 28px;
  }
}

.common-form-item {
  display: flex;
  align-items: center;
  padding: 22px 0;
  border-bottom: 1px dotted #ebebeb;

  &.child {
    padding: 0;
    border-bottom: 0 none;
  }

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

.reason-item {
  display: flex;
  width: 100%;
  margin-top: 16px;
  margin-bottom: 34px;

  .reason-lt {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 32px;

    .icon {
      width: 32px;
      height: 32px;
    }

    .line {
      width: 1px;
      height: 60px;
      background-color: #ebebeb;
    }
  }

  .reason-rt {
    flex: 1;
    padding-left: 10px;

    .user-time {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .user {
        font-size: 16px;
        font-weight: 500;
        color: #171718;
      }

      .time {
        font-size: 14px;
        font-weight: 500;
        color: rgba(19, 19, 19, 0.4);
      }
    }

    .reason-cont {
      height: 60px;
      padding: 20px;
      margin-top: 10px;
      background-color: #f6f6f6;
      border-radius: 4px;
    }
  }
}
</style>
