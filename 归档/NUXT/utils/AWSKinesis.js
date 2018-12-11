// import AWS from 'aws-sdk'
import Storage from './storage';
import { saveKinesis, getUserInfo } from '~/store/modules/user/api';
import { GET_USER_INFO } from '~/store/modules/user/type';
import utils from '~/utils/';
var params = {
  ip: '',
  device_type: '',
  device_id: '',
  platform: 'pc_web',
  platform_info: utils.getPlaformInfo(),
}; //固定参数
export default {
  async putRecord(par) {
    // if(!Storage.get('userId')){
    //   await this.$store.dispatch(GET_USER_INFO); //判断是否用户id存在 如果不存在获取用户信息
    // }
    let text = JSON.stringify({ ...params, ...par, ip: Storage.getItem('ip') });
    let res = await saveKinesis(text);
    if (res && res.code === 200) {
      console.log('埋点数据成功' + res);
    } else {
      console.log('埋点数据失败' + res);
    }
  },
};
