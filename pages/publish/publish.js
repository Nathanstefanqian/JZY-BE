const { Contact, SalaryTime, isNull } = require('../../data/data')
const job = wx.cloud.database().collection('job')
const checkParams = obj => {
  for (const key in obj) {
    if (key === 'work' || key === 'workPlace') {
      console.log(obj[key])
    }
    if (!obj[key] && key !== 'salaryStart') {
      wx.showModal({
        title: '提示',
        content: isNull[key],
        showCancel: false
      })
      return
    }
  }
}
Page({
  data: {
    jobTitle: '',
    title: '',
    max: 2,
    page: 1,
    show: false,
    selectShow: false,
    calendarShow: false,
    timeSelect: '',
    HireNumberRadio: '',
    PaymentRadio: '',
    demand: '',
    select: {
      selectTime: '元/周',
      selectContact: '手机号'
    },
    isJump: false,
    tabActive: '',
    actions: [],
    salaryStart: '',
    salaryEnd: '',
    salaryShow: true,
    shortTimeitems: [
      {
        text: '工作日期',
        children: [
          {
            text: '自定义日期',
            id: 1
          }
        ]
      },
      {
        text: '工作时间',
        children: [
          {
            text: '不限',
            id: 2
          },
          {
            text: '周末节假日',
            id: 3
          },
          {
            text: '工作日',
            id: 4
          },
          {
            text: '依据个人时间安排',
            id: 5
          }
        ]
      },
      {
        text: '工作时段(多选）',
        children: [
          {
            text: '早班',
            id: 6
          },
          {
            text: '中班',
            id: 7
          },
          {
            text: '晚班',
            id: 8
          },
          {
            text: '不限',
            id: 9
          }
        ]
      }
    ],
    longTimeitems: [
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
            id: 1
          },
          {
            text: '周末节假日',
            id: 2
          },
          {
            text: '工作日',
            id: 3
          },
          {
            text: '依据个人时间安排',
            id: 4
          }
        ]
      },
      {
        text: '工作时段(多选）',
        children: [
          {
            text: '不限',
            id: 1
          },
          {
            text: '早班',
            id: 2
          },
          {
            text: '中班',
            id: 3
          },
          {
            text: '晚班',
            id: 4
          }
        ]
      }
    ],
    workDesc: '',
    work: ['', '', '', ''],
    shortActive: ['', '', []],
    longActive: ['', '', []],
    long: {
      mainActiveIndex: 0,
      activeId: ''
    },
    short: {
      mainActiveIndex: 0,
      activeId: null
    },
    workPlace: {
      name: '',
      address: '',
      latitude: '',
      longitude: ''
    },
    contactValue: ''
  },

  onLoad(e) {
    var isJump = wx.getStorageSync('isJump');
    if (isJump) {
      const res = wx.getStorageSync('job')
      this.setData({
        isJump: true,
        jobTitle: res.jobTitle,
        work: res.work,
        HireNumberRadio: res.HireNumberRadio,
        PaymentRadio: res.PaymentRadio,
        contactValue: res.contactValue,
        demand: res.demand,
        desc: res.desc,
        salary: res.salary,
        salaryEnd: res.salaryEnd,
        salaryStart: res.salaryStart,
        workPlace: res.workPlace
      }, () => {
        console.log(this.data.salaryStart)
      })
    }
  },

  onShow(e) {
    var isJump = wx.getStorageSync('isJump')
    if (isJump) {
      const res = wx.getStorageSync('job')
      const work = res.work
      let workDesc = work[3] + ' ; ' + work[0] + ' ; ' + work[1] + ' ; '
      work[2].map(item => workDesc += item)
      workDesc += ' ; '
      this.setData({
        isJump: true,
        jobTitle: res.jobTitle,
        work: res.work,
        HireNumberRadio: res.HireNumberRadio,
        PaymentRadio: res.PaymentRadio,
        contactValue: res.contactValue,
        demand: res.demand,
        desc: res.desc,
        salary: res.salary,
        salaryEnd: res.salaryEnd,
        salaryStart: res.salaryStart,
        workPlace: res.workPlace,
        workDesc
      })
    }
  },

  onReset() {
    this.setData({
      jobTitle: '',
      title: '',
      max: 2,
      page: 1,
      show: false,
      selectShow: false,
      calendarShow: false,
      timeSelect: '',
      HireNumberRadio: '',
      PaymentRadio: '',
      demand: '',
      select: {
        selectTime: '元/周',
        selectContact: '手机号'
      },
      isJump: false,
      tabActive: '',
      actions: [],
      salaryStart: '',
      salaryEnd: '',
      salaryShow: true,
      workDesc: '',
      work: ['', '', '', ''],
      shortActive: ['', '', []],
      longActive: ['', '', []],
      long: {
        mainActiveIndex: 0,
        activeId: ''
      },
      short: {
        mainActiveIndex: 0,
        activeId: null
      },
      workPlace: {
        name: '',
        address: '',
        latitude: '',
        longitude: ''
      },
      contactValue: ''
    })
  },

  onTitleInput(e) {
    this.setData({ jobTitle: e.detail.value })
  },

  onDescInput(e) {
    this.setData({ desc: e.detail.value })
  },

  onDemandInput(e) {
    this.setData({ demand: e.detail.value })
  },

  onTime() {
    this.setData({ show: true, work: ['', '', '', ''] })
  },
  onCancelModify() {
    const that = this
    wx.showModal({
      title: '提示',
      content: '确认取消修改该职位吗？',
      success: res => {
        if (res.confirm) {
          wx.setStorageSync('isJump', false)
          wx.removeStorageSync('job')
          that.onReset()
        }
      }
    })
  },

  onTabChange(e) {
    this.setData({
      tabActive: e.detail.index,
      work: ['', '', '', '']
    })
  },

  onClose() {
    this.setData({ show: false, selectShow: false, calendarShow: false })
  },

  onConfirm(e) {
    let { shortTimeitems, work } = this.data
    const dates = e.detail
    const datesTemp = []
    dates.map(item => {
      const date = new Date(item)
      const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }
      const formatter = new Intl.DateTimeFormat('zh-CN', options)
      const formattedDate = formatter.format(date)
      datesTemp.push(formattedDate)
    })
    shortTimeitems[0].children[0].text = datesTemp[0] + '-' + datesTemp[1]
    work[0] = shortTimeitems[0].children[0].text
    this.setData({ calendarShow: false, shortTimeitems, work })
  },

  onTimeConfirm(e) {
    let { tabActive, work, workDesc } = this.data
    work[3] = tabActive ? '长期兼职' : '临时兼职'
    let workIsNull = tabActive ? ['每周工作天数不能为空', '工作时间不能为空', '工作时段不能为空'] : ['工作日期不能为空', '工作时间不能为空', '工作时段不能为空']
    let isAnyItemEmpty = work.some((item, index) => {
      if (!item) {
        wx.showModal({
          title: '提示',
          content: workIsNull[index],
          showCancel: false
        })
        return true; // 终止循环
      }
    });

    if (isAnyItemEmpty) {
      return; // 退出函数
    }
    workDesc = work[3] + ' ; ' + work[0] + ' ; ' + work[1] + ' ; '
    work[2].map(item => workDesc += item)
    workDesc += ' ; '
    this.setData({ work, show: false, workDesc }, () => console.log(work))
  },

  onToggleSalary() {
    let { salaryShow } = this.data
    this.setData({
      salaryShow: !salaryShow,
      salaryStart: ''
    })
  },

  onSalary() {
    this.setData({ selectShow: true, actions: SalaryTime, title: '薪资单位' })
  },

  onSalaryInput(e) {
    this.setData({ salaryEnd: e.detail.value })
  },

  onSalaryStartInput(e) {
    this.setData({ salaryStart: e.detail.value })
  },

  onContact() {
    this.setData({ selectShow: true, actions: Contact, title: '联系方式' })
  },

  onGetUserInfo(e) {
    console.log(e.detail);
  },

  onClickNav({ detail = {} }) {
    let { short, shortActive } = this.data
    short.mainActiveIndex = detail.index
    short.activeId = shortActive[short.mainActiveIndex]
    this.setData({
      short
    });
  },

  onClickItem({ detail = {} }) {
    let { short, work, shortActive } = this.data
    if (short.mainActiveIndex == 0) {
      this.setData({
        calendarShow: true
      })
      return
    }
    if (short.mainActiveIndex == 2) { // 多选
      if (!Array.isArray(short.activeId)) {
        short.activeId = [short.activeId]
      }
      const index = short.activeId.indexOf(detail.id)
      if (index > -1) {
        short.activeId.splice(index, 1)
        const subIndex = work[short.mainActiveIndex].indexOf(detail.text)
        work[short.mainActiveIndex].splice(subIndex, 1)
        shortActive[2].splice(subIndex, 1)
      }
      else {
        short.activeId.push(detail.id)
        work[short.mainActiveIndex] = [...work[short.mainActiveIndex], detail.text]
        shortActive[2].push(detail.id)
      }
    }
    else {
      short.activeId = detail.id
      work[short.mainActiveIndex] = detail.text
      shortActive[short.mainActiveIndex] = detail.id
    }

    this.setData({ short, work, shortActive }, () => {
      console.log(work)
    })
  },

  onClickLongNav({ detail = {} }) {
    let { long, longActive } = this.data
    long.mainActiveIndex = detail.index
    long.activeId = longActive[long.mainActiveIndex]
    this.setData({
      long
    })
  },

  onClickLongItem({ detail = {} }) {
    let { long, work, longActive } = this.data
    if (long.mainActiveIndex == 2) { // 多选
      if (!Array.isArray(long.activeId)) {
        long.activeId = [long.activeId]
      }
      const index = long.activeId.indexOf(detail.id)
      if (index > -1) {  // 取消选中
        long.activeId.splice(index, 1)
        const subIndex = work[long.mainActiveIndex].indexOf(detail.text)
        longActive[2].splice(subIndex, 1)
        work[long.mainActiveIndex].splice(subIndex, 1)
      } else {
        long.activeId.push(detail.id)
        work[long.mainActiveIndex] = [...work[long.mainActiveIndex], detail.text]
        longActive[long.mainActiveIndex].push(detail.id)
      }
    }
    else {
      long.activeId = detail.id
      work[long.mainActiveIndex] = detail.text
      longActive[long.mainActiveIndex] = detail.id
    }
    this.setData({ long, work, longActive })
  },

  onNext() {
    const { salaryStart, salaryEnd } = this.data
    console.log(salaryStart)
    if (!/^(?:0|[1-9]\d*)$/.test(salaryEnd) && (!salaryStart || !/^(?:0|[1-9]\d*)$/.test(salaryStart))) {
      wx.showToast({
        title: '请输入合法的金额',
        icon: 'none'
      })
      return
    }
    if (salaryStart && parseInt(salaryEnd) <= parseInt(salaryStart)) {
      wx.showToast({
        title: '起始金额不能大于等于末尾金额',
        icon: 'none'
      })
      return
    }
    this.setData({
      page: 2
    })
  },

  onLocation() {
    const that = this
    wx.chooseLocation({
      complete: res => {
        console.log(res)
        let { workPlace } = that.data
        workPlace.address = res.address
        workPlace.latitude = res.latitude
        workPlace.longitude = res.longitude
        workPlace.name = res.name
        that.setData({ workPlace })
      }
    })
  },

  onPrevious() {
    this.setData({
      page: 1
    })
  },

  onSelect(e) {
    let { select, title } = this.data
    if (title === "薪资单位") {
      select.selectTime = e.detail.name
    }
    else {
      select.selectContact = e.detail.name
    }
    this.setData({
      select
    })
  },

  onHireNumberChange(e) {
    this.setData({
      HireNumberRadio: e.detail
    })
  },

  onPaymentChange(e) {
    this.setData({
      PaymentRadio: e.detail
    })
  },

  onContactValueInput(e) {
    this.setData({ contactValue: e.detail.value })
  },

  onSubmit() {
    const { jobTitle, salaryStart, salaryEnd, salaryShow, contact, select, demand, desc, PaymentRadio, HireNumberRadio, contactValue, work, workPlace } = this.data
    let salary = ''
    if (salaryShow === true) {
      salary = '固定薪资'
    } else {
      salary = '范围薪资'
    }
    const obj = {
      jobTitle, salary, salaryStart, salaryEnd, work, workPlace, contactValue, select, demand, desc, PaymentRadio, HireNumberRadio, contact
    }

    if (checkParams(obj)) {
      console.log('发布失败')
      return
    }
    const isJump = wx.getStorageSync('isJump')
    if (isJump) {
      const job = wx.getStorageSync('job')
      const { _id } = job
      wx.showModal({
        title: '提示',
        content: '确认修改该职位吗？',
        success: res => {
          const currentTime = new Date()
          obj.time = currentTime
          obj.updateTime = currentTime
          obj.state = 0
          job.where({ _id }).update({
            data: obj,
            complete: res => {
              console.log(res)
              wx.showToast({ title: '修改成功' })
            }
          })
          wx.setStorageSync('isJump', false)
        }
      })
    }
    const that = this
    wx.showModal({
      title: '提示',
      content: '确认发布该职位吗？',
      success: res => {
        const currentTime = new Date()
        obj.time = currentTime
        obj.updateTime = currentTime
        obj.state = 0
        job.add({
          data: obj,
          complete: res => {
            console.log(res)
            wx.showToast({ title: '发布成功' })
            // todo 发布完后刷新数据
            that.onReset()
          }
        })
      }
    })
  },

  onModify() {
    const { jobTitle, salaryStart, salaryEnd, salaryShow, contact, select, demand, desc, PaymentRadio, HireNumberRadio, contactValue, work, workPlace } = this.data
    let salary = ''
    if (salaryShow === true) {
      salary = '固定薪资'
    } else {
      salary = '范围薪资'
    }
    const obj = {
      jobTitle, salary, salaryStart, salaryEnd, work, workPlace, contactValue, select, demand, desc, PaymentRadio, HireNumberRadio, contact
    }
    if (checkParams(obj)) {
      console.log('发布失败')
      return
    }
    const jobItem = wx.getStorageSync('job')
    const { _id } = jobItem
    wx.showModal({
      title: '提示',
      content: '确认修改该职位吗？',
      success: res => {
        const currentTime = new Date()
        obj.time = currentTime
        obj.updateTime = currentTime
        obj.state = 0
        job.where({ _id }).update({
          data: obj,
          complete: res => {
            console.log(res)
            wx.showToast({ title: '修改成功' })
          }
        })
        wx.setStorageSync('isJump', false)
      }
    })
  }
})