<template>
  <WorkContentWrap>
    <!-- 搬迁安置 —— 公寓房 -->
    <div class="table-wrap !py-12px !mt-0px">
      <div class="flex items-center justify-between pb-12px">
        <div> </div>
        <ElSpace>
          <!-- <ElButton
            class="!bg-[#30A952] !border-[#30A952]"
            type="primary"
            @click="purchaseCalc"
          >
            购房测算
          </ElButton> -->
          <ElButton type="primary" @click="onDocumentation"> 进度汇报 </ElButton>
          <!-- <ElButton
            class="!bg-[#30A952] !border-[#30A952]"
            type="primary"
            :icon="printIcon"
            @click="onPrint"
          >
            协议打印
          </ElButton> -->
        </ElSpace>
      </div>
      <div class="title">公寓房办理情况</div>
      <div class="content">{{ isHandled ? '交房协议已签订' : '交房协议未办理' }}</div>
      <div class="title">公寓房</div>
      <ElTable :data="tableData" style="width: 100%">
        <ElTableColumn label="序号" width="80" type="index" align="center" header-align="center" />
        <ElTableColumn
          label="安置区"
          prop="settleAddressText"
          align="center"
          header-align="center"
        />
        <ElTableColumn label="类型" prop="houseAreaType" align="center" header-align="center">
          公寓房
        </ElTableColumn>
        <ElTableColumn label="户型/套型" prop="area" align="center" header-align="center" />
        <ElTableColumn label="幢号-室号" prop="roomNo" align="center" header-align="center">
          <template #default="{ row }">
            {{ row.roomNo ? roomNoOptions.filter((ket) => ket.value == row.roomNo)[0]?.label : '' }}
          </template>
        </ElTableColumn>
        <ElTableColumn label="储藏室编号" prop="storeroomNo" align="center" header-align="center" />
        <ElTableColumn label="车位编号" prop="carNo" align="center" header-align="center" />
      </ElTable>
    </div>

    <!-- 档案上传 -->
    <OnDocumentation :show="dialog" :door-no="props.doorNo" @close="close" />
  </WorkContentWrap>
</template>
<script lang="ts" setup>
import { ref, onMounted } from 'vue'
// import { useDictStoreWithOut } from '@/store/modules/dict'
// import { useIcon } from '@/hooks/web/useIcon'
import { ElButton, ElSpace, ElTable, ElTableColumn } from 'element-plus'
import { WorkContentWrap } from '@/components/ContentWrap'
import OnDocumentation from './OnDocumentation.vue'
import { getImmigrantChooseHouseApi } from '@/api/immigrantImplement/siteConfirmation/siteSel-service'
import { documentationCheckApi } from '@/api/immigrantImplement/siteConfirmation/common-service'
import { getHouseConfigApi } from '@/api/immigrantImplement/siteConfirmation/siteSel-service'

interface PropsType {
  doorNo: string
  baseInfo: any
}

const props = defineProps<PropsType>()
// const dictStore = useDictStoreWithOut()
// const dictObj = computed(() => dictStore.getDictObj)
// const printIcon = useIcon({ icon: 'ion:print-outline' })

const tableData = ref<any[]>([])
const dialog = ref<boolean>(false)
const isHandled = ref<boolean>(false)
const emit = defineEmits(['updateData'])
const roomNoOptions = ref<any[]>([])
// 获取列表数据
const getList = () => {
  getImmigrantChooseHouseApi(props.doorNo).then((res) => {
    tableData.value = res.content
    console.log(res.content, '11111111111111')
  })
  getHouseConfigApi(56, 3, 2).then((res) => {
    roomNoOptions.value = res.content.map((item) => {
      return {
        label: item.showName,
        value: item.code
      }
    })
    console.log(roomNoOptions.value, '数据')
  })
}

// 获取交房协议是否办理的结果
const getDocumentationCheckResult = () => {
  documentationCheckApi(props.doorNo, 'flatAgreementPic').then((res: any) => {
    isHandled.value = res
  })
}

// 购房测算
// const purchaseCalc = () => {}

// 归档
const onDocumentation = () => {
  dialog.value = true
}

// 打印报表
// const onPrint = () => {
//   console.log('打印报表')
// }

/**
 * 关闭归档弹窗
 * @param flag
 */
const close = (flag: boolean) => {
  dialog.value = false
  if (flag == true) {
    emit('updateData')
    getList()
    getDocumentationCheckResult()
  }
}

onMounted(() => {
  getList()
  getDocumentationCheckResult()
})
</script>
<style lang="less" scoped>
.title {
  margin-bottom: 10px;
  font-size: 14px;
  font-weight: bold;
  color: #313131;
}

.content {
  padding-left: 28px;
  margin-bottom: 10px;
  font-size: 14px;
  color: #666;
}

.no-data {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 200px;
  font-size: 15px;
}

.btn-txt {
  color: red;
  cursor: pointer;
}
</style>
