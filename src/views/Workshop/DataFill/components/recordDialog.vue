<template>
  <el-dialog title="修改日志" :model-value="props.recordShow" width="500" @close="onClose">
    <div class="box">
      <el-steps direction="vertical" finish-status="success" :active="1">
        <el-step title="2023-04-07 12:00:05">
          <template #description>
            <div class="stepDesc">
              <div><span class="label">操作人员姓名:</span><span>张三</span></div>
              <div><span class="label">修改居民户姓名:</span><span>杨汉忠</span></div>
              <div
                ><span class="label">修改出生年月:</span
                ><span>
                  <span class="fw600">1960年1月</span>&nbsp;&nbsp;修改为&nbsp;&nbsp;<span
                    class="fw600"
                    >1964年1月</span
                  >
                </span></div
              >
              <div
                ><span class="label">修改婚姻状况:</span
                ><span>
                  <span class="fw600">未婚</span>&nbsp;&nbsp;修改为&nbsp;&nbsp;<span class="fw600"
                    >已婚</span
                  >
                </span></div
              >
              <div
                ><span class="label">修改参保状况:</span
                ><span>
                  <span class="fw600">其他</span>&nbsp;&nbsp;修改为&nbsp;&nbsp;<span class="fw600"
                    >养老保险</span
                  >
                </span></div
              >
            </div>
          </template>
        </el-step>

        <el-step title="2023-04-07 12:00:05" description="这是一段很长很长很长的描述性文字" />
      </el-steps>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="onClose">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ElDialog, ElButton, ElSteps, ElStep } from 'element-plus'
import { watch } from 'vue'
import { getupdateLog } from '@/api/workshop/landlord/service'
const emit = defineEmits(['close'])
interface PropsType {
  recordShow: boolean
  doorNo
}
const props = defineProps<PropsType>()
watch(
  () => props.recordShow,
  () => {
    if (props.recordShow) {
      getupdateLog(props.doorNo)
    }
  }
)
// onMounted(() => {
//   getupdateLog(props.doorNo)
// })
const onClose = () => {
  emit('close')
}
const confirm = () => {
  emit('close')
}
</script>

<style lang="less" scoped>
.box {
  height: 300px;
  overflow: -moz-scrollbars-none;
  overflow-y: auto;
  -ms-overflow-style: none;

  .stepDesc {
    width: 383px;
    height: 190px;
    padding: 15px 0;
    margin: 10px 0;
    background: #f6f6f6;
    border: 1px solid #ebebeb;
    border-radius: 4px 4px 4px 4px;
    opacity: 1;

    div {
      margin: 10px 0;
    }

    .label {
      display: inline-block;
      width: 130px;
      margin-right: 15px;
      text-align: right;
    }

    .fw600 {
      font-weight: 600;
    }
  }
}

:deep(.el-step__description.is-success) {
  color: rgba(19, 19, 19, 1);
}

:deep(.el-step__title.is-success) {
  font-weight: 700;
  color: rgba(19, 19, 19, 1);
}

.box::-webkit-scrollbar {
  width: 0 !important;
}
</style>
