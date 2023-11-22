const uploadFile = async () => {
  const that = this
  wx.chooseImage({
    count: 1, // 最多可以选择的图片张数
    sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图
    sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机
    success: async res => {
      let url = res.tempFilePaths[0] // 选择的图片临时文件路径
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
            resolve(res.fileID)
          },
          fail: err => {
            console.error('图片上传失败', err)
            reject(err)
          }
        })
      })
    }
  })
 

}
Page({
  async test() {
    await uploadFile()
  }
})