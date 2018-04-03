const koa = require("koa");
const app = new koa();
const logger = require("koa-logger");
const router = require("koa-router")();
//const jieba = require("nodejieba");

// 载入模块
var Segment = require('segment');
// 创建实例
var segment = new Segment();
// 使用默认的识别模块及字典，载入字典文件需要1秒，仅初始化时执行一次即可
segment.useDefault();

// 开始分词
console.log(segment.doSegment('南京市长江大桥！'));

app.use(logger());
router.get("/index",async (ctx,next)=>{
    //ctx.cookies.set("username=xiaofeng");
    ctx.set("Set-Cookie",`username=${ctx.query.name}`);
    ctx.body = "index";
    await next();
});

router.get("/jj",async (ctx,next)=>{

    console.log(ctx.cookies.get("username"));
    ctx.body = ctx.cookies.get("username");
    await next();
});
app.use(router.routes());
app.listen(8081);
console.log("http://localhost:8081");

