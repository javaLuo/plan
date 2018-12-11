import axios from '~/store/axios';
import bus from '~/plugins/bus';

//获取验证码
export function sendCode() {
  return axios.get(`/user/code/sendCode`, {
    params: {
      fresh: new Date().getTime(),
    },
  });
}
// 用户帐号验证是否存在
export function checkUserAccount(params) {
  return axios.post(`/user/checkUserAccount`, params);
}
// 用户登录
export function userLogin(params) {
  return axios.post(`/user/login`, params);
}
//用户登出
export function userLogout() {
  return axios.get(`/user/logout`).then(res => {
    if (200 == res.code) {
      //这里为了解耦用一个广播来发送退出登录消息
      bus.trigger('logout');
    }
  });
}

// 获取用户信息
export function getUserInfo() {
  return axios.get('/user/getUserInfo');
}
// 获取区号地址
export function getArealist() {
  return axios.get('/kyc/sms/arealist');
}

// 发送短信或邮件验证码 仅注册时用
export function sendVerificationCode(params) {
  return axios.post(`/user/sms/sendVCode`, params);
}

// 用户注册
export function userRegister(params) {
  return axios.post(`/user/v2/register`, params);
}

//验证谷歌验证器码
export function checkGoogleCode(params) {
  return axios.post('/user/google/check', params);
}

//验证登录时谷歌验证器码
export function loginGoogleCheck(params) {
  return axios.post('/user/google/loginGoogleCheck', params);
}

//获取谷歌验证码url
export function getGbindUrl(params) {
  return axios.post('/user/google/getBindUrl', params);
}

// 验证短信或邮件验证码
export function checkVerificationCode(params) {
  return axios.post(`/user/sms/checkVerificationCode`, params);
}
// 检查用户绑定信息
export function checkBindingStatus(params) {
  return axios.post('/user/checkBindingStatus', params);
}
// 忘记密码时 发送短信或邮件验证码 其他验证码用这个
export function sendVCodeForForgot(params) {
  return axios.post(`/user/sms/sendVCodeForForget`, params);
}
//忘记密码
export function forgetPassword(params) {
  return axios.post('/user/forgetPassword', params);
}

//记录埋点数据
export function saveKinesis(params) {
  return axios.post('/user/kinesis', {
    message: params,
  });
}

// 用户签到状态
export function signStatus() {
  return axios.get('/user/getSignStatus');
}

// 用户签到
export function userSign() {
  return axios.get('/user/sign');
}

//检查用户是否是活动黑名单
export function isBlack() {
  return axios.get('/activity-api/sign/isBlack');
}

//重新发送邮件
export function resendEmail(params) {
  return axios.post('/user/v2/resendEmail', params);
}

//合伙人接口·获取邀请码
export function getInvit() {
  return axios.get('/activity-api/invit/joinInvit');
}

//邀请人历史
export function queryInvitee(params) {
  return axios.post('activity-api/invit/queryInvitee', params);
}

//奖励历史
export function queryInviteReward(params) {
  return axios.post('/activity-api/invit/queryInviteReward', params);
}
