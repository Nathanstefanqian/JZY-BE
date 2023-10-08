Page({
  data: {
    show: false,
    salaryShow: true,
    mainActiveIndex: 0,
    activeId: '',
    actions: [
      {
        name: '元/小时',
      },
      {
        name: '元/天',
      },
      {
        name: '元/周',
      },
      {
        name: '元/月',
      },
      {
        name: '元/其他',
      },
    ],
    items: [
      {
        text: '每周工作天数',
        children: [
          {
            text: '不限',
            id: 1,
          },
          {
            text: '1-2天',
            id: 2,
          },
          {
            text: '3-4天',
            id: 3,
          },
          {
            text: '5天以上',
            id: 4,
          }
        ],
      },
      {
        text: '工作时间',
        children: [
          {
            text: '不限',
            index: 1
          },
          {
            text: '周末节假日',
            index: 2
          }
        ]
      },
      {
        text: '工作时段',
        children: [
          {
            text: '不限',
            index: 1
          },
          {
            text: '周末节假日',
            index: 2
          },
          {
            text: '工作日',
            index: 3
          }
        ]
      }
    ]
  },
  onTime() {
    this.setData({
      show: true
    })
  },

  onClose() {
    this.setData({ show: false, salaryShow: false });
  },
  
  onSalary() {
    this.setData({ salaryShow: true })
  },

  onGetUserInfo(e) {
    console.log(e.detail);
  },

  onClickNav({ detail = {} }) {
    this.setData({
      mainActiveIndex: detail.index || 0,
    });
  },

  onClickItem({ detail = {} }) {
    const activeId = this.data.activeId === detail.id ? null : detail.id;
    this.setData({ activeId });
  },
});