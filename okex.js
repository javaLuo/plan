(function() {
  // init面板
  const dom_box = document.createElement("div");
  const dom_ul = document.createElement("ul");
  const dom_lis = [];
  const fee3 = (1 - 0.0015) ** 3;
  const baseM = 100;
  const haveTao = ["无套利", "被低估", "被高估"];
  function init() {
    dom_box.className = "mybox";
    document.body.appendChild(dom_box);
    const li_title = document.createElement("li");
    li_title.innerHTML = "<div>交易对1</div><div>交易对2</div><div>交易对3</div><div>结论</div><div>操作</div>";
    dom_ul.appendChild(li_title);
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
        return res.data;
      } catch (e) {
        console.error("getTickerOkex 请求失败", e);
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
      const t0 = d3.last;
      const d1t = temp1.last;
      const d2t = temp2.last;
      // 理论价格 d1t/d2t
      const t1 = d1t / d2t;
      // 差价 t1 - d2
      const t2 = t1 - t0;

      const taoUp = this.taoli(d1t, d2t, t0, 1);
      // const taoUpFee = this.taoli(d1t, d2t, t0, this.fee);
      const taoDown = this.taoli2(d1t, d2t, t0, 1);
      // const taoDownFee = this.taoli2(d1t, d2t, t0, this.fee);
      const check = this.checkT2(t2);
      temp.push({
        d1: temp1, // 交易对1 obj
        d2: temp2, // 交易对2 obj
        d3, // 交易对3 obj
        d1t, // 交易对1真实价格
        d2t, // 交易对2真实价格
        t0, // 交易对3真实价格
        t1, // 交易对3理论价格
        t2, // t1 - t0
        taoUp, // 交易对3子币 被高估 计算
        taoDown, // 交易对3子币 被低估 计算
        taoUpFee: taoUp * (window.fee3 || fee3), // 交易对3子币 被高估 计算
        taoDownFee: taoDown * (window.fee3 || fee3), // 交易对3子币 被低估 计算
        check,
      });
    },
    taoli(d1t, d2t, t0, f) {
      return ((window.baseM || baseM) / d1t) * f * t0 * f * d2t * f;
    },
    taoli2(d1t, d2t, t0, f) {
      return ((((window.baseM || baseM) / d2t) * f) / t0) * f * d1t * f;
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
  // 构建css
  function initStyle() {
    return `
      .mybox{
        position:absolute;
        top:48px;
        width:300px;
        left:0;
        z-index:99;
        background:#fff;
        border-right:solid 1px #ccc;
        padding:10px;
      }
      .mybox>ul{
        margin:0;
        padding:0;
      }
      .mybox>ul>li{
          display:flex;
          align-items: center;
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

  init();

  // 开始操作
  api.getTickerOkex().then(res => {
    if (res) {
      const formartTicker = res.map(item => {
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
        k++;
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
            pushD3(d1, d2, d3, temp);
          }
        }
      }

      temp.sort((a, b) => {
        let av = a.check === 1 ? a.taoDownFee : a.check === 2 ? a.taoupFee : 0;
        let bv = b.check === 1 ? b.taoDownFee : b.check === 2 ? b.taoupFee : 0;
        return bv - av;
      });

      for (let i = 0; i < dom_lis.length; i++) {
        dom_list[i].innerHTML = `
        <div>${temp[i].d1.zi}/${temp[i].d1.mu}<br/>${temp[i].d1t}</div>
        <div>${temp[i].d2.zi}/${temp[i].d2.mu}<br/>${temp[i].d2t}</div>
        <div>${temp[i].d2.zi}/${temp[i].d2.mu}<br/>真实价：${temp[i].t0}<br/>理论价：${temp[i].t1}<br/>差价(理-真):${temp[i].t2}</div>
        <div>
          <ul class="res">
            <li>${temp[i].d3.zi}${haveTao[temp[i].check]}</li>
            <li>
              ${temp[i].check === 1 && `${temp[i].d2.mu}>${temp[i].d2.zi},${temp[i].d2.zi}>${temp[i].d3.zi}>${temp[i].d3.zi}>${temp[i].d2.mu}`}
              ${temp[i].check === 2 && `${temp[i].d2.mu}>${temp[i].d1.zi},${temp[i].d1.zi}>${temp[i].d3.mu}>${temp[i].d3.mu}>${temp[i].d2.mu}`}
              <br/>
              ${temp[i].check === 1 && `${window.baseM || baseM}/${item[i].d2t}/${item[i].t0}*${item[i].d1t} = ${item[i].taoDownFee}`}
              ${temp[i].check === 2 && `${window.baseM || baseM}/${item[i].d1t}/${item[i].t0}*${item[i].d2t} = ${item[i].taoUpFee}`}
            </li>
          </ul>
        </div>
        `;
      }
    }
  });
})();

/*
function test() {
  var s = document.createElement("script");
  s.src = "https://unpkg.com/axios/dist/axios.min.js";
  document.body.appendChild(s);
  axios.get("https://raw.githubusercontent.com/javaLuo/plan/master/okex.js").then(res => eval(res.data));
}
*/
