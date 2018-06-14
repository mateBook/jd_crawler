const cp = require("child_process");
const {resolve} = require("path");
const mongoose = require("mongoose");
const puppeteer = require("puppeteer");
const Movie = require("../model/model.js");

mongoose.connect("mongodb://localhost:27017/imooc");
let db = mongoose.connection;
db.on("error", (err)=> {
    console.log(err);
});
db.once('open', function () {
    console.log('Mongodb started !')
});
(async ()=> {
    //引入要执行的脚本
    const scirpt = resolve(__dirname, "../crawler/crawler.js");
    //将脚本放进分叉
    const child = cp.fork(scirpt, []);
    let invoked = false;

    process.on('unhandledRejection', error => {
        console.error('unhandledRejection', error);
        process.exit(1); // To exit with a 'failure' code
    });
    child.on("error", (err)=> {
        if (invoked) return;

        invoked = true;
        console.log(err);
    });
    child.on("exit", (code)=> {
        if (invoked) return;
        invoked = true;
        const err = code === "0" ? null : new Error("err code: " + code);
        console.log(err);
    });
    const Browser = await puppeteer.launch({
        args: ['--no-sandbox'],
        dumpio: false
    });
    child.on("message", async(data)=> {
        let result = data.result;

        const Page = await Browser.newPage();
        for (let i = 0; i < result.length; i++) {
            let doubanId = result[i].src;

            await Page.goto(doubanId, {
                waitUntil: 'networkidle2'
            });

            result[i].detail = await Page.evaluate(() => {
                let el = document.querySelectorAll(".lh>li");
                let s_image  = [];
                let l_image  = [];
                let detail_image  = [];
                for(let j=0;j<el.length;j++){
                    var child = el[j];
                    var s_img=child.firstChild.src;
                    if(s_img){
                        var l_img=s_img.replace(/jfs/,"s450x450_jfs");
                        var detail_img=s_img.replace(/jfs/,"s850x850_jfs");
                        s_image.push(s_img);
                        l_image.push(l_img);
                        detail_image.push(detail_img);
                    }
                }
                return {
                    s_imge:s_image,
                    l_image:l_image,
                    detail_image:detail_image
                };

            });

        }

        Browser.close();
        console.log(result);
        for (let i = 0; i < result.length; i++) {
            var item = result[i];
            let jd = await Movie.findOne({"id": item.id}).exec();
            if (!jd) {
                jd = new Movie(item);
                await jd.save()
            }
        }
    })
})();