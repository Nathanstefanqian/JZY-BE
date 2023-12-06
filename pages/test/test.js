// B小程序 - 对应页面的js文件
Page({
  data: {
    c1: Object,
    job: Object,
    takeaway: Object,
    markers: []
  },

  async onLoad() {
    // 替换为你的云开发环境ID
    let c1 = new wx.cloud.Cloud({
      resourceAppid: 'wxb6b66008bee95427',
      resourceEnv: 'jzy-2gzzv7vae99329fb',
    })
    await c1.init()
    const job = c1.database().collection('job')
    const takeaway = c1.database().collection('takeaway')
    this.setData({ job, takeaway })
  },
  async onTest() {
    const { job } = this.data
    const res = await job.add({ data: {
      HireNumberRadio: 1,
      contactValue: "18012858611",
      demand: "需要一个服务员",
      desc: "描述",
      isTeacher: 1,
      jobTitle: "招聘服务员",
      salary: "固定薪资",
      salaryEnd: "120",
      salaryStart: "",
      select: {"selectContact": "手机号", "selectTime": "元/周"},
      state: 0,
      work: ["1-2天", "周末节假日", ["早班", "中班"], "长期兼职"],
      workPlace: {
        address: "江苏省南通市崇川区世纪大道",
        latitude: 31.97958,
        longitude: 120.89371,
        name: "南通市人民政府"
      },
      time: new Date(),
      updateTime: new Date()
    }})
    console.log(res)
  },
  async onTake() {
    const { takeaway } = this.data
    const res = await takeaway.add({ data: {
      contactValue: "18012858611",
      desc: "拿快件",
      isTeacher: 1,
      jobTitle: "拿快件",
      salaryEnd: "120",
      select: {"selectContact": "手机号", "selectTime": "元/周"},
      state: 0,
      work: ["1-2天", "周末节假日", ["早班", "中班"], "长期兼职"],
      workPlace: {
        address: "江苏省南通市崇川区世纪大道",
        latitude: 31.97958,
        longitude: 120.89371,
        name: "南通市人民政府"
      },
      destPlace: {
        address: "江苏省南通市崇川区世纪大道",
        latitude: 31.97958,
        longitude: 120.89371,
        name: "南通市人民政府"
      },
      time: new Date(),
      updateTime: new Date(),
      currentDate: new Date()
    }})
    console.log(res)
  },
  onTap() {
    for(let i = 0; i < 10; i++) {
      this.onTake()
    }
  }
});