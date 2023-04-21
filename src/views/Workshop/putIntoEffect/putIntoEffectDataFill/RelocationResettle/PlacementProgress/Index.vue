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
      <div class="progress-wrap">
        <div class="progress-item">
          <div class="progress-tit">搬迁腾空进度</div>
          <div class="progress-children">
            <div class="info-item">
              <div class="tit">房屋腾空：</div>
              <div class="progress">进度：{{ form.houseEmptyStatus }}</div>
              <div class="remark">
                <div class="common-tit">备注：</div>
                <el-input placeholder="请输入备注" v-model="form.houseEmptyRemark" />
              </div>
            </div>

            <div class="info-item">
              <div class="tit">青苗腾空：</div>
              <div class="progress">进度：{{ form.greenShootsStatus }}</div>
              <div class="remark">
                <div class="common-tit">备注：</div>
                <el-input placeholder="请输入备注" v-model="form.greenShootsRemark" />
              </div>
            </div>
          </div>
        </div>

        <div class="progress-item">
          <div class="progress-tit">择房、择址、建房进度</div>
          <div class="progress-children">
            <div class="info-item">
              <div class="tit">择房确认：</div>
              <div class="progress">进度：{{ form.chooseHouseStatus }}</div>
              <div class="remark">
                <div class="common-tit">备注：</div>
                <el-input placeholder="请输入备注" v-model="form.chooseHouseRemark" />
              </div>
            </div>

            <div class="info-item">
              <div class="tit">择址确认：</div>
              <div class="progress">进度：{{ form.chooseAddressStatus }}</div>
              <div class="remark">
                <div class="common-tit">备注：</div>
                <el-input placeholder="请输入备注" v-model="form.chooseAddressRemark" />
              </div>
            </div>

            <div class="info-item">
              <div class="tit">择房交付：</div>
              <div class="progress">进度：{{ form.houseSelectAndDeliveryStatus }}</div>
              <div class="remark">
                <div class="common-tit">备注：</div>
                <el-input placeholder="请输入备注" v-model="form.houseSelectAndDeliveryRemark" />
              </div>
            </div>

            <div class="info-item">
              <div class="tit">建房交付：</div>
              <div class="progress">进度：{{ form.houseBuildAndDeliveryStatus }}</div>
              <div class="remark">
                <div class="common-tit">备注：</div>
                <el-input placeholder="请输入备注" v-model="form.houseBuildAndDeliveryRemark" />
              </div>
            </div>
          </div>
        </div>

        <div class="progress-item">
          <div class="progress-tit">坟墓搬迁进度</div>
          <div class="progress-children">
            <div class="info-item">
              <div class="tit">坟墓择址：</div>
              <div class="progress">进度：{{ form.graveChooseAddressStatus }}</div>
              <div class="remark">
                <div class="common-tit">备注：</div>
                <el-input placeholder="请输入备注" v-model="form.graveChooseAddressRemark" />
              </div>
            </div>

            <div class="info-item">
              <div class="tit">坟墓迁移：</div>
              <div class="progress">进度：{{ form.graveMoveStatus }}</div>
              <div class="remark">
                <div class="common-tit">备注：</div>
                <el-input placeholder="请输入备注" v-model="form.graveMoveRemark" />
              </div>
            </div>
          </div>
        </div>

        <div class="progress-item">
          <div class="progress-tit">社保及其他进度</div>
          <div class="progress-children">
            <div class="info-item">
              <div class="tit">社保缴费：</div>
              <div class="progress">进度：{{ form.socialSecurityPayStatus }}</div>
              <div class="remark">
                <div class="common-tit">备注：</div>
                <el-input placeholder="请输入备注" v-model="form.socialSecurityPayRemark" />
              </div>
            </div>

            <div class="info-item">
              <div class="tit">自建房验收：</div>
              <div class="progress">进度：{{ form.buildHouseCheckStatus }}</div>
              <div class="remark">
                <div class="common-tit">备注：</div>
                <el-input placeholder="请输入备注" v-model="form.buildHouseCheckRemark" />
              </div>
            </div>

            <div class="info-item">
              <div class="tit">生产用地交付：</div>
              <div class="progress">进度：{{ form.productionLandDeliveryStatus }}</div>
              <div class="remark">
                <div class="common-tit">备注：</div>
                <el-input placeholder="请输入备注" v-model="form.productionLandDeliveryRemark" />
              </div>
            </div>
          </div>
        </div>

        <div class="progress-item">
          <div class="progress-tit">过渡进度</div>
          <div class="progress-children">
            <div class="info-item">
              <div class="tit">搬迁过渡：</div>
              <div class="progress">
                <div class="common-tit">进度：</div>
                <ElSelect
                  class="!w-280px"
                  clearable
                  placeholder="请选择"
                  v-model="form.relocationTransitionStatus"
                >
                  <ElOption
                    v-for="item in dictObj[254]"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </ElSelect>
              </div>
              <div class="remark">
                <div class="common-tit">备注：</div>
                <el-input placeholder="请输入备注" v-model="form.relocationTransitionRemark" />
              </div>
            </div>

            <div class="info-item">
              <div class="tit">生产过渡：</div>
              <div class="progress">
                <div class="common-tit">进度：</div>
                <ElSelect
                  class="!w-280px"
                  clearable
                  placeholder="请选择"
                  v-model="form.productionTransitionStatus"
                >
                  <ElOption
                    v-for="item in dictObj[315]"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </ElSelect>
              </div>
              <div class="remark">
                <div class="common-tit">备注：</div>
                <el-input placeholder="请输入备注" v-model="form.productionTransitionRemark" />
              </div>
            </div>
          </div>
        </div>

        <div class="progress-item">
          <div class="progress-tit">搬迁安置进度</div>
          <div class="progress-children">
            <div class="info-item">
              <div class="tit">建房进度：</div>
              <div class="progress">
                <div class="common-tit">进度：</div>
                <ElSelect
                  class="!w-280px"
                  clearable
                  placeholder="请选择"
                  v-model="form.buildHouseStatus"
                >
                  <ElOption
                    v-for="item in dictObj[290]"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </ElSelect>
              </div>
              <div class="remark">
                <div class="common-tit">备注：</div>
                <el-input placeholder="请输入备注" v-model="form.buildHouseRemark" />
              </div>
            </div>

            <div class="info-item">
              <div class="tit">水、电、气、网络转移：</div>
              <div class="progress">
                <div class="common-tit">进度：</div>
                <ElSelect
                  class="!w-280px"
                  clearable
                  placeholder="请选择"
                  v-model="form.hydropowerStatus"
                >
                  <ElOption
                    v-for="item in dictObj[253]"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </ElSelect>
              </div>
              <div class="remark">
                <div class="common-tit">备注：</div>
                <el-input placeholder="请输入备注" v-model="form.hydropowerRemark" />
              </div>
            </div>

            <div class="info-item">
              <div class="tit">房屋产权证办理：</div>
              <div class="progress">
                <div class="common-tit">进度：</div>
                <ElSelect
                  class="!w-280px"
                  clearable
                  placeholder="请选择"
                  v-model="form.houseOwnershipStatus"
                >
                  <ElOption
                    v-for="item in dictObj[271]"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </ElSelect>
              </div>
              <div class="remark">
                <div class="common-tit">备注：</div>
                <el-input placeholder="请输入备注" v-model="form.houseOwnershipRemark" />
              </div>
            </div>
          </div>
        </div>

        <div class="progress-item">
          <div class="progress-tit">生产安置进度</div>
          <div class="progress-children">
            <div class="info-item">
              <div class="tit">其他安置方式办理进度：</div>
              <div class="progress">
                <div class="common-tit">进度：</div>
                <ElSelect
                  class="!w-280px"
                  clearable
                  placeholder="请选择"
                  v-model="form.otherResettlementStatus"
                >
                  <ElOption
                    v-for="item in dictObj[271]"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </ElSelect>
              </div>
              <div class="remark">
                <div class="common-tit">备注：</div>
                <el-input placeholder="请输入备注" v-model="form.otherResettlementRemark" />
              </div>
            </div>
          </div>
        </div>

        <div class="progress-item">
          <div class="progress-tit">相关手续办理进度</div>
          <div class="progress-children">
            <div class="info-item">
              <div class="tit">户籍迁移：</div>
              <div class="progress">
                <div class="common-tit">进度：</div>
                <ElSelect
                  class="!w-280px"
                  clearable
                  placeholder="请选择"
                  v-model="form.registeredResidenceTransferStatus"
                >
                  <ElOption
                    v-for="item in dictObj[271]"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </ElSelect>
              </div>
              <div class="remark">
                <div class="common-tit">备注：</div>
                <el-input
                  placeholder="请输入备注"
                  v-model="form.registeredResidenceTransferRemark"
                />
              </div>
            </div>

            <div class="info-item">
              <div class="tit">党团关系转移：</div>
              <div class="progress">
                <div class="common-tit">进度：</div>
                <ElSelect
                  class="!w-280px"
                  clearable
                  placeholder="请选择"
                  v-model="form.politicalRelationStatus"
                >
                  <ElOption
                    v-for="item in dictObj[271]"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </ElSelect>
              </div>
              <div class="remark">
                <div class="common-tit">备注：</div>
                <el-input placeholder="请输入备注" v-model="form.politicalRelationRemark" />
              </div>
            </div>

            <div class="info-item">
              <div class="tit">入学入托办理：</div>
              <div class="progress">
                <div class="common-tit">进度：</div>
                <ElSelect
                  class="!w-280px"
                  clearable
                  placeholder="请选择"
                  v-model="form.daycareStatus"
                >
                  <ElOption
                    v-for="item in dictObj[271]"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </ElSelect>
              </div>
              <div class="remark">
                <div class="common-tit">备注：</div>
                <el-input placeholder="请输入备注" v-model="form.daycareRemark" />
              </div>
            </div>

            <div class="info-item">
              <div class="tit">军烈属转移：</div>
              <div class="progress">
                <div class="common-tit">进度：</div>
                <ElSelect
                  class="!w-280px"
                  clearable
                  placeholder="请选择"
                  v-model="form.armymanTransferStatus"
                >
                  <ElOption
                    v-for="item in dictObj[271]"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </ElSelect>
              </div>
              <div class="remark">
                <div class="common-tit">备注：</div>
                <el-input placeholder="请输入备注" v-model="form.armymanTransferRemark" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </WorkContentWrap>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { WorkContentWrap } from '@/components/ContentWrap'
import { useDictStoreWithOut } from '@/store/modules/dict'
import { ElSpace, ElInput, ElSelect, ElOption, ElButton } from 'element-plus'
import { useIcon } from '@/hooks/web/useIcon'
import { onMounted } from 'vue'

const dictStore = useDictStoreWithOut()
const dictObj = computed(() => dictStore.getDictObj)
const saveIcon = useIcon({ icon: 'mingcute:save-line' })

const defaultForm = {
  houseEmptyStatus: '',
  houseEmptyRemark: '',

  greenShootsStatus: '',
  greenShootsRemark: '',

  chooseHouseStatus: '',
  chooseHouseRemark: '',

  chooseAddressStatus: '',
  chooseAddressRemark: '',

  houseSelectAndDeliveryStatus: '',
  houseSelectAndDeliveryRemark: '',

  houseBuildAndDeliveryStatus: '',
  houseBuildAndDeliveryRemark: '',

  graveChooseAddressStatus: '',
  graveChooseAddressRemark: '',

  graveMoveStatus: '',
  graveMoveRemark: '',

  socialSecurityPayStatus: '',
  socialSecurityPayRemark: '',

  buildHouseCheckStatus: '',
  buildHouseCheckRemark: '',

  productionLandDeliveryStatus: '',
  productionLandDeliveryRemark: '',

  relocationTransitionStatus: '',
  relocationTransitionRemark: '',

  productionTransitionStatus: '',
  productionTransitionRemark: '',

  buildHouseStatus: '',
  buildHouseRemark: '',

  hydropowerStatus: '',
  hydropowerRemark: '',

  houseOwnershipStatus: '',
  houseOwnershipRemark: '',

  otherResettlementStatus: '',
  otherResettlementRemark: '',

  registeredResidenceTransferStatus: '',
  registeredResidenceTransferRemark: '',

  politicalRelationStatus: '',
  politicalRelationRemark: '',

  daycareStatus: '',
  daycareRemark: '',

  armymanTransferStatus: '',
  armymanTransferRemark: ''
}

const form = ref<any>(defaultForm)

onMounted(() => {
  getList()
})

const getList = () => {
  // const params: any = {
  //   doorNo: props.doorNo,
  //   householdId: props.householdId,
  //   projectId: props.projectId,
  //   status: 'implementation',
  //   size: 1000
  // }
  // getMainHouseListApi(params).then((res) => {
  //   form.value = res.content
  // })
}

// 保存
const onSave = () => {
  const params = {
    ...form.value
  }
  console.log(params, '参数')
  // saveMainHouseApi(params).then(() => {
  //   ElMessage.success('操作成功！')
  //   getList()
  // })
}
</script>

<style lang="less" scoped>
.progress-item {
  margin-top: 40px;

  .progress-tit {
    display: flex;
    width: 100%;
    height: 40px;
    padding: 0 20px;
    font-size: 18px;
    font-weight: bold;
    color: #171717;
    background-color: #e7edfd;
    align-items: center;
  }

  .progress-children {
    padding: 10px 0 0 40px;

    .info-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      height: 40px;

      .tit {
        font-size: 16px;
        font-weight: bold;
        color: #171717;
        flex: 20%;
      }

      .progress {
        flex: 30%;
        display: flex;
        align-items: center;
        font-size: 14px;
        color: #171717;
      }

      .remark {
        flex: 50%;
        display: flex;
        align-items: center;
        padding-left: 20px;
        font-size: 14px;
        color: #171717;
      }

      .common-tit {
        flex: none;
        width: 70px;
      }
    }
  }
}
</style>
