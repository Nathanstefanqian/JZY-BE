const { sex } = require('../../data/data')
const { reg } = require('../../config/index')
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
      cloudPath: `avatar/${name}`, // 头像名用户openid命名
      filePath: url, // 选择的图片临时文件路径
      success: res => {
        console.log('图片上传成功', res.fileID)
        const url = reg(res.fileID)
        resolve(url)
      },
      fail: err => {
        console.error('图片上传失败', err)
        reject(err)
      }
    })
  })
}
const { imageUrl } = require('../../config/index')
Page({
  data: {
    c1: Object,
    job: Object,
    user: Object,
    imageUrl,
    action: '',
    avatarUrl: '',
    name: '',
    phone: '',
    sex: '',
    exist: false
  },
  async onLoad(e) {
    let c1 = new wx.cloud.Cloud({
      resourceAppid: 'wxb6b66008bee95427',
      resourceEnv: 'jzy-2gzzv7vae99329fb',
    })
    await c1.init()
    const job = c1.database().collection('job')
    const user = c1.database().collection('buser')
    this.setData({ c1, job, user })
    // 初始化一下头像
    let { imageUrl } = this.data
    this.setData({ avatarUrl: imageUrl + '/assets/boy.svg' })
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    const { id } = e
    if (id) { // 如果是修改的
      const openid = wx.getStorageSync('openid')
      const res = await user.where({ _openid: openid }).get()
      const info = res.data[0]
      this.setData({
        avatarUrl: info.url,
        name: info.name,
        phone: info.phone,
        sex: info.sex,
        exist: true
      }, () => wx.hideLoading())
    } else { // 如果是注册的
      wx.hideLoading()
    }
  },
  onClose() {
    this.setData({
      show: false
    })
  },
  onUpload() {
    const that = this
    wx.chooseImage({
      count: 1, // 最多可选择的图片数量
      sizeType: ['compressed'], // 所选的图片的尺寸压缩方式
      sourceType: ['album', 'camera'], // 选择图片的来源，可以从相册选择或使用相机拍摄
      async success(res) {
        const url = res.tempFilePaths[0]
        const avatarUrl = await uploadFile(url)
        that.setData({ avatarUrl }, () => {
          wx.showToast({ title: '选择成功' })
        })
      }
    })
  },
  onName(e) {
    const { value } = e.detail
    this.setData({
      name: value
    })
  },
  onSex() {
    this.setData({
      title: '请选择性别',
      show: true,
      actions: sex,
      index: 0
    })
  },
  onPhone(e) {
    const { value } = e.detail
    this.setData({
      phone: value
    })
  },
  onSelect(e) {
    const { name } = e.detail
    const { index } = this.data
    const list = ['sex', 'school', 'grade']
    const vari = list[index]
    this.setData({
      [vari]: name
    })
  },
  onChange(e) {
    this.setData({ verifyType: e.detail })
  },
  async onSubmit() {
    let { name, sex, phone, avatarUrl, imageUrl, user, c1 } = this.data
    if (avatarUrl == `${{ imageUrl }}/assets/boy.svg`) avatarUrl = ''  // 默认图片设置为空
    let phoneNumberRegex = /^1([3456789])\d{9}$/
    if (!phoneNumberRegex.test(phone)) {
      wx.showToast({
        title: '手机号不正确',
        icon: 'error'
      })
      return
    }
    const obj = {
      name, sex, phone, url: avatarUrl
    }
    // 检查非空
    for (const item of Object.values(obj)) {
      if (!item) {
        wx.showToast({ title: '请检查信息填写完整', icon: 'error' })
        return  // 发现数据为空时直接返回，退出函数
      }
    }
    await user.add({
      data: obj
    })
    for (let key in obj) { // 设置本地存储
      wx.setStorageSync(key, obj[key])
    }

    wx.setStorageSync('isLogin', true)
    wx.showToast({
      icon: 'success',
      title: '注册成功'
    })
    setTimeout(() => wx.navigateBack(), 2000)
  },
  async onModify() {
    let { name, sex, phone, avatarUrl, imageUrl, user } = this.data
    if (avatarUrl == `${{ imageUrl }}/assets/boy.svg`) avatarUrl = ''
    const obj = {
      name, sex, phone, url: avatarUrl
    }
    // 检查非空
    for (const item of Object.values(obj)) {
      if (!item) {
        wx.showToast({ title: '请检查信息填写完整', icon: 'error' })
        return  // 发现数据为空时直接返回，退出函数
      }
    }
    const openid = wx.getStorageSync('openid')
    await user.where({ _openid: openid }).update({
      data: obj
    })
    wx.showToast({
      icon: 'success',
      title: '修改成功'
    })
    let result = await user.where({ _openid: openid }).get()
    let data = result.data[0]
    for (const item in data) {
      wx.setStorageSync(item, data[item])
    }
  }
})