<template>
  <WorkContentWrap>
    <div class="table-wrap !py-12px !mt-0px">
      <div class="progress-wrap">
        <div class="progress-item">
          <div class="progress-tit">搬迁腾空进度</div>
          <div class="progress-children">
            <div class="info-item">
              <div class="tit">房屋腾空：</div>
              <div class="progress">进度：回显房屋腾空确认单状态</div>
              <div class="remark">
                <div class="common-tit">备注：</div>
                <el-input placeholder="请输入备注" />
              </div>
            </div>

            <div class="info-item">
              <div class="tit">青苗腾空：</div>
              <div class="progress">进度：回显房屋腾空确认单状态</div>
              <div class="remark">
                <div class="common-tit">备注：</div>
                <el-input placeholder="请输入备注" />
              </div>
            </div>
          </div>
        </div>

        <div class="progress-item">
          <div class="progress-tit">择房、择址、建房进度</div>
          <div class="progress-children">
            <div class="info-item">
              <div class="tit">择房确认：</div>
              <div class="progress">进度：回显房屋腾空确认单状态</div>
              <div class="remark">
                <div class="common-tit">备注：</div>
                <el-input placeholder="请输入备注" />
              </div>
            </div>

            <div class="info-item">
              <div class="tit">择址确认：</div>
              <div class="progress">进度：回显房屋腾空确认单状态</div>
              <div class="remark">
                <div class="common-tit">备注：</div>
                <el-input placeholder="请输入备注" />
              </div>
            </div>

            <div class="info-item">
              <div class="tit">择房交付：</div>
              <div class="progress">进度：回显房屋腾空确认单状态</div>
              <div class="remark">
                <div class="common-tit">备注：</div>
                <el-input placeholder="请输入备注" />
              </div>
            </div>

            <div class="info-item">
              <div class="tit">建房交付：</div>
              <div class="progress">进度：回显房屋腾空确认单状态</div>
              <div class="remark">
                <div class="common-tit">备注：</div>
                <el-input placeholder="请输入备注" />
              </div>
            </div>
          </div>
        </div>

        <div class="progress-item">
          <div class="progress-tit">坟墓搬迁进度</div>
          <div class="progress-children">
            <div class="info-item">
              <div class="tit">坟墓择址：</div>
              <div class="progress">进度：回显房屋腾空确认单状态</div>
              <div class="remark">
                <div class="common-tit">备注：</div>
                <el-input placeholder="请输入备注" />
              </div>
            </div>

            <div class="info-item">
              <div class="tit">坟墓迁移：</div>
              <div class="progress">进度：回显房屋腾空确认单状态</div>
              <div class="remark">
                <div class="common-tit">备注：</div>
                <el-input placeholder="请输入备注" />
              </div>
            </div>
          </div>
        </div>

        <div class="progress-item">
          <div class="progress-tit">社保及其他进度</div>
          <div class="progress-children">
            <div class="info-item">
              <div class="tit">社保缴费：</div>
              <div class="progress">进度：回显房屋腾空确认单状态</div>
              <div class="remark">
                <div class="common-tit">备注：</div>
                <el-input placeholder="请输入备注" />
              </div>
            </div>

            <div class="info-item">
              <div class="tit">自建房验收：</div>
              <div class="progress">进度：回显房屋腾空确认单状态</div>
              <div class="remark">
                <div class="common-tit">备注：</div>
                <el-input placeholder="请输入备注" />
              </div>
            </div>

            <div class="info-item">
              <div class="tit">生产用地交付：</div>
              <div class="progress">进度：回显房屋腾空确认单状态</div>
              <div class="remark">
                <div class="common-tit">备注：</div>
                <el-input placeholder="请输入备注" />
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
                <el-input class="!w-280px" placeholder="请输入备注" />
              </div>
              <div class="remark">
                <div class="common-tit">备注：</div>
                <el-input placeholder="请输入备注" />
              </div>
            </div>

            <div class="info-item">
              <div class="tit">生产过渡：</div>
              <div class="progress">
                <div class="common-tit">进度：</div>
                <el-input class="!w-280px" placeholder="请输入备注" />
              </div>
              <div class="remark">
                <div class="common-tit">备注：</div>
                <el-input placeholder="请输入备注" />
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
                <ElSelect class="!w-280px" clearable placeholder="请选择">
                  <ElOption
                    v-for="item in dictObj[233]"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </ElSelect>
              </div>
              <div class="remark">
                <div class="common-tit">备注：</div>
                <el-input placeholder="请输入备注" />
              </div>
            </div>

            <div class="info-item">
              <div class="tit">水、电、气、网络转移：</div>
              <div class="progress">
                <div class="common-tit">进度：</div>
                <ElSelect class="!w-280px" clearable placeholder="请选择">
                  <ElOption
                    v-for="item in dictObj[233]"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </ElSelect>
              </div>
              <div class="remark">
                <div class="common-tit">备注：</div>
                <el-input placeholder="请输入备注" />
              </div>
            </div>

            <div class="info-item">
              <div class="tit">房屋产权证办理：</div>
              <div class="progress">
                <div class="common-tit">进度：</div>
                <ElSelect class="!w-280px" clearable placeholder="请选择">
                  <ElOption
                    v-for="item in dictObj[233]"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </ElSelect>
              </div>
              <div class="remark">
                <div class="common-tit">备注：</div>
                <el-input placeholder="请输入备注" />
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
                <ElSelect class="!w-280px" clearable placeholder="请选择">
                  <ElOption
                    v-for="item in dictObj[233]"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </ElSelect>
              </div>
              <div class="remark">
                <div class="common-tit">备注：</div>
                <el-input placeholder="请输入备注" />
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
                <ElSelect class="!w-280px" clearable placeholder="请选择">
                  <ElOption
                    v-for="item in dictObj[233]"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </ElSelect>
              </div>
              <div class="remark">
                <div class="common-tit">备注：</div>
                <el-input placeholder="请输入备注" />
              </div>
            </div>

            <div class="info-item">
              <div class="tit">党团关系转移：</div>
              <div class="progress">
                <div class="common-tit">进度：</div>
                <ElSelect class="!w-280px" clearable placeholder="请选择">
                  <ElOption
                    v-for="item in dictObj[233]"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </ElSelect>
              </div>
              <div class="remark">
                <div class="common-tit">备注：</div>
                <el-input placeholder="请输入备注" />
              </div>
            </div>

            <div class="info-item">
              <div class="tit">入学入托办理：</div>
              <div class="progress">
                <div class="common-tit">进度：</div>
                <ElSelect class="!w-280px" clearable placeholder="请选择">
                  <ElOption
                    v-for="item in dictObj[233]"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </ElSelect>
              </div>
              <div class="remark">
                <div class="common-tit">备注：</div>
                <el-input placeholder="请输入备注" />
              </div>
            </div>

            <div class="info-item">
              <div class="tit">军烈属转移：</div>
              <div class="progress">
                <div class="common-tit">进度：</div>
                <ElSelect class="!w-280px" clearable placeholder="请选择">
                  <ElOption
                    v-for="item in dictObj[233]"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </ElSelect>
              </div>
              <div class="remark">
                <div class="common-tit">备注：</div>
                <el-input placeholder="请输入备注" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </WorkContentWrap>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { WorkContentWrap } from '@/components/ContentWrap'
import { useDictStoreWithOut } from '@/store/modules/dict'
import { ElInput, ElSelect, ElOption } from 'element-plus'

const dictStore = useDictStoreWithOut()
const dictObj = computed(() => dictStore.getDictObj)
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
