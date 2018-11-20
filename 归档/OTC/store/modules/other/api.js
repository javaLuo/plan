import axios from '~/store/axios';

//获取常见问题列表
export function getQuestion(params){
  return axios.post('/otc/user/question/getAllQuestion', params);
}
//问题类型列表
export function getTypeQuestion(params){
  return axios.post('/otc/user/question/getQuestionByType', params)
}
//获取常见问题答案列表
export function getQuestionById(params){
  return axios.post('otc/user/question/getQuestionById', params)
}
//问题反馈
export function questionHelp(params){
  return axios.post('/otc/user/question/questionHelp', params);
}