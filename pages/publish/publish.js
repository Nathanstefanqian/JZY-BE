const { Contact, SalaryTime, isNull } = require('../../data/data')
const job = wx.cloud.database().collection('job')
const formatDate = date => {
  date = new Date(date);
  return `${date.getMonth() + 1}/${date.getDate()}`;
}
const checkParams = obj => {
  for (const key in obj) {
    if (key === 'work' || key === 'workPlace') {
      console.log(obj[key])
    }
    if (!obj[key] && key !== 'salaryStart') {
      console.log('问题', key)
      wx.showModal({
        title: '提示',
        content: isNull[key],
        showCancel: false
      })
      return false
    }
  }
  return true
}
Page({
  data: {
    c1: Object,
    job: Object,
    user: Object,
    user_job: Object,
    jobTitle: '',
    title: '',
    max: 2,
    page: 1,
    show: false,
    selectShow: false,
    calendarShow: false,
    calendarSingleShow: false,
    timeSelect: '',
    HireNumberRadio: 1,
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
            text: '选择单个日期',
            id: 1
          },
          {
            text: '选择日期区间',
            id: 12
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

  async onLoad(e) {
    let c1 = new wx.cloud.Cloud({
      resourceAppid: 'wxcd21eb64b26e4b50',
      resourceEnv: 'jzy-1gjdmixbb2d05e5f',
    })
    await c1.init()
    const job = c1.database().collection('job')
    const user = c1.database().collection('buser')    
    const user_job = c1.database().collection('user_job')
    this.setData({ c1, job, user, user_job })
    var isJump = wx.getStorageSync('isJump');
    if (isJump) {
      const res = wx.getStorageSync('job')
      this.setData({
        isJump: true,
        jobTitle: res.jobTitle,
        work: res.work,
        HireNumberRadio: res.HireNumberRadio,
        contactValue: res.contactValue,
        demand: res.demand,
        desc: res.desc,
        salary: res.salary,
        salaryEnd: res.salaryEnd,
        salaryStart: res.salaryStart,
        workPlace: res.workPlace
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
      HireNumberRadio: 1,
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
    this.setData({ show: false, selectShow: false, calendarShow: false, calendarSingleShow: false })
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
    shortTimeitems[0].children[1].text = datesTemp[0] + '-' + datesTemp[1]
    shortTimeitems[0].children[0].text = '请选择单个日期'
    work[0] = shortTimeitems[1].children[0].text
    this.setData({ calendarShow: false, shortTimeitems, work })
  },

  onConfirmSingle(event) {
    let { work, shortTimeitems } = this.data
    shortTimeitems[0].children[0].text = formatDate(event.detail)
    shortTimeitems[0].children[1].text = '请选择日期区间'
    work[0] = shortTimeitems[0].children[0].text
    this.setData({
      shortTimeitems, work, calendarSingleShow: false
    });
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
    this.setData({ work, show: false, workDesc })
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
      const { id } = detail
      if (id == 1) {
        this.setData({
          calendarSingleShow: true
        })
      }
      else {
        this.setData({
          calendarShow: true
        })
      }
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

    this.setData({ short, work, shortActive })
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
    const { salaryStart, salaryEnd, contactValue, select } = this.data
    if (select.selectContact == '手机号') {
      let regEx = /^1[34578]\d{9}$/
      if (!regEx.test(contactValue)) {
        wx.showToast({ title: '非法的手机号', icon: 'error' })
        return
      }
    }
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
    console.log(e)
    this.setData({
      HireNumberRadio: e.detail
    })
  },
  onContactValueInput(e) {
    this.setData({ contactValue: e.detail.value })
  },

  onSubmit() {
    const { job } = this.data
    if (wx.getStorageSync('openid')) {
      if (wx.getStorageSync('verify')) {
        wx.showToast({
          title: '请先实名', icon: 'error'
        })
      }
      const { jobTitle, salaryStart, salaryEnd, salaryShow, select, demand, desc, HireNumberRadio, contactValue, work, workPlace } = this.data
      let salary = ''
      if (salaryShow === true) {
        salary = '固定薪资'
      } else {
        salary = '范围薪资'
      }
      const obj = {
        jobTitle, salary, salaryStart, salaryEnd, work, workPlace, contactValue, select, demand, desc, HireNumberRadio,
      }

      if (!checkParams(obj)) {
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
            if (res.confirm) {
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
          }
        })
      }
      const that = this
      wx.showModal({
        title: '提示',
        content: '确认发布该职位吗？',
        success: res => {
          if (res.confirm) {
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
        }
      })
    } else {
      wx.showToast({ title: '请先登录', icon: 'error' })
    }
  },

  onModify() {
    const { jobTitle, salaryStart, salaryEnd, salaryShow, select, demand, desc, HireNumberRadio, contactValue, work, workPlace, job } = this.data
    let salary = ''
    if (salaryShow === true) {
      salary = '固定薪资'
    } else {
      salary = '范围薪资'
    }
    const obj = {
      jobTitle, salary, salaryStart, salaryEnd, work, workPlace, contactValue, select, demand, desc, HireNumberRadio,
    }
    if (!checkParams(obj)) {
      console.log('发布失败')
      return
    }
    const jobItem = wx.getStorageSync('job')
    const { _id } = jobItem
    wx.showModal({
      title: '提示',
      content: '确认修改该职位吗？',
      success: res => {
        if (res.confirm) {
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
      }
    })
  }
})  