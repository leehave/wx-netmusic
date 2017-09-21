//index.js
//获取应用实例
var bsurl = require("../../utils/baseurl.js");
var common = require('../../utils/util.js');
var async = require("../../utils/async.js");
var nt = require("../../utils/nt.js")
const app = getApp()
Page({
  data: {
    rec: {
      idx: 0, loading: false,
    },
    banner: [4],
    remd_list: {},
    thisday: (new Date()).getDate(),
    cateisShow: false
  },
  onLoad: function (options) {
    if (options.share == 1) {
      var url = '../' + options.st + '/index?id=' + options.id
      console.log(url, options.st, options.id)
      wx.navigateTo({
        url: url,
        success: function () {
          console.log("success")
        }
      })
      return;
    };
  },
  onShow: function () {
    !this.data.rec.loading && this.init();
  },
  numToStr: function(str){
    return str >= 1e8 ? Math.floor(str / 1e7) / 10 + "亿" : str >= 1e5 ? Math.floor(str / 1e3) / 10 + "万" : str
  },
  init: function () {
    var that = this
    var rec = this.data.rec
    //banner，
    wx.request({
      url: bsurl + 'banner',
      data: { cookie: app.globalData.cookie },
      success: function (res) {
        that.setData({
          banner: res.data.banners
        })
      }
    }),
    // 推荐歌单
      wx.request({
        url: bsurl + 'personalized',
        data: { cookie: app.globalData.cookie },
        success: function (res) {
          let result = res.data.result;
          for (let i = 0; i < result.length; i++) {
            result[i].playCount = that.numToStr(result[i].playCount);
          }
          console.log(result);
          that.setData({
            remd: result
          });
        }
      }),
      // 最新音乐
      wx.request({
        url: bsurl + 'personalized/newsong',
        data: { cookie: app.globalData.cookie },
        success: function (res) {
          that.setData({
            sglist: res.data.result
          })
        }
      })
  }
})
