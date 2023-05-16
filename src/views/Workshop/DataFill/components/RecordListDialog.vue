<template>
  <el-dialog title="修改日志" :model-value="props.recordShow" width="548" @close="onClose">
    <div class="box" v-if="list && list.length">
      <el-steps
        direction="vertical"
        finish-status="success"
        process-status="success"
        :active="list.length - 1"
      >
        <el-step :title="item.createdDate" v-for="item in list" :key="item.id">
          <template #description>
            <div class="stepDesc">
              <div>
                <span class="label">操作人员姓名:</span>
                <span>{{ item.createdName }}</span>
              </div>

              <template v-if="item.operationType === '修改'">
                <div v-for="(record, dex) in item.updateJsonArray" :key="dex">
                  <span class="label"> {{ record.propertyName }}:</span>
                  <span>
                    <span class="fw600">{{ record.oldValue || '-' }}</span>
                    &nbsp;&nbsp;修改为&nbsp;&nbsp;
                    <span class="fw600">{{ record.newValue || '-' }}</span>
                  </span>
                </div>
              </template>
              <div v-else>
                <span class="label">
                  {{ item.operationType }}[{{ item.name }}]{{ item.type }}
                </span>
                <span v-if="item.remark" class="fw600">:{{ item.remark }}</span>
                <div v-if="props.isReason" style="padding: 0 66px">新增原因：{{ item.reason }}</div>
              </div>
            </div>
          </template>
        </el-step>
      </el-steps>
    </div>
    <div v-else class="null-box">暂无数据</div>
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
import { watch, ref } from 'vue'
import dayjs from 'dayjs'
import { getupdateLog } from '@/api/workshop/landlord/service'

interface PropsType {
  recordShow: boolean
  doorNo: string
  type: string
  isReason?: boolean
}

interface RecordItemType {
  id: number
  createdName: string
  type: string
  operationType: string
  updateJson: string
  updateJsonArray: any[]
  name: string
  doorNo: string
  remark?: string
  createdDate: string
  reason?: string
}

const props = defineProps<PropsType>()
const emit = defineEmits(['close'])
const list = ref<RecordItemType[]>([])

watch(
  () => props.recordShow,
  () => {
    if (props.recordShow) {
      getupdateLog({
        doorNo: props.doorNo,
        size: 1000,
        type: props.type,
        sort: ['createdDate', 'desc']
      }).then((res) => {
        if (res && res.content) {
          console.log(res.content, '操作日志')
          const result = res.content
            // .filter((item) => item.type === props.type)
            .map((item) => {
              item.updateJsonArray = []
              if (item.updateJson) {
                item.updateJsonArray = JSON.parse(item.updateJson)
              }
              item.createdDate = dayjs(item.createdDate).format('YYYY-MM-DD HH:mm:ss')
              return item
            })
          list.value = result
        }
      })
    }
  }
)

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
    width: 433px;
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
      width: 180px;
      margin-right: 15px;
      text-align: right;
    }

    .fw600 {
      font-weight: 600;
    }
  }
}

.null-box {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100px;
  color: #999999;
}

:deep(.el-step__description.is-success) {
  color: rgba(19, 19, 19, 1);
}

:deep(.el-step__title.is-success) {
  font-weight: 700;
  color: rgba(19, 19, 19, 1);
}

:deep(.el-step__main) {
  padding-left: 24px !important;
}

.box::-webkit-scrollbar {
  width: 0 !important;
}
</style>
