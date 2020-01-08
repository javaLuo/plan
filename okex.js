(function() {
  // init面板
  const dom_box = document.createElement("div");
  const dom_ul = document.createElement("ul");
  const dom_lis = [];
  function init() {
    dom_box.className = "mybox";
    document.body.appendChild(box);
    const li_title = document.createElement("li");
    li_title.innerHTML = "<div>交易对1</div><div>交易对2</div><div>交易对3</div><div>结论</div><div>操作</div>";
    dom_ul.appendChild(li_title);
    dom_box.appendChild(ul);

    for (let i = 0; i < 10; i++) {
      const li = document.createElement("li");
      li.id = `li${i}`;
      li.innerHTML = "<div></div><div></div><div></div><div></div><div></div>";
      dom_ul.appendChild(li);
      dom_lis.push(li);
    }

    const style = document.createElement("style");
    style.rel = "stylesheet";
    style.type = "text/css";
    style.innerText = initStyle();
    document.head.appendChild(style);
  }

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
      return Object.entries(obj).reduces((res, item) => {
        return `${res}&${item[0]}=${item[1]}`;
      }, "");
    },
  };

  init();

  // 开始操作
  api.getTickerOkex().then(res => {
    if (res) {
    }
  });
})();

// <script src="https://raw.githubusercontent.com/javaLuo/plan/master/okex.js"></script>

/**
 * var s = document.createElement('script');s.src="https://unpkg.com/axios/dist/axios.min.js";
 * document.body.appendChild(s);
 * axios.get('https://raw.githubusercontent.com/javaLuo/plan/master/okex.js').then((res)=>eval(res.data));
 * **/

function test() {
  var s = document.createElement("script");
  s.src = "https://unpkg.com/axios/dist/axios.min.js";
  document.body.appendChild(s);
  axios.get("https://raw.githubusercontent.com/javaLuo/plan/master/okex.js").then(res => eval(res.data));
}
