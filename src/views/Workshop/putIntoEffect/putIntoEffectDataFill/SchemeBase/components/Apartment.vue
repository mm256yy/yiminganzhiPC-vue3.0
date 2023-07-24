<template>
  <div class="apartment-wrap">
    <div class="common-form-item">
      <div class="common-label flex-center">公寓房安置人数：</div>
      <div class="common-value"> 5人，其中该户农村移民 ：2 人，随迁人口：3人 </div>
    </div>

    <div class="common-form-item">
      <div class="common-label">可选安置点：</div>
      <div class="common-value">
        <el-radio-group v-model="radio1">
          <el-radio :label="item.id" size="large" v-for="item in apartmentArea" :key="item.id">
            {{ item.name }}
          </el-radio>
        </el-radio-group>
        <div class="blue-row">
          <div class="blue-view" v-for="item in apartmentArea" :key="item.id">地块详情</div>
        </div>
      </div>
    </div>

    <div class="common-form-item">
      <div class="common-label">推荐方案：</div>
      <div class="common-value">
        <view class="plan-table-wrap">
          <table>
            <!-- 第一行 -->
            <tr class="head-tr">
              <td colspan="2" class="column-w1 bold">搬迁安置</td>

              <td class="column-w3 plan-tit" v-for="(item, index) in tableData" :key="item.id">
                方案{{ index + 1 }}
              </td>
            </tr>

            <tr>
              <td rowspan="4" class="column-w1 bold">套数</td>
              <td class="column-w2">65</td>
              <td class="column-w3" v-for="item in tableData" :key="item.id">
                {{ filterArea(item, 1) }}
              </td>
            </tr>

            <tr>
              <td class="column-w2">85</td>
              <td class="column-w3" v-for="item in tableData" :key="item.id">
                {{ filterArea(item, 2) }}
              </td>
            </tr>

            <tr>
              <td class="column-w2">110</td>
              <td class="column-w3" v-for="item in tableData" :key="item.id">
                {{ filterArea(item, 3) }}
              </td>
            </tr>

            <tr>
              <td class="column-w2">140</td>
              <td class="column-w3" v-for="item in tableData" :key="item.id">
                {{ filterArea(item, 4) }}
              </td>
            </tr>

            <tr>
              <td class="column-w1 bold" colspan="2">购房总面积</td>
              <td class="column-w3" v-for="item in tableData" :key="item.id">
                {{ item.homesteadBuildPrice + item.apartmentBuyPrice }}
              </td>
            </tr>

            <tr>
              <td class="column-w1" rowspan="3">金额</td>
              <td class="column-w2">购房金额估算</td>
              <td class="column-w3" v-for="item in tableData" :key="item.id">
                {{ item.subsidyCompensatePrice }}
              </td>
            </tr>

            <tr>
              <td class="column-w2">补偿补助估算</td>
              <td class="column-w3" v-for="item in tableData" :key="item.id">
                {{ item.cropsCompensatePrice }}
              </td>
            </tr>

            <tr>
              <td class="column-w2">差额</td>
              <td class="column-w3" v-for="item in tableData" :key="item.id">
                {{ item.homesteadCompensatePrice }}
              </td>
            </tr>

            <tr>
              <td class="column-w1 bold" colspan="2">确定方案</td>
              <td
                class="column-w3"
                v-for="item in tableData"
                :key="item.id"
                @click="selectPlan(item.id)"
              >
                <view class="select-btn" :class="{ active: item.isSelected }">
                  <el-radio label="选择该方案" />
                </view>
              </td>
            </tr>
          </table>
        </view>
      </div>
    </div>

    <div class="common-form-item">
      <div class="common-label">可选安置点：</div>
      <div class="common-value">
        <div class="area-size">
          <div class="area-size-item" v-for="item in apartmentAreaSize" :key="item.id">
            <div class="name"> {{ item.name }}{{ item.unit }} </div>
            <div class="ipt-wrap">
              <el-input-number v-model="item.num" :min="1" :max="10" />&nbsp;间
            </div>
            <div class="blue-row">
              <div class="blue-view">户型介绍</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="common-form-item">
      <div class="common-label">选定户型及数量：</div>
      <div class="common-value">
        <div class="info-item">
          根据您输入的安置人数： <span class="red">5</span> 人，选购总面积为：
          <span class="red">5</span>m²
        </div>

        <div class="info-item">
          选择选定户型为： <span class="red">65</span> m²<span class="red">2</span>套，<span
            class="red"
            >65</span
          >
          m²<span class="red">2</span>套
        </div>

        <div class="info-item">
          剩余面积： <span class="red">2</span> ㎡ 超出面积： <span class="red">5</span>m²
        </div>

        <div class="info-item"> 购房金额估算： <span class="red">2</span> 元 </div>

        <div class="info-item"> 购房总金额=选购总面积“成本价+超出面积"市场优惠价 </div>
      </div>
    </div>

    <div class="common-form-item">
      <div class="common-label">说明：</div>
      <div class="common-value">
        <div class="desc-item">
          1、公寓房以户为单位按人口数安排建筑面积，标准为每人 40 平方米；
        </div>

        <div class="desc-item"> 2、仅选购一套公寓房的，可就近上靠一档选定房型; </div>

        <div class="desc-item">
          3、如需选购多套公寓房的，在扣除已购公寓房面积后的剩余购买面积达到公寓房型的一半面积以上时，才允许满套选购;
        </div>

        <div class="desc-item">
          4、实际选购面积在安排面积内以综合成本价购买，超出安排面积的部分以市场优惠价购买。
        </div>
      </div>
    </div>

    <el-dialog v-model="areaDetailPup" title="安置点详情" width="900">
      <AreaDetail />
    </el-dialog>

    <el-dialog v-model="housePicPup" title="户型图" width="900">
      <HousePic />
    </el-dialog>

    <el-dialog v-model="pricePup" title="补偿补助金额估算" width="800">
      <FindSelf view-type="pup" />
    </el-dialog>

    <el-dialog v-model="buyHousePup" title="购房金额估算" width="800">
      <BuyHousePrice />
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { ElRadioGroup, ElRadio, ElInputNumber, ElDialog } from 'element-plus'
import { apartmentArea, apartmentAreaSize } from './config'
import AreaDetail from './AreaDetail.vue'
import HousePic from './HousePic.vue'
import FindSelf from './FindSelf.vue'
import BuyHousePrice from './BuyHousePrice.vue'

const areaDetailPup = ref(false)
const housePicPup = ref(false)
const pricePup = ref(false)
const buyHousePup = ref(true)

// 方案数据
const tableData = ref<any>([
  {
    isSelected: false,

    homesteadResettleNum: null, // 宅基地安置人数
    homesteadResettleRegion: null, // 宅基地安置地块
    homesteadResettleArea: null, // 宅基地安置面积
    homesteadResettleLayersCount: null, // 宅基地建房层数
    homesteadResettlePrice: null, // 宅基地建房预估单价

    apartmentResettleNum: null, // 公寓安置人数
    apartmentResettleRegion: null, // 公寓安置地块
    apartmentResettleArea: [], // 公寓安置面积

    noResettleNum: null, // 无需搬迁安置人数

    homesteadBuildPrice: 185000, // 宅基地建安费
    apartmentBuyPrice: 100000, // 公寓购房金
    subsidyCompensatePrice: 1500, // 补偿补助
    cropsCompensatePrice: 1200, // 土地青苗补助
    homesteadCompensatePrice: 1000, // 宅基地补偿

    buildHouseSubsidyPrice: 1500, // 建房补助费
    relocateSubsidyPrice: 1200, // 搬迁补助费
    lifeSubsidyPrice: 1000, // 生活补助费

    signAgreementRewardPrice: 1500, // 签协议奖励费
    houseEmptyRewardPrice: 1200, // 房屋腾空奖励费
    startBuildHouseRewardPrice: 1000, // 启动建房奖励费
    endBuildHouseRewardPrice: 2400, // 结束建房奖励费
    moveInHouseRewardPrice: 3600 // 房屋腾空奖励费
  }
])
const radio1 = ref(1)

const filterArea = (item: any, id: number) => {
  const current = item.apartmentResettleArea.find((x: any) => x.id === id)
  return current ? current.num || 0 : 0
}

// 选择该方案
const selectPlan = (id: string) => {
  tableData.value = tableData.value.map((item: any) => {
    if (item.id === id) {
      item.isSelected = true
    } else {
      item.isSelected = false
    }
    return item
  })
}
</script>

<style lang="less" scoped>
.common-form-item {
  display: flex;
  padding: 22px 0;
  border-bottom: 1px dotted #ebebeb;

  .common-label {
    width: 140px;
    font-size: 14px;
    line-height: 32px;
    color: #131313;
    text-align: right;
    flex: none;
  }

  .flex-center {
    align-self: center;
  }

  .common-value {
    flex: 1;
    min-height: 32px;
    font-size: 14px;
    color: #131313;
  }
}

.area-size {
  .area-size-item {
    display: flex;
    align-items: center;
    margin-bottom: 16px;

    .name {
      width: 60px;
      margin-right: 10px;
      font-size: 14px;
      font-weight: 500;
      color: #171718;
    }

    .ipt-wrap {
      display: flex;
      align-items: center;
      width: 120px;
      margin-right: 30px;
    }
  }
}

.blue-row {
  display: flex;
  align-items: center;

  .blue-view {
    width: 130px;
    padding-left: 20px;
    line-height: 16px;
    color: #3e73ec;
    cursor: pointer;
    user-select: none;
  }
}

.info-item {
  display: flex;
  font-size: 14px;
  font-weight: 500;
  line-height: 16px;
  color: #171718;
  align-items: center;

  .red {
    color: #e43030;
  }
}

.desc-item {
  font-size: 14px;
  line-height: 16px;
  color: #171718;
}

// 表格
.plan-table-wrap {
  table {
    /* 用于表格属性, 表示表格的两边框合并为一条 */
    border-collapse: collapse;
    border-right: 1px solid #ebebeb;
    border-bottom: 1px solid #ebebeb;
    /* 设置边缘间距0 */
    border-spacing: 0;
  }

  tr td {
    height: 40px;
    font-size: 14px;
    color: #171718;
    text-align: center;
    border-top: 1px solid #ebebeb;
    border-right: 1px solid #ebebeb;
    border-left: 1px solid #ebebeb;

    &.column-w1 {
      width: 153px;
      background: #f6f6f6;
    }

    &.column-w2 {
      width: 160px;
    }

    &.column-w3 {
      width: 273px;
    }

    &.bold {
      font-weight: 500;
    }

    .blue {
      color: #3e73ec;
    }

    &.plan-tit {
      color: #3e73ec;
      background: #f2f6ff;
    }

    .select-btn {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}

:deep(.el-dialog__body) {
  padding: 0 0 35px;
}
</style>
