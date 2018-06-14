const puppeteer = require("puppeteer");
const mongoose = require("mongoose");
const job_list = require("../model/51job");
const job_detail = require("../model/51job_detail");


mongoose.connect("mongodb://localhost:27017/imooc");
let db = mongoose.connection;
db.on("error",(err)=>{
    console.log(err);
});
db.once("open",()=>{
    console.log("mongodb start!");
});

let url = "https://www.lagou.com/";


(async function () {
    const browser = await puppeteer.launch({
        headless:false
    });
    const page = await  browser.newPage();
    await page.goto(url,{awaitUntil:"networkidle2"});
    await page.waitFor(5000);
    let result;
    try {
       result = await page.evaluate(()=>{
            var content = $(".clearfix .position_list_ul>li");
            var data =[];
            console.log(content)
            for(var i=3;i<content.length;i++){
                var item = content[i];

                var Url = "https://www.lagou.com/jobs/"+item.attributes[1].nodeValue+".html";
                var title = item.attributes[5].nodeValue;
                var company = item.attributes[4].nodeValue;
                var wage = item.attributes[3].nodeValue;
                var target = item.children[0].children[2].innerText;


                data.push({
                    url:Url,
                    title:title,
                    company:company,
                    wage:wage,
                    target:target
                })
            }
            return data;
        });
    }
    catch(err) {
        console.log(err.message);
    }


    for(var j=0;j<result.length;j++){
        var list = result[j].url;
        await page.goto(list,{awaitUntil:"networkidle2"});
        await page.waitFor(200);
        let detail = await page.evaluate(()=>{
            return {
                title:$(".name").html(),
                company:$(".company").html(),
                yq:$(".job_request>p").text(),
                fl:$(".job-advantage>p").text(),
                gw:$(".job_bt>div").text()
            }
        });


        let record = new job_list(result[j]);
        await record.save();

        let jDetail = new job_detail(detail);
        await jDetail.save();



    }


})();

process.on("unhandledRejection",(err) => {
    console.log(err.message);
});