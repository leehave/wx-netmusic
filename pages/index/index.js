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
    banner_list: [],
    remd_list: [],
    newsong:[],
    loading: true,
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
          // console.log("success")
        }
      })
      return;
    };
  },
  onShow: function () {
    !this.data.rec.loading && this.init();
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
          banner_list:res.data,
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
            result[i].playCount = common.numToStr(result[i].playCount);
          }
        
          that.setData({
            remd_list:res.data,
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
            newsong: res.data,
            sglist: res.data.result
          })
        }
      })
  }
})
