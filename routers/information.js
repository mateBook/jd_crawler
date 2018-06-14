const router = require("koa-router")();
const information = require("../controller/information");
module.exports = function () {
    router.get("/getInformation",information.getInformation);
    router.get("/getInformationDetail",information.getInformationDetail);
    router.get("/addComment",information.addComment);
    router.get("/getInformationComment",information.getInformationComment);
    router.get("/praise",information.praise);
    return router;
};