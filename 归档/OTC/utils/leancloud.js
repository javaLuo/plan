import { Realtime } from 'leancloud-realtime';
import { Message, TextMessage, ConversationMemberRole } from 'leancloud-realtime';
import { ImageMessage } from 'leancloud-realtime-plugin-typed-messages';
import AV from 'leancloud-storage';

const appId = 'GJKfN0a234VJ6NHxmWn3Xmkb-MdYXbMMI'; //appid
const appKey = '6VjXnhtX4J1nAS0clEvCFose'; //appkey

export default {
  LeanRT: {},
  // constructor(prop) {
  // 	this.LeanRT = {}; //默认连接属性
  // 	super(prop);
  // }
  init() {
    //初始化leancloud
    const realtime = new Realtime({
      appId,
      appKey,
      // server: 'rtm51',
      //plugins: [TypedMessagesPlugin, GroupchatReceiptsPlugin, TypingIndicatorPlugin],
      region: 'us', // 美国节点为 "us"
    });
    //realtime.register([StickerMessage]);
    this.LeanRT.realtime = realtime;
    this.LeanRT.imClient = null;
    this.LeanRT.currentConversation = null;
  },
  setClient(userClient) {
    //设置连接属性
    this.LeanRT.imClient = userClient;
  },
  login(clientId) {
    //连接
    //登录leancloud
    return this.LeanRT.realtime.createIMClient(clientId);
  },
  close() {
    //关闭连接
    if (this.LeanRT && this.LeanRT.imClient) {
      this.LeanRT.imClient.close();
    }
  },
  async createConversation(...arg) {
    //创建会话
    if (!this.isLoggedin || arg[0] === this.LeanRT.imClient.id) {
      return false;
    }
    try {
      let res = await this.LeanRT.imClient.createConversation({
        members: [arg[0]],
        name: `${arg[0]}和 ${this.LeanRT.imClient.id} 的对话`,
        transient: false,
        unique: false, //唯一对话，当其为 true 时，如果当前已经有相同成员的对话存在则返回该对话，否则会创建新的对话
      });
      this.conversation = res; //创建会话之后设置会话
      this.messageIterator = res.createMessagesIterator({ limit: 30 }); //创建一个消息查询池
    } catch (error) {
      throw new Error(error);
    }
  },
  async getConversation(id) {
    //创建会话
    if (!this.isLoggedin) {
      return false;
    }
    try {
      let res = await this.LeanRT.imClient.getConversation(id);
      this.conversation = res; //创建会话之后设置会话
      this.messageIterator = res.createMessagesIterator({ limit: 30 }); //创建一个消息查询池
    } catch (error) {
      throw new Error(error);
    }
  },
  async sendText(text) {
    //发送消息
    if (!text || !this.conversation) return;

    const message = new TextMessage(text);
    message.setAttributes({
      type: 1,
    });
    const sendPromise = await this.conversation.send(message, {
      receipt: this.conversation.members.length === 2,
    });
    return sendPromise;
  },
  async sendImgText(text) {
    if (!text || !this.conversation) return;
    const message = new TextMessage(text);
    message.setAttributes({
      type: 2,
    });
    const sendPromise = await this.conversation.send(message, {
      receipt: this.conversation.members.length === 2,
    });
    return sendPromise;
  },
  bindEvent(eventType, cb) {
    //设置监听事件
    this.LeanRT.imClient.on(eventType, cb);
  },
  bindCovEvent(eventType, cb) {
    //设置会话级别的监听事件
    if (!this.conversation) return;

    this.conversation.on(eventType, cb);
  },
  async loadMoreMessages() {
    if (!this.messageIterator) return;
    let res = await this.messageIterator.next();
    return !!res && res.value;
  },
  isCached: () => {
    try {
      return Storage.getItem('clientId') !== null;
    } catch (e) {
      return false;
    }
  },
  cache: clientId => {
    Storage.setItem('clientId', clientId);
  },

  isLoggedin: () => {
    if (this.LeanRT.imClient) {
      return true;
    }
    return false;
  },
  logout: () => {
    localStorage.removeItem('clientId');
    return this.LeanRT.imClient.close();
  },
  getCachedInfo: () => {
    try {
      return Storage.getItem('clientId');
    } catch (e) {
      return undefined;
    }
  },
  readMarket(msg) {
    // 暂态消息不标记
    // 特殊情况：暂态对话的所有消息都是暂态的，因此暂态对话收到消息全部标记
    if (msg.transient && !this.conversation.transient) {
      return;
    }
    // 当前 tab 未激活不标记
    if (document.hidden) {
      return;
    }
    // 当前对话标记为已读
    this.conversation.read();
    //console.log('调用读取方法之后的时间', this.conversation.lastReadAt);
  },
};
