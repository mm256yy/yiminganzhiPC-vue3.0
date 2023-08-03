// 宅基地安置区块
export const resettleArea = [
  {
    id: '1',
    name: '曙光安置区'
  },
  {
    id: '2',
    name: '镜岭集镇安置区'
  }
]

// 公寓安置地块
export const apartmentArea = [
  {
    id: '1',
    name: '棠村安置区'
  },
  {
    id: '2',
    name: '麻家田安置区'
  },
  {
    id: '3',
    name: '东坪安置区'
  }
]

export enum HouseType {
  homestead = 'homestead',
  flat = 'flat',
  oneself = 'oneself',
  concentrate = 'concentrate'
}

export const resettleHouseType = [
  {
    id: 'homestead',
    name: '宅基地',
    disabled: false
  },
  {
    id: 'flat',
    name: '公寓房',
    disabled: false
  },
  {
    id: 'oneself',
    name: '自谋出路',
    disabled: false
  },
  {
    id: 'concentrate',
    name: '集中供养',
    disabled: false
  }
]

// 宅基地面积
export const homesteadAreaSize = [
  {
    id: '1',
    name: 48,
    unit: 'm²',
    disabled: false,
    needPeopleNumber: 1,
    isSelected: false
  },
  {
    id: '2',
    name: 72,
    unit: 'm²',
    disabled: false,
    needPeopleNumber: 3,
    isSelected: false
  },
  {
    id: '3',
    name: 96,
    unit: 'm²',
    disabled: false,
    needPeopleNumber: 5,
    isSelected: false
  },
  {
    id: '4',
    name: 120,
    unit: 'm²',
    disabled: false,
    needPeopleNumber: 7,
    isSelected: false
  },
  {
    id: '5',
    name: 144,
    unit: 'm²',
    disabled: false,
    needPeopleNumber: 9,
    isSelected: false
  },
  {
    id: '6',
    name: 168,
    unit: 'm²',
    disabled: false,
    needPeopleNumber: 11,
    isSelected: false
  }
]

// 公寓

export const apartmentAreaSize = [
  {
    id: '1',
    name: 70,
    unit: 'm²',
    isSelected: false,
    num: 0
  },
  {
    id: '2',
    name: 90,
    unit: 'm²',
    isSelected: false,
    num: 0
  },
  {
    id: '3',
    name: 110,
    unit: 'm²',
    isSelected: false,
    num: 0
  },
  {
    id: '4',
    name: 130,
    unit: 'm²',
    isSelected: false,
    num: 0
  }
]

// 自谋出路
export const selfResettleData = [
  {
    type: 'compensate',
    title: '补偿费',
    subProject: '房屋补偿补助款',
    unit: 'm²',
    number: 2,
    costPrice: 1000,
    totalPrice: 22222
  },
  {
    type: 'compensate',
    title: '补偿费',
    subProject: '地面青苗附着物补偿款',
    unit: 'm²',
    number: 2,
    costPrice: 1000,
    totalPrice: 22222
  },
  {
    type: 'compensate',
    title: '补偿费',
    subProject: '宅基地补偿款 (超面积)',
    unit: 'm²',
    number: 2,
    costPrice: 1000,
    totalPrice: 22222
  },

  {
    type: 'subsidy',
    title: '补助费',
    subProject: '建房补助费',
    unit: 'm²',
    number: 2,
    costPrice: 1000,
    totalPrice: 22222
  },
  {
    type: 'subsidy',
    title: '补助费',
    subProject: '搬迁补助费',
    unit: 'm²',
    number: 2,
    costPrice: 1000,
    totalPrice: 22222
  },
  {
    type: 'subsidy',
    title: '补助费',
    subProject: '过渡期生产生活补助款',
    unit: 'm²',
    number: 2,
    costPrice: 1000,
    totalPrice: 22222
  },

  {
    type: 'reward',
    title: '奖励费',
    subProject: '签订动迁安置协议奖励',
    unit: 'm²',
    number: 2,
    costPrice: 1000,
    totalPrice: 22222
  },
  {
    type: 'reward',
    title: '奖励费',
    subProject: '房屋腾空奖励',
    unit: 'm²',
    number: 2,
    costPrice: 1000,
    totalPrice: 22222
  },
  {
    type: 'reward',
    title: '奖励费',
    subProject: '启动建房奖励',
    unit: 'm²',
    number: 2,
    costPrice: 1000,
    totalPrice: 22222
  },
  {
    type: 'reward',
    title: '奖励费',
    subProject: '完成建房奖励',
    unit: 'm²',
    number: 2,
    costPrice: 1000,
    totalPrice: 22222
  },
  {
    type: 'reward',
    title: '奖励费',
    subProject: '搬迁入驻奖励',
    unit: 'm²',
    number: 2,
    costPrice: 1000,
    totalPrice: 22222
  }
]
