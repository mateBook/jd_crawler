const koa = require("koa")
const bodyParser = require("koa-bodyparser")
const Router = require("koa-router")()
const app = new koa()

Router.post("/register",async function (ctx) {
    console.log(ctx)
    console.log(ctx.request.body)
})
app.use(bodyParser())
app.use(Router.routes())
app.listen(1235);

console.log("http://localhost:1235")