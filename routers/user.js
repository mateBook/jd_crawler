const Router = require("koa-router")();
const goods = require("../controller/goods.js");
module.exports= function(){
    Router.get("/index",goods.goods);
    Router.get("/search",goods.search);
    return Router;
}