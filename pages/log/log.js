
const formatTime = (timeString) => {
  const date = new Date(timeString)
  const formattedTime = date.toISOString()
    .replace('T', ' ') // 将 'T' 替换为空格
    .replace(/\.\d+Z$/, '') // 将小数点及 'Z' 删除
  return formattedTime
}
Page({
  data:{
    list: []
  },
  async onLoad() {
    let c1 = new wx.cloud.Cloud({
      resourceAppid: 'wxb6b66008bee95427',
      resourceEnv: 'jzy-2gzzv7vae99329fb',
    })
    await c1.init()
    const user_take = c1.database().collection('user_take')
    const takeaway = c1.database().collection('takeaway')
    const user = c1.database().collection('user')
    const buser = c1.database().collection('buser')
    this.setData({ user_take, takeaway, user, buser })
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    const openid = wx.getStorageSync('openid')
    const res  = await takeaway.where({ _openid: openid }).get()
    console.log(res)
    let list = []
    await Promise.all(res.data.map(async item => {
      if(item.state == 3) { // 获取已结束的单子
        let result = await user_take.where({ jobId: item._id }).get()
        result = result.data[0]
        console.log(result)
        item.user_take = result
        item.time = formatTime(item.time)
        item.user_take.time = formatTime(item.user_take.time)
        item.user_take.cTime = formatTime(item.user_take.cTime)
        result = await user.where({ _openid: result._openid }).get()
        item.user = result.data[0]
        list.push(item)
      }
    }))
    console.log(list)
    this.setData({ list }, ()=> wx.hideLoading())
  }
})