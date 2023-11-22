const SalaryTime = [
  {
    name: '元/小时',
  },
  {
    name: '元/天',
  },
  {
    name: '元/周',
  },
  {
    name: '元/月',
  },
  {
    name: '元/其他',
  }
]

const Contact = [
  {
    name: '手机号'
  },
  {
    name: '微信号'
  },
  {
    name: 'QQ号'
  }
]

const colleges = [
  {
    name: '文学院'
  },
  {
    name: '理学院'
  },
  {
    name: '马克思主义学院'
  },
  {
    name: '经济与管理学院'
  },
  {
    name: '教育科学学院'
  },
  {
    name: '教师教育学院'
  },
  {
    name: '外国语学院'
  },
  {
    name: '化学化工学院'
  },
  {
    name: '机械工程学院'
  },
  {
    name: '信息科学技术学院'
  },
  {
    name: '电气工程学院'
  },
  {
    name: '纺织服装学院'
  },
  {
    name: '医学院'
  },
  {
    name: '公共卫生学院'
  },
  {
    name: '体育科学学院'
  },
  {
    name: '艺术学院'
  },
  {
    name: '地理科学学院'
  },
  {
    name: '交通与土木工程学院'
  },
  {
    name: '药学院'
  },
  {
    name: '国际教育学院'
  },
  {
    name: '张謇学院'
  },
  {
    name: '通科微电子学院'
  }
]

const sex = [
  {
    name: '男'
  },
  {
    name: '女'
  }
]

const grade = [
  {
    name: '大一'
  },
  {
    name: '大二'
  },
  {
    name: '大三'
  },
  {
    name: '大四'
  }
]

const params = [
  '微信名','头像', '姓名', '性别', '手机号', '认证类型'
]

const jobRequire = [
  ["长期工作", "短期工作"],["工作日", "节假日", "寒暑假", "都可以"],["早班", "白班", "晚班", "都可以"],
  ["1-2天", "3-4天", "5天以上", "都可以"]
]

const isNull = {
  jobTitle: "职位名称不能为空",
  salaryStart: "薪资不能为空",
  salaryEnd: "薪资不能为空",
  contactValue: "联系方式不能为空",
  HireNumberRadio: '请选择招聘人数',
  work: '',
  desc: '职位描述不能为空',
  demand: '人员需求不能为空',
  workPlace: '请选择工作地点',
  work: '请选择工作时间'
}

module.exports = {
  colleges,
  sex,
  grade,
  jobRequire,
  SalaryTime,
  Contact,
  params,
  isNull
}