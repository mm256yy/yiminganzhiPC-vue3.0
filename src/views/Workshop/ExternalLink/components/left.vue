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
        {{ landScreenDtoListObj.overview }}
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
            <img class="icons" src="../../../../assets/imgs/homes/Polygons.png" alt="" />
            共
            <span>{{ landScreenDtoListObj.totalArea }}</span>
            亩
          </div>
        </div>
        <div @click="onChange(0)" class="permanent">
          <div v-for="item in landList" :key="item.id" class="permanent_box">
            <div class="permanent_box_top">{{ item.name }}</div>
            <div class="permanent_box_bom">
              {{ landScreenDtoListObj[item.num] }}<span> 亩</span>
            </div>
          </div>
        </div>
        <div class="tip_box people_tip">
          <img class="icon" src="../../../../assets/imgs/homes/Polygon.png" alt="" />
          <div class="left_text">人口</div>
        </div>
        <div @click="onChange(1)" class="peoole_list">
          <div class="people_info">
            <div class="people_box">
              <div>
                <img class="prople_img" src="../../../../assets/imgs/homes/ico_left.png" alt="" />
              </div>
              <div class="people_con">
                <span class="people_text">总户数</span>
                <span class="num">{{ populationScreenDtoList.houseNum }} </span>
                <span>户</span>
              </div>
              <div class="people_right">
                <img class="right_icon" src="../../../../assets/imgs/homes/Polygons.png" alt="" />
                <span>财产户</span>
                {{ populationScreenDtoList.cchNum }}户
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
                <span class="num">
                  {{ populationScreenDtoList.peopleNum }}
                </span>
                <span>人</span>
              </div>
              <div class="people_right">
                <img class="right_icon" src="../../../../assets/imgs/homes/Polygons.png" alt="" />
                <span>农业</span>
                {{ populationScreenDtoList.nongNum }}人
                <span class="people_border"></span>
                <span>非农</span>
                {{ populationScreenDtoList.unNongNum }}人
              </div>
            </div>
          </div>
        </div>
        <div class="tip_box">
          <img class="icon" src="../../../../assets/imgs/homes/Polygon.png" alt="" />
          <div class="left_text">房屋</div>
        </div>
        <div @click="onChange(2)" class="permanent">
          <div v-for="item in houseList" :key="item.id" class="permanent_box">
            <div class="permanent_box_top">{{ item.name }}</div>
            <div class="permanent_box_bom"> {{ houseScreenDto[item.num] }}<span> ㎡</span> </div>
          </div>
        </div>
        <div class="tip_box">
          <img class="icon" src="../../../../assets/imgs/homes/Polygon.png" alt="" />
          <div class="left_text">企（事）业单位</div>
        </div>
        <div @click="onChange(3)" class="business">
          <div class="business_li">
            <div class="business_li_l">
              <img class="ico_a" src="../../../../assets/imgs/homes/ico_a.png" alt="" />
            </div>
            <div class="business_li_r">
              <div>企业</div>
              <div class="bom_text">{{ companyDto.qyNum }} <span>家</span></div>
            </div>
          </div>
          <div class="business_li">
            <div class="business_li_l">
              <img class="ico_a" src="../../../../assets/imgs/homes/sdz.png" alt="" />
            </div>
            <div class="business_li_r">
              <div>水电站</div>
              <div class="bom_text">{{ companyDto.gtNum }} <span>家</span></div>
            </div>
          </div>
          <div class="business_li">
            <div class="business_li_l">
              <img class="ico_a" src="../../../../assets/imgs/homes/icon_c.png" alt="" />
            </div>
            <div class="business_li_r">
              <div>个体工商户</div>
              <div class="bom_text">{{ companyDto.tkqNum }} <span>家</span></div>
            </div>
          </div>
          <div class="business_li">
            <div class="business_li_l">
              <img class="ico_a" src="../../../../assets/imgs/homes/tkq.png" alt="" />
            </div>
            <div class="business_li_r">
              <div>探矿权</div>
              <div class="bom_text">{{ companyDto.qyNum }} <span>家</span></div>
            </div>
          </div>
        </div>
        <div class="tip_box">
          <img class="icon" src="../../../../assets/imgs/homes/Polygon.png" alt="" />
          <div class="left_text">主要专业项目</div>
        </div>
        <div class="project">
          <div class="project_table">
            <div v-for="item in projectsList" :key="item.id" class="table_li">
              <div class="table_name"> <span class="table_cur"></span> {{ item.name }} </div>
              <div class="tabel_value">{{ professionalProjectsDto[item.num] }}km</div>
            </div>
          </div>
          <div class="project_table_r">
            <div v-for="item in projectArr" :key="item.id" class="table_li">
              <div class="table_name"> <span class="table_cur"></span> {{ item.name }} </div>
              <div class="tabel_value">
                {{ professionalProjectsDto[item.num] }}{{ item.type }}
              </div>
            </div>
          </div>
        </div>

        <div v-if="isClose" class="siderbar_box_house">
          <Siderbar
            @on-close="(e) => (isClose = e)"
            :isClose="isClose"
            :isType="isType"
            @handle-change="handleChange"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import Label from './label.vue'
import Siderbar from './siderbar.vue'

import { getVillageList, getLeadershipScreen } from '@/api/AssetEvaluation/leader-side'
import { ElTabs, ElTabPane, ElSelect, ElOption } from 'element-plus'
import { useAppStore } from '@/store/modules/app'
import { useEmitt } from '@/hooks/web/useEmitt'

onMounted(() => {
  villageList()
  getList()
  //getToken()
})
const appStore = useAppStore()
const { emitter } = useEmitt()
const reason = ref()
const villageLists = ref<any>([])
const landScreenDtoListObj = ref<any>({})
const paramsValue = ref<any>({})
const leadershipScreenList = ref<any>({})
const arr = ref<any>([])
const tokenStr = ref<string>('')
const populationScreenDtoList = ref<any>({})
const houseScreenDto = ref<any>({})
const companyDto = ref<any>({})
const fundScreenDto = ref<any>({})

const isType = ref('0')

const isClose = ref(false)

const professionalProjectsDto = ref<any>({})

const landList = ref<any>([
  {
    id: 1,
    name: '水库淹没区',
    num: 'totalSkymqArea'
  },
  {
    id: 2,
    name: '枢纽工程建设区',
    num: 'totalSnjsqArea'
  },
  {
    id: 3,
    name: '翰水工程建设区',
    num: 'totalSsjsqArea'
  }
])

const houseList = ref<any>([
  {
    id: 1,
    name: '总房屋面积',
    num: 'totalArea'
  },
  {
    id: 2,
    name: '住宅房屋',
    num: 'zzArea'
  },
  {
    id: 3,
    name: '村集体房屋',
    num: 'cjtArea'
  }
])

const projectsList = ref<any>([
  {
    id: 1,
    name: '四级公路',
    num: 'road',
    type: 'km'
  },
  {
    id: 2,
    name: '35KV电力线路',
    num: 'electricity',
    type: 'km'
  },
  {
    id: 3,
    name: '电信杆路',
    num: 'dxLine',
    type: 'km'
  },
  {
    id: 4,
    name: '移动杆路',
    num: 'ydLine',
    type: 'km'
  },
  {
    id: 5,
    name: '联通杆路',
    num: 'ltLine',
    type: 'km'
  }
])

const projectArr = ref<any>([
  {
    id: 6,
    name: '铁塔基站',
    num: 'gdLine',
    type: '座'
  },
  {
    id: 7,
    name: '广电杆路',
    num: 'ttjz',
    type: 'km'
  },
  {
    id: 8,
    name: '溪西水文站',
    num: 'swz',
    type: '处'
  },
  {
    id: 9,
    name: '县级文保点',
    num: 'wbd',
    type: '处'
  },
  {
    id: 10,
    name: '宗教设施',
    num: 'zjss',
    type: '处'
  }
])

const onChange = (e: any) => {
  isClose.value = true
  isType.value = e
}
const villageList = async () => {
  villageLists.value = await getVillageList({})
}

const tabVillage = async () => {
  appStore.setVillageCoder(reason.value)
  getList()
}

const clearInput = () => {}

const getList = async () => {
  paramsValue.value = { code: reason.value || undefined }
  const list = await getLeadershipScreen(paramsValue.value)
  // 项目概览
  landScreenDtoListObj.value = list.landScreenDto

  //人口
  populationScreenDtoList.value = list.populationScreenDto

  // 房屋
  houseScreenDto.value = list.houseScreenDto

  // 企(事业单位)
  companyDto.value = list.companyDto

  // 主要专业项目
  professionalProjectsDto.value = list.professionalProjectsDto

  // fundScreenDto.value = list.fundScreenDto

  emitter.emit('getHomeInfo_list', list)
}
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
      position: relative;
      .siderbar_box_house {
      }
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
          position: relative;
          margin-left: 6px;
          .icons {
            width: 7px;
            height: 9px;
            position: absolute;
            left: -7px;
            top: 5px;
          }
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
        cursor: pointer;
        height: 72px;
        border-radius: 4px 4px 4px 4px;
        opacity: 1;
        border: 1px solid rgba(62, 115, 236, 0.2);
        margin-top: 10px;
        display: flex;
        justify-content: space-between;
        margin-bottom: 18px;
        position: relative;
        .siderbar_box {
          position: absolute;
          top: 15px;
          right: -430px;
          z-index: 999;
        }

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
      .peoole_list {
        position: relative;
        cursor: pointer;
        .siderbar_people {
          position: absolute;
          top: 15px;
          right: -430px;
          z-index: 999;
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
        cursor: pointer;
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
