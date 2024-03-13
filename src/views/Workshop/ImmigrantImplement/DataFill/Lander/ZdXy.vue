<template>
  <WorkContentWrap>
    <!-- 居民户信息 -- 协议签订 -->
    <div class="table-wrap !py-12px !mt-0px">
      <div class="flex items-center justify-between pb-12px">
        <div> </div>
        <ElSpace>
          <ElButton type="primary" @click="onDocumentation"> 档案上传 </ElButton>
          <!-- <ElButton class="!bg-[#30A952] !border-[#30A952]" type="primary"> 协议打印 </ElButton> -->
        </ElSpace>
      </div>

      <div class="agm-wrap">
        <ElScrollbar ref="scrollRef" height="600px" @scroll="scroll">
          <div class="agm-cont">
            <div class="agm-title">镜岭水库工程建设征地协议</div>
            <div class="agm-tit-1">甲方：镜岭镇人民政府</div>
            <div class="agm-tit-1">
              <span>乙方</span>
              <span class="common-ipt ml-10px">{{ form.name }}</span>
              <span class="pl-40px">联系电话</span>
              <span class="common-ipt ml-10px">{{ form.phone }}</span>
            </div>

            <div class="agm-txt mt-30px">
              镜岭水库工程经“浙发改农经 〔 2022 〕 4 “号”批准建设。根据 《
              浙江省人民政府关于镜岭水库工程建设征地移民安置规划大纲的批复 》 （浙政函 〔 2022 〕 78
              号）和 《 镜岭水库工程建设征地搬迁安置工作实施办法 》 （浙政办发 〔 2022 〕 94
              号，以下简称“办法”）等文件精神，甲乙双方就实物补偿和搬迁安置达成协议如下：
            </div>

            <div class="agm-tit-1 floor-item" id="第一条 基础信息">第一条 基础信息</div>

            <div class="agm-bold mt-20px">
              （一）经认定，乙方有农村移民 {{ form.countryNum }} 人，农业随迁
              {{ form.trailingNum }} 人，非农随迁 {{ form.unTrailingNum }} 人。具体如下：
            </div>

            <ElTable :data="form.countryDemographic" class="mt-10px">
              <ElTableColumn
                label="姓名"
                :width="342"
                prop="name"
                align="center"
                header-align="center"
              />
              <ElTableColumn
                label="身份证号"
                :width="342"
                prop="card"
                align="center"
                header-align="center"
              />
              <ElTableColumn
                label="信息"
                :width="342"
                prop="populationNatureText"
                align="center"
                header-align="center"
              />
            </ElTable>

            <div class="agm-bold">
              （二）经确认，乙方在工程建设征地范围内坐落有房屋，总计建筑面积
              {{ form.immigrantSign && form.immigrantSign.totalArea }}
            </div>
            <div class="agm-bold">
              （三）经确认，乙方在工程建设征地范围内青苗等地上附着物涉及的土地面积总计
              {{ form.immigrantSign && form.immigrantSign.landArea }}
            </div>

            <div class="agm-tit-1 floor-item" id="第二条 安置方式">第二条 安置方式</div>
            <div class="agm-tit-2"
              >（一）经认定，乙方选定搬迁安置方式为 {{ form.removalType }} 安置。</div
            >
            <div class="agm-tit-2">
              （二）经认定，乙方 {{ form.agricultureResettlementNum }} 人参加农业安置；
              {{ form.socialSecurityNum }} 参加社会保障安置； {{ form.workNum }}
              人参加自谋职业安置。具体如下：
            </div>
            <ElTable :data="form.resettlementList" class="mt-10px">
              <ElTableColumn
                label="姓名"
                :width="342"
                prop="name"
                align="center"
                header-align="center"
              />
              <ElTableColumn
                label="身份证号"
                :width="342"
                prop="card"
                align="center"
                header-align="center"
              />
              <ElTableColumn
                label="安置方式"
                :width="342"
                prop="settingWayText"
                align="center"
                header-align="center"
              />
            </ElTable>
            <div class="agm-txt">
              参加参加农业安置并将户籍迁入安置地的农村移民,人均安排 0.47 亩生产用地到村。
            </div>

            <div class="agm-tit-1 floor-item" id="第三条 安置房">第三条 安置房</div>
            <div class="agm-tit-2">
              （一）统一规划的安置点选址在湖镇镇集镇，位于湖镇镇派出所对面。
            </div>
            <div class="agm-tit-2">
              （二）经确认，乙方安置房选房人数
              {{ form.immigrantSign && form.immigrantSign.agricultureResettlementNum }}
              人，其中增计选房人数
              {{ form.immigrantSign && form.immigrantSign.increasesMeterNum }} 人，增计依据为：
              {{ form.immigrantSign && form.immigrantSign.increasesMeterRemark }}
              。
            </div>
            <div class="agm-tit-2">
              （三）乙方选定
              {{ houseTypeText() }} 房型安置房，具体如下：
            </div>

            <div class="detail-box">
              <div>
                <span class="agm-bold">联排房型：</span
                ><span class="agm-txt"
                  >选定为 {{ houseAreaTypeText() }}户型，建筑占地
                  {{ form.immigrantScheme && form.immigrantScheme.demolitionArea }} 平方米。</span
                >
              </div>
              <div>
                <span class="agm-bold">公寓房型：</span>
                <span class="agm-txt"
                  >选定公寓房 {{ form.apartmentNum }} 套；合计设计建筑面积约
                  {{ form.immigrantScheme && form.immigrantScheme.apartmentArea }}
                  平方米；户型组合为75平方米左右户型
                  {{ form.immigrantScheme && form.immigrantScheme.typeOneNum }} 套；95平方米左右户型
                  {{ form.immigrantScheme && form.immigrantScheme.typeTwoNum }}
                  套；115 平方米左右户型
                  {{ form.immigrantScheme && form.immigrantScheme.typeThreeNum }}
                  套；135平方米左右户型
                  {{ form.immigrantScheme && form.immigrantScheme.typeFourNum }} 套；选定储藏室
                  {{ form.immigrantScheme && form.immigrantScheme.storeroomNum }}
                  间（储藏室间数不得超过选定公寓房套数）。</span
                >
              </div>
            </div>

            <div class="agm-tit-2">
              （四）应缴安置房房款暂计 {{ typeTotalPrice }} 元，具体如下：
            </div>

            <div class="detail-box">
              <div>
                <span class="agm-bold">联排房型：</span
                ><span class="agm-txt"
                  >户型设计建筑面积约 {{ form.houseArea }} 平方米，结算单价为每平方米 1000 元，暂计
                  {{ dataCalculateBase('houseArea', 1000, null) }}元。</span
                >
              </div>
              <div>
                <span class="agm-bold">公寓房型：</span>
                <span class="agm-txt"
                  >公寓房合计设计建筑面积约 {{ totalArea }} 平方米，与自建户型设计建筑面积对等部分为
                  {{ form.immigrantScheme && form.immigrantScheme.houseAreaTypeText }}
                  平方米，每平方米基准价1000元，暂计
                  {{ gyTotalPrice }} 元；超出自建户型设计建筑面积为
                  {{ exceedArea }} 平方米，每平方米基准价1980元，暂计
                  {{ priceDifference }}
                  元；储藏室结算单价为每平方米1000元，每间暂计 15000元。 共
                  {{ form.immigrantSign && form.immigrantSign.storeroomNum }}
                  间暂计 {{ dataCalculateBase('storeroomNum', 15000, 'immigrantSign') }} 元。</span
                >
              </div>
              <div class="agm-txt">
                安置房结算房款建筑面积以房管部门实测为准。公寓房房款结算单价根据“办法”按基准价结合楼层系数
                确定：一楼按基准价减5%；二楼、四楼按基准价增加3%；三楼按基准价增加7%；五楼按基准价减8％。
              </div>
            </div>

            <div class="agm-tit-2"> （五）安置房“定位到户”按照相关实施细则执行。 </div>

            <div class="agm-tit-1 floor-item" id="第四条 补偿费、补助费及奖励费">
              第四条 补偿费、补助费及奖励费
            </div>

            <div class="agm-tit-2">（一）补偿费</div>
            <div class="detail-box">
              <div class="agm-txt">
                根据镜岭昌信价格事务有限公司出具的评估报告（附后），乙方房屋及
                附属建（构）筑物、青苗等地上附着物等补偿费总计
                {{ form.immigrantSign && form.immigrantSign.feeSum }} 元。
              </div>
            </div>

            <div class="agm-tit-2">（二）补助费</div>
            <div class="detail-box">
              <div>
                <span class="agm-bold">1、搬迁补助费：</span>
                <span class="agm-txt">
                  乙方有农村移民和农业随迁人口
                  {{ form.immigrantSign && form.immigrantSign.trailingNum }}
                  人，补助标准为每人1200元，合计
                  {{ form.immigrantSign && form.immigrantSign.relocationFee }}
                  元。
                </span>
              </div>
              <div>
                <span class="agm-bold">2、过渡期补助费：</span>
                <span class="agm-txt">
                  乙方有农村移民和农业随迁人口
                  {{ form.immigrantSign && form.immigrantSign.trailingNum }}
                  人，补助标准为每人4320元，小计
                  {{ dataCalculateBase('trailingNum', 4320, 'immigrantSign') }}
                  元；非农随迁人口
                  {{ form.immigrantSign && form.immigrantSign.unTrailingNum }}
                  人，补助标准为每人3000元，小计 3000 元；合计
                  {{ dataCalculateBase('unTrailingNum', 3000, 'immigrantSign') }}
                  元。
                </span>
              </div>
              <div>
                <span class="agm-bold">3、临时安置补助费：</span>
                <span class="agm-txt">
                  乙方选房人数（不含增计选房人数）为
                  {{ form.immigrantSign && form.immigrantSign.roomSelectionNum }}
                  人，补助标准为每人每月450元，小计临时安置补助费每月
                  {{ dataCalculateBase('roomSelectionNum', 450, 'immigrantSign') }}
                  元。补助时间为腾空被拆迁房屋并办理移交手续的当月至安置房选房的当月。首次
                  发放时间为乙方腾空被拆迁房屋并办理移交手续之日起十五日内，每半年发放一次。
                  符合补助条件的，按附件一办理确认手续。
                </span>
              </div>

              <div>
                <span class="agm-bold">4、异地搬迁补助费：</span>
                <span class="agm-txt">
                  在腾空被拆迁房屋并办理移交手续之日，按乙方符合享受县级（含）以上农民异地搬迁补助政策的人数，每人补助
                  5600 元。符合补助条件的，按附件二办理确认手续。
                </span>
              </div>

              <div class="agm-bold"> 5、其他补助费 </div>
              <div class="agm-txt">
                ① 自谋出路安置补助费：乙方有
                {{ form.immigrantSign && form.immigrantSign.seekWayNum }}
                人选定自谋出路安置方式，补助标准为每人15000元，小计
                {{ dataCalculateBase('seekWayNum', 15000, 'immigrantSign') }}
                元；
              </div>
              <div class="agm-txt">
                ② 自谋职业安置补助费：乙方有
                {{ form.immigrantSign && form.immigrantSign.workNum }}
                人选定自谋职业安置方式，补助标准为每人3000元，小计
                {{ dataCalculateBase('workNum', 3000, 'immigrantSign') }} 元；其他补助费合计
                {{ form.immigrantSign && form.immigrantSign.otherFeeSum }}
                元。
              </div>
            </div>

            <div class="agm-tit-2">（三）奖励费</div>
            <div class="detail-box">
              <div class="agm-bold"> 1、签约奖 </div>
              <div class="agm-txt">
                ① 网格签约奖：根据
                《关于在镜岭水库库区设置移民网格和建立乡村干部联系移民网格的通知》 （社委 〔 2022
                〕36 号）文件规定，乙方划分在 {{ villageText }} 村第
                <span class="common-ipt">
                  {{ form.immigrantSign && form.immigrantSign.gridName }}
                </span>
                网格。如乙方所在网格内所有签约对象在2022年12月10日17时前全部完成镜岭水库工程建设征
                地实物补偿、搬迁安置协议签订，按本协议签约之日乙方农村移民和随迁人口数量，每人奖励3000元。
                符合奖励条件的，按附件三办理确认手续。
              </div>
              <div class="agm-txt">
                ②
                按时签约奖：如乙方在2022年12月10日17时前完成本协议签订，按本协议签约之日乙方农村移民和随迁人口数量，每人奖励
                10000 元。符合奖励条件的，按附件四办理确认手续。
              </div>

              <div class="agm-bold"> 2 、提前腾空奖 </div>
              <div class="agm-txt">
                ① 房屋提前腾空奖：如乙方在 2023 年 3 月 31 日 17
                时前完成房屋腾空并办理移交手续，按住宅建筑面积每平方米奖励 200 元；如乙方在 2023 年
                5 月 15 日 17 时前完成房屋腾空并办理移交手续，按住宅建筑面积每平方米奖励 100
                元．符合奖励条件的，按附件五办理确认手续。
              </div>
              <div class="agm-txt">
                ② 青苗提前腾空奖：如乙方在 2023 年 5 月 15 日 17
                时前完成被征土地上青苗等地上附着物腾空并办理交地手续，按青苗等地上附着物涉及的土地面积，耕地每亩奖励
                1200 元；园地、林地每亩奖励 800 元；未利用地每亩奖励 100
                元。符合奖励条件的，按附件六办理确认手续。
              </div>
            </div>
            <div class="agm-tit-2">（四）补偿费、补助费及奖励费的支付</div>
            <div class="detail-box">
              <div class="agm-txt">
                1、双方约定将补偿费、异地搬迁补助费、奖励费（如有）等资金用于安置房房款抵扣，上述资金全额拨付至甲方指定银行账户，存储期间利息归乙方所有。
              </div>
              <div class="agm-txt">
                2、甲方于本协议签订之日起十五日内向乙方支付搬迁补助费、过渡期补助费、其他补助费合计
                3000 元；临时安置补助费按本协议约定的条件、时间支付。
              </div>
              <div class="agm-txt">
                3、乙方收款账户：户名 {{ form.bankName }} ， 开户行 建设银行 ，账号
                {{ form.bankAccount }} 。
              </div>
            </div>

            <div class="agm-tit-1 floor-item" id="第五条 安置房房款结算及交付">
              第五条 安置房房款结算及交付
            </div>
            <div class="agm-txt">
              安置房结算房款建筑面积以房管部门实测为准，结算单价按“办法”相关规定执行。结算房款时，若乙方已拨至甲方指定银行账户的抵扣资金少于结算房款的，乙方应在安置房交房前将差额部分资金足额缴纳至甲方指定的银行帐户。
            </div>
            <div class="agm-txt">
              安置房交付时间为 2023 年 12 月，未足额缴纳结算房款的，甲方有权拒绝交房。
            </div>

            <div class="agm-tit-1 floor-item" id="第六条">第六条</div>
            <div class="agm-txt">
              被征收房屋及附属建（构）筑物、青苗等地上附着物有产权纠纷的由乙方自行处理，并承担相应法律责任。房屋内水、电、通信网络、广播电视等费用由乙方自行结清。被征收房屋有租赁、抵押、典当等关系的，由乙方自行解除。
            </div>

            <div class="agm-tit-1 floor-item" id="第七条">第七条</div>
            <div class="agm-txt">
              房屋、青苗完成腾空并办理移交手续时，乙方应将房屋所有权证、土地证件或有效权属证明等资料交于甲方。办理移交手续后，房屋及附属建（构）筑物由甲方组织拆除，土地上新增青苗等不予补偿。乙方擅自进入已腾空并办理移交手续的房屋及土地内，造成任何后果由乙方承担全部法律责任。
            </div>

            <div class="agm-tit-1 floor-item" id="第八条">第八条</div>
            <div class="agm-txt"> 乙方确认，本协议已经与家庭全体成员协商一致。 </div>

            <div class="agm-tit-1 floor-item" id="第九条">第九条</div>
            <div class="agm-txt">
              本协议在履行过程汇总发生争议的，甲、乙双方应协商解决、协商不成的、可依法向法院提起诉讼。
            </div>

            <div class="agm-tit-1 floor-item" id="第十条">第十条</div>
            <div class="agm-txt">
              本协议一式四份，甲方三份，乙方一份，经双方签字盖章后（捺印）生效。
            </div>

            <div class="agm-tit-1 floor-item" id="第十一条">第十一条</div>
            <div class="agm-txt">
              其他约定：<span class="common-ipt">
                {{ form.immigrantSign && form.immigrantSign.remark }}
              </span>
            </div>

            <div class="agm-tit-2 agm-mt-40">甲方：镜岭镇人民政府（盖章）</div>

            <div class="agm-tit-2 agm-mt-40">
              <span>法定代表人：</span>
              <span class="common-ipt"></span>
              <span>经办人（工作小组成员）：</span>
              <span class="common-ipt"></span>
              <span>乙方（户主或委托代理人）：</span>
              <span class="common-ipt"></span>
            </div>

            <div class="agm-tit-2 agm-mt-40"> 鉴证方：镜岭水库工程建设指挥部办公室（盖章） </div>

            <div class="agm-tit-2 agm-mt-40"> 负责人（盖章） </div>

            <div class="agm-tit-2 agm-mt-40"> 经办人：<span class="common-ipt"></span> </div>

            <div class="agm-tit-2 agm-mt-40 text-right">
              <span>日期</span>
              <span class="common-ipt"></span>
              <span>年</span>
              <span class="common-ipt"></span>
              <span>月</span>
              <span class="common-ipt"></span>
              <span>日</span>
            </div>
          </div>
        </ElScrollbar>

        <div class="agm-nav">
          <div class="toc-box">
            <div
              v-for="(item, index) in navList"
              :key="item.id"
              :class="['toc-item', item.id === activeIndex ? 'active' : '']"
              @click="jump(index)"
            >
              <div>{{ item.name }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <OnDocumentation :show="dialog" :door-no="props.doorNo" @close="close" />
  </WorkContentWrap>
</template>

<script lang="ts" setup>
import { ref, nextTick, onMounted, computed, reactive } from 'vue'
import { ElTable, ElTableColumn, ElScrollbar, ElSpace, ElButton } from 'element-plus'
import { WorkContentWrap } from '@/components/ContentWrap'
import { getAgreementApi, getDistrictApi } from '@/api/immigrantImplement/agreement/service'
import { useDictStoreWithOut } from '@/store/modules/dict'
import { getSchemeBaseInfoApi } from '@/api/immigrantImplement/schemeBase/service'
import OnDocumentation from '@/views/Workshop/ImmigrantImplement/DataFill/Agreement/OnDocumentation.vue'

const dictStore = useDictStoreWithOut()
const dictObj = computed(() => dictStore.getDictObj)

interface NavType {
  id: number
  name: string
  active: boolean
}
const emit = defineEmits(['updateData'])
const dialog = ref<boolean>(false)
const navList = ref<NavType[]>([
  {
    id: 0,
    name: '第一条 基础信息',
    active: false
  },
  {
    id: 1,
    name: '第二条 安置方式',
    active: false
  },
  {
    id: 2,
    name: '第三条 安置房',
    active: false
  },
  {
    id: 3,
    name: '第四条 补偿费、补助费及奖励费',
    active: false
  },
  {
    id: 4,
    name: '第五条 安置房房款结算及交付',
    active: false
  },
  {
    id: 5,
    name: '第六条',
    active: false
  },
  {
    id: 6,
    name: '第七条',
    active: false
  },
  {
    id: 7,
    name: '第八条',
    active: false
  },
  {
    id: 8,
    name: '第九条',
    active: false
  },
  {
    id: 9,
    name: '第十条',
    active: false
  },
  {
    id: 10,
    name: '第十一条',
    active: false
  }
])

const activeIndex = ref<number>(0)
const contentLocation = ref<any[]>([])
const scrollRef = ref()
interface PropsType {
  doorNo: string
}
const props = defineProps<PropsType>()
let totalArea = ref(0)
let gyTotalPrice = ref(0)
let exceedArea = ref<string | number>(0)
let priceDifference = ref<string | number>(0)
let typeTotalPrice = ref<string | number>(0)
let form = ref<any>({})
const getDetail = async () => {
  const res = await getAgreementApi(props.doorNo)
  form.value = res
  calculateData()
}

const calculateData = () => {
  const tempGyTotalPrice =
    (form.value.immigrantScheme?.typeOneNum * 75 * form.value.immigrantScheme?.typeOnePrice
      ? form.value.immigrantScheme?.typeOneNum * 75 * form.value.immigrantScheme?.typeOnePrice
      : 0) +
    (form.value.immigrantScheme?.typeTwoNum * 95 * form.value.immigrantScheme?.typeTwoPrice
      ? form.value.immigrantScheme?.typeTwoNum * 95 * form.value.immigrantScheme?.typeTwoPrice
      : 0) +
    (form.value.immigrantScheme?.typeThreeNum * 115 * form.value.immigrantScheme?.typeThreePrice
      ? form.value.immigrantScheme?.typeThreeNum * 115 * form.value.immigrantScheme?.typeThreePrice
      : 0) +
    (form.value.immigrantScheme?.typeFourNum * 135 * form.value.immigrantScheme?.typeFourPrice
      ? form.value.immigrantScheme?.typeFourNum * 135 * form.value.immigrantScheme?.typeFourPrice
      : 0)
  gyTotalPrice.value = tempGyTotalPrice ? Number(tempGyTotalPrice.toFixed(2)) : 0
  const tempTotalArea =
    (form.value.immigrantScheme?.typeOneNum * 75
      ? form.value.immigrantScheme?.typeOneNum * 75
      : 0) +
    (form.value.immigrantScheme?.typeTwoNum * 95
      ? form.value.immigrantScheme?.typeTwoNum * 95
      : 0) +
    (form.value.immigrantScheme?.typeThreeNum * 115
      ? form.value.immigrantScheme?.typeThreeNum * 115
      : 0) +
    (form.value.immigrantScheme?.typeFourNum * 135
      ? form.value.immigrantScheme?.typeFourNum * 135
      : 0)
  totalArea.value = tempTotalArea ? Number(tempTotalArea.toFixed(2)) : 0
  const tempExceedArea =
    Number(totalArea.value || 0) - Number(form.value.immigrantScheme?.houseArea || 0)
  exceedArea.value = tempExceedArea > 0 ? tempExceedArea.toFixed(2) : 0
  priceDifference.value = (
    Number(exceedArea.value || 0) * Number(form.value.immigrantScheme?.housePrice || 0)
  ).toFixed(2)
  if (form.value.immigrantScheme?.houseType == 2) {
    typeTotalPrice.value = gyTotalPrice.value
  } else {
    typeTotalPrice.value = Number(
      (form.value.immigrantScheme?.houseArea ? form.value.immigrantScheme?.houseArea : 0) *
        (form.value.immigrantScheme?.housePrice ? form.value.immigrantScheme?.housePrice : 0)
    ).toFixed(2)
  }
}

const getDetailInfo = async () => {
  const res = await getSchemeBaseInfoApi(props.doorNo)
  if (res) {
    const { demolitionHouseArea, demolitionHouseAmount, demolitionHouseOtherAmount } = res
    form.value.demolitionHouseArea = demolitionHouseArea
    form.value.demolitionHouseAmount = demolitionHouseAmount
    form.value.demolitionHouseOtherAmount = demolitionHouseOtherAmount
  }
}

getDetailInfo()

getDetail()

interface VillageType {
  code: string
  value: string | number
}
let village = reactive<VillageType[]>([])
let villageText = ref<any>('')
const dictAdministration = (name?: string) => {
  getDistrictApi(name).then((res) => {
    village = res.content
  })
  villageText.value = village.find(
    (item) => item.code === form.value.immigrantSign?.villageCode
  )?.code
}
dictAdministration()

const dataCalculateBase = (formProps, baseData, type) => {
  const tempForm = type ? form.value[type] : form
  if (tempForm) {
    const result = tempForm[formProps] * baseData
    return result ? Number(result).toFixed(2) : 0
  } else {
    return ''
  }
}

const houseTypeText = () => {
  const tempHouseType = form.value.immigrantScheme?.houseType
  return tempHouseType === 1 ? '联排' : tempHouseType === 2 ? '公寓' : '一次性货币补偿'
}

const houseAreaTypeText = () => {
  const tempHouseAreaType = form.value.immigrantScheme?.houseAreaType
  const item = dictObj.value[318].find((item) => item.value === tempHouseAreaType)
  return item ? item.label + (isNaN(Number(item.label)) ? '' : '㎡') : ''
}

onMounted(() => {
  const floors = document.querySelectorAll('.floor-item')
  const arr: any[] = []
  floors.forEach((floor: any, index: number) => {
    if (index === 0) {
      arr.push(0)
    } else {
      arr.push(floor.offsetTop - 20 * index)
    }
  })
  contentLocation.value = arr
})

const jump = (index) => {
  // 左侧导航点击
  let total: number = contentLocation.value[index]
  nextTick(() => {
    activeIndex.value = index
    scrollRef.value.setScrollTop(total)
  })
}

// 内容部分滚动事件
const listenScroll = (scrollTop) => {
  contentLocation.value.forEach((el, index) => {
    if (scrollTop === 0) {
      activeIndex.value = 0
    } else if (scrollTop >= el) {
      activeIndex.value = index
    }
  })
}

const scroll = ({ scrollTop }) => {
  listenScroll(scrollTop)
}

// 归档
const onDocumentation = () => {
  dialog.value = true
}

const close = (e) => {
  dialog.value = false
  if (e) {
    emit('updateData')
  }
}
</script>

<style lang="less" scoped>
// 协议相关的样式
.agm-wrap {
  display: flex;
  padding: 0 40px 20px;
  justify-content: space-between;

  .agm-cont {
    width: 1025px;
  }

  .agm-nav {
    width: 260px;
    padding-top: 50px;
  }
}

.agm-title {
  height: 20px;
  margin-top: 40px;
  font-size: 20px;
  font-weight: bold;
  line-height: 20px;
  color: #171718;
  text-align: center;
}

.agm-tit-1 {
  height: 20px;
  margin: 50px 0 20px;
  font-size: 16px;
  font-weight: bold;
  line-height: 20px;
  color: #171718;
}

.agm-tit-2 {
  height: 30px;
  margin-top: 10px;
  font-size: 14px;
  font-weight: bold;
  line-height: 30px;
  color: #171718;
}

.agm-mt-40 {
  margin-top: 40px;
}

.agm-bold {
  font-size: 14px;
  font-weight: bold;
  line-height: 30px;
  color: #171718;
}

.agm-txt {
  margin-top: 10px;
  font-size: 14px;
  line-height: 30px;
  color: #171718;
}

.common-ipt {
  display: inline-flex;
  height: 30px;
  padding: 0 20px;
  border-bottom: 1px solid #333333;
  align-items: center;
}

.detail-box {
  padding-left: 30px;
}

.agm-nav {
  .toc-box {
    position: sticky;
    top: 30px;
    border-left: 1px solid #dcdfe6;
  }

  .toc-item {
    height: 40px;
    padding-left: 20px;
    margin-top: 10px;
    font-size: 14px;
    line-height: 40px;
    cursor: pointer;
    border-left: 4px solid transparent;

    &.active {
      border-left: 4px solid #3e73ec;
    }
  }
}
</style>
