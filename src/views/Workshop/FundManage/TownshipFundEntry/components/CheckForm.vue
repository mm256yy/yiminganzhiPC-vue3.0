<template>
  <ElDialog
    title="查看"
    :model-value="props.show"
    :width="800"
    @close="onClose"
    alignCenter
    appendToBody
    :closeOnClickModal="false"
  >
    <ElForm
      class="form"
      ref="formRef"
      :model="form"
      label-width="100px"
      :label-position="'right'"
      :rules="rules"
      label-suffix=":"
    >
      <ElFormItem v-if="isHouseHold" label="户主" prop="household"> {{ form.name }} </ElFormItem>
      <ElFormItem v-if="isHouseHold" label="户号" prop="showDoorNo">
        {{ form.showDoorNo }}
      </ElFormItem>

      <ElFormItem v-if="isVillage" label="村集体" prop="household">
        {{ form.name }}
      </ElFormItem>
      <ElFormItem v-if="isVillage" label="村集体编号" prop="accountNumber">
        {{ form.showDoorNo }}
      </ElFormItem>

      <ElFormItem v-if="isOther" label="名称" prop="household"> {{ form.name }} </ElFormItem>
      <ElFormItem v-if="isOther" label="资金科目" prop="accountNumber">
        {{ form.funSubjectName }}
      </ElFormItem>

      <ElFormItem v-if="!isOther" label="所属区域" prop="area">
        {{
          `
              ${form.cityCodeText ? form.cityCodeText + '/' : ''}
              ${form.areaCodeText ? form.areaCodeText : ''}
              ${form.townCodeText ? '/' + form.townCodeText : ''}
              ${form.villageText ? '/' + form.villageText : ''}
              ${form.virutalVillageText ? '/' + form.virutalVillageText : ''}
              `
        }}
      </ElFormItem>

      <ElFormItem label="到账金额" prop="amount"> {{ form.amount }}&nbsp;元 </ElFormItem>
      <ElFormItem label="已发放金额" prop="issuedAmount">
        {{ form.issuedAmount }}&nbsp;元
      </ElFormItem>
      <ElFormItem label="待发放" prop="pendingAmount">
        {{ form.pendingAmount }}&nbsp;元
      </ElFormItem>
      <div class="table-wrap">
        <Table
          border
          :loading="false"
          :data="tableObject.tableList"
          :columns="allSchemas.tableColumns"
          tableLayout="auto"
          headerAlign="center"
          align="center"
          highlightCurrentRow
          @register="register"
        >
          <template #paymentTime="{ row }">
            <div> {{ dayjs(row.paymentTime).format('YYYY-MM-DD HH:mm:ss') }}</div>
          </template>
          <template #receipt="{ row }">
            <div class="proof-container">
              <ElImage
                :src="row.receipt ? JSON.parse(row.receipt)[0].url : ''"
                @click="onShowImage(row.receipt)"
                alt="相关凭证"
            /></div>
          </template>
        </Table>
      </div>
    </ElForm>
    <el-dialog title="查看图片" :width="600" v-model="dialogVisible">
      <img class="block w-full" :src="avatarSrc" alt="Preview Image" />
    </el-dialog>
  </ElDialog>
</template>

<script setup lang="ts">
import { ElDialog, ElForm, ElFormItem, FormInstance, FormRules, ElImage } from 'element-plus'
import { ref, reactive, computed, watch } from 'vue'
import { Table } from '@/components/Table'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { useTable } from '@/hooks/web/useTable'
import type { TownshipFundEntryDtoType } from '@/api/fundManage/townshipFundEntry-types'
import { getFundGrantFindByDoorNo } from '@/api/fundManage/townshipFundEntry-service'
import dayjs from 'dayjs'
interface PropsType {
  show: boolean
  row?: TownshipFundEntryDtoType | null | undefined
  type: number // 类型
}

interface FileItemType {
  name: string
  url: string
}

const props = defineProps<PropsType>()
const emit = defineEmits(['close', 'submit'])
const formRef = ref<FormInstance>()
const relocateOtherPic = ref<FileItemType[]>([]) // 其他附件列表

const form = ref<any>({})
const dialogVisible = ref<boolean>(false)
let avatarSrc = ref()
const isHouseHold = computed(() => {
  return props.type === 1
})

const isVillage = computed(() => {
  return props.type === 2
})

const isOther = computed(() => {
  return props.type === 3
})

const onShowImage = (e) => {
  avatarSrc.value = e ? JSON.parse(e)[0].url : ''
  dialogVisible.value = true
}

const { register, tableObject, methods } = useTable()

// 规则校验
const rules = reactive<FormRules>({})
// 关闭弹窗
const onClose = (flag = false) => {
  emit('close', flag)
}
watch(
  () => props.show,
  async (val) => {
    if (val) {
      form.value = props.row
      if (props.row) {
        let res = await getFundGrantFindByDoorNo(props.row['doorNo'])
        tableObject.tableList = res
      }
    }
  }
)

// 预览
// const imgPreview = (uploadFile: UploadFile) => {
//   imgUrl.value = uploadFile.url!
//   dialogVisible.value = true
// }
const schema = reactive<CrudSchema[]>([
  // table字段
  {
    field: 'index',
    type: 'index',
    label: '序号',
    search: {
      show: false
    }
  },
  {
    field: 'paymentTime',
    label: '发放日期',
    search: {
      show: false
    }
  },
  {
    field: 'amount',
    label: '金额（元）',
    width: 180,
    search: {
      show: false
    }
  },
  {
    field: 'remark',
    label: '说明',
    search: {
      show: false
    }
  },
  {
    field: 'receipt',
    label: '相关凭证',
    align: 'center',
    search: {
      show: false
    }
  }
])

const { allSchemas } = useCrudSchemas(schema)
</script>

<style lang="less" scoped>
.col-wrapper {
  display: flex;
  align-items: center;
  margin: 0 16px 16px 0;

  .col-label-required {
    display: inline-flex;
    width: 150px;
    height: 32px;
    padding: 0 12px 0 0;
    font-size: 14px;
    line-height: 32px;
    color: #606266;
    box-sizing: border-box;
    justify-content: flex-end;
    align-items: flex-start;
    flex: 0 0 auto;

    &::before {
      margin-right: 4px;
      color: #f56c6c;
      content: '*';
    }
  }
}

.upload {
  .el-upload--picture-card {
    display: none;
  }
}

.proof-container {
  width: 50px;
  height: 50px;
  padding: 10px;
  margin: 0 auto;
}
</style>
