const { Contact, SalaryTime, isNull } = require('../../data/data')
const { getTime } = require('../../utils/util')
const formatDate = date => {
  date = new Date(date);
  return `${date.getMonth() + 1}/${date.getDate()}`;
}
const checkParams = obj => {
  for (const key in obj) {
    if (!obj[key] && key !== 'salaryStart') {
      wx.showModal({
        title: '提示',
        content: '请检查是否有必填项为空',
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
    takeaway: Object,
    currentDate: new Date().getTime(),
    jobTitle: '',
    max: 2,
    page: 1,
    show: false,
    selectShow: false,
    time: '',
    demand: '',
    select: {
      selectContact: '手机号'
    },
    isJump: false,
    salaryEnd: '',
    salaryShow: true,
    workPlace: {
      name: '',
      address: '',
      latitude: '',
      longitude: ''
    },
    destPlace: {
      name: '',
      address: '',
      latitude: '',
      longitude: ''
    },
    contactValue: ''
  },

  async onLoad(e) {
    let c1 = new wx.cloud.Cloud({
      resourceAppid: 'wxb6b66008bee95427',
      resourceEnv: 'jzy-2gzzv7vae99329fb',
    })
    await c1.init()
    const job = c1.database().collection('job')
    const user = c1.database().collection('buser')
    const user_job = c1.database().collection('user_job')
    const takeaway = c1.database().collection('takeaway')
    this.setData({ c1, job, user, user_job, takeaway })
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
      currentDate: new Date().getTime(),
      jobTitle: '',
      max: 2,
      page: 1,
      show: false,
      selectShow: false,
      time: '',
      demand: '',
      select: {
        selectContact: '手机号'
      },
      isJump: false,
      salaryEnd: '',
      salaryShow: true,
      workPlace: {
        name: '',
        address: '',
        latitude: '',
        longitude: ''
      },
      destPlace: {
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

  onTimeInput(e) {
    this.setData({ currentDate: e.detail })
  },

  onTimeConfirm() {
    const { currentDate } = this.data
    const time = getTime(currentDate)
    this.setData({ time })
    this.onClose()
  },

  onTime() {
    this.setData({ show: true })
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


  onClose() {
    this.setData({ show: false, selectShow: false, calendarShow: false, calendarSingleShow: false })
  },

  onSalary() {
    this.setData({ selectShow: true, actions: SalaryTime, title: '薪资单位' })
  },

  onSalaryInput(e) {
    this.setData({ salaryEnd: e.detail.value })
  },

  onContact() {
    this.setData({ selectShow: true, actions: Contact, title: '联系方式' })
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

  onDestLocation() {
    const that = this
    wx.chooseLocation({
      complete: res => {
        let { destPlace } = that.data
        destPlace.address = res.address
        destPlace.latitude = res.latitude
        destPlace.longitude = res.longitude
        destPlace.name = res.name
        that.setData({ destPlace })
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

  onContactValueInput(e) {
    this.setData({ contactValue: e.detail.value })
  },

  async onSubmit() {
    const { takeaway } = this.data
    const openid = wx.getStorageSync('openid')
    // 检查一下当前有无正在进行的
    const result = await takeaway.where({ _openid: openid }).get()
    let checkIsRunning = true
    result.data.map(item => {
      if(item.state == 0 || item.state == 1) {
        wx.showModal({ title: "请先结束正在进行的订单", showCancel: false })
        checkIsRunning = false
      }
    })
    if(!checkIsRunning) return
    if (wx.getStorageSync('isLogin')) {
      const verify = wx.getStorageSync('verify')
      console.log(typeof verify)
      if (typeof verify != 'number') {
        wx.showToast({
          title: '请先实名', icon: 'error'
        })
        return
      }
      const { jobTitle, currentDate, salaryEnd, select, desc, contactValue, workPlace, destPlace, time } = this.data

      const obj = {
        jobTitle, salaryEnd, select, desc, contactValue, workPlace, destPlace, currentDate, destTime: time
      }
      if (!checkParams(obj)) {
        console.log('发布失败')
        return
      }
      const that = this
      wx.showModal({
        title: '提示',
        content: '确认发布该跑腿吗？',
        success: res => {
          if (res.confirm) {
            const currentTime = new Date()
            obj.time = currentTime
            obj.updateTime = currentTime
            obj.state = 0
            takeaway.add({
              data: obj,
              complete: res => {
                console.log(res)
                wx.showToast({ title: '发布成功' })
                // 发布完后刷新数据
                that.onReset()
              }
            })
          }
        }
      })
    } else {
      wx.showToast({ title: '请先登录', icon: 'error' })
    }
  }
})  