////g.alicdn.com/sd/ncpc/nc.js?t=${new Date().getTime()} 必须在人机验证页面引用js

var nc_token = ["FFFF0N00000000006634", (new Date()).getTime(), Math.random()].join(':');

var NC_Opt = 
{
   renderTo: "#charSlider", //声明滑动验证需要渲染的目标元素ID 必填
    appkey: 'FFFF0N00000000006634', 
    scene: 'nc_login_h5',
    customWidth: 476, //滑动条的长度，建议预留300像素以上
    token: nc_token,
    trans: {"key1": "code200"},
    elementID: ["usernameID"],
    is_Opt: 0,
    language: "cn",
    timeout: 10000,
    retryTimes: 5,
    errorTimes: 5,
    inline:true,
    apimap: {
        // 'analyze': '//a.com/nocaptcha/analyze.jsonp',
        // 'uab_Url': '//aeu.alicdn.com/js/uac/909.js',
    },
    initHidden:false,
    callback: function (data) {
        window.console && console.log(nc_token)
        window.console && console.log(data.csessionid)
        window.console && console.log(data.sig)
    },
    error: function (s) {

    }
}

import i18n from '~/common/i18n/'
import Storage from './storage'
export default  class Auth{
  constructor(){
    this.nc = null;  
    this.data = null;
    return this;   
  }
  //初始化拉杆组件  回调函数
  init(success = ()=>{}){
    //获取多语言
    
    const locale = Storage.get('locale') || 'en_us';
    const Login = i18n.get(locale).App.Login;
    this.nc = new NoCaptcha.init({...NC_Opt, callback: (data)=>{
      this.data = data;
    }});
    this.nc.setEnabled(true);
    this.nc.reset();//请务必确保这里调用一次reset()方法
    this.nc.on('success', ()=>{
      success(Object.assign({...this.data}, {token: nc_token}))
    })
    NoCaptcha.upLang('cn', {
      'LOADING': Login.loading,//加载
      'SLIDER_LABEL': Login.startText,//等待滑动
      'CHECK_Y': Login.yesText,//通过
      'ERROR_TITLE':"aaaa...",//拦截
      'CHECK_N': Login.checkNo, //准备唤醒二次验证
      'OVERLAY_INFORM': Login.overlay,//二次验证
      'TIPS_TITLE': Login.tipsTitle//验证码输错时的提示
    });
    this.nc.reset();
  }
  //获取当前人机验证实例
  getNc(){
    return this.nc;
  }
  //卸载人机验证实例
  deStroy(){
    this.nc = null;
  }
  getToken(){
    return nc_token;
  }
}