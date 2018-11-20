import axios from "~/store/axios";
import Configs from "~/common/config";

//用户登出
export function userLogout() {
	return axios.get("/user/logout");
}

//获取otc用户信息ByUserId
export function getOtcUserInfoByUserId(params) {
	return axios.get("/otc/user/getUserInfo/" + params.userId);
}

//获取otc login用户信息ByUserId
export function getOtcUserInfo() {
	return axios.get("/otc/user/getUserInfo/");
}

//获取用户绑定信息ByUserId
export function getUserBindStatusByUserId(params) {
	return axios.get("/user/getUserBindStatus/" + params.userId);
}

//设置当前登陆用户昵称
export function setNickname(params = { nickname: "" }) {
	return axios.post("/otc/user/setNickname", params);
}

//设置当前登陆用户昵称
export function getNicknameByUserId(params) {
	return axios.get("/otc/user/getNicknameByUserId/" + params.userId);
}

//获取当前登陆用户设置信息
export function getUserInfo() {
	return axios.get("/user/getUserInfo");
}

//获取当前登陆用户kyc信息
export function getKycUserInfo() {
	return axios.get("/kyc/user/info");
}

//获取当前登陆用户kyc验证状态
export function getKycStatus() {
	return axios.get("/kyc/user/status");
}

//S3上传
export function s3upload(file = {}) {
	return axios.post("/kyc/manager/file/s3upload", file);
}

//获取S3上传文件路径-暂时没用
export function gets3uploadUrl(params = { filename: "" }) {
	return axios.post("/kyc/manager/file/getfileurl", params);
}

//获取平台的支付类型
export function getPayType() {
	return axios.post("/otc/user/pay/getPayType");
}

// secret:"123321"
//校验资金密码
export function verifySecret(params) {
	return axios.post("/user/apikey/verifySecret", params);
}

//获取用户的所有支付方式列表 登陆状态
export function getPayList() {
	return axios.post("/otc/user/pay/getUserPayList");
}

//   "account": "string",//账号
//   "accountName": "string",//账户名
//   "status": 0//状态 1开发  0关闭
//更新支付方式的开发状态
export function updatePayMethod(params) {
	return axios.post("/otc/user/pay/updatePayMethod", params);
}

//   "account": "string",    //账号 not null
//   "accountName": "string",//账户名 not null
//   "fundPasd": "string",    //资金密码  not null
//   "openBank": "string",    //开户银行
//   "openSubbranch": "string",//开户支行
//   "payType": "string",//支付类型 id
//   "url": "string"//照片文件名
//增加支付方式
export function addPayMethod(params) {
	return axios.post("/otc/user/pay/addPayMethod", params);
}

//   "account": "string",    //账号 not null
//   "accountName": "string",//账户名 not nul
//删除支付方式
export function deletePayMethod(params) {
	return axios.post("/otc/user/pay/deletePayMethod", params);
}

//   "pageNo": 0,//当前页
//   "pageSize": 0//每页大小
// 分页获取用户黑名单
export function getDefriendList(params) {
	return axios.post("/otc/user/defriend/getDefriendList", params);
}

// "defrindID": 0//被拉黑用户id
// "defrindName": "string",//被拉黑用户昵称
// "nickName": "string",//用户昵称
//拉黑用户
export function addDefriend(params) {
	return axios.post("/otc/user/defriend/addDefriend", params);
}

// "defrindID": 0//被拉黑用户id
// 移除黑名单
export function removeDefriend(params) {
	return axios.post("/otc/user/defriend/removeDefriend", params);
}

// "defrindID": 0//被拉黑用户id
//判断莫一个用户是否在黑名单
export function checkIsDefriend(params) {
	return axios.post("/otc/user/defriend/checkIsDefriend", params);
}
