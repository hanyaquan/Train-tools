const app = getApp()

Page({
  data: {
    //判断小程序的API，回调，参数，组件等是否在当前版本可用。
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  onLoad: function () {
    var that = this;
    // 查看是否授权
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: function (res) {
              //从数据库获取用户信息
              //that.queryUsreInfo();
                 this.getuserId()
          
            }
          });
        }
      }
    })
  },
  bindGetUserInfo: function (e) {
    if (e.detail.userInfo) {
      //用户按了允许授权按钮
      var that = this;
   this.getuserId(function (res) {
       console.log(res);
     }),
      //授权成功后，跳转进入小程序首页
     wx.redirectTo({
        url: '/pages/index/index',
      })

    } else {
      //用户按了拒绝按钮
      wx.showModal({
        title: '警告',
        content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
        showCancel: false,
        confirmText: '返回授权',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击了“返回授权”')
          }
        }
      })
    }
  },
  //获取用户信息接口
  queryUsreInfo: function () {
    wx.request({
      url: getApp().globalData.urlPath + 'hstc_interface/queryByOpenid',
      data: {
        openid: getApp().globalData.openid
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res.data);
        getApp().globalData.userInfo = res.data;
      }
    })
  },
  getuserId: function (callback) {
    wx.getStorage({
      key: 'wxuserid',
      success: function (res) {
        callback.call(res.data)
      },
      fail: function (res) {
        wx.login({
          success: function (res) {
            if (res.code) {
              //发起网络请求
              console.log('code==' + res.code);
              // return;
              var code = res.code;
              wx.getUserInfo({
                success: function (res) {
                  console.log("encryptedData=" + res.encryptedData);
                  console.log("iv=" + res.iv);
                  console.log("code=" + code);
                  //3.解密用户信息 获取unionId
                  wx.request({
                    url: getApp().getUserInfourl,
                    data: {
                      jsCode: code,
                      iv: res.iv,
                      encryptedData: res.encryptedData
                    },
                    success: function (res) {
                      var jsonText = JSON.parse(res.data);
                      console.log(jsonText.msg_code);
                      console.log(jsonText.openId);
                     if (jsonText.msg_code == '0000') {
                        try {
                          wx.setStorageSync('wxuserid', jsonText.openId);
                          console.log("openid"+jsonText.openId);
                          callback.call(res.data)
                        } catch (e) {
                        }
                        console.log('code注册成功');
                       //用户已经授权过
                       wx.navigateTo({
                         url: '/pages/index/index',
                       })
                     }
                      else {
                        console.info('res:' + jsonText.data);
                        console.info('msg-code:' + jsonText.msg_code);
                        console.log('code注册失败');
                    }
                    },
                    fail: function (res) {
                      console.log('getUserInfourl请求失败' + res.errMsg);
                    }
                  })
                },
                fail: function () {
                  console.log('获取用户信息失败')
                }

              })
            } else {
              console.log('获取用户登录态失败！' + res.errMsg)
            }
          }
        });
      }
    })
  }

})