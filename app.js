//app.js
App({
  getUserInfourl: 'https://shuoboclub.com/xProgram/insweptUser/getUserInfo.do', 
  getTripInfoByTrainNourl: 'https://shuoboclub.com/xProgram/insweptTrainList/getTripInfoByTrainNo.do', addtripurl:'https://shuoboclub.com/xProgram/insweptTrainList/addtrip.do',
  getMyIndexTripurl: 'https://shuoboclub.com/xProgram/insweptTrainList/getMyIndexTrip.do',
  getMyAllTripurl: 'https://shuoboclub.com/xProgram/insweptTrainList/getMyAllTrip.do',
  getMyAllTripHandleurl: 'https://shuoboclub.com/xProgram/insweptTrainList/getMyAllTripHandle.do',
  deleteMyTripByUidAndTid: 'https://shuoboclub.com/xProgram/insweptTrainList/deleteMyTripByUidAndTid.do',
  getMyIndexTripHandleurl: 'https://shuoboclub.com/xProgram/insweptTrainList/getMyIndexTripHandle.do',
  updateDaoZhanFormId: 'https://shuoboclub.com/xProgram/insweptTrainList/updateDaoZhanFormId.do',

  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    
    wx.checkSession({
      success: function () {
        //session 未过期，并且在本生命周期一直有效
      },
      fail: function () {
        //登录态过期
        wx.login() //重新登录

      }
    })

    this.getuserId(function (res) {
      console.log(res);
    }),
      // 获取用户信息
      wx.getSetting({
        success: res => {
          if (res.authSetting['scope.userInfo']) {
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
            wx.getUserInfo({
              success: res => {
                // 可以将 res 发送给后台解码出 unionId
                this.globalData.userInfo = res.userInfo

                // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                // 所以此处加入 callback 以防止这种情况
                if (this.userInfoReadyCallback) {
                  this.userInfoReadyCallback(res)
                }
              }
            })
          }
        }
      })
  },

  globalData: {
    userInfo: null,
    openid:''
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
              console.log('code=='+res.code);
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
                      console.log('bbbbb');
                      console.info('msg-code:' + res.data.msg_code);
                      console.log(res.data);

                    //  return;
                      var jsonText = JSON.parse(res.data);
                      
                      if (jsonText.msg_code == '0000') {
                        try {
                          wx.setStorageSync('wxuserid', jsonText.openId);
                           callback.call(jsonText.data);
                        } catch (e) {
                        }
                        console.log('code注册成功');
                      } else {
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