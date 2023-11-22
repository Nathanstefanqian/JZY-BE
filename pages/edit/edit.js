const { sex } = require('../../data/data')
const { reg } = require('../../config/index')
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
    user_job: Object,
    imageUrl,
    action: '',
    title: '',
    avatarUrl: '',
    nickName: '',
    name: '',
    phone: '',
    sex: '',
    exist: false
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
        nickName: info.nickName,
        major: info.major,
        schoolId: info.schoolId,
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
        console.log(res)
        const url = res.tempFilePaths[0]
        const avatarUrl = await uploadFile(url)
        that.setData({
          avatarUrl
        }, () => {
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
  onNickName(e) {
    const { value } = e.detail
    this.setData({
      nickName: value
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
  onGetUserInfo(e) {
    const rawData = JSON.parse(e.detail.rawData)
    this.setData({
      nickName: rawData.nickName,
      avatarUrl: rawData.avatarUrl
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
    let { nickName, name, sex, phone, avatarUrl, imageUrl, user, c1 } = this.data
    console.log(nickName, name, sex, phone, avatarUrl)
    if (avatarUrl == `${{ imageUrl }}/assets/boy.svg`) avatarUrl = ''  // 默认图片设置为空
    const obj = {
      nickName, name, sex, phone, url: avatarUrl
    }
    // 检查非空
    for (const item of Object.values(obj)) {
      console.log(item)
      if (!item) {
        wx.showToast({ title: '请检查信息填写完整', icon: 'error' })
        return  // 发现数据为空时直接返回，退出函数
      }
    }
    const res = await user.add({
      data: obj
    })
    for (let key in obj) {
      wx.setStorageSync(key, obj[key])
    }
    // 注册后调取云函数获得openid
    await c1.callFunction({
      name: 'getOpenId',
      complete: res => {
        console.log(res)
        const { openId } = res.result
        wx.setStorageSync('openid', openId)
      }
    })
    wx.setStorageSync('isLogin', true)
    wx.showToast({
      icon: 'success',
      title: '注册成功'
    })
    setTimeout(() => wx.navigateBack(), 2000)
  },
  async onModify() {
    let { nickName, name, sex, phone, avatarUrl, imageUrl, user } = this.data
    console.log(nickName, name, sex, phone, avatarUrl)
    if (avatarUrl == `${{ imageUrl }}/assets/boy.svg`) avatarUrl = ''
    const obj = {
      nickName, name, sex, phone, url: avatarUrl
    }
    // 检查非空
    for (const item of Object.values(obj)) {
      if (!item) {
        console.log(item)
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