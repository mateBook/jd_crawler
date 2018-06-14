const koa = require("koa");
const mongoose = require("mongoose");
const path = require("path");
const server = require("koa-static");
const logger = require("koa-logger");
const bodyParse = require("koa-bodyparser");
const cors = require('koa2-cors');
const app = new koa();

app.use(cors());

app.use(server(__dirname + '/views'));  //静态资源
mongoose.connect("mongodb://localhost:27017/imooc"); //连接数据库
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'Mongodb connect error !'));
db.once('open', function() {
    console.log('Mongodb started !')
});

app.use(bodyParse());
/*
 *@使用router转发请求
 */
const router= require("./routers/user")();
const router1= require("./routers/information")();

/*
 *@捕获异常和错误并抛出
 */
process.on("unhandledRejection",(err)=>{
    console.log(err.message);
});

/*
 *@日志输出
 */
require("./logger/Winston.js")();
app.use(logger());
app.use(router.routes());

app.use(router1.routes());

app.listen(1234);
console.log("http://localhost:1234");