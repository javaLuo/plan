import axios from '~/store/axios'
import Storage from '~/utils/storage';

// 获取公告列表
export function getNewsList(params) {
  return axios.post('/admin-api/notice/getAllNotices', params);
}

// 获取单个公告
export function getNoticeByNoticeID(params) {
  return axios.post('/admin-api/notice/getNoticeByNoticeID', params);
}


// 获取用户信息
export function getUserInfo() {
  return axios.get('/user/getUserInfo');
}

// 获取kyc用户信息
// export function getKycUserInfo(){
//   return axios.get('/kyc/user/info')
// }

//绑定邮箱
export function bindMailbox(params) {
  return axios.post('/user/bindEmail', params);
}

// 绑定手机号
export function bindMobile(params) {
  return axios.post('/user/google/bindPhone', params);
}

// 修改密码
export function loginPwd(params) {
  return axios.post('/user/modifyPassword', params);
}

// 修改资金密码
export function modifiyCapitalPass(params) {
  return axios.post('/user/apikey/capitalPass', params);
}

//获取谷歌验证码url
export function getGoogleBindUrl(params) {
  return axios.post("/user/google/getBindUrl", params);
}

//绑定google身份验证
export function bindGoogle(params) {
  return axios.post("/user/google/bind", params);
}

//解绑google身份验证
export function unBindGoogle(params) {
  return axios.post("/user/google/unBind", params);
}
// C1认证
export function C1Auth(params) {
  return axios.post('/kyc/user/userInfoC1', params);
}

// C2认证
export function C2Auth(params) {
  return axios.post('/kyc/user/userInfoC2', params);
}

// 修改C2图片
export function updateUserInfoC2(params) {
  return axios.post("/kyc/user/updateUserInfoC2", params);
}

// 获取资金密码
export function getApiKey(params) {
  return axios.post("/user/createApiKey", params);
}
