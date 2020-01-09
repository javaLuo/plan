(function() {
  // init面板
  const dom_box = document.createElement("div");
  const dom_ul = document.createElement("ul");
  const dom_lis = [];
  const fee = 1 - 0.0015;
  const baseM = 100;
  const haveTao = ["无套利", "被低估", "被高估"];
  let tickerTimer = null;

  let productsData = []; // 所有市场中存在的交易对 maxPriceDigit zi精度，maxSizeDigit mu精度
  let formartTicker = []; // 原始数据formart后
  let deeps = {}; // 所有symbol的深度数据
  let deepLook3 = [];
  function init() {
    dom_box.className = "mybox";
    document.body.appendChild(dom_box);
    dom_box.appendChild(dom_ul);

    for (let i = 0; i < 10; i++) {
      const li = document.createElement("li");
      dom_ul.appendChild(li);
      dom_lis.push(li);
    }

    dom_ul.addEventListener(
      "click",
      e => {
        console.log("被点击：", e);
        const targetDom = e.target;
        const type = targetDom.getAttribute("data-type");
        if (type === "begin") {
        } else if (type === "start") {
          const symbols = targetDom.getAttribute("data-symbols").split("@");
          startDeep3(...symbols);
        } else if (type === "stop") {
          stopDeep3();
        }
      },
      false,
    );
    const style = document.createElement("style");
    style.rel = "stylesheet";
    style.type = "text/css";
    style.innerText = initStyle();
    document.head.appendChild(style);

    api.getProducts().then(res => {
      console.log("productsData:", res);
      productsData = res;
    });
  }

  // 请求ticker
  const api = {
    // 获取所有市场存在的交易对
    async getProducts() {
      try {
        const res = await server.get(`https://www.okex.com/v2/spot/markets/products`, { t: Date.now() });
        if (res.data && res.data.code === 0) {
          return res.data.data || [];
        }
      } catch (e) {
        console.error("getProducts 请求失败", e);
      }
    },
    // 获取所有最新价格
    async getTickerOkex() {
      try {
        const res = await server.get(`https://www.okex.com/v2/spot/markets/tickers`, { t: Date.now() });
        if (res.data && res.data.code === 0) {
          return res.data.data || [];
        }
        return [];
      } catch (e) {
        console.error("getTickerOkex 请求失败", e);
      }
    },
    // 获取指定3个交易对的深度
    async getDeep(symbol) {
      try {
        const res = await server.get(`https://www.okex.com/v2/spot/markets/deep-deal`, { t: Date.now(), symbol });
        if (res.data && res.data.code === 0) {
          return res.data.data || [];
        }
        return { asks: [], bids: [] };
      } catch (e) {
        console.error("getDeep 请求失败", e);
      }
    },
  };

  // server.js
  const server = {
    post(url, bodyObj = {}) {
      return axios({
        url,
        method: "post",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
        },
        data: JSON.stringify(bodyObj),
      });
    },
    get(url, params) {
      return axios({
        url: `${url}?${this.formartParams(params)}`,
        methods: "get",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
        },
      });
    },
    formartParams(obj) {
      return Object.entries(obj).reduce((res, item) => {
        return res ? `${res}&${item[0]}=${item[1]}` : `${item[0]}=${item[1]}`;
      }, "");
    },
  };

  const utils = {
    pushD3(d1, d2, d3, temp) {
      let temp1 = d1;
      let temp2 = d2;
      if (d3.zi === d2.zi) {
        temp1 = d2;
        temp2 = d1;
      }
      // 真实价格
      const d1t = temp1.last;
      const d2t = temp2.last;
      const d3t = d3.last;
      // 卖1
      //console.log("没有吗：", deeps, d1.symbol); totalSize
      const [asks1, asks1t] = deeps[d1.symbol] && deeps[d1.symbol].asks ? [deeps[d1.symbol].asks[0].price, deeps[d1.symbol].asks[0].totalSize] : [0, 0];
      const [bids2, bids2t] = deeps[d2.symbol] && deeps[d2.symbol].bids ? [deeps[d2.symbol].bids[0].price, deeps[d2.symbol].bids[0].totalSize] : [0, 0];
      const [bids3, bids3t] = deeps[d3.symbol] && deeps[d3.symbol].bids ? [deeps[d3.symbol].bids[0].price, deeps[d3.symbol].bids[0].totalSize] : [0, 0];
      // 理论价格 d1t/d2t
      const t1 = d1t / d2t;
      // 差价 t1 - d2
      const t2 = t1 - d3t;

      const taoDownFee = this.taoliDown(d1t, d2t, d3t);
      const taoUpFee = this.taoliUp(d1t, d2t, d3t);
      const { taoliDownDeep, baseStart: baseStartDown } = this.taoliDownDeep(asks1, bids2, bids3, asks1t, bids2t, bids3t);
      const { taoliUpDeep, baseStart: baseStartUp } = this.taoliUpDeep(asks1, bids2, bids3, asks1t, bids2t, bids3t);
      const check = this.checkT2(t2);
      temp.push({
        d1: temp1, // 交易对1 obj
        d2: temp2, // 交易对2 obj
        d3, // 交易对3 obj
        d1t, // 交易对1真实价格
        d2t, // 交易对2真实价格
        d3t, // 交易对3真实价格
        t1, // 交易对3理论价格
        t2, // t1 - d3t 差价：理论价 - 当前价
        asks1,
        bids2,
        bids3,
        asks1t,
        bids2t,
        bids3t,
        taoUpFee, // 交易对3子币 被高估 计算 已减手续费
        taoDownFee, // 交易对3子币 被低估 计算 已减手续费
        taoliDownDeep,
        taoliUpDeep,
        baseStartDown, // 真正一开始需要消耗的本金
        baseStartUp, // 真正一开始需要消耗的本金
        check,
      });
    },
    /**
     * 被低估 算tao价格 用深1价计算的 已扣手续费
     * @param {number} asks1 第1个交易对卖1价格
     * @param {number} bids2 第2个交易对卖1价格
     * @param {number} bids3 第3个交易对卖1价格
     * @param {number} asks1t 第1个交易对卖1数量
     * @param {number} bids2t 第2个交易对买1数量
     * @param {number} bids3t 第3个交易对卖1数量
     * 低估：zen_usdt,eth_usdt,zen_eth: usdt->eth eth->zen zen->usdt
     */
    taoliDownDeep(asks1, bids2, bids3, asks1t, bids2t, bids3t) {
      const base = window.baseM || baseM; // 本金
      const f = window.fee || fee; // (1 - 手续费)

      // 第1步是否有充足的卖1: bids2
      const step1 = Math.min(bids2 * bids2t, base); // 最多只能消耗这么多usdt
      const step1Num = (step1 / bids2) * f; // 用usdt买到了这么多eth
      // 接下来该用eth买zen
      const step2 = Math.min(bids3 * bids3t, step1Num); // 最多只能消耗这么多eth
      const step2Num = (step2 / bids3) * f; // 用eth买到了这么多zen
      // 最后用zen买usdt
      const step3 = Math.min(asks1 * asks1t, step2Num); // 最多只能消耗这么多zen
      const step3Num = step3 * asks1 * f;
      // 既然最终只能消耗step3个zen，那么一开始只需要step3*bids3个eth，既然只需要step3*bids3个eth，那一开始只需要step3*bids3 * bids2个usdt
      return { taoliDownDeep: step3Num, baseStart: step3 * bids3 * bids2 };
    },
    /**
     * 被高估 深1算
     * @param {number} asks1
     * @param {number} bids2
     * @param {number} bids3
     * @param {number} asks1t
     * @param {number} bids2t
     * @param {number} bids3t
     * 高估：usdt->dcr, dcr->eth, eth->usdt
     * 交易手续费
     * 最小交易量
     * 卖1量不足
     * 小数点位数限制
     * js精度损失
     */
    taoliUpDeep(asks1, bids2, bids3, asks1t, bids2t, bids3t) {
      // 第1步是否有充足的卖1: asks1
      const base = window.baseM || baseM; // 本金
      const f = window.fee || fee; // (1 - 手续费)

      // 第1步是否有充足的卖1: asks1
      const step1 = Math.min(asks1 * asks1t, base); // 最多只能消耗这么多usdt
      const step1Num = (step1 / asks1) * f; // 用usdt买到了这么多dcr
      // 接下来该用dcr买eth
      const step2 = Math.min(bids3 * bids3t, step1Num); // 最多只能消耗这么多dcr
      const step2Num = step2 * bids3 * f; // 用dcr买到了这么多eth
      // 最后用eth买usdt
      const step3 = Math.min(bids2 * bids2t, step2Num); // 最多只能消耗这么多eth
      const step3Num = step3 * bids2 * f;

      // 既然最终只能消耗step3个eth，那么一开始只需要step3/bids3个dcr，既然只需要step3/bids3个dcr，那一开始只需要step3/bids3 * asks1个usdt
      return { taoliUpDeep: step3Num, baseStart: (step3 / bids3) * asks1 };
    },
    /**
     * 被低估 算tao价格 直接用当前价算的 已扣手续费
     * 低估：usdt->btc dcr->zip zip->usdt
     * @param {number} d1t 第1个交易对当前价格
     * @param {number} d2t 第2个交易对当前价格
     * @param {number} d3t 第3个交易对当前价格
     */
    taoliDown(d1t, d2t, d3t) {
      const base = window.baseM || baseM; // 本金
      const f = window.fee || fee; // (1 - 手续费)**3
      return (((base / d2t) * f) / d3t) * f * d1t * f;
    },
    // 被高估 d1t:卖1， d3t:卖1， d2t:卖1; usdt买lamb,lamb买usdk, usdk买usdt
    /**
     *
     * @param {number} d1t
     * @param {number} d2t
     * @param {number} d3t
     */
    taoliUp(d1t, d2t, d3t) {
      const base = window.baseM || baseM; // 本金
      const f = window.fee || fee; // (1 - 手续费)
      return (base / d1t) * f * d3t * f * d2t * f;
    },
    checkT2(num) {
      if (num < 0) {
        return 2;
      } else if (num > 0) {
        return 1;
      }
      return 0;
    },
  };

  // 根据交易对获取深度 d1,d2,d3是3个symbol名字
  function getDeep3(d1, d2, d3) {
    const p = [api.getDeep(d1), api.getDeep(d2), api.getDeep(d3)];
    Promise.all(p)
      .then(resarr => {
        resarr.forEach(item => {
          if (item) {
            deeps[item.symbol] = item;
          }
        });
      })
      .catch(() => {
        console.log("获取深度信息失败：", d1, d2, d3);
      });
  }

  // 构建css
  function initStyle() {
    return `
      .mybox{
        position:fixed;
        bottom:0;
        width:100%;
        height: 300px;
        overflow:auto;
        left:0;
        z-index:99;
        background:#fff;
        border:solid 1px #ccc;
        padding:10px;
      }
      .mybox>ul{
        margin:0;
        padding:0;
      }
      .mybox>ul>li{
          display:flex;
          align-items: flex-start;
          color: #aaa;
          font-size: 14px;
          border-bottom: solid 1px #ccc;
      }
      .mybox>ul>li b{
        color:#222;
      }
      .mybox>ul>li button{
        border:solid 1px #ccc;
        cursor:pointer;
      }
      .mybox>ul>li button.check{
        border:solid 1px #22c;
      }
      .mybox>ul>li>div{
        padding: 2px 4px;
      }
      .mybox>ul>li>div:nth-child(1){
        width:10%;
      }
      .mybox>ul>li>div:nth-child(2){
        width:10%;
      }
      .mybox>ul>li>div:nth-child(3){
        width:30%;
      }
      .mybox>ul>li>div:nth-child(4){
        width:40%;
      }
      .mybox>ul>li>div:nth-child(5){
        width:10%;
      }
    `;
  }

  // 轮训刷ticker
  function tickerTime() {
    clearTimeout(tickerTimer);
    tickerTimer = setTimeout(() => {
      if (deepLook3.length === 3) {
        getDeep3(...deepLook3);
      }

      updateTicker();
      tickerTime();
    }, 4000);
  }

  function startDeep3(d1, d2, d3) {
    deepLook3 = [d1, d2, d3];
  }
  function stopDeep3() {
    deeps = {};
    deepLook3 = [];
  }

  // 更新一次ticker
  function updateTicker() {
    api.getTickerOkex().then(res => {
      if (res) {
        let k = {};
        res.forEach(item => {
          k[item.symbol] = {
            ...item,
          };
        });
        formartTicker = productsData.map(item => {
          const [zi, mu] = item.symbol.split("_");
          return {
            ziPoint: item.maxDigitDigit,
            muPoint: item.maxPriceDigit,
            zi,
            mu,
            ...k[item.symbol],
          };
        });

        let temp = [];
        const l = formartTicker.length;
        const group = {};
        // 分组
        for (let i = 0; i < l; i++) {
          const ticker = formartTicker[i];
          const mu = ticker.mu;
          if (group[mu]) {
            group[mu].push(ticker);
          } else {
            group[mu] = [ticker];
          }
        }

        // 开始遍历
        for (let i = 0; i < l; i++) {
          const d1 = formartTicker[i];
          const mu = d1.mu;
          // 我的本金为usdt
          if (mu !== "usdk") {
            continue;
          }
          for (let j = 0; j < group[mu].length; j++) {
            const d2 = group[mu][j];
            if (d1 === d2) {
              continue;
            }
            const d3 =
              group[d2.zi] &&
              group[d2.zi].find(item => {
                return item.zi === d1.zi;
              });

            if (d3) {
              utils.pushD3(d1, d2, d3, temp);
            }
          }
        }
        temp.sort((a, b) => {
          let av = a.check === 1 ? a.taoDownFee : a.check === 2 ? a.taoUpFee : 0;
          let bv = b.check === 1 ? b.taoDownFee : b.check === 2 ? b.taoUpFee : 0;
          return bv - av;
        });

        for (let i = 0; i < dom_lis.length; i++) {
          dom_lis[i].innerHTML = `
          <div>${temp[i].d1.symbol}<br/>当前价：<b>${temp[i].d1t}</b><br/>卖1:<b>${temp[i].asks1 || "-"}</b></div>
          <div>${temp[i].d2.symbol}<br/>当前价：<b>${temp[i].d2t}</b><br/>买1:<b>${temp[i].bids2 || "-"}</b></div>
          <div>${temp[i].d3.symbol}<br/>当前价：<b>${temp[i].d3t}</b><br/>买1:<b>${temp[i].bids3 || "-"}</b><br/>理论价：<b>${temp[i].t1}</b><br/>差价(理-真):<b>${temp[i].t2}</b></div>
          <div>
            <ul class="res">
              <li>${temp[i].d3.zi}${haveTao[temp[i].check]}</li>
              <li>
                ${temp[i].check === 1 ? `${temp[i].d2.mu}>${temp[i].d2.zi}, ${temp[i].d2.zi}>${temp[i].d3.zi}, ${temp[i].d3.zi}>${temp[i].d2.mu}` : ""}
                ${temp[i].check === 2 ? `${temp[i].d2.mu}>${temp[i].d1.zi}, ${temp[i].d1.zi}>${temp[i].d3.mu}, ${temp[i].d3.mu}>${temp[i].d2.mu}` : ""}
                <br/>
                <div>
                  <div>深度计算：</div>
                  ${temp[i].check === 1 ? `${temp[i].baseStartDown}/${temp[i].bids2}/${temp[i].bids3}*${temp[i].asks1} = ${temp[i].taoliDownDeep}` : ""}
                  ${temp[i].check === 2 ? `${temp[i].baseStartUp}/${temp[i].asks1}*${temp[i].bids3}*${temp[i].bids2} = ${temp[i].taoliUpDeep}` : ""}
                </div>
                <div>
                  <div>当前价计算：</div>
                  ${temp[i].check === 1 ? `${window.baseM || baseM}/${temp[i].d2t}/${temp[i].d3t}*${temp[i].d1t} = ${temp[i].taoDownFee}` : ""}
                  ${temp[i].check === 2 ? `${window.baseM || baseM}/${temp[i].d1t}*${temp[i].d3t}*${temp[i].d2t} = ${temp[i].taoUpFee}` : ""}
                </div>
              </li>
            </ul>
          </div>
          <div>
            <button data-type="begin">开始</button>
            <button data-type="start" data-symbols="${temp[i].d1.symbol}@${temp[i].d2.symbol}@${temp[i].d3.symbol}" class="${deepLook3.join("") === `${temp[i].d1.symbol}${temp[i].d2.symbol}${temp[i].d3.symbol}` ? "check" : ""}">深度修正</button>
            <button data-type="stop">取消深度修正</button>
          </div>
          `;
        }
      }
    });
  }

  init();
  tickerTime();
})();

/*
function test() {
  var s = document.createElement("script");
  s.src = "https://unpkg.com/axios/dist/axios.min.js";
  document.body.appendChild(s);
  axios.get("https://raw.githubusercontent.com/javaLuo/plan/master/okex.js").then(res => eval(res.data));
}
*/
