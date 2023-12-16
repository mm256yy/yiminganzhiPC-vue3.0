<!--
 * @Author: baike
 * @LastEditors: baike
-->
<template>
  <div class="letf_info">
    <div class="header">
      <Label>
        <template #title>
          <img class="xm_img" src="../../../../assets/imgs/homes/xm.png" alt="" />
        </template>
        <template #info>
          <ElSelect
            clearable
            filterable
            v-model="reason"
            class="w-full"
            @change="tabVillage"
            placeholder="全域"
            @clear="clearInput"
          >
            <ElOption
              v-for="item in villageLists"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            />
          </ElSelect>
        </template>
      </Label>
      <div class="con_box">
        工程永久用地总面积为14375.60亩(国有土地2146.65亩、集体土地12228.95亩)，其中工程建设区和水库淹没区共14087.30亩，涉及绍兴市柯桥区69.73亩，嵊州市28.61亩，新昌县13969.13亩，磐安县19.82亩。
        工程管理区范围内补偿土地总面积288.30亩，涉及绍兴市柯桥区8.99亩，嵊州市13.14亩，新昌县266.17亩。
      </div>
    </div>
    <div class="contain">
      <Label>
        <template #title>
          <img class="xm_img" src="../../../../assets/imgs/homes/ym.png" alt="" />
        </template>
      </Label>

      <div class="contain_ym_box">
        <div class="tip_box">
          <img class="icon" src="../../../../assets/imgs/homes/Polygon.png" alt="" />
          <div class="left_text">永久用地</div>
          <div class="right_tip_box">
            共
            <span>14,375.6 </span>
            亩
          </div>
        </div>
        <div class="permanent">
          <div class="permanent_box">
            <div class="permanent_box_top">水库淹没区</div>
            <div class="permanent_box_bom">13643.97<span> 亩</span></div>
          </div>
          <div class="permanent_box">
            <div class="permanent_box_top">枢纽工程建设区</div>
            <div class="permanent_box_bom">13643.97<span> 亩</span></div>
          </div>
          <div class="permanent_box">
            <div class="permanent_box_top">输水工程建设区</div>
            <div class="permanent_box_bom">13643.97<span> 亩</span></div>
          </div>
        </div>
        <div class="tip_box people_tip">
          <img class="icon" src="../../../../assets/imgs/homes/Polygon.png" alt="" />
          <div class="left_text">人口</div>
        </div>
        <div class="people_info">
          <div class="people_box">
            <div>
              <img class="prople_img" src="../../../../assets/imgs/homes/ico_left.png" alt="" />
            </div>
            <div class="people_con">
              <span class="people_text">总户数</span>
              <span class="num">4,961 </span>
              <span>户</span>
            </div>
            <div class="people_right">
              <img class="right_icon" src="../../../../assets/imgs/homes/Polygons.png" alt="" />
              <span>财产户</span>
              144户
            </div>
          </div>
        </div>
        <div class="people_info">
          <div class="people_box">
            <div>
              <img class="prople_img" src="../../../../assets/imgs/homes/ico_bom.png" alt="" />
            </div>
            <div class="people_con">
              <span class="people_text">总人数</span>
              <span class="num">4,961 </span>
              <span>人</span>s
            </div>
            <div class="people_right">
              <img class="right_icon" src="../../../../assets/imgs/homes/Polygons.png" alt="" />
              <span>农业</span>
              144人
              <span class="people_border"></span>
              <span>非农</span>
              144人
            </div>
          </div>
        </div>
        <div class="tip_box">
          <img class="icon" src="../../../../assets/imgs/homes/Polygon.png" alt="" />
          <div class="left_text">房屋</div>
        </div>
        <div class="permanent">
          <div class="permanent_box">
            <div class="permanent_box_top">总房屋面积</div>
            <div class="permanent_box_bom">13643.97<span> ㎡</span></div>
          </div>
          <div class="permanent_box">
            <div class="permanent_box_top">住宅房屋</div>
            <div class="permanent_box_bom">13643.97<span> ㎡</span></div>
          </div>
          <div class="permanent_box">
            <div class="permanent_box_top">村集体房屋</div>
            <div class="permanent_box_bom">13643.97<span> ㎡</span></div>
          </div>
        </div>
        <div class="tip_box">
          <img class="icon" src="../../../../assets/imgs/homes/Polygon.png" alt="" />
          <div class="left_text">企（事）业单位</div>
        </div>
        <div class="business">
          <div class="business_li">
            <div class="business_li_l">
              <img class="ico_a" src="../../../../assets/imgs/homes/ico_a.png" alt="" />
            </div>
            <div class="business_li_r">
              <div>企业</div>
              <div class="bom_text">476 <span>家</span></div>
            </div>
          </div>
          <div class="business_li">
            <div class="business_li_l">
              <img class="ico_a" src="../../../../assets/imgs/homes/ico_a.png" alt="" />
            </div>
            <div class="business_li_r">
              <div>企业</div>
              <div class="bom_text">476 <span>家</span></div>
            </div>
          </div>
          <div class="business_li">
            <div class="business_li_l">
              <img class="ico_a" src="../../../../assets/imgs/homes/ico_a.png" alt="" />
            </div>
            <div class="business_li_r">
              <div>企业</div>
              <div class="bom_text">476 <span>家</span></div>
            </div>
          </div>
          <div class="business_li">
            <div class="business_li_l">
              <img class="ico_a" src="../../../../assets/imgs/homes/ico_a.png" alt="" />
            </div>
            <div class="business_li_r">
              <div>企业</div>
              <div class="bom_text">476 <span>家</span></div>
            </div>
          </div>
        </div>
        <div class="tip_box">
          <img class="icon" src="../../../../assets/imgs/homes/Polygon.png" alt="" />
          <div class="left_text">主要专业项目</div>
        </div>
        <div class="project">
          <div class="project_table">
            <div class="table_li">
              <div class="table_name"><span class="table_cur"></span> 四级公路</div>
              <div class="tabel_value">32.24 km</div>
            </div>
          </div>
          <div class="project_table_r">
            <div class="table_li">
              <div class="table_name"><span class="table_cur"></span> 四级公路</div>
              <div class="tabel_value">32.24 km</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import Label from './label.vue'
import { getVillageList } from '@/api/AssetEvaluation/leader-side'
import { ElTabs, ElTabPane, ElSelect, ElOption } from 'element-plus'

onMounted(() => {
  villageList()
  //getToken()
})

const reason = ref()
const villageLists = ref<any>([])
const landScreenDtoListObj = ref<any>({})

const villageList = async () => {
  villageLists.value = await getVillageList({})
}

const tabVillage = () => {}

const clearInput = () => {}
</script>

<style lang="less" scoped>
.letf_info {
  .header {
    width: 620px;
    height: 182px;
    background: #ffffff;
    box-shadow: 0px 3px 3px 0px rgba(62, 115, 236, 0.3);
    border-radius: 8px 8px 8px 8px;
    opacity: 1;
    border: 2px solid rgba(62, 115, 236, 0.7);
    box-sizing: border-box;
    margin-bottom: 13px;

    .w-full {
      width: 80px;
      height: 24px;
      margin-top: -6px;
    }
    .con_box {
      padding: 16px;
      font-size: 14px;
      font-family: PingFang SC, PingFang SC;
      font-weight: 400;
      color: #171718;
      line-height: 20px;
    }
  }
  .xm_img {
    width: 74px;
    height: 15px;
  }
  .contain {
    width: 620px;
    height: 755px;
    background: #ffffff;
    box-shadow: 0px 3px 3px 0px rgba(62, 115, 236, 0.3);
    border-radius: 8px 8px 8px 8px;
    opacity: 1;
    border: 2px solid rgba(62, 115, 236, 0.7);
    .contain_ym_box {
      padding: 16px;
      .tip_box {
        display: flex;

        .icon {
          width: 7px;
          height: 9px;
          margin-right: 8px;
          margin-top: 2px;
        }
        .left_text {
          font-size: 14px;
          font-family: PingFang SC, PingFang SC;
          font-weight: 500;
          color: #131313;
          line-height: 16px;
          margin-right: 8px;
        }
        .right_tip_box {
          padding: 2px 10px;
          background: #f3f7ff;
          border-radius: 4px 4px 4px 4px;
          font-size: 14px;
          font-family: PingFang SC, PingFang SC;
          font-weight: 400;
          color: #333333;
          line-height: 16px;
          margin-top: -2px;
          span {
            font-weight: 600;
            color: #3e73ec;
            margin-right: 5px;
          }
        }
      }
      .people_tip {
        margin-bottom: 10px;
      }
      .permanent {
        width: 100%;
        height: 72px;
        border-radius: 4px 4px 4px 4px;
        opacity: 1;
        border: 1px solid rgba(62, 115, 236, 0.2);
        margin-top: 10px;
        display: flex;
        justify-content: space-between;
        margin-bottom: 18px;

        .permanent_box {
          font-size: 14px;
          font-family: PingFang SC, PingFang SC;
          font-weight: 500;
          color: #666666;
          line-height: 20px;
          text-align: center;
          flex: 1;
        }
        .permanent_box_top {
          margin-top: 10px;
          margin-bottom: 8px;
        }
        .permanent_box_bom {
          font-size: 20px;
          font-family: DIN Medium, DIN Medium;
          font-weight: 400;
          color: #171718;
          line-height: 23px;
          span {
            font-size: 14px;
            font-weight: none;
          }
        }
      }
      .people_info {
        padding-left: 7px;
        .people_box {
          display: flex;
          .prople_img {
            width: 56px;
            height: 56px;
          }
          .people_con {
            width: 178px;
            height: 44px;
            border-radius: 4px 4px 4px 4px;
            opacity: 1;
            border: 1px solid rgba(62, 115, 236, 0.2);
            margin-left: 8px;
            line-height: 40px;
            text-align: center;
            font-size: 14px;
            .num {
              font-size: 20px;
              font-family: DIN Medium, DIN Medium;
              font-weight: 400;
              color: #171718;
            }
            .people_text {
              margin-right: 8px;
              font-size: 14px;
              font-family: PingFang SC, PingFang SC;
              font-weight: 500;
              color: #666666;
            }
          }
          .people_right {
            width: 324px;
            height: 44px;
            background: #f3f7ff;
            border-radius: 4px 4px 4px 4px;
            opacity: 1;
            margin-left: 16px;
            position: relative;
            text-align: center;
            line-height: 44px;
            font-size: 14px;
            font-family: PingFang SC, PingFang SC;
            font-weight: 400;
            color: #000000;

            .people_border {
              width: 0px;
              height: 14px;
              opacity: 1;
              border: 1px solid #dddddd;
              display: inline-block;
              margin: 0 16px;
            }
            span {
              font-size: 14px;
              font-family: PingFang SC, PingFang SC;
              font-weight: 500;
              color: #666666;
              margin-right: 8px;
            }
            .right_icon {
              position: absolute;
              left: -9px;
              top: 16px;
              width: 9px;
              height: 12px;
            }
          }
        }
      }
      .business {
        display: flex;
        margin-top: 11px;
        padding-left: 13px;
        margin-bottom: 18px;
        .business_li {
          display: flex;
          flex: 1;
          .ico_a {
            width: 40px;
            height: 40px;
            margin-right: 8px;
          }
        }
        .business_li_r {
          font-size: 14px;
          font-family: PingFang SC, PingFang SC;
          font-weight: 500;
          color: #666666;
          line-height: 16px;
          .bom_text {
            font-size: 20px;
            font-family: DIN Medium, DIN Medium;
            font-weight: 400;
            color: #171718;
            line-height: 23px;
            margin-top: 8px;
            span {
              line-height: 16px;
              font-size: 14px;
            }
          }
        }
      }
      .project {
        margin-top: 12px;
        display: flex;
        .project_table {
          flex: 1;
          margin-right: 8px;
          height: 172px;
          background: #f2f6ff;
          box-shadow: 0px 2px 0px 0px rgba(62, 115, 236, 0.2);
          border-radius: 4px 4px 4px 4px;
          opacity: 1;
          padding: 16px;
        }

        .table_li {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
          width: 100%;
          .table_name {
            position: relative;
            .table_cur {
              width: 4px;
              height: 4px;
              background: #9fbcff;
              border-radius: 0px 0px 0px 0px;
              display: inline-block;
              position: absolute;
              left: 0;
              top: 8px;
            }
            font-size: 14px;
            font-family: PingFang SC, PingFang SC;
            font-weight: 500;
            color: #666666;
            line-height: 20px;
            padding-left: 12px;
          }
          .tabel_value {
            font-size: 14px;
            font-family: PingFang SC, PingFang SC;
            font-weight: 400;
            color: #171718;
            line-height: 16px;
          }
        }
        .project_table_r {
          flex: 1;
          height: 172px;
          background: #f2f6ff;
          box-shadow: 0px 2px 0px 0px rgba(62, 115, 236, 0.2);
          border-radius: 4px 4px 4px 4px;
          opacity: 1;
          padding: 16px;
        }
      }
    }
  }
}
</style>
