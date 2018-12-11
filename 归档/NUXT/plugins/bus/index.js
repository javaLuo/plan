const clientList = {};

//vue bus 不适合非组件通信 自己实现一个资源占用很小

export default {
  on(key, fn) {
    if (!clientList[key]) {
      clientList[key] = [];
    }
    clientList[key].push(fn);
  },
  trigger() {
    const key = Array.prototype.shift.call(arguments),
      fns = clientList[key];
    if (!fns || fns.length === 0) {
      return false;
    }
    for (let i = 0, fn; (fn = fns[i++]); ) {
      fn.apply(this, arguments);
    }
  },
  off(key, fn) {
    const fns = clientList[key];
    if (!fns) {
      return false;
    }
    if (!fn) {
      fns && (fns.length = 0);
    } else {
      for (let l = fns.length - 1; l >= 0; l--) {
        const _fn = fns[l];
        if (_fn === fn) {
          fns.splice(1, 1);
        }
      }
    }
  },
};
