const puppeteer = require("puppeteer");
const mongoose = require("mongoose");
const model = require("../model/m_information");


mongoose.connect("mongodb://localhost:27017/imooc");
let db = mongoose.connection;
db.on("error",(err)=>{
    console.log(err);
});
db.once("open",()=>{
    console.log("mongodb start!");
});

let url = "http://maoyan.com/news?showTab=2&offset=40";


(async function () {
   const browser = await puppeteer.launch({
       // headless:false
   });
    const page = await  browser.newPage();
    await page.goto(url,{awaitUntil:"networkidle2"});
    await page.waitFor(1000);
    // await page.waitForSelector(".page_6");
    console.log("正在爬取数据...");
    let result = await page.evaluate(()=>{
        var content = $(".news-container>div");
        var data =[];
        for(var i=0;i<content.length;i++){
            var item = content[i];
            var itemUrl = item.firstChild.nextElementSibling.href;
            var itemImg = item.firstChild.nextElementSibling.children[0].src;
            var itemTitle = item.firstChild.nextElementSibling.nextElementSibling.children[0].children[0].innerHTML;
            var itemBrief = item.firstChild.nextElementSibling.nextElementSibling.children[0].nextElementSibling.innerHTML;
            data.push({
                url:itemUrl,
                img:itemImg,
                title:itemTitle,
                brief:itemBrief
            });
            console.log()
        }
        return data;
    });

   for(var j=0;j<result.length;j++){
       var list = result[j].url;
       await page.goto(list,{awaitUntil:"networkidle2"});
       await page.waitFor(200);
       result[j].detail = await page.evaluate(()=>{
           return {
               title:$("h1").html(),
               content:$(".news-content").html()
           }
       })

       let record=await model.findOne({"url":list}).exec();
       // let record=false;
       if(!record){
           record = new model(result[j]);
           await record.save()
       }
   }
    process.on('unhandledRejection', error => {
        console.error('unhandledRejection', error);
        process.exit(1); // To exit with a 'failure' code
    });
   browser.close();
    console.log("数据爬取完成")
})();