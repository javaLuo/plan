import Storage from '~/utils/storage.js'
//用于跳转到tradingview页面进行  交易对 设置

export default {
  //设置交易对
  set({mu,zi}){
    Storage.set('gmu',mu)
    Storage.set('gzi',zi)
  },
  //清除已设交易对
  clear(){
    Storage.remove('gmu')
    Storage.remove('gzi')
  },
  //是否已经设置交易对
  has(){
    const gmu = Storage.get('gmu');
    const gzi = Storage.get('gzi');
    if(!gmu && gmu != 'undefined' && !gzi && gzi != 'undefined'){
      return true;
    }
    return false;
  }
}