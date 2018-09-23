var app = getApp();
var checkNetWork = require("../../utils/CheckNetWork.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    date: '2018-01-01',
    startdate: '2018-01-01',
    enddate: '2018-01-01',
    f: '12:00',
    array1: [],
    array2: [],
    index1: 0,
    index2: 0,
    isKeyboard: false,//是否显示键盘
    tapNum: true,//数字键盘是否可以点击
    bottomNum: true,
    parkingData: false,//是否展示剩余车位按钮
    isFocus: false,//输入框聚焦
    flag: false,//防止多次点击的阀门
    checiState: false,//车次是否正确？
    phoneNumber: '0379-60201137',
    keyboardNumber: 'CDGKTZYL',
    keyboardAlph: '123巛4560789',
    keyboard2: '',
    keyboard2For: ['完成'],
    textArr: [],
    textValue: '',
    placeholder: '请输入您的车次',
    warnMessage: '提示：输入车次完成请注意点击键盘完成按钮呦，要不然小智的“智商”跟不上吖',
    telMessage: '该小程序目前仅适用于东北服务区停车场，给您造成的不便敬请谅解！',
    stations: [],
    wxuserid: '',
  },

  onLoad: function () {
  },
  selectCity: function () {
    wx.vibrateShort();
    wx.navigateTo({
      url: '../selectCity/selectCity'
    })
  },
  //点击隐藏
  selectYinChangCity: function () {
    wx.showToast({
      title: '车次未正确获取，请检查',
      icon: 'none',
      duration: 1000
    })
  },
  // 点击时间组件确定事件 
  bindTimeChange: function (e) {
    this.setData({
      time: e.detail.value
    })
  },
  // 点击日期组件确定事件 
  bindDateChange: function (e) {
    wx.vibrateShort();
    this.setData({
      date: e.detail.value
    })
  },
  // 点击出发车站组件确定事件 
  bindPickerChange1: function (e) {
    var temp = e.detail.value;
    var qishi2 = Number(temp) + 1;
    var stationstemp = this.data.stations.slice(qishi2, this.data.stations.length);
    var index2 = stationstemp.indexOf(this.data.array2[this.data.index2]);
    if (typeof (index2) == "undefined" || index2 < 0) {
      index2 = 0;
    }
    this.setData({
      index2: index2,
      index1: temp,
      array2: stationstemp
    })

  },
  // 点击结束车站组件确定事件 
  bindPickerChange2: function (e) {
    var temp = e.detail.value;
    // var array1temp = this.data.stations.slice(0, temp-1);
    this.setData({
      index2: temp,
    })
  },
  //yunijianpan
  /**
   * 输入框显示键盘状态
   */
  showKeyboard: function () {
    var self = this;
    self.setData({
      isFocus: true,
      isKeyboard: true,
    })
  },
  /**
   * 点击页面隐藏键盘事件
   */
  hideKeyboard: function () {
    var self = this;
    if (self.data.isKeyboard) {
      //说明键盘是显示的，再次点击要隐藏键盘
      if (self.data.textValue) {
        self.setData({
          isKeyboard: false
        })
      } else {
        self.setData({
          isKeyboard: false,
          isFocus: false
        })
      }
    }
  },
  /**
   * 输入框聚焦触发，显示键盘
   */
  bindFocus: function () {
    var self = this;
    if (self.data.isKeyboard) {
      //说明键盘是显示的，再次点击要隐藏键盘
      self.setData({
        isKeyboard: false,
        isFocus: true,
      })
    } else {
      //说明键盘是隐藏的，再次点击显示键盘
      self.setData({
        isFocus: true,
        isKeyboard: true,
      })
    }
  },
  /**
   * 键盘事件
   */
  tapKeyboard: function (e) {
    var self = this;
    //获取键盘点击的内容，并将内容赋值到textarea框中
    var tapIndex = e.target.dataset.index;
    var tapVal = e.target.dataset.val;
    var tapNum;
    var bottomNum;
    if (tapVal == "巛") {
      //说明是删除
      self.data.textArr.pop();
      if (self.data.textArr.length == 0) {
        //只能输入字母
        this.tapNum = true;
        // this.bottomNum = false;
      } else {
        this.tapNum = false;
        // this.bottomNum = true;
      }
      self.data.textValue = self.data.textArr.join("");
      self.setData({
        textValue: self.data.textValue,
        tapNum: this.tapNum,
        bottomNum: this.bottomNum,
      })
      return false
    }
    if (self.data.textArr.length >= 6) {
      return false;
    }
    self.data.textArr.push(tapVal);
    self.data.textValue = self.data.textArr.join("");
    self.setData({
      textValue: self.data.textValue,
    })
    if (self.data.textArr.length > 0) {
      //展示数字键盘
      self.setData({
        tapNum: false,
        // bottomNum: true
      })
    }
  },
  /**
   * 特殊键盘事件（删除和完成）
   */
  tapSpecBtn: function (e) {
    wx.vibrateShort();
    var self = this;
    var wxuserid = wx.getStorageSync('wxuserid');
    if (self.data.flag) {
      return false
    }
    var btnIndex = e.target.dataset.index;
    if (btnIndex == 0) {
      //说明是完成事件
      self.setData({
        flag: true
      })
      if (!checkNetWork.checkNetWorkStatu()) {
        console.log('网络错误')
        self.setData({
          flag: false
        })
      } else {
        wx.request({
          url: app.getTripInfoByTrainNourl,
          method: 'post',
          data: {
            openId: ' ',
            trainNo: self.data.textValue,
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          success: function (res) {
            var jsonText = res.data;
            if (jsonText.msg_code == '0000') {
              //说明请求成功了,跳转到支付页面
              var resulttemp = jsonText.result[0].stations;
              var stations = resulttemp.split(',');
              var endStations = stations.slice(1, stations.length);
              self.setData({
                stations: stations,
                checiState: true,
                isKeyboard: false,
                array1: stations,
                array2: endStations,
                index1: 0,
                index2: endStations.length - 1,
              })
            } else {
              wx.showModal({
                title: '车次查询失败',
                content: '车次不存在或者请求延迟，亲爱的请核实一下呦！',
                showCancel: false,
                success: function (res) {
                  if (res.confirm) {
                  }
                }
              })
            }
          },
          complete: function () {
            self.setData({
              flag: null
            })
          }
        })
      }
    }
  },
  Appendzero: function (obj) {
    if (obj < 10) return "0" + "" + obj;
    else return obj;
  },
  //yunijianpan
  gettripinfo: function (e) {
    var self = this;
    var wxuserid = wx.getStorageSync('wxuserid')
    this.setData({
      wxuserid: wxuserid
    })

    console.log('aaaa' + wxuserid);
    wx.request({
      url: app.getTripInfoByTrainNourl, //仅为示例，并非真实的接口地址
      data: {
        openId: '',
        trainNo: self.data.textValue,
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        var jsonText = res.data;
        if (jsonText.msg_code == '0000') {
        } else {
        }
      }
    })
  },
  // 添加车次
  formSubmit: function (e) {
    wx.vibrateShort();
    var self = this;
    wx.showModal({
      title: '是否确定添加车次：' + self.data.textValue,
      content: '出发日期：' + self.data.date + ' ' + self.data.array1[self.data.index1] + '发往' + self.data.array2[self.data.index2],
      success: function (res) {
        if (res.confirm) {
          console.log('添加行程');
          self.showNavigationBarLoading();
          var wxuserid = self.data.wxuserid;
          console.log('addtrip-wxuserid:' + wxuserid);
          wx.showLoading({
            title: '添加中...',
          })
          wx.request({
            url: app.addtripurl, //仅为示例，并非真实的接口地址
            data: {
              formId: e.detail.formId,
              openId: wxuserid,
              trainNo: self.data.textValue,
              date: self.data.date,
              myStartStation: self.data.array1[self.data.index1],
              myEndStation: self.data.array2[self.data.index2]
            },
            header: {
              // 'content-type': 'application/json' // 默认值
              'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
            },
            method: "POST",
            success: function (res) {
              self.hideNavigationBarLoading();
              wx.hideLoading();
              var jsonText = res.data;
              if (jsonText.msg_code == '0000') {
                wx.showToast({
                  title: '添加成功',
                  icon: 'success',
                  duration: 2000
                });
                var pages = getCurrentPages();
                wx.navigateBack({
                  delta: pages - 1
                })
              }
              else if (jsonText.msg_code == '2001') {
                self.hideNavigationBarLoading();
                wx.hideLoading();
                wx.showToast({
                  title: '您已经添加过该车票，请勿重复添加！',
                  icon: 'none',
                  duration: 2000
                })
              } else {
                wx.hideLoading();
                self.hideNavigationBarLoading();
                wx.showToast({
                  title: '添加失败！',
                  icon: 'none',
                  duration: 2000
                })
              }
            }
          })
        } else if (res.cancel) {
        }
      }
    })
  },
  selectTime: function () {
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var self = this;
    var wxuserid = wx.getStorageSync('wxuserid');
    var myDate = new Date();
    // myDate.getYear();        //获取当前年份(2位)
    // myDate.getFullYear();    //获取完整的年份(4位,1970-????)
    // myDate.getMonth();       //获取当前月份(0-11,0代表1月)
    // myDate.getDate();        //获取当前日(1-31)
    // myDate.getDay();         //获取当前星期X(0-6,0代表星期天)
    // myDate.getTime();        //获取当前时间(从1970.1.1开始的毫秒数)
    // myDate.getHours();       //获取当前小时数(0-23)
    var myEnddate = new Date();//获取当前时间  
    myEnddate.setDate(myEnddate.getDate() + 30);//设置天数 -1 天  
    var time1 = myDate.getFullYear() + '-' + self.Appendzero(myDate.getMonth() + 1) + '-' + self.Appendzero(myDate.getDate());
    var myStartdate = new Date(new Date() - 48 * 60 * 60 * 1000);//获取当前时间  
    var time3 = myStartdate.getFullYear() + '-' + self.Appendzero(myStartdate.getMonth() + 1) + '-' + self.Appendzero(myStartdate.getDate());
    var time2 = myEnddate.getFullYear() + '-' + self.Appendzero(myEnddate.getMonth() + 1) + '-' + self.Appendzero(myEnddate.getDate());
    self.setData({
      date: time1,
      enddate: time2,
      startdate: time3,
      wxuserid: wxuserid,
    })
  },
  //页面显示加载动画  
  showNavigationBarLoading: function () {
    wx.showNavigationBarLoading()
  },

  //页面隐藏加载动画
  hideNavigationBarLoading: function () {
    wx.hideNavigationBarLoading()
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  }
})