<!--
 * @Author: baike
 * @LastEditors: baike
 * @LastEditors: 1019314017@qq.com 1019314017@qq.com
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
            @clear="getList"
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
            <div class="permanent_box_bom"> {{ houseScreenDto[item.num] }}<span> 万㎡</span> </div>
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
              <div class="bom_text">{{ companyDto.sdzNum }} <span>家</span></div>
            </div>
          </div>
          <div class="business_li">
            <div class="business_li_l">
              <img class="ico_a" src="../../../../assets/imgs/homes/icon_c.png" alt="" />
            </div>
            <div class="business_li_r">
              <div>个体工商户</div>
              <div class="bom_text">{{ companyDto.gtNum }} <span>家</span></div>
            </div>
          </div>
          <div class="business_li">
            <div class="business_li_l">
              <img class="ico_a" src="../../../../assets/imgs/homes/tkq.png" alt="" />
            </div>
            <div class="business_li_r">
              <div>探矿权</div>
              <div class="bom_text">{{ companyDto.tkqNum }} <span>家</span></div>
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
            :code="reason"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted, defineProps } from 'vue'
import Label from './label.vue'
import Siderbar from './siderbar.vue'

import { getVillageList, getLeadershipScreen } from '@/api/AssetEvaluation/leader-side'
import { ElTabs, ElTabPane, ElSelect, ElOption } from 'element-plus'
import { useAppStore } from '@/store/modules/app'
import { useEmitt } from '@/hooks/web/useEmitt'

const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:loading'])

onMounted(() => {
  // villageList()
  getList()
  //getToken()
})
const appStore = useAppStore()
const { emitter } = useEmitt()
const reason = ref()
// 330624109213	竹潭村
// 330624109212	小泉溪村
// 330624109214	殿前村
// 330624109215	下潘村
// 330624109217	大畈村
// 330624109221	潭角村
// 330624109216	后染村
// 330624109222	里镜屏村
// 330624109202	溪西村
// 330624109218	安山村
const villageLists = ref<any>([
  {
    code: null,
    name: '全域'
  },
  {
    code: 330624109213,
    name: '竹潭村'
  },
  {
    code: 330624109212,
    name: '小泉溪村'
  },
  {
    code: 330624109214,
    name: '殿前村'
  },
  {
    code: 330624109215,
    name: '下潘村'
  },
  {
    code: 330624109217,
    name: '大畈村'
  },
  {
    code: 330624109221,
    name: '潭角村'
  },
  {
    code: 330624109216,
    name: '后染村'
  },
  {
    code: 330624109222,
    name: '里镜屏村'
  },
  {
    code: 330624109202,
    name: '溪西村'
  },
  {
    code: 330624109218,
    name: '安山村'
  }
])
const landScreenDtoListObj = ref<any>({})
const paramsValue = ref<any>({})
const arr = ref<any>([])
const populationScreenDtoList = ref<any>({})
const houseScreenDto = ref<any>({})
const companyDto = ref<any>({})

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
    name: '输水工厂建设区',
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

//该方法未知 需确认排查 只为方便提交
const handleChange = () => {
  console.log(1)
}

const onChange = (e: any) => {
  console.log(e, isClose.value)

  if (isClose.value) {
    isClose.value = false
  }
  setTimeout(() => {
    isClose.value = true
    isType.value = e
  }, 500)
}
// const villageList = async () => {
//   villageLists.value = await getVillageList({})
// }

const tabVillage = async () => {
  appStore.setVillageCoder(reason.value)
  getList()
}

// const clearInput = () => {
//   console.log(reason.value)
// }

const getList = async () => {
  paramsValue.value = { code: reason.value || undefined }
  try {
    emit('update:loading', true)
    const list = await getLeadershipScreen(paramsValue.value)
    emit('update:loading', false)
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
    emitter.emit('getHomeInfo_list', list)
  } catch (error) {
    emit('update:loading', false)
  }
}
</script>

<style lang="less" scoped>
.letf_info {
  .header {
    width: 620px;
    height: 182px;
    margin-bottom: 13px;
    background: #ffffff;
    border: 2px solid rgba(62, 115, 236, 0.7);
    border-radius: 8px 8px 8px 8px;
    opacity: 1;
    box-shadow: 0px 3px 3px 0px rgba(62, 115, 236, 0.3);
    box-sizing: border-box;

    .w-full {
      width: 80px;
      height: 24px;
      margin-top: -6px;
    }

    .con_box {
      padding: 16px;
      font-size: 14px;
      font-weight: 400;
      line-height: 20px;
      color: #171718;
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
    border: 2px solid rgba(62, 115, 236, 0.7);
    border-radius: 8px 8px 8px 8px;
    opacity: 1;
    box-shadow: 0px 3px 3px 0px rgba(62, 115, 236, 0.3);

    .contain_ym_box {
      position: relative;
      padding: 16px;

      .tip_box {
        display: flex;

        .icon {
          width: 7px;
          height: 9px;
          margin-top: 2px;
          margin-right: 8px;
        }

        .left_text {
          margin-right: 8px;
          font-size: 14px;
          font-weight: 500;
          line-height: 16px;
          color: #131313;
        }

        .right_tip_box {
          position: relative;
          padding: 2px 10px;
          margin-top: -2px;
          margin-left: 6px;
          font-size: 14px;
          font-weight: 400;
          line-height: 16px;
          color: #333333;
          background: #f3f7ff;
          border-radius: 4px 4px 4px 4px;

          .icons {
            position: absolute;
            top: 5px;
            left: -7px;
            width: 7px;
            height: 9px;
          }

          span {
            margin-right: 5px;
            font-weight: 600;
            color: #3e73ec;
          }
        }
      }

      .people_tip {
        margin-bottom: 10px;
      }

      .permanent {
        position: relative;
        display: flex;
        width: 100%;
        height: 72px;
        margin-top: 10px;
        margin-bottom: 18px;
        cursor: pointer;
        border: 1px solid rgba(62, 115, 236, 0.2);
        border-radius: 4px 4px 4px 4px;
        opacity: 1;
        justify-content: space-between;

        .siderbar_box {
          position: absolute;
          top: 15px;
          right: -430px;
          z-index: 999;
        }

        .permanent_box {
          font-size: 14px;
          font-weight: 500;
          line-height: 20px;
          color: #666666;
          text-align: center;
          flex: 1;
        }

        .permanent_box_top {
          margin-top: 10px;
          margin-bottom: 8px;
        }

        .permanent_box_bom {
          font-family: DIN Medium, DIN Medium;
          font-size: 20px;
          font-weight: 400;
          line-height: 23px;
          color: #171718;

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
            margin-left: 8px;
            font-size: 14px;
            line-height: 40px;
            text-align: center;
            border: 1px solid rgba(62, 115, 236, 0.2);
            border-radius: 4px 4px 4px 4px;
            opacity: 1;

            .num {
              font-family: DIN Medium, DIN Medium;
              font-size: 20px;
              font-weight: 400;
              color: #171718;
            }

            .people_text {
              margin-right: 8px;
              font-size: 14px;
              font-weight: 500;
              color: #666666;
            }
          }

          .people_right {
            position: relative;
            width: 324px;
            height: 44px;
            margin-left: 16px;
            font-size: 14px;
            font-weight: 400;
            line-height: 44px;
            color: #000000;
            text-align: center;
            background: #f3f7ff;
            border-radius: 4px 4px 4px 4px;
            opacity: 1;

            .people_border {
              display: inline-block;
              width: 0px;
              height: 14px;
              margin: 0 16px;
              border: 1px solid #dddddd;
              opacity: 1;
            }

            span {
              margin-right: 8px;
              font-size: 14px;
              font-weight: 500;
              color: #666666;
            }

            .right_icon {
              position: absolute;
              top: 16px;
              left: -9px;
              width: 9px;
              height: 12px;
            }
          }
        }
      }

      .business {
        display: flex;
        padding-left: 13px;
        margin-top: 11px;
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
          font-weight: 500;
          line-height: 16px;
          color: #666666;

          .bom_text {
            margin-top: 8px;
            font-family: DIN Medium, DIN Medium;
            font-size: 20px;
            font-weight: 400;
            line-height: 23px;
            color: #171718;

            span {
              font-size: 14px;
              line-height: 16px;
            }
          }
        }
      }

      .project {
        display: flex;
        margin-top: 12px;

        .project_table {
          height: 172px;
          padding: 16px;
          margin-right: 8px;
          background: #f2f6ff;
          border-radius: 4px 4px 4px 4px;
          opacity: 1;
          box-shadow: 0px 2px 0px 0px rgba(62, 115, 236, 0.2);
          flex: 1;
        }

        .table_li {
          display: flex;
          width: 100%;
          margin-bottom: 10px;
          justify-content: space-between;

          .table_name {
            position: relative;
            padding-left: 12px;
            font-size: 14px;
            font-weight: 500;
            line-height: 20px;
            color: #666666;

            .table_cur {
              position: absolute;
              top: 8px;
              left: 0;
              display: inline-block;
              width: 4px;
              height: 4px;
              background: #9fbcff;
              border-radius: 0px 0px 0px 0px;
            }
          }

          .tabel_value {
            font-size: 14px;
            font-weight: 400;
            line-height: 16px;
            color: #171718;
          }
        }

        .project_table_r {
          height: 172px;
          padding: 16px;
          background: #f2f6ff;
          border-radius: 4px 4px 4px 4px;
          opacity: 1;
          box-shadow: 0px 2px 0px 0px rgba(62, 115, 236, 0.2);
          flex: 1;
        }
      }
    }
  }
}
</style>
