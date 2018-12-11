////g.alicdn.com/sd/ncpc/nc.js?t=${new Date().getTime()} 必须在人机验证页面引用js

var nc_token = ["FFFF0N00000000006634", (new Date()).getTime(), Math.random()].join(':');
var NC_Opt = 
{
  renderTo: "#charSlider", //声明滑动验证需要渲染的目标元素ID 必填
  appkey: "FFFF0N00000000006634", // 应用标示。它和scene字段一起决定了滑动验证的业务场景与后端对应使用的策略模型。您可以从console的配置里找到它正确的值，请勿乱写 必填
  scene: "nc_login", //场景标示。它和appkey字段一起决定了滑动验证的业务场景与后端对应使用的策略模型。您可以从console的配置里找到它正确的值，请勿乱写 必填
  token: nc_token, // 滑动验证码的主键，请务必不需要写死固定值。请确保每个用户每次打开页面时，token都是不同的。建议格式为”您的appkey”+”时间戳”+”随机数” 必填
  customWidth: 476, //滑动条的长度，建议预留300像素以上
  trans:{"key1":"code0"}, //业务键字段。您可以不写此字段，也可以按照下文中”问题排查与错误码”部分文档配置此字段，便于线上问题排查
  elementID: ["usernameID"], //通过Dom的ID属性自动填写trans业务键，您可以不写此字段，也可以按照下文中”问题排查与错误码”部分文档配置此字段，便于线上问题排查
  is_Opt: 0, //是否自己配置底层采集组件。如无特殊场景请保持写0或不写此项。默认为0
  language: "cn", //语言。PC场景默认支持18国语言，详细配置方法请见下方”自定义文案与多语言”部分。默认为cn(中文)
  isEnabled: true, // 是否启用，无特殊场景请默认写true。默认为true
  timeout: 3000, //内部网络请求的超时时间，一般不需要改，默认值为3000ms
  times:5, //允许服务器超时重复次数，默认5次
  apimap: {  //用于自己指定滑动验证各项请求的接口地址。如无特殊情况，请不要配置这里的apimap
      // 'analyze': '//a.com/nocaptcha/analyze.jsonp',
      // 'get_captcha': '//b.com/get_captcha/ver3',
      // 'get_captcha': '//pin3.aliyun.com/get_captcha/ver3'
      // 'get_img': '//c.com/get_img',
      // 'checkcode': '//d.com/captcha/checkcode.jsonp',
      // 'umid_Url': '//e.com/security/umscript/3.2.1/um.js',
      // 'uab_Url': '//aeu.alicdn.com/js/uac/909.js',
      // 'umid_serUrl': 'https://g.com/service/um.json'
  },   
  callback: function (data) {   //前端滑动验证通过时会触发此回调，您可以在这个回调中将token、sessionid、sig记录下来，随业务请求带到您的server端调用验签
      console.log('nc_token', nc_token)
      console.log('csessionid', data.csessionid)
      console.log('sig', data.sig)
  }
}

import i18n from '~/common/i18n/'
import Storage from './storage'

export default  class Auth{
  constructor(){
    this.nc = null;  
    return this;   
  }
  //初始化拉杆组件  回调函数
  init(cb){
    //获取多语言
    const locale = Storage.get('locale') || 'en_us';
    const Login = i18n.get(locale).App.Login;
    this.nc = new noCaptcha({...NC_Opt, callback: cb});
    this.nc.upLang('cn', {
      _Loading: `${Login.loading}`,
      _startTEXT: `${Login.startText}`,
      _yesTEXT: Login.yesText,
      _error300: `${Login.error300[0]}<a href=\"javascript:__nc.reset()\">${Login.error300[1]}</a>${Login.error300[2]}`,
      _errorNetwork: `${Login.errorNetwork[0]}<a href=\"javascript:__nc.reset()\">${Login.errorNetwork[1]}</a>`,
    })
    this.nc.reset();//请务必确保这里调用一次reset()方法
  }
  //获取当前人机验证实例
  getNc(){
    return this.nc;
  }

  //卸载人机验证实例
  deStroy(){
    this.nc.destroy();
  }
}