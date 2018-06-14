const Router = require("koa-router")();
const goods = require("../controller/goods.js");
const multer = require("koa-multer");

let storage = multer.diskStorage({
    //文件保存路径
    destination: function (req, file, cb) {
        cb(null, 'views/uploads/')
    },
    //修改文件名称
    filename: function (req, file, cb) {
        let fileFormat = (file.originalname).split(".");
        cb(null,Date.now() + "." + fileFormat[fileFormat.length - 1]);
    }
});
//加载配置
let upload = multer({ storage: storage });

module.exports= function(){
    Router.get("/index",goods.goods);
    Router.get("/search",goods.search);
    Router.post("/register",goods.register);
    Router.post("/login",goods.login);
    Router.get("/loginOut",goods.loginOut);
    Router.get("/productDel",goods.productDel);
    Router.get("/addCart",goods.addCart);
    Router.get("/getCarList",goods.getCarList);
    Router.get("/delCar",goods.delCar);
    Router.get("/getUsers",goods.getUsers);
    Router.post("/updateAvatar",upload.single('file'),goods.updateAvatar);
    Router.get("/cities",goods.cities);
    Router.get("/addAddress",goods.addAddress);
    Router.get("/delAddress",goods.delAddress);
    return Router;
};