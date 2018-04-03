const koa = require("koa");
const mongoose = require("mongoose");
const path = require("path");
const views = require("koa-views");
const app = new koa();


app.use(views(path.join(__dirname, './views'), { extension: 'jade' }));
mongoose.connect("mongodb://localhost:27017/imooc"); //连接数据库
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'Mongodb connect error !'));

db.once('open', function() {

    console.log('Mongodb started !')

});


/*
 *@使用router转发请求
 */
const router= require("./routers/user")();

app.use(router.routes());
app.listen(1234);
console.log("http://localhost:1234");