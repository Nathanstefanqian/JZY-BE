Page({
  data: {
    company: true
  },
  onToggleCompany() {
    let { company } = this.data
    this.setData({
      company: !company
    })
  }
})