<template>
  <div>
    <div class="imitate-step-tab">
      <div
        class="step-item"
        :class="{ active: stepIndex === item.id }"
        v-for="item in stepArray"
        :key="item.id"
        @click="stepClick(item.id)"
      >
        <div class="number" v-if="!item.done">{{ item.id }}</div>

        <div class="done" v-else>
          <img class="icon" src="@/assets/imgs/done_icon.png" alt="✅" />
        </div>
        <div class="name">{{ item.name }}</div>
        <div class="next" v-if="stepArray.length - 1 >= item.id"></div>
      </div>
    </div>

    <div class="imitate-step-cont">
      <!-- 生产安置 step -->
      <div class="step-cont-production" v-if="stepIndex === 1">
        <el-table :data="tableData" style="width: 100%">
          <el-table-column prop="name" label="姓名" width="100" />
          <el-table-column prop="relationText" label="与户主关系" width="100" />
          <el-table-column prop="sexText" label="性别" width="100" />
          <el-table-column prop="card" label="身份证" width="200" />
          <el-table-column prop="censusTypeText" label="户籍类别" width="160" />
          <el-table-column prop="populationNature" label="人口性质" width="160" />
          <el-table-column prop="settingWay" label="安置方式" width="268">
            <template #default="scope">
              <el-select v-model="scope.row.settingWay" placeholder="请选择">
                <el-option
                  v-for="item in productionResettleWay"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                  :disabled="item.disabled"
                />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="settingRemark" label="备注" width="288">
            <template #default="scope">
              <el-input v-model="scope.row.settingRemark" placeholder="请输入" />
            </template>
          </el-table-column>
        </el-table>

        <div class="btn-wrap">
          <div class="btn" @click="stepNext">确定，进入下一步</div>
        </div>
      </div>

      <!-- 搬迁安置 step -->
      <div class="step-cont-move" v-else-if="stepIndex === 2">
        <div class="common-wrap">
          <div class="common-head">
            <div class="icon"></div>
            <div class="tit">搬迁安置方式</div>
          </div>

          <div class="common-cont">
            <div class="common-form-item">
              <div class="common-label">户型类型：</div>
              <div class="common-value">
                <el-radio-group v-model="houseType">
                  <el-radio
                    size="large"
                    v-for="item in resettleHouseType"
                    :key="item.id"
                    :label="item.id"
                    >{{ item.name }}</el-radio
                  >
                </el-radio-group>
              </div>
            </div>

            <template v-if="houseType === 1">
              <Homestead />
            </template>

            <template v-if="houseType === 2">
              <Apartment />
            </template>

            <template v-if="houseType === 3">
              <FindSelf view-type="default" />
            </template>

            <template v-if="houseType === 4">
              <CenterSupport />
            </template>
          </div>
        </div>

        <div class="btn-wrap">
          <div class="btn" @click="stepNext">确认</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import {
  ElTable,
  ElTableColumn,
  ElInput,
  ElSelect,
  ElOption,
  ElMessage,
  ElRadioGroup,
  ElRadio
} from 'element-plus'
import { getDemographicListApi } from '@/api/workshop/population/service'
import { DemographicDtoType } from '@/api/workshop/population/types'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { resettleHouseType } from './components/config'

import Homestead from './components/Homestead.vue'
import Apartment from './components/Apartment.vue'
import FindSelf from './components/FindSelf.vue'
import CenterSupport from './components/CenterSupport.vue'

dayjs.extend(relativeTime)

interface PropsType {
  doorNo: string
  baseInfo: any
}

const props = defineProps<PropsType>()

// 步骤条
const stepArray = ref([
  {
    id: 1,
    name: '选择生产安置方式',
    done: false
  },
  {
    id: 2,
    name: '选择搬迁安置方式',
    done: false
  }
])
// 步骤条选中
const stepIndex = ref(1)

// 属实
const productionResettleWay = ref([
  {
    id: 1,
    name: '农业安置',
    disabled: false
  },
  {
    id: 2,
    name: '养老保险',
    disabled: false
  },
  {
    id: 3,
    name: '自谋职业',
    disabled: false
  }
])

// 表格数据
const tableData = ref<DemographicDtoType[]>([])

const houseType = ref(1)

const getPeopleList = async () => {
  const res = await getDemographicListApi({
    doorNo: props.doorNo,
    status: props.baseInfo.status
  })
  if (res && res.content) {
    tableData.value = res.content.map((item) => {
      item.age = item.birthday ? parseInt(dayjs(item.birthday).fromNow().replace(/\D+/, '')) : ''
      return item
    })
  }
}

onMounted(() => {
  getPeopleList()
})

const stepClick = (id) => {
  stepIndex.value = id
}
/**
 * 生产安置确认
 */

const stepNext = () => {
  // 校验数据
  const notFillArray = tableData.value.filter((item) => !item.settingWay)
  if (notFillArray && notFillArray.length) {
    ElMessage.info('请选择安置方式')
    return
  }
  console.log(9999, tableData.value)
  stepIndex.value += 1
}
</script>

<style lang="less" scoped>
.flex-center-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

.imitate-step-tab {
  display: flex;
  width: 1200px;
  height: 56px;
  padding: 0 100px;
  margin: 16px auto;
  background: #fff;
  align-items: center;
  justify-content: center;

  .step-item {
    display: flex;
    align-items: center;
    margin-right: 10px;
    cursor: pointer;

    .number {
      .flex-center-center();

      width: 36px;
      height: 36px;
      font-size: 16px;
      font-weight: 500;
      color: #666666;
      background: #fff;
      border: 1px solid #ebebeb;
      border-radius: 50%;
    }

    .done {
      width: 36px;
      height: 36px;

      .icon {
        width: 36px;
        height: 36px;
      }
    }

    .name {
      .flex-center-center();
      margin: 0 16px;
      font-size: 16px;
      color: #666666;
      word-wrap: none;
      white-space: nowrap;
    }

    .next {
      width: 614px;
      height: 1px;
      background-color: #ebebeb;
    }

    &.active {
      .number {
        color: #fff;
        background: #3e73ec;
        border: 1px solid #3e73ec;
        border-radius: 50%;
      }

      .name {
        color: #171718;
      }
    }
  }
}

.imitate-step-cont {
  padding: 0 16px 16px;

  .btn-wrap {
    .flex-center-center();
    padding: 16px;

    .btn {
      .flex-center-center();
      height: 40px;
      padding: 0 26px;
      font-size: 16px;
      font-weight: 500;
      color: #ffffff;
      cursor: pointer;
      background: #3e73ec;
      border-radius: 4px 4px 4px 4px;
      user-select: none;
    }
  }
}

.common-wrap {
  background-color: #fff;
  border: 1px solid #ebebeb;

  .common-head {
    display: flex;
    width: 100%;
    height: 32px;
    padding: 0 16px;
    background: #f6f6f6;
    border-bottom: 1px solid #ebebeb;
    border-radius: 4px 4px 0px 0px;
    opacity: 1;
    align-items: center;

    .icon {
      width: 4px;
      height: 16px;
      margin-right: 8px;
      background: linear-gradient(90deg, #3e73ec 0%, #ffffff 100%);
      border-radius: 3px 3px 3px 3px;
    }

    .tit {
      font-size: 14px;
      font-weight: 500;
      color: #131313;
    }
  }

  .common-cont {
    padding: 0 28px;
  }
}

.common-form-item {
  display: flex;
  align-items: center;
  padding: 22px 0;
  border-bottom: 1px dotted #ebebeb;

  .common-label {
    width: 140px;
    font-size: 14px;
    line-height: 32px;
    color: #131313;
    text-align: right;
  }

  .common-value {
    flex: 1;
    font-size: 14px;
    color: #131313;
  }
}
</style>
