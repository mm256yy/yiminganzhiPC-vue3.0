<template>
  <div class="bigBox">
    <div style="margin: 10px 0">
      <ElBreadcrumb separator="/">
        <ElBreadcrumbItem class="text-size-12px">信息填报</ElBreadcrumbItem>
        <ElBreadcrumbItem class="text-size-12px">结束实物采集</ElBreadcrumbItem>
      </ElBreadcrumb>
    </div>

    <div class="head">
      <div class="title">
        <div>实物采集汇总</div>
        <el-button @click="btnClick" type="success">
          <Icon icon="material-symbols:check-circle-outline" class="mr-5px" style="color: white" />
          实物采集确认批复
        </el-button>
        <!-- <el-button @click="btnClick" type="danger">
          <Icon icon="mingcute:folder-upload-line" class="mr-5px" style="color: white" />
          实物采集确认批复
        </el-button> -->
      </div>
      <div class="contentBox">
        <div class="content">
          <div class="text1">
            <div>涉及总居民户</div>
            <div class="numberBox"
              >{{ statisticalInfo.peasantHouseholdTotalCount }} <span>户</span>
            </div>
          </div>
          <div class="shu"> </div>
          <div class="text2">
            <div>
              <span
                >居民户
                <span style="color: red">{{ statisticalInfo.notPropertyAccountCount }}</span>
                户</span
              >
            </div>
            <div style="margin-top: 5px">
              <span
                >财产户
                <span style="color: red">{{ statisticalInfo.propertyAccountCount }}</span> 户</span
              >
            </div>
          </div>
        </div>
        <div class="content">
          <div class="text1">
            <div>涉及总人口</div>
            <div class="numberBox">{{ statisticalInfo.demographicCount }} <span>户</span> </div>
          </div>
          <div class="shu"> </div>
          <div class="text2">
            <div>
              <span
                >册内人口 <span style="color: red">{{ statisticalInfo.inCount }}</span> 户</span
              >
            </div>
            <div style="margin-top: 5px">
              <span
                >册外人口 <span style="color: red">{{ statisticalInfo.outCount }}</span> 户</span
              >
            </div>
          </div>
        </div>
        <div class="content content3">
          <div class="textbox">
            <div class="text">涉及个体户</div>
            <div class="numberBox"
              >{{ statisticalInfo.individualHouseholdTotalCount }} <span>家</span>
            </div>
          </div>
          <div class="textbox">
            <div class="text">涉及企业</div>
            <div class="numberBox">{{ statisticalInfo.companyTotalCount }} <span>家</span> </div>
          </div>
        </div>
        <div class="content">
          <div class="text1">
            <div>涉及村集体</div>
            <div class="numberBox">{{ statisticalInfo.villageTotalCount }} <span>个</span> </div>
          </div>
          <div class="shu"> </div>
          <div class="text2">
            <div>
              <span
                >区县 <span style="color: red">{{ statisticalInfo.areaCodeCount }}</span> 个</span
              >
            </div>
            <div style="margin-top: 5px">
              <span
                >自然村
                <span style="color: red">{{ statisticalInfo.initialVillageCodeCount }}</span>
                个</span
              >
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="steps">
      <div style="text-align: center">
        <el-button @click="endInvestigate" type="primary" style="width: 150px">
          <template #icon> <img src="./icon_gd.png" alt="" style="margin-bottom: 3px" /> </template>
          阶段结束
        </el-button>
      </div>
      <div class="stepsBox">
        <el-steps align-center>
          <el-step>
            <template #title><div class="title">实物采集数据归档</div></template>

            <template #icon>
              <img v-if="stepActiveIndex <= 0" src="./icon_wwc.png" alt="" />
              <div
                v-else-if="stepActiveIndex === 1"
                v-loading="true"
                style="left: -20px; height: 37px"
              ></div>
              <img v-else-if="stepActiveIndex >= 2" src="./icon_wc.png" alt="" />
            </template>

            <template #description>
              <div style="position: relative">
                <div class="descriptionDiv">
                  <div v-if="stepActiveIndex <= 0">未开始</div>
                  <div v-else-if="stepActiveIndex === 1">进行中</div>
                  <div v-else-if="stepActiveIndex >= 2">已完成</div>
                </div>
              </div>
            </template>
          </el-step>
          <el-step title="实物复核数据库初始化">
            <template #title><div class="title">实物复核数据库初始化</div></template>
            <template #icon>
              <img v-if="stepActiveIndex <= 3" src="./icon_wwc.png" alt="" />
              <div
                v-else-if="stepActiveIndex === 4"
                v-loading="true"
                style="left: -20px; height: 37px"
              ></div>
              <img v-else-if="stepActiveIndex >= 5" src="./icon_wc.png" alt="" />
            </template>
            <template #description>
              <div style="position: relative">
                <div class="descriptionDiv">
                  <div v-if="stepActiveIndex <= 3">未开始</div>
                  <div v-else-if="stepActiveIndex === 4">进行中</div>
                  <div v-else-if="stepActiveIndex >= 5">已完成</div>
                </div>
              </div>
            </template>
          </el-step>
          <el-step title="实物采集结束">
            <template #title><div class="title">实物采集结束</div></template>
            <template #icon>
              <img v-if="stepActiveIndex <= 6" src="./icon_wwc.png" alt="" />
              <div
                v-else-if="stepActiveIndex === 7"
                v-loading="true"
                style="left: -20px; height: 37px"
              ></div>
              <img v-else-if="stepActiveIndex >= 8" src="./icon_wc.png" alt="" />
            </template>
            <template #description>
              <div style="position: relative">
                <div class="descriptionDiv">
                  <div v-if="stepActiveIndex <= 6">未开始</div>
                  <div v-else-if="stepActiveIndex === 7">进行中</div>
                  <div v-else-if="stepActiveIndex >= 8">已完成</div>
                </div>
              </div>
            </template>
          </el-step>
        </el-steps>
      </div>
    </div>
    <EditForm
      :show="editFormShow"
      :action-type="actionType"
      :report-type="reportType"
      @close="onFormPupClose"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useAppStore } from '@/store/modules/app'
import { reviewProjectApi, getProjectStatisticalApi } from '@/api/project/index'
import { ElBreadcrumb, ElBreadcrumbItem, ElButton, ElSteps, ElStep } from 'element-plus'
import EditForm from './components/EditForm.vue'

interface StatisticalType {
  areaCodeCount: number
  companyTotalCount: number
  demographicCount: number
  inCount: number
  individualHouseholdTotalCount: number
  initialVillageCodeCount: number
  notPropertyAccountCount: number
  otherCount: number
  outCount: number
  peasantHouseholdTotalCount: number
  propertyAccountCount: number
  villageTotalCount: number
}

const appStore = useAppStore()
const editFormShow = ref()
const actionType = ref('add')
const reportType = ref()
const statisticalInfo = ref<Partial<StatisticalType>>({})
const stepActiveIndex = ref(0)
const intervalId = ref()

const projectStatus = computed(() => {
  return appStore.getProjectStatus
})
const onFormPupClose = (flag: boolean) => {
  editFormShow.value = false
  console.log(flag)
}

const btnClick = () => {
  editFormShow.value = true
}

// 获取统计信息
const getStatistical = async () => {
  const res = await getProjectStatisticalApi()
  // console.log(res, 'res')
  statisticalInfo.value = res || {}
}

const endInvestigate = async () => {
  if (projectStatus.value === 'review') {
    return
  }
  clearInterval(intervalId.value)
  stepActiveIndex.value = 0
  animationHandle()
  reviewProjectApi()
    .then(() => {
      stepActiveIndex.value = 8
      appStore.setProjectStatus('review')
    })
    .catch((res) => {
      if (res?.response?.data?.message === '提示: 该项目已经复核') {
        clearInterval(intervalId.value)
        stepActiveIndex.value = 8
      } else {
        clearInterval(intervalId.value)
        stepActiveIndex.value = 0
      }
    })
}

const animationHandle = () => {
  intervalId.value = setInterval(() => {
    if (stepActiveIndex.value >= 7) {
      clearInterval(intervalId.value)
      return
    }
    stepActiveIndex.value += 1
  }, 2000)
}

onMounted(() => {
  getStatistical()
  console.log(projectStatus.value, 'status')
  if (projectStatus.value === 'review') {
    stepActiveIndex.value = 8
  }
})
</script>

<style lang="less" scoped>
.bigBox {
  width: 1408px;
  margin: 0 auto;
  background: #e7edfd;
  border-radius: 8px 8px 8px 8px;
  opacity: 1;

  .head {
    width: 1408px;

    padding: 15px 16px 25px 16px;
    background: #ffffff;
    border-radius: 4px 4px 4px 4px;
    opacity: 1;

    .title {
      display: flex;
      margin-bottom: 16px;
      font-family: PingFang SC-Bold, PingFang SC;
      font-size: 16px;
      font-weight: bold;
      color: #171718;
      justify-content: space-between;
    }

    .contentBox {
      display: flex;
      justify-content: space-between;

      .content {
        display: flex;
        width: 330px;

        height: 112px;
        background: #eef4ff;
        border-radius: 4px 4px 4px 4px;
        opacity: 1;
        align-items: center;

        .shu {
          width: 0px;
          height: 40px;
          margin: 0 35px;
          border: 1px solid #ccdfff;
          opacity: 1;
        }

        .text1 {
          height: 68px;
          margin: 22px 0px 22px 20px;
          border-radius: 0px 0px 0px 0px;
          opacity: 1;

          .numberBox {
            margin-top: 7px;
            font-family: Helvetica-Bold, Helvetica;
            font-size: 32px;
            font-weight: bold;
            color: #333333;

            span {
              position: relative;
              top: -13px;
              font-family: PingFang SC-Medium, PingFang SC;
              font-size: 16px;
              font-weight: 500;
              color: #131313;
            }
          }
        }

        .text2 {
          height: 54px;
          line-height: 27px;
          border-radius: 0px 0px 0px 0px;
          opacity: 1;
        }
      }

      .content3 {
        display: flex;
        justify-content: space-between;
        background: #ffffff;

        .textbox {
          width: 156px;
          height: 112px;
          padding: 22px 20px;
          background: #eef4ff;
          border-radius: 4px 4px 4px 4px;
          opacity: 1;

          .numberBox {
            margin-top: 7px;
            font-family: Helvetica-Bold, Helvetica;
            font-size: 32px;
            font-weight: bold;
            color: #333333;

            span {
              position: relative;
              top: -13px;
              font-family: PingFang SC-Medium, PingFang SC;
              font-size: 16px;
              font-weight: 500;
              color: #131313;
            }
          }
        }
      }
    }
  }

  .steps {
    padding-top: 40px;
    padding-bottom: 20px;
    margin-top: 20px;
    background: #ffffff;

    .stepsBox {
      width: 780px;
      margin: 80px auto;

      .title {
        font-family: PingFang SC-Medium, PingFang SC;
        font-size: 14px;
        font-weight: 600;
        color: #171718;
      }

      .descriptionDiv {
        position: absolute;
        top: -115px;
        left: 30px;
        width: 95px;
        font-weight: 400;
        color: #333333;
        text-align: center;
      }
    }
  }
}
</style>
