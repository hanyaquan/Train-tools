//index.js
//获取应用实例
const app = getApp()
const Marquee = require('../../utils/marquee.js').marquee;

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    MyIndexTripCheCi: {},
    MyAllTripCheCi:{},
    items: [],
    itemsCount: '',
    pageBackgroundColor: 'gray',
    ishavechechi: false,
    disabled: true,
    isshowgonggao: false,
    msgList: []
  },

  login: function() {
    wx.login({
      success: function(loginCode) {
        console.log(loginCode)
      }
    })
  },

  inputClick: function() {
    if (this.data.disabled) {
      this.setData({
        disabled: false
      });
      wx.vibrateShort();
      wx.navigateTo({
        url: '../tieckerInput/tieckerInput'
      });
    }
  },
  myTickerClick: function() {
    if (!this.data.ishavechechi) {
      wx.showToast({
        title: '您还没有行程哟，赶快去添加吧！',
        icon: 'none',
        duration: 2000
      })
    } else {
      if (this.data.disabled) {
        this.setData({
          disabled: false
        });
        wx.vibrateShort();
        wx.navigateTo({
          url: '../myTiecker/myTiecker'
        });

      }
    }
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function(options) {
    var that = this;
    if (options.TripDetail) {
      wx.navigateTo({
        url: '../stationlist/stationlist?TripDetail=' + options.TripDetail,
      })
    }
    console.log("--asd---");

    var aa = app.getTripInfoByTrainNourl;
    wx.showToast({
      title: '请求完成',
    })
    this.login()
    if (app.globalData.userInfo) {
      console.log("--111---" + app.globalData.userInfo);
      that.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        console.log("--222---" + res.userInfo);
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }

    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    };
    wx.cloud.init({
      env: 'prod-c0015d',
      traceUser: true
    });
    const db = wx.cloud.database();
    db.collection('gonggao').where({
      _type: '1' // 填入当前用户 openid
    }).get({
      success: function(res) {
        var jsonText = res.data;
        var array = new Array();
        for (var i = 0; i < jsonText.length; i++) {
          console.log("---1-" + jsonText[i].name);
          array.push({
            url: jsonText[i].link,
            title: jsonText[i].title
          });

        }
        if (array.length > 0) {
          that.setData({
            msgList: array,
            isshowgonggao: true
          });
        }
      }
    })

  },
  getUserInfo: function(e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    let _this = this;
    _this.setData({
      disabled: true
    })
    var wxuserid = wx.getStorageSync('wxuserid');
    wx.request({
      url: app.getMyIndexTripHandleurl, //仅为示例，并非真实的接口地址
      data: {
        openId: wxuserid
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      method: "POST",
      success: function(res) {
        var jsonText = res.data;
        var MyIndexTripCheCi = jsonText.result;
        var ishavechechi = false;
        if (null != MyIndexTripCheCi && jsonText.msg_code == '0000') {
          ishavechechi = true;
          _this.setData({
            MyIndexTripCheCi: MyIndexTripCheCi,
          })
          var count = jsonText.result.stations_num;
          var stations = jsonText.result.stations;
          //计算结束
          _this.setData({
            itemsCount: count,
            items: stations,
            ishavechechi: ishavechechi,
          })
          var current_place = MyIndexTripCheCi.current_place;
          for (var item in _this.data.items) {
            var color;
            if (_this.data.items[item].place > current_place) {
              color = 'gray';
            } else {
              color = '#5cb85c';
            } //我的车站为蓝色
            if (_this.data.items[item].station_name == _this.data.MyIndexTripCheCi.mystartstation |
              _this.data.items[item].station_name == _this.data.MyIndexTripCheCi.myendstation) {
              color = '#0095FF';
            }
            _this.data.items[item].color = color;
            _this.setData({
              items: _this.data.items,
            });
          }
        } else {
          _this.setData({
            ishavechechi: ishavechechi,
          })

        }

      }
    })

  },
  binddetail: function(e) {
    var that = this;
    var TripDetail = JSON.stringify(that.data.MyIndexTripCheCi);
    wx.vibrateShort();
    wx.navigateTo({
      url: '../stationlist/stationlist?TripDetail=' + TripDetail,
    })
  },

  // 添加车次
  formSubmit: function(e) {
    var self = this;
    var tripJson = self.data.MyIndexTripCheCi;
    self.binddetail();
    wx.request({
      url: app.updateDaoZhanFormId, //仅为示例，并非真实的接口地址
      data: {
        formId: e.detail.formId,
        openId: tripJson.userid,
        utid: tripJson.utid,
        tripId: tripJson.tripid
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      method: "POST",
      success: function(res) {}
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    return {
      title: '最好用的火车智能管家',
      path: '/pages/index/index',
      success: function(res) {
        // 转发成功
      },
      fail: function(res) {
        // 转发失败
      }
    }
  },
  gonggaodetail: function(e) {
    wx.navigateTo({
      url: '/pages/gonggao/gonggao',
    })
  },
  yujiazaimytrip:function(e){
    let _this = this;
    var wxuserid = wx.getStorageSync('wxuserid');
    console.log('正在预加载:' + wxuserid);
    wx.request({
      url: app.getMyAllTripHandleurl, //仅为示例，并非真实的接口地址
      data: {
        openId: wxuserid
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      method: "POST",
      success: function (res) {
        var jsonText = res.data;
        if (jsonText.msg_code == '0000') {
          _this.setData({
            MyAllTripCheCi: jsonText.result,
          })
        }
      }
    }
    )
  }

})