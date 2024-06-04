<template>
  <WorkContentWrap>
    <div class="flex items-center">
      <ElButton
        @click="onBack"
        :icon="BackIcon"
        type="default"
        class="px-9px py-0px !h-28px mr-8px !text-12px"
      >
        返回
      </ElButton>
      <ElBreadcrumb separator="/">
        <ElBreadcrumbItem class="text-size-12px">资金管理</ElBreadcrumbItem>
        <ElBreadcrumbItem class="text-size-12px">资金支付详情</ElBreadcrumbItem>
      </ElBreadcrumb>
    </div>

    <div class="table-wrap">
      <div class="common-title">
        <div class="line"></div>
        <div class="tit">资金支付详情</div>
      </div>
      <div class="row-cont">
        <div class="row">
          <div class="label">申请类型：</div>
          <div class="value">{{ detail.applyTypeText }}</div>
        </div>

        <div class="row">
          <div class="label">申请名称：</div>
          <div class="value">{{ detail.name }}</div>
        </div>
        <div class="row">
          <div class="label">概算科目：</div>
          <div class="value">{{ detail.typeText }}</div>
        </div>
        <div class="row">
          <div class="label">资金科目：</div>
          <div class="value">{{ detail.funSubjectIdText }}</div>
        </div>

        <div class="row">
          <div class="label">付款说明:</div>
          <div class="value">{{ detail.remark }}</div>
        </div>

        <div class="row">
          <div class="label">申请时间:</div>
          <div class="value">{{
            detail.createTime ? dayjs(detail.createTime).format('YYYY-MM-DD') : '-'
          }}</div>
        </div>

        <div class="row">
          <div class="label">申请人:</div>
          <div class="value">{{ detail.createUserName }}</div>
        </div>

        <div class="row">
          <div class="label">收款单位:</div>
          <div class="value">{{ detail.receivePaymentUnit }}</div>
        </div>

        <div class="row">
          <div class="label">付款时间:</div>
          <div class="value">{{
            detail.paymentTime ? dayjs(detail.paymentTime).format('YYYY-MM-DD') : '-'
          }}</div>
        </div>

        <div class="row">
          <div class="label">申请金额:</div>
          <div class="value">{{ detail.amount }}</div>
        </div>

        <div class="row">
          <div class="label">申请凭证:</div>
          <div class="value">
            <div class="img-list" v-if="detail.receipt && detail.receipt.length">
              <div
                class="img-box"
                @click="viewImg(item.url)"
                v-for="(item, index) in detail.receipt"
                :key="index"
              >
                <img class="img" :src="item.url" alt="" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <el-dialog title="查看图片" :width="920" v-model="dialogVisible">
      <img class="block w-full" :src="imgUrl" alt="Preview Image" />
    </el-dialog>
  </WorkContentWrap>
</template>

<script setup lang="ts">
import { unref, onMounted, ref, computed } from 'vue'
import { ElButton, ElBreadcrumb, ElBreadcrumbItem, ElDialog } from 'element-plus'
import { WorkContentWrap } from '@/components/ContentWrap'
import { useIcon } from '@/hooks/web/useIcon'
import { useRouter } from 'vue-router'
import { getfunPay } from '@/api/fundManage/fundEntry-service'
import dayjs from 'dayjs'
import { useDictStoreWithOut } from '@/store/modules/dict'
import { fmtDict } from '@/utils'

const { back, currentRoute } = useRouter()
const BackIcon = useIcon({ icon: 'iconoir:undo' })
const { query } = unref(currentRoute)
const id: number = query.id ? +query.id : 0
const dictStore = useDictStoreWithOut()
const dictObj = computed(() => dictStore.getDictObj)
const type: any = query.type
const detail = ref<any>({})
const dialogVisible = ref<boolean>(false)
const imgUrl = ref<string>('')
onMounted(() => {
  if (!id) {
    return
  }
  console.log(111, id)

  getfunPay(id).then((res) => {
    if (res) {
      if (res.receipt) {
        res.receipt = JSON.parse(res.receipt as string)
      }
      detail.value = res
    }
  })
})

const viewImg = (url: string) => {
  imgUrl.value = url
  dialogVisible.value = true
}

const onBack = () => {
  back()
}
</script>

<style scoped lang="less">
.row-cont {
  padding: 0 28px;
}

.row {
  display: flex;
  align-items: center;
  min-height: 64px;

  border-bottom: 1px solid #ebebeb;

  .label {
    width: 98px;
    font-size: 14px;
    color: #131313;
    text-align: right;
    flex-shrink: 0;
  }

  .value {
    flex: 1;
    padding-left: 16px;
    font-size: 14px;
    font-weight: 500;
    color: #171718;
  }

  .img-list {
    display: flex;
    width: 100%;
    padding-bottom: 10px;

    .img-box {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 200px;
      height: 200px;
      margin: 10px 10px 0 0;
      overflow: hidden;
      cursor: pointer;

      .img {
        width: 100%;
      }
    }
  }
}

.common-title {
  display: flex;
  align-items: center;
  height: 32px;
  padding: 0 16px;
  background: #f5f7fa;
  border: 1px solid #ebebeb;

  .line {
    width: 4px;
    height: 16px;
    margin-right: 8px;
    background: linear-gradient(90deg, #3e73ec 0%, #ffffff 100%);
    border-radius: 3px;
  }

  .tit {
    font-size: 14px;
    font-weight: 500;
    color: #131313;
  }
}
</style>
