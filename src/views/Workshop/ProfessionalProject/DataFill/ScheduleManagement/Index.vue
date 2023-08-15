<template>
  <!-- 专业项目—— 进度管理 -->
  <div class="table-wrap !py-12px !mt-0px">
    <div class="flex items-center justify-between pb-12px"> </div>
  </div>

  <div class="sub-title">进度管理</div>

  <div class="progress-wrapper">
    <div class="progress-list">
      <div class="progress-item" v-for="item in dataList" :key="item.name">
        <div class="left">
          <div class="icon-box">
            <div v-if="item.isComplete === '0'" class="disabled"></div>
            <img
              v-if="item.isComplete === '1'"
              src="@/assets/imgs/icon_finish.png"
              width="18"
              height="18"
            />
            <div v-if="item.isComplete === '2'" class="hollow"></div>
          </div>
          <div v-if="item.isComplete === '0' && item.type !== '3'" class="line disabled"></div>
          <div v-if="item.isComplete === '1' && item.type !== '3'" class="line"></div>
          <div v-if="item.isComplete === '2' && item.type !== '3'" class="line in-progress"></div>
          <div v-if="item.type === '3'" class="line none"></div>
        </div>
        <div class="right">
          <div class="content-box">
            <div class="content-1">
              <div class="name">{{ item.name }}</div>
              <el-button
                type="primary"
                :disabled="item.isComplete === '0'"
                v-if="item.isComplete !== '1'"
                @click="onFill(item)"
              >
                填写
              </el-button>
              <el-button type="primary" v-if="item.isComplete === '1'" @click="onFill(item)">
                查看
              </el-button>
            </div>
            <div class="status" v-if="item.isComplete === '1'">已完成</div>
            <div class="time" v-if="item.isComplete === '1'">
              {{ dayjs(item.completeDate).format('YYYY-MM-DD') }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 填写/查看 -->
  <Fill
    :show="fillDialog"
    :project-id="projectId"
    :professional-id="professionalId"
    :row="currentRow"
    @close="close"
  />
</template>
<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { ElButton } from 'element-plus'
import dayjs from 'dayjs'
import { getProfessionalScheduleApi } from '@/api/professional/service'
import Fill from './Fill.vue' // 引入填写/查看组件

interface PropsType {
  projectId: number
  professionalId: number
}

const props = defineProps<PropsType>()
const fillDialog = ref<boolean>(false)
const dataList = ref<any[]>([])
const currentRow = ref<any>({})

// 初始化获取数据
const initData = () => {
  getProfessionalScheduleApi(props.professionalId).then((res: any) => {
    dataList.value = [...res]
  })
}

// 关闭弹窗
const close = (flag: boolean) => {
  fillDialog.value = false
  if (flag === true) {
    initData()
  }
}

/**
 * 填写/查看
 * @param data 当前阶段数据
 */
const onFill = (data: any) => {
  currentRow.value = data
  fillDialog.value = true
}

onMounted(() => {
  initData()
})
</script>

<style lang="less" scoped>
.sub-title {
  padding-left: 16px;
  margin-bottom: 34px;
  font-size: 16px;
  color: #171718;
}

.progress-wrapper {
  width: 100%;
  height: 100%;
  padding: 16px 16px 16px 50px;
  box-sizing: border-box;

  .progress-list {
    display: flex;
    flex-direction: column;

    .progress-item {
      display: flex;

      .left {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-right: 16px;

        .icon-box {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 20px;

          .hollow {
            width: 18px;
            height: 18px;
            border: 1px solid #3e73ec;
            border-radius: 9px;
          }

          .disabled {
            width: 18px;
            height: 18px;
            background-color: #ebebeb;
            border-radius: 9px;
          }
        }

        .line {
          width: 2px;
          height: 124px;
          background-color: #3e73ec;

          &.in-progress {
            height: 74px;
          }

          &.disabled {
            height: 74px;
            background-color: #ebebeb;
          }

          &.none {
            height: 74px;
            background-color: #fff;
          }
        }
      }

      .right {
        width: 570px;
        padding-bottom: 16px;

        .content-box {
          width: 570px;
          padding: 21px 16px;
          border: 1px solid #ebebeb;
          border-radius: 4px;
          box-sizing: border-box;

          &.finish {
            background: #fafafa;
          }

          .content-1 {
            display: flex;
            align-items: center;
            justify-content: space-between;

            .name {
              font-size: 16px;
              color: #171718;
            }
          }

          .status {
            margin-top: 9px;
            font-size: 14px;
            color: #3e73ec;
          }

          .time {
            font-size: 14px;
            color: rgba(19, 19, 19, 0.4);
          }
        }
      }
    }
  }
}
</style>
