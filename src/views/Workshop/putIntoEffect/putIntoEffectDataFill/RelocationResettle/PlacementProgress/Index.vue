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
              <div class="progress">进度：{{ form.houseVacateStatusText }}</div>
              <div class="remark">
                <div class="common-tit">备注：</div>
                <el-input placeholder="请输入备注" v-model="form.houseVacateRemark" />
              </div>
            </div>

            <div class="info-item">
              <div class="tit">青苗腾空：</div>
              <div class="progress">进度：{{ form.treeVacateStatusText }}</div>
              <div class="remark">
                <div class="common-tit">备注：</div>
                <el-input placeholder="请输入备注" v-model="form.treeVacateRemark" />
              </div>
            </div>
          </div>
        </div>

        <div class="progress-item">
          <div class="progress-tit">择房、择址、建房进度</div>
          <div class="progress-children">
            <div class="info-item">
              <div class="tit">择房确认：</div>
              <div class="progress">进度：{{ form.houseConfirmStatusText }}</div>
              <div class="remark">
                <div class="common-tit">备注：</div>
                <el-input placeholder="请输入备注" v-model="form.houseConfirmRemark" />
              </div>
            </div>

            <div class="info-item">
              <div class="tit">择址确认：</div>
              <div class="progress">进度：{{ form.addressConfirmStatusText }}</div>
              <div class="remark">
                <div class="common-tit">备注：</div>
                <el-input placeholder="请输入备注" v-model="form.addressConfirmRemark" />
              </div>
            </div>

            <div class="info-item">
              <div class="tit">择房交付：</div>
              <div class="progress">进度：{{ form.houseDeliveryStatusText }}</div>
              <div class="remark">
                <div class="common-tit">备注：</div>
                <el-input placeholder="请输入备注" v-model="form.houseDeliveryRemark" />
              </div>
            </div>

            <div class="info-item">
              <div class="tit">建房交付：</div>
              <div class="progress">进度：{{ form.buildHouseStatusText }}</div>
              <div class="remark">
                <div class="common-tit">备注：</div>
                <el-input placeholder="请输入备注" v-model="form.buildHouseRemark" />
              </div>
            </div>
          </div>
        </div>

        <div class="progress-item">
          <div class="progress-tit">坟墓搬迁进度</div>
          <div class="progress-children">
            <div class="info-item">
              <div class="tit">坟墓择址：</div>
              <div class="progress">进度：{{ form.graveAddressStatusText }}</div>
              <div class="remark">
                <div class="common-tit">备注：</div>
                <el-input placeholder="请输入备注" v-model="form.graveAddressRemark" />
              </div>
            </div>

            <div class="info-item">
              <div class="tit">坟墓迁移：</div>
              <div class="progress">进度：{{ form.graveMigrationStatusText }}</div>
              <div class="remark">
                <div class="common-tit">备注：</div>
                <el-input placeholder="请输入备注" v-model="form.graveMigrationRemark" />
              </div>
            </div>
          </div>
        </div>

        <div class="progress-item">
          <div class="progress-tit">社保及其他进度</div>
          <div class="progress-children">
            <div class="info-item">
              <div class="tit">社保缴费：</div>
              <div class="progress">进度：{{ form.feePayStatusText }}</div>
              <div class="remark">
                <div class="common-tit">备注：</div>
                <el-input placeholder="请输入备注" v-model="form.feePayRemark" />
              </div>
            </div>

            <div class="info-item">
              <div class="tit">自建房验收：</div>
              <div class="progress">进度：{{ form.houseAcceptanceStatusText }}</div>
              <div class="remark">
                <div class="common-tit">备注：</div>
                <el-input placeholder="请输入备注" v-model="form.houseAcceptanceRemark" />
              </div>
            </div>

            <div class="info-item">
              <div class="tit">生产用地交付：</div>
              <div class="progress">进度：{{ form.landDeliveryStatusText }}</div>
              <div class="remark">
                <div class="common-tit">备注：</div>
                <el-input placeholder="请输入备注" v-model="form.landDeliveryRemark" />
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
                  v-model="form.buildHouseProgressStatus"
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
                <el-input placeholder="请输入备注" v-model="form.buildHouseProgressRemark" />
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
                  v-model="form.networkTransferStatus"
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
                <el-input placeholder="请输入备注" v-model="form.networkTransferRemark" />
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
                  v-model="form.propertyRightHandleStatus"
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
                <el-input placeholder="请输入备注" v-model="form.propertyRightHandleRemark" />
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
                  v-model="form.otherStatus"
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
                <el-input placeholder="请输入备注" v-model="form.otherRemark" />
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
                  v-model="form.householdRegistrationTransferStatus"
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
                  v-model="form.householdRegistrationTransferRemark"
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
                  v-model="form.relationshipTransferStatus"
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
                <el-input placeholder="请输入备注" v-model="form.relationshipTransferRemark" />
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
                  v-model="form.goSchoolStatus"
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
                <el-input placeholder="请输入备注" v-model="form.goSchoolRemark" />
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
                  v-model="form.soldierTransferStatus"
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
                <el-input placeholder="请输入备注" v-model="form.soldierTransferRemark" />
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
import { ElSpace, ElInput, ElSelect, ElOption, ElButton, ElMessage } from 'element-plus'
import { useIcon } from '@/hooks/web/useIcon'
import {
  getPlacementProgressApi,
  addPlacementProgressApi,
  editPlacementProgressApi
} from '@/api/putIntoEffect/putIntoEffectDataFill/placementProgress/service'

const dictStore = useDictStoreWithOut()
const dictObj = computed(() => dictStore.getDictObj)
const saveIcon = useIcon({ icon: 'mingcute:save-line' })
interface PropsType {
  doorNo: string
  householdId: number
  projectId: number
  status: string
}
const props = defineProps<PropsType>()
const defaultForm = {
  houseVacateStatus: '',
  houseVacateRemark: '',

  treeVacateStatus: '',
  treeVacateRemark: '',

  houseConfirmStatus: '',
  houseConfirmRemark: '',

  addressConfirmStatus: '',
  addressConfirmRemark: '',

  houseDeliveryStatus: '',
  houseDeliveryRemark: '',

  buildHouseStatus: '',
  buildHouseRemark: '',

  graveAddressStatus: '',
  graveAddressRemark: '',

  graveMigrationStatus: '',
  graveMigrationRemark: '',

  feePayStatus: '',
  feePayRemark: '',

  houseAcceptanceStatus: '',
  houseAcceptanceRemark: '',

  landDeliveryStatus: '',
  landDeliveryRemark: '',

  relocationTransitionStatus: '',
  relocationTransitionRemark: '',

  productionTransitionStatus: '',
  productionTransitionRemark: '',

  buildHouseProgressStatus: '',
  buildHouseProgressRemark: '',

  networkTransferStatus: '',
  networkTransferRemark: '',

  propertyRightHandleStatus: '',
  propertyRightHandleRemark: '',

  otherStatus: '',
  otherRemark: '',

  householdRegistrationTransferStatus: '',
  householdRegistrationTransferRemark: '',

  relationshipTransferStatus: '',
  relationshipTransferRemark: '',

  goSchoolStatus: '',
  goSchoolRemark: '',

  soldierTransferStatus: '',
  soldierTransferRemark: ''
}

const form = ref<any>(defaultForm)
const getList = () => {
  getPlacementProgressApi(props.doorNo).then((res) => {
    if (res?.id) {
      form.value = res
    }
  })
}
getList()

// 保存
const onSave = () => {
  const params = {
    projectId: props.projectId,
    status: props.status,
    householdId: props.householdId,
    doorNo: props.doorNo,
    ...form.value
  }
  console.log(params, '参数')
  if (form.value.id) {
    editPlacementProgressApi(params).then(() => {
      ElMessage.success('操作成功！')
      getList()
    })
  } else {
    addPlacementProgressApi(params).then(() => {
      ElMessage.success('操作成功！')
      getList()
    })
  }
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
