(function() {
  // init面板
  const dom_box = document.createElement("div");
  const dom_ul = document.createElement("ul");
  const dom_lis = [];
  const fee3 = (1 - 0.0015) ** 3;
  const baseM = 100;
  const haveTao = ["无套利", "被低估", "被高估"];
  let tickerTimer = null;
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

    const style = document.createElement("style");
    style.rel = "stylesheet";
    style.type = "text/css";
    style.innerText = initStyle();
    document.head.appendChild(style);
  }

  // 请求ticker
  const api = {
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
      const asks1 = deeps[d1.symbol] && deeps[d1.symbol].asks[0] ? deeps[d1.symbol].asks[0] : 0;
      const asks2 = deeps[d1.symbol] && deeps[d2.symbol].asks[0] ? deeps[d2.symbol].asks[0] : 0;
      const asks3 = deeps[d1.symbol] && deeps[d3.symbol].asks[0] ? deeps[d3.symbol].asks[0] : 0;
      // 理论价格 d1t/d2t
      const t1 = d1t / d2t;
      // 差价 t1 - d2
      const t2 = t1 - d3t;

      const taoDown = this.taoliDown(d1t, d2t, d3t);
      const taoUp = this.taoliUp(d1t, d2t, d3t);

      const check = this.checkT2(t2);
      temp.push({
        d1: temp1, // 交易对1 obj
        d2: temp2, // 交易对2 obj
        d3, // 交易对3 obj
        d1t, // 交易对1真实价格
        d2t, // 交易对2真实价格
        d3t, // 交易对3真实价格
        t1, // 交易对3理论价格
        t2, // t1 - d3t
        taoUpFee: taoUp * (window.fee3 || fee3), // 交易对3子币 被高估 计算
        taoDownFee: taoDown * (window.fee3 || fee3), // 交易对3子币 被低估 计算
        check,
      });
    },
    // 被低估 d2t:卖1，d3t:卖1， d1t：卖1
    taoliDown(d1t, d2t, d3t) {
      return ((window.baseM || baseM) / d2t / d3t) * d1t;
    },
    // 被高估 d1t:卖1， d3t:卖1， d2t:卖1; usdt买lamb,lamb买usdk, usdk买usdt
    taoliUp(d1t, d2t, d3t) {
      return ((window.baseM || baseM) / d1t) * d3t * d2t;
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
          if (item.data && item.data.code === 0) {
            deeps[item.data.symbol] = item.data;
          }
        });
      })
      .catch(() => {
        console.log("获取深度信息失败：", d1, d2, d3);
      });
  }

  function startDeep3(d1, d2, d3) {
    deepLook3 = [d1, d2, d3];
  }
  function stopDeep3() {
    deeps = {};
    deepLook3 = [];
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
          align-items: center;
          color: #aaa;
          font-size: 14px;
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
    }, 8000);
  }

  // 更新一次ticker
  function updateTicker() {
    api.getTickerOkex().then(res => {
      if (res) {
        formartTicker = res.map(item => {
          const [zi, mu] = item.symbol.split("_");
          return {
            ...item,
            zi,
            mu,
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
          if (mu !== "usdt") {
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
          <div>${temp[i].d1.symbol}<br/><b>${temp[i].d1t}</b></div>
          <div>${temp[i].d2.symbol}<br/><b>${temp[i].d2t}</b></div>
          <div>${temp[i].d3.symbol}<br/>真实价：<b>${temp[i].d3t}</b><br/>理论价：<b>${temp[i].t1}</b><br/>差价(理-真):<b>${temp[i].t2}</b></div>
          <div>
            <ul class="res">
              <li>${temp[i].d3.zi}${haveTao[temp[i].check]}</li>
              <li>
                ${temp[i].check === 1 ? `${temp[i].d2.mu}>${temp[i].d2.zi}, ${temp[i].d2.zi}>${temp[i].d3.zi}, ${temp[i].d3.zi}>${temp[i].d2.mu}` : ""}
                ${temp[i].check === 2 ? `${temp[i].d2.mu}>${temp[i].d1.zi}, ${temp[i].d1.zi}>${temp[i].d3.mu}, ${temp[i].d3.mu}>${temp[i].d2.mu}` : ""}
                <br/>
                ${temp[i].check === 1 ? `${window.baseM || baseM}/${temp[i].d2t}/${temp[i].d3t}*${temp[i].d1t} = ${temp[i].taoDownFee}` : ""}
                ${temp[i].check === 2 ? `${window.baseM || baseM}/${temp[i].d1t}*${temp[i].d3t}*${temp[i].d2t} = ${temp[i].taoUpFee}` : ""}
              </li>
            </ul>
          </div>
          <div>
            <button>开始</button>
            <button class="${deepLook3.join("") === `${temp[i].d1.symbol}${temp[i].d2.symbol}${temp[i].d3.symbol}` ? "check" : ""}" onClick="startDeep3('${temp[i].d1.symbol}','${temp[i].d2.symbol}','${temp[i].d3.symbol}')">卖1修正</button>
            <button onClick="stopDeep3">取消卖1修正</button>
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
