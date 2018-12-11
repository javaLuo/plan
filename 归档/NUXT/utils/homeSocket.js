import SockJS from 'sockjs-client'
const Stomp = require('stompjs');
export default {
  ws:null,
  url:'',
  timer:null,
  init(cfg){
    this.ws && this.ws.disconnect && this.ws.disconnect();
    this.url = cfg.url;
    this.connect(cfg.symbol);
  },
  connect(symbol){
    const socket = new SockJS(`${this.url}/quote-websocket/${symbol}`);
    this.ws = Stomp.over(socket);
    this.ws.debug = null;
  },
  debounce(fn,time = 2000){
    if(this.timer){
      clearTimeout(this.timer);
    }
    this.timer = setTimeout(() => {
      fn();
      clearTimeout(this.timer);
    },time)
  },
  unsub(){
    for(let key in this.ws.subscriptions){
      this.ws.unsubscribe(key);
    }
  },
  disconnect(){
    if(this.ws && this.ws.disconnect){
      this.unsub();
      if(!this.ws.connected) return;
      this.ws && this.ws.disconnect && this.ws.disconnect();
      this.ws = null;
      this.url = null;
      this.timer = null;
    }
  }
}