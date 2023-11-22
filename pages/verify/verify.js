const verify = wx.cloud.database().collection('verify')
const { reg, imageUrl } = require('../../config/index')
// todo
const uploadFile = async url => {
  let c1 = new wx.cloud.Cloud({
    resourceAppid: 'wxcd21eb64b26e4b50',
    resourceEnv: 'jzy-1gjdmixbb2d05e5f',
  })
  await c1.init()
  const name = url.substring(url.lastIndexOf('/') + 1).toLowerCase()
  return new Promise((resolve, reject) => {
    c1.uploadFile({
      cloudPath: `verify/${name}`, // 文件名为临时文件的名称
      filePath: url, // 选择的图片临时文件路径
      success: res => {
        console.log('图片上传成功', res.fileID)
        const url = reg(res.fileID)
        console.log('打印url', url)
        resolve(url)
      },
      fail: err => {
        console.error('图片上传失败', err)
        reject(err)
      }
    })
  })
}
Page({
  data: {
    verify: Object,
    active: 0,
    frontImage: `${imageUrl}/assets/f.png`,
    backImage: `${imageUrl}/assets/b.png`,
    companyImage: `${imageUrl}/assets/y.png`,
    activeNames: ['1'],
    IdCard: '',
    name: '',
    companyInfo: {
      name: '',
      location: '',
      id: '',
      job: ''
    },
    isPersonalVerify: false,
    isCompanyVerify: false
  },
  async onLoad() {
    let c1 = new wx.cloud.Cloud({
      resourceAppid: 'wxcd21eb64b26e4b50',
      resourceEnv: 'jzy-1gjdmixbb2d05e5f',
    })
    await c1.init()
    const verify = c1.database().collection('verify')
    this.setData({ verify })
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    const openid = wx.getStorageSync('openid')
    const res = await verify.where({ _openid: openid }).get()
    if (res.data.length) { // 如果已认证过
      let info = res.data[0]
      if (info.type == 0) {
        this.setData({
          IdCard: info.IdCard,
          name: info.name,
          frontImage: info.frontImage,
          backImage: info.backImage,
          isPersonalVerify: true,
          active: 0
        }, () => wx.hideLoading())
      }
      else {
        const companyInfo = info.obj
        const companyImage = info.companyImage
        this.setData({
          companyInfo,
          companyImage,
          isCompanyVerify: true,
          active: 1
        }, () => wx.hideLoading())
      }
    }
    wx.hideLoading()
  },
  chooseFrontImage() {
    const that = this
    wx.chooseImage({
      count: 1, // 最多可以选择的图片张数
      sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图
      sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机
      success: async res => {
        var tempFilePath = res.tempFilePaths[0] // 选择的图片临时文件路径
        // 处理上传逻辑，可以通过wx.uploadFile等方法上传图片
        const result = await uploadFile(tempFilePath)
        that.setData({ frontImage: result })
        wx.showToast({ title: '上传成功' })
      }
    })
  },
  chooseBackImage() {
    const that = this
    wx.chooseImage({
      count: 1, // 最多可以选择的图片张数
      sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图
      sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机
      success: async res => {
        var tempFilePath = res.tempFilePaths[0] // 选择的图片临时文件路径
        // 处理上传逻辑，可以通过wx.uploadFile等方法上传图片
        const result = await uploadFile(tempFilePath)
        that.setData({ backImage: result })
        wx.showToast({ title: '上传成功' })
      }
    })
  },
  chooseCompanyImage() {
    const that = this
    wx.chooseImage({
      count: 1, // 最多可以选择的图片张数
      sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图
      sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机
      success: async res => {
        var tempFilePath = res.tempFilePaths[0] // 选择的图片临时文件路径
        // 处理上传逻辑，可以通过wx.uploadFile等方法上传图片
        const result = await uploadFile(tempFilePath)
        that.setData({ companyImage: result })
        wx.showToast({ title: '上传成功' })
      }
    })
  },
  onToggle(e) {
    console.log(e)
    const { index } = e.detail
    this.setData({
      active: index
    })
  },
  onNameInput(e) {
    const { value } = e.detail
    this.setData({ name: value })
  },
  onIdInput(e) {
    const { value } = e.detail
    this.setData({ IdCard: value })
  },
  onCompanyNameInput(e) {
    const { value } = e.detail
    let { companyInfo } = this.data
    companyInfo.name = value
    this.setData({ companyInfo })
  },
  onCompanyIdInput(e) {
    const { value } = e.detail
    let { companyInfo } = this.data
    companyInfo.id = value
    this.setData({ companyInfo })
  },
  onCompanyJobInput(e) {
    const { value } = e.detail
    let { companyInfo } = this.data
    companyInfo.job = value
    this.setData({ companyInfo })
  },
  onCompanyLocationInput(e) {
    const { value } = e.detail
    let { companyInfo } = this.data
    companyInfo.location = value
    this.setData({ companyInfo })
  },
  async onSubmitPersonal() {
    const { IdCard, name, frontImage, backImage,verify } = this.data
    const obj = {
      IdCard, name, frontImage, backImage
    }
    obj.type = 0
    const res = await verify.add({
      data: obj
    })
    wx.showToast({ title: '上传认证成功' })
    wx.setStorageSync('verify', 0)
    const that = this
    setTimeout(() => that.onLoad(), 2000)
  },
  async onUpdatePersonal() {
    const that = this
    const openid = wx.getStorageSync('openid')
    const { IdCard, name, frontImage, backImage, verify } = this.data
    const obj = {
      IdCard, name, frontImage, backImage
    }
    obj.type = await verify.where({ _openid: openid }).update({
      data: obj
    })
    wx.showToast({ title: '修改认证成功' })
    setTimeout(() => that.onLoad(), 2000)
  },
  async onDelete() {
    const openid = wx.getStorageSync('openid')
    await verify.where({ _openid: openid }).remove()
    wx.showToast({ title: '撤回认证成功' })
    wx.removeStorageSync('verify')
    setTimeout(() => wx.navigateBack(), 2000)
  },
  async onSubmitCompany() {
    const that = this
    const { companyInfo, companyImage, verify } = this.data
    const obj = companyInfo
    obj.type = 1
    await verify.add({
      data: { obj, companyImage }
    })
    wx.setStorageSync('verify', 1)
    wx.showToast({ title: '上传认证成功' })
    setTimeout(() => that.onLoad, 2000)
  },
  async onUpdateCompany() {
    const that = this
    const openid = wx.getStorageSync('openid')
    const { companyInfo, companyImage, verify } = this.data
    const obj = companyInfo
    obj.type = 1
    await verify.where({ _openid: openid }).update({
      data: { obj, companyImage }
    })
    setTimeout(() => that.onLoad, 2000)
  }
})