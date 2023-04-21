<template>
  <WorkContentWrap>
    <div class="table-wrap !py-12px !mt-0px">
      <div class="flex items-center justify-between pb-12px">
        <div> </div>
        <ElSpace>
          <ElButton
            :icon="saveIcon"
            type="primary"
            class="!bg-[#30A952] !border-[#30A952]"
            @click="onSave"
          >
            保存
          </ElButton>
        </ElSpace>
      </div>
      <div class="title">房屋腾空移交确认单</div>
      <div class="content-wrap">
        <div class="row">
          <input class="input-txt w-200" v-model="form.govName" placeholder="请输入政府名称" />
          人民政府：
        </div>
        <div class="row">
          <div class="txt-indent-28">我户坐落在</div>
          <input
            class="input-txt w-200 ml-10 mr-10"
            v-model="form.natureVillageName"
            placeholder="请输入自然村名称"
          />
          村
          <input
            class="input-txt w-400 ml-10 mr-10"
            v-model="form.houseName"
            placeholder="请输入房屋名称(多幢)"
          />
          已完成腾空
        </div>
        <div class="row">
          <div class="txt-indent-28 mr-10">现将</div>
          <ElSelect class="w-200" clearable placeholder="请选择" v-model="form.handoverProject">
            <ElOption
              v-for="item in dictObj[327]"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </ElSelect>
          <div class="ml-10">予以移交，房屋及附属建（构）筑物和室内物品按现状移交给</div>
          <input
            class="input-txt w-200 ml-10 mr-10"
            v-model="form.govName"
            placeholder="请输入政府名称"
          />
          人民政府，
        </div>
        <div class="row">
          <div class="txt-indent-28">并归</div>
          <input
            class="input-txt w-200 ml-10 mr-10"
            v-model="form.govName"
            placeholder="请输入政府名称"
          />
          人民政府，自移交之日起，移交人不再对其主张权利。
        </div>
        <div class="row">
          <div class="txt-indent-28">户主</div>
          <input
            class="input-txt w-200 ml-10 mr-10"
            v-model="form.householdlerName"
            placeholder="请输入户主名称"
          />
          户号：
          <input
            class="input-txt w-200 ml-10 mr-10"
            v-model="form.doorNo"
            placeholder="请输入户号"
          />
          迁出地址：
          <input
            class="input-txt w-400 ml-10"
            v-model="form.relocationAddress"
            placeholder="请输入迁出地址"
          />
        </div>
        <div class="row txt-indent-28">现予确认。</div>
        <div class="row right">移交人（捺印）：</div>
        <div class="row right">经办人（签字）：</div>
        <div class="row right">移交日期：</div>
      </div>
    </div>
  </WorkContentWrap>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { useIcon } from '@/hooks/web/useIcon'
import { useDictStoreWithOut } from '@/store/modules/dict'
import { ElSpace, ElButton, ElSelect, ElOption } from 'element-plus'
import { WorkContentWrap } from '@/components/ContentWrap'

interface PropsType {
  doorNo: string
  householdId: number
  projectId: number
  uid: string
}

const props = defineProps<PropsType>()
const saveIcon = useIcon({ icon: 'mingcute:save-line' })
const dictStore = useDictStoreWithOut()
const dictObj = computed(() => dictStore.getDictObj)

const defaultForm = {
  householdId: props.householdId,
  projectId: props.projectId,
  uid: props.uid,
  govName: '', // 政府名称
  natureVillageName: '', // 自然村名称
  houseName: '', // 房屋名称
  handoverProject: '', // 腾空移交项目
  hoseholdName: '', // 户主姓名
  doorNo: props.doorNo, // 户号
  relocationAddress: '' // 迁出地址
}

const form = ref<any>(defaultForm)

// 保存
const onSave = () => {
  // saveMainHouseApi(form.value).then(() => {
  //   ElMessage.success('操作成功！')
  //   getList()
  // })
}
</script>

<style lang="less" scoped>
.title {
  width: 100%;
  padding: 10px 0 40px 0;
  font-size: 20px;
  font-weight: bold;
  color: #171718;
  text-align: center;
  box-sizing: border-box;
}

.row {
  display: flex;
  margin-bottom: 20px;
  font-size: 14px;
  font-weight: bold;
  line-height: 30px;
  color: #171718;
  align-items: center;

  &.right {
    justify-content: right;
    padding-right: 200px;
  }
}

.input-txt {
  font-size: 14px;
  border-bottom: 1px solid;
  outline: none;
}

.ml-10 {
  margin-left: 10px;
}

.mr-10 {
  margin-right: 10px;
}

.w-150 {
  width: 150px;
}

.w-200 {
  width: 200px;
}

.w-400 {
  width: 400px;
}

.txt-indent-28 {
  text-indent: 28px;
}
</style>
