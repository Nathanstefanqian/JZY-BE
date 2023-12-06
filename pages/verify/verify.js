const { reg, imageUrl } = require('../../config/index')
const { getOCR, getCompanyOCR } = require('../../utils/util')
// todo
const uploadFile = async url => {
  let c1 = new wx.cloud.Cloud({
    resourceAppid: 'wxb6b66008bee95427',
    resourceEnv: 'jzy-2gzzv7vae99329fb',
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
    user: Object,
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
      job: '法人'
    },
    isPersonalVerify: false,
    isCompanyVerify: false
  },
  async onLoad() {
    let c1 = new wx.cloud.Cloud({
      resourceAppid: 'wxb6b66008bee95427',
      resourceEnv: 'jzy-2gzzv7vae99329fb',
    })
    await c1.init()
    const verify = c1.database().collection('verify')
    const user = c1.database().collection('buser')
    this.setData({ verify })
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    const openid = wx.getStorageSync('openid')
    const userRes = await user.where({ _openid: openid }).get()
    let userData = userRes.data[0]
    this.setData({ name: userData.name })
    const res = await verify.where({ _openid: openid }).get()
    if (res.data.length) { // 如果已认证过
      let info = res.data[0]
      if (info.type == 0) {
        this.setData({
          IdCard: info.IdCard,
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
        wx.showLoading({
          title: '上传中'
        })
        let { name } = this.data
        let tempFilePath = res.tempFilePaths[0] // 选择的图片临时文件路径
        // 首先进行规则判断
        const result = await getOCR(tempFilePath);  // 假设这是获取OCR结果的函数
        const { words_result } = result.data;
        const IdCard = words_result['公民身份号码'] ? words_result['公民身份号码'].words : null;  // 判断是否存在该属性
        const realName = words_result['姓名'] ? words_result['姓名'].words : null;  // 判断是否存在该属性
        if (IdCard && realName) {
          if (name == realName) {
            wx.showToast({ title: '信息匹配成功' });
            // 处理上传逻辑，可以通过wx.uploadFile等方法上传图片
            const url = await uploadFile(tempFilePath);
            that.setData({ frontImage: url, IdCard }, () => wx.hideLoading());
          } else {
            wx.hideLoading()
            wx.showModal({
              title: '身份证姓名与您不匹配',
              showCancel: false
            });
          }
        }
        else {
          wx.hideLoading()
          wx.showModal({
            title: '信息无法识别',
            showCancel: false
          });
        }
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
        wx.showLoading({
          title: '上传中'
        })
        let tempFilePath = res.tempFilePaths[0] // 选择的图片临时文件路径
        // 首先进行规则判断
        const result = await getOCR(tempFilePath);  // 假设这是获取OCR结果的函数
        const { words_result } = result.data;
        const str = words_result['失效日期'] ? words_result['失效日期'].words : null;  // 判断是否存在该属性
        if (!str) {
          wx.hideLoading()
          wx.showModal({ title: '信息无法识别', showCancel: false })
          return
        }
        const year = str.slice(0, 4);
        const month = str.slice(4, 6);
        const day = str.slice(6, 8);
        // 创建一个新的Date对象，将年、月、日作为参数传递
        const timestamp = new Date(year, month - 1, day).getTime();
        if (timestamp > Date.now()) { // 大于当前时间返回false
          wx.showToast({ title: '识别成功' })
          // 处理上传逻辑，可以通过wx.uploadFile等方法上传图片
          const url = await uploadFile(tempFilePath);
          that.setData({ backImage: url }, () => wx.hideLoading());
        } else { // 小于等于当前时间返回true
          wx.hideLoading()
          wx.showModal({
            title: '该身份证已过期',
            showCancel: false
          });
        }
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
        wx.showLoading({
          title: '上传中'
        })
        var tempFilePath = res.tempFilePaths[0] // 选择的图片临时文件路径
        const result = await getCompanyOCR(tempFilePath)
        if (!result.data.words_result) {
          console.log(result.data)
          wx.hideLoading()
          wx.showModal({ title: '信息无法识别', showCancel: false })
          return
        }
        const { words_result } = result.data
        const companyName = words_result['单位名称'] ? words_result['单位名称'].words : null
        const companyLocation = words_result['地址'] ? words_result['地址'].words : null
        const lawerName = words_result['法人'] ? words_result['法人'].words : null
        const code = words_result['社会信用代码'] ? words_result['社会信用代码'].words : null
        const { name } = that.data
        if (companyName && companyLocation && lawerName && code) { //如果都有
          if (lawerName == name) { // 如果名字相同
            console.log('passs')
            wx.hideLoading()
            wx.showToast({ title: '识别成功' })
            let { companyInfo } = this.data
            companyInfo.name = companyName
            companyInfo.location = companyLocation
            companyInfo.id = code
            // 处理上传逻辑，可以通过wx.uploadFile等方法上传图片
            const result = await uploadFile(tempFilePath)
            this.setData({ companyInfo, companyImage: result }, () => {
              wx.showToast({ title: '上传成功' })
            })
          }
          else { // 如果名字不同
            wx.hideLoading()
            wx.showModal({ title: '信息与法人姓名不匹配', showCancel: false })
          }
        }
        else {
          wx.hideLoading()
          wx.showModal({ title: '信息无法识别', showCancel: false })
          return
        }
      }
    })
  },
  onToggle(e) {
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
    const { IdCard, name, frontImage, backImage, verify } = this.data
    // 检查是否验证通过，可以通过照片是否上传成功来判断
    if (frontImage == `${imageUrl}/assets/f.png` ||
      backImage == `${imageUrl}/assets/b.png`
    ) {
      wx.showModal({
        title: '请检查是否正反面上传正确',
        showCancel: false
      })
      return
    }
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
    const { verify } = this.data
    const openid = wx.getStorageSync('openid')
    await verify.where({ _openid: openid }).remove()
    wx.showToast({ title: '撤回认证成功' })
    wx.removeStorageSync('verify')
    setTimeout(() => wx.navigateBack(), 2000)
  },
  async onSubmitCompany() {
    const that = this
    const { companyInfo, companyImage, verify } = this.data
    if (companyImage == `${imageUrl}/assets/y.png`) {
      wx.showModal({
        title: '请检查是否营业执照上传正确',
        showCancel: false
      })
    }
    const obj = companyInfo
    obj.type = 1
    await verify.add({
      data: { obj, companyImage }
    })
    wx.setStorageSync('verify', 1)
    wx.showToast({ title: '上传认证成功' })
    setTimeout(() => that.onLoad(), 2000)
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