const express = require('express');
const graphqlHTTP = require('express-graphql');
const bodyParser = require('body-parser');
const jdbc = require('./sql/mysql');
const fs = require('fs');

const app = express();

const schema = require('./schema.js');

app.use(express.static('view/public'));
app.use('/work', express.static('view/work'));
app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    graphiql: false,
  }),
);
app.use(bodyParser.urlencoded({ extended: false }));

// 默认访问
app.all('/', function(req, res) {
  res.sendFile(__dirname + '/view/index.html');
});

// 各GET请求
app.get('/main/todo.do', function(req, res) {
  console.log('GET请求', req.query, new Date());
  switch (req.query.m) {
    case 'getAllWorks': // 请求所有作品
      jdbc
        .getAllWorks()
        .then(obj => {
          res.send(obj);
        })
        .catch(obj => {
          res.send(obj);
        });
      break;
    case 'getOneMyWork': // 点击进入某一个work详情页
      jdbc
        .getOneMyWork(req.query.p)
        .then(obj => {
          res.send(obj);
        })
        .catch(obj => {
          res.send(obj);
        });
      break;
    case 'getMessage': // 按照分页加载留言
      jdbc
        .getMessage(req.query.p)
        .then(obj => {
          res.send(obj);
        })
        .catch(obj => {
          res.send(obj);
        });
      break;
    case 'getMovieList': // 分页加载电影列表
      jdbc
        .getMovieList(req.query.p)
        .then(obj => {
          res.send(obj);
        })
        .catch(obj => {
          res.send(obj);
        });
      break;
    case 'getMovieInfo': // 加载某一个电影的具体信息
      let movieinfo;
      jdbc
        .getMovieInfo(req.query.p)
        .then(obj => {
          movieinfo = obj.rows[0];
          return jdbc.getMovieImgs(req.query.p);
        })
        .then(obj => {
          movieinfo.movieimgs = obj.rows;
          res.send({ status: '0', message: 'success', rows: [movieinfo] });
        })
        .catch(obj => {
          console.log('发生错误', obj);
          res.send(obj);
        });
      break;
    case 'getGameList': // 加载全部游戏列表
      jdbc
        .getGameList()
        .then(obj => {
          res.send(obj);
        })
        .catch(obj => {
          res.send(obj);
        });
      break;
    case 'getGameInfo': // 加载某一个游戏的详情
      let gameinfo;
      jdbc
        .getGameInfo(req.query.p)
        .then(obj => {
          gameinfo = obj.rows[0];
          return jdbc.getGameImgs(req.query.p);
        })
        .then(obj => {
          gameinfo.gameimg = obj.rows;
          res.send({ status: '0', message: 'success', rows: [gameinfo] });
        })
        .catch(obj => {
          console.log('发生错误', obj);
          res.send(obj);
        });
      break;
    case 'getArticleList': // 加载文章列表
      jdbc
        .getArticleList()
        .then(obj => {
          res.send(obj);
        })
        .catch(obj => {
          res.send(obj);
        });
      break;
    case 'getOneArticle': // 加载某一篇文章的详情
      jdbc
        .getOneArticle(req.query.p)
        .then(obj => {
          res.send(obj);
        })
        .catch(obj => {
          res.send(obj);
        });
      break;
    case 'getStudy': // 微信小程序study获取对应的分类数据
      switch (req.query.p) {
        case 'zz1': // 政治1 - 知识点
          var data = fs.readFileSync(__dirname + '/view/public/imgs/wx/成人高考专升本政治知识点.json', 'utf-8');
          res.send({ status: '0', message: 'success', data: JSON.parse(data) });
          res.end();
          break;
        case 'zz2': // 政治2 - 毛中特练习题1
          var data = fs.readFileSync(__dirname + '/view/public/imgs/wx/毛泽东思想和中国特色练习题.json', 'utf-8');
          res.send({ status: '0', message: 'success', data: JSON.parse(data) });
          res.end();
          break;
        case 'zz3': // 政治3 - 毛中特练习题1
          var data = fs.readFileSync(__dirname + '/view/public/imgs/wx/毛中特练习题.json', 'utf-8');
          res.send({ status: '0', message: 'success', data: JSON.parse(data) });
          res.end();
          break;
        case 'zz4': // 政治4 - 哲学练习
          var data = fs.readFileSync(__dirname + '/view/public/imgs/wx/哲学练习.json', 'utf-8');
          res.send({ status: '0', message: 'success', data: JSON.parse(data) });
          res.end();
          break;
        case 'zz5': // 政治4 - 哲学单选
          var data = fs.readFileSync(__dirname + '/view/public/imgs/wx/哲学单选.json', 'utf-8');
          res.send({ status: '0', message: 'success', data: JSON.parse(data) });
          res.end();
          break;
        case 'zz6': // 政治4 - 模拟1
          var data = fs.readFileSync(__dirname + '/view/public/imgs/wx/模拟1.json', 'utf-8');
          res.send({ status: '0', message: 'success', data: JSON.parse(data) });
          res.end();
          break;
        case 'zz7': // 政治4 - 模拟2
          var data = fs.readFileSync(__dirname + '/view/public/imgs/wx/模拟2.json', 'utf-8');
          res.send({ status: '0', message: 'success', data: JSON.parse(data) });
          res.end();
          break;
        case 'zz8': // 政治4 - 模拟3
          var data = fs.readFileSync(__dirname + '/view/public/imgs/wx/模拟3.json', 'utf-8');
          res.send({ status: '0', message: 'success', data: JSON.parse(data) });
          res.end();
          break;
        case 'en0': // 英语0 - 语法
          var data = fs.readFileSync(__dirname + '/view/public/imgs/wx/en0.json', 'utf-8');
          res.send({ status: '0', message: 'success', data: JSON.parse(data) });
          res.end();
        case 'en1': // 英语1 - 高一单词
          var data = fs.readFileSync(__dirname + '/view/public/imgs/wx/en1.json', 'utf-8');
          res.send({ status: '0', message: 'success', data: JSON.parse(data) });
          res.end();
        case 'en2': // 英语1 - 高二单词
          var data = fs.readFileSync(__dirname + '/view/public/imgs/wx/en2.json', 'utf-8');
          res.send({ status: '0', message: 'success', data: JSON.parse(data) });
          res.end();
        case 'en3': // 英语1 - 高三单词
          var data = fs.readFileSync(__dirname + '/view/public/imgs/wx/en3.json', 'utf-8');
          res.send({ status: '0', message: 'success', data: JSON.parse(data) });
          res.end();
        default:
          res.send({ status: '1', message: '404', rows: null });
          res.end();
          break;
      }
      break;
    default:
      res.send({ status: '1', message: '404', rows: null });
      res.end();
  }
});

// 各POST请求
app.post('/main/todo.do', function(req, res) {
  console.log('POST请求', req.query, new Date());

  if (req.body.m === 'putMessage') {
    // 添加留言
    let ps = decodeURIComponent(req.body.p);
    let date = new Date();
    ps = ps.split('@@');
    date = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    jdbc
      .putMessage(ps[0], ps[1], date)
      .then(obj => {
        obj.rows.backinfo = { name: ps[0], msg: ps[1], time: date };
        res.send(obj);
      })
      .catch(obj => {
        res.send(obj);
      });
  }
});

const server = app.listen(8080, function() {
  console.log('启动成功，端口：' + server.address().port);
});
