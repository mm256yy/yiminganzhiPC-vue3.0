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
            <div class="numberBox">1000 <span>户</span> </div>
          </div>
          <div class="shu"> </div>
          <div class="text2">
            <div>
              <span>居民户 <span style="color: red">380</span> 户</span>
            </div>
            <div style="margin-top: 5px">
              <span>财产户 <span style="color: red">380</span> 户</span>
            </div>
          </div>
        </div>
        <div class="content">
          <div class="text1">
            <div>涉及总人口</div>
            <div class="numberBox">1000 <span>户</span> </div>
          </div>
          <div class="shu"> </div>
          <div class="text2">
            <div>
              <span>搬迁安置 <span style="color: red">380</span> 户</span>
            </div>
            <div style="margin-top: 5px">
              <span>生产安置 <span style="color: red">380</span> 户</span>
            </div>
          </div>
        </div>
        <div class="content content3">
          <div class="textbox">
            <div class="text">涉及个体户</div>
            <div class="numberBox">103 <span>家</span> </div>
          </div>
          <div class="textbox">
            <div class="text">设计企业</div>
            <div class="numberBox">103 <span>家</span> </div>
          </div>
        </div>
        <div class="content">
          <div class="text1">
            <div>涉及村集体</div>
            <div class="numberBox">13 <span>个</span> </div>
          </div>
          <div class="shu"> </div>
          <div class="text2">
            <div>
              <span>乡镇 <span style="color: red">3</span> 个</span>
            </div>
            <div style="margin-top: 5px">
              <span>行政村 <span style="color: red">10</span> 个</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="steps">
      <div style="text-align: center">
        <el-button @click="btnClick" type="primary" style="width: 150px">
          <template #icon> <img src="./icon_gd.png" alt="" style="margin-bottom: 3px" /> </template>
          数据归档
        </el-button>
      </div>
      <div class="stepsBox">
        <el-steps :active="1" align-center>
          <el-step>
            <template #title><div class="title">实物采集数据归档</div></template>
            <template #icon> <img src="./icon_wc.png" alt="" /> </template>
            <template #description>
              <div style="position: relative">
                <div class="descriptionDiv">
                  <div>2023-01-01</div>
                  <div>已归档</div>
                </div>
              </div>
            </template>
          </el-step>
          <el-step>
            <template #title><div class="title">实物采集数据归档</div></template>
            <template #icon>
              <div v-loading="true" style="left: -20px; height: 37px"></div>
            </template>
            <template #description>
              <div style="position: relative">
                <div class="descriptionDiv">
                  <div>2023-01-01</div>
                  <div>已归档</div>
                </div>
              </div>
            </template>
          </el-step>
          <el-step>
            <template #title><div class="title">实物采集数据归档</div></template>
            <template #icon> <img src="./icon_wwc.png" alt="" /> </template>
            <template #description>
              <div style="position: relative">
                <div class="descriptionDiv">
                  <div>2023-01-01</div>
                  <div>已归档</div>
                </div>
              </div>
            </template>
          </el-step>
          <!-- <el-step title="实物复核数据库初始化" description="这是一段很长很长很长的描述性文字" />
          <el-step title="实物采集结束" description="这段就没那么长了" /> -->
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
import { ref } from 'vue'
import { ElBreadcrumb, ElBreadcrumbItem, ElButton, ElSteps, ElStep } from 'element-plus'
// import { useRouter } from 'vue-router'
// import { useIcon } from '@/hooks/web/useIcon'
import EditForm from './components/EditForm.vue'
// const { setSearchParams } = methods
// const downloadIcon = useIcon({ icon: 'material-symbols:check-circle-outline' })
const btnClick = () => {
  editFormShow.value = true
}
const editFormShow = ref()
const actionType = ref('add')
const reportType = ref()
const onFormPupClose = (flag: boolean) => {
  editFormShow.value = false
  console.log(flag)

  // if (flag === true) {
  //   setSearchParams({ type: reportType as string })
  // }
}
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
