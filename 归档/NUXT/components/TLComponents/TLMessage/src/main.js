import Vue from 'vue';
import Main from './main.vue';
//import { PopupManager } from 'element-ui/src/utils/popup';
import { isVNode } from './dom';

let MessageConstructor = Vue.extend(Main);

let instance;
let instances = [];
let seed = 1;

const TLMessage = function(options) {
  if (Vue.prototype.$isServer) return;
  options = options || {};
  if (typeof options === 'string') {
    options = {
      message: options,
    };
  }
  let userOnClose = options.onClose;
  let id = 'tlmessage_' + seed++;

  options.onClose = function() {
    TLMessage.close(id, userOnClose);
  };
  instance = new MessageConstructor({
    data: options,
  });
  instance.id = id;
  if (isVNode(instance.message)) {
    instance.$slots.default = [instance.message];
    instance.message = null;
  }
  instance.vm = instance.$mount();
  document.body.appendChild(instance.vm.$el);
  instance.vm.visible = true; //调用show方法关闭
  instance.dom = instance.vm.$el;
  //instance.dom.style.zIndex = PopupManager.nextZIndex();
  instances.push(instance);
  return instance.vm;
};

// ['success', 'warning', 'info', 'error'].forEach(type => {

// });

TLMessage.show = options => {
  if (typeof options === 'string') {
    options = {
      message: options,
    };
  }
  //options.type = type;
  return TLMessage(options);
};
TLMessage.close = function(id, userOnClose) {
  for (let i = 0, len = instances.length; i < len; i++) {
    if (id === instances[i].id) {
      if (typeof userOnClose === 'function') {
        userOnClose(instances[i]);
      }
      instances.splice(i, 1);
      break;
    }
  }
};

TLMessage.closeAll = function() {
  for (let i = instances.length - 1; i >= 0; i--) {
    instances[i].close();
  }
};

export default TLMessage;
