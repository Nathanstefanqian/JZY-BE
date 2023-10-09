const { Contact, SalaryTime } = require('../../data/data')
Page({
  data: {
    page: 1,
    show: false,
    selectShow: false,
    mainActiveIndex: 0,
    activeId: '',
    actions: [],
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
    this.setData({ show: false, selectShow: false });
  },
  
  onSalary() {
    this.setData({ selectShow: true, actions: SalaryTime, title: '薪资单位' })
  },

  onContact() {
    this.setData({ selectShow: true, actions: Contact, title: '联系方式' })
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

  onNext() {
    this.setData({
      page: 2
    })
  },

  onPrevious() {
    this.setData({
      page: 1
    })
  },

  onSubmit() {
    wx.navigateTo({
      url: '../publish-success/publish-success',
    })
  }
});