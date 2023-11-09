<template>
  <WorkContentWrap>
    <!-- 搬迁安置 —— 自建房 -->
    <div class="table-wrap !py-12px !mt-0px">
      <div class="flex items-center justify-between pb-12px">
        <div> </div>
        <ElSpace>
          <ElButton type="primary" @click="onDocumentation"> 档案上传 </ElButton>
        </ElSpace>
      </div>
    </div>

    <div class="sub-title">建房进度</div>

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
            <div v-if="item.isComplete === '0' && item.type !== '9'" class="line disabled"></div>
            <div v-if="item.isComplete === '1' && item.type !== '9'" class="line"></div>
            <div v-if="item.isComplete === '2' && item.type !== '9'" class="line in-progress"></div>
            <div v-if="item.type === '9'" class="line none"></div>
          </div>
          <div class="right">
            <div class="content-box">
              <div class="content-1">
                <div class="name">{{ item.name }}</div>
                <el-button type="primary" v-if="item.type === '1'" @click="onPrint(item)">
                  打印
                </el-button>
                <el-button
                  type="primary"
                  :disabled="item.isComplete === '0'"
                  v-if="item.type !== '1' && item.isComplete !== '1'"
                  @click="onFill(item)"
                >
                  填写
                </el-button>
                <el-button
                  type="primary"
                  v-if="item.type !== '1' && item.isComplete === '1'"
                  @click="onFill(item)"
                >
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

    <!-- 档案上传 -->
    <OnDocumentation
      :show="dialog"
      :door-no="props.doorNo"
      @close="(...event) => close(event, 'documentation')"
    />

    <!-- 填写/查看 -->
    <Fill
      :show="fillDialog"
      :door-no="props.doorNo"
      :row="currentRow"
      @close="(...event) => close(event, 'fill')"
    />
  </WorkContentWrap>
</template>
<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { ElButton, ElSpace } from 'element-plus'
import dayjs from 'dayjs'
import {
  getSelfBuildHouseApi,
  saveSelfBuildHouseApi
} from '@/api/immigrantImplement/relocatePlacement/selfBuildHouse-service'
import { WorkContentWrap } from '@/components/ContentWrap'
import OnDocumentation from './OnDocumentation.vue' // 引入档案上传组件
import Fill from './Fill.vue' // 引入填写/查看组件

interface PropsType {
  doorNo: string
  baseInfo: any
}

const props = defineProps<PropsType>()
const dialog = ref<boolean>(false)
const fillDialog = ref<boolean>(false)
const dataList = ref<any[]>([])
const currentRow = ref<any>({})

// 初始化获取数据
const initData = () => {
  getSelfBuildHouseApi(props.doorNo).then((res: any) => {
    dataList.value = res
  })
}

// 归档
const onDocumentation = () => {
  dialog.value = true
}
const emit = defineEmits(['updateData'])
// 关闭弹窗
const close = (params: any[], type: string) => {
  if (type === 'documentation') {
    dialog.value = false
    emit('updateData')
  } else if (type === 'fill') {
    fillDialog.value = false
  }
  if (params[0] === true) {
    initData()
  }
}

/**
 * 打印
 * @param data 当前阶段数据
 */
const onPrint = async (data: any) => {
  currentRow.value = data
  await saveSelfBuildHouseForPrint()
}

/**
 * 填写/查看
 * @param data 当前阶段数据
 */
const onFill = (data: any) => {
  currentRow.value = data
  fillDialog.value = true
}

// 填写保存（这里主要用于打印时调用）
const saveSelfBuildHouseForPrint = async () => {
  let params = {
    ...currentRow.value,
    completeDate: new Date(),
    doorNo: props.doorNo
  }
  await saveSelfBuildHouseApi(params)
  initData()
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
