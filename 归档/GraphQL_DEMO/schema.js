const { GraphQLObjectType, GraphQLSchema, GraphQLInt, GraphQLNonNull, GraphQLString, GraphQLList, GraphQLID } = require('graphql');
const jdbc = require('./sql/mysql');

// 作品模型
const Work = new GraphQLObjectType({
  name: 'Work',
  description: '模型：作品',
  fields: () => ({
    ID: { type: new GraphQLNonNull(GraphQLID) },
    TITLE: { type: new GraphQLNonNull(GraphQLString) },
    TITLEINFO: { type: GraphQLString },
    IMGPATH: { type: GraphQLString },
  }),
});

// 我的收藏 - 电影模型 - 电影图片模型
const Movieimg = new GraphQLObjectType({
  name: 'Movieimg',
  description: '模型：对应电影的图片',
  fields: () => ({
    id: { type: GraphQLID },
    imgpath: { type: GraphQLString },
    movie_id: { type: GraphQLInt },
    ordernum: { type: GraphQLInt },
  }),
});

// 我的收藏 - 电影模型
const Movie = new GraphQLObjectType({
  name: 'Movie',
  description: '模型：电影',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLID) },
    title: { type: GraphQLString },
    type: { type: GraphQLString },
    star: { type: GraphQLInt },
    mytalk: { type: GraphQLString },
    info: { type: GraphQLString },
    imgpath: { type: GraphQLString },
    downlink: { type: GraphQLString },
    downinfo: { type: GraphQLString },
    movieimgs: { type: new GraphQLList(Movieimg) },
  }),
});

// 留言模型
const Talk = new GraphQLObjectType({
  name: 'Talk',
  description: '模型： 留言',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLID) },
    info: { type: GraphQLString },
    time: { type: GraphQLString },
    username: { type: GraphQLString },
  }),
});

// GraphQL Query根
const Query = new GraphQLObjectType({
  name: 'Query',
  description: '所有的查询模式',
  fields: () => ({
    // 获得作品数据
    allworks: {
      type: new GraphQLList(Work),
      description: '查询所有work，返回应该是数组',
      resolve: async () => {
        const res = await jdbc.getAllWorks();
        if (res && res.status === '0') {
          return res.rows;
        } else {
          return null;
        }
      },
    },
    // 获得电影数据
    movie: {
      type: new GraphQLList(Movie),
      description: '查询所有的电影',
      args: {
        pageNow: { type: GraphQLInt },
      },
      resolve: async (_, { pageNow }) => {
        const res = await jdbc.getMovieList(pageNow);
        if (res && res.status === '0') {
          console.log(res.rows);
          return res.rows;
        } else {
          return null;
        }
      },
    },
  }),
});

// GraphQL Mutation根
const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  description: '所有的突变模式',
  fields: () => ({
    addTalk: {
      type: Talk,
      description: '添加留言',
      args: {
        talkinfo: { type: GraphQLString },
      },
      resolve: async (_, { talkinfo }) => {
        let date = new Date();
        let ps = talkinfo.split('@@');
        date = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
        return await jdbc
          .putMessage(ps[0], ps[1], date)
          .then(obj => {
            obj.rows.backinfo = { id: obj.rows.insertId, username: ps[0], info: ps[1], time: date };
            console.log('返回什么：', obj.rows.backinfo);
            return obj.rows.backinfo;
          })
          .catch(obj => {
            return null;
          });
      },
    },
  }),
});

const schema = new GraphQLSchema({
  query: Query,
  mutation: Mutation,
});

module.exports = schema;
