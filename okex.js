(function() {
  // init面板
  function init() {
    const box = document.createElement("div");
    box.style = "position:absolute;top:48px;width:400px;left:0;z-index:99;background:#fff;border-right:solid 1px #ccc;padding:10px;";
    document.body.appendChild(box);

    const ul = document.createElement("ul");
    const li_title = document.createElement("li");
    li_title.innerHTML = "<div>交易对1</div><div>交易对2</div><div>交易对3</div><div>结论</div>";
    ul.appendChild(li_title);
    box.appendChild(ul);
  }
  // 更新面板

  init();
})();

// <script src="https://raw.githubusercontent.com/javaLuo/plan/master/okex.js"></script>

/**
 * var s = document.createElement('script');s.src="https://unpkg.com/axios/dist/axios.min.js";
 * document.body.appendChild(s);
 * axios.get('https://raw.githubusercontent.com/javaLuo/plan/master/okex.js').then((res)=>eval(res.data));
 * **/
