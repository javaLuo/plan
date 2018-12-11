import axios from '~/store/axios';

//查询用户所有资产信息
export function queryUserAllAssestBalance(params) {
  return axios.get('/finMan-api/NOTC/queryUserAllAssetBalance');
}

//查询用户充币地址
export function getUserDepositAddress(params) {
  return axios.get(`/newAudit-api/getUserDepositAddress/${params}`);
}

// 查询用户提币地址
// private String asset;
export async function queryWithDrawApi(params) {
  return axios.post(`/newAudit-api/queryUserWithDrawAddress`, params);
}

// 新增用户提币地址
// private String asset;
// private String alias;
// private String address;
export async function saveWithDrawApi(params) {
  return axios.post(`/newAudit-api/saveUserWithDrawAddress`, params);
}

// 删除用户提币地址 http://10.10.10.247:8080/
export async function deleteWithDrawApi(params) {
  return axios.post(`/newAudit-api/delUserWithDrawAddress`, params);
}
//查询充币记录
export function queryDepositRecord(params) {
  return axios.post('/newAudit-api/queryDepositRecord', params);
}
//查询提币记录
export function queryWithdrawRecord(params) {
  return axios.post('/newAudit-api/queryWithDrawAudit', params);
}
//所有币种手续费配置
export function queryAuditConfig(params) {
  return axios.post('/newAudit-api/queryAuditConfig', params);
}

//验证资金密码接口
export function verifySecret(params) {
  return axios.post(`/user/apikey/verifySecret`, params);
}

//提币接口
export function Withdraw(params) {
  return axios.post(`/newAudit-api/saveUserAudit`, params);
}

//查询指定资产信息
export function queryUserOenAssetBalance(params) {
  return axios.get(`/finMan-api/NOTC/queryUserSpecifiedAssetBalance/${params}`);
}

//查询活动流水信息
export function getTurnover(params) {
  return axios.post('/activity-api/sign/getTurnover', params);
}
