const fs = require("fs");
const puppeteer = require("puppeteer");
const readFile = require("util").promisify(fs.readFile);

const mongoose = require("mongoose");
const schema = new mongoose.Schema({
    address:String,
    companyName:String,
    companyAvatar:String,
    companyDetail:String
});
const schema1 = new mongoose.Schema({
    url:String,
});
const model = mongoose.model("company",schema);
const model1 = mongoose.model("url",schema1);
mongoose.connect("mongodb://localhost:27017/imooc");
const db = mongoose.connection;
db.once("open",() => {
    console.log("mongodb started!");
});


async function run(filePath) {
    try {
        const fr = await readFile(filePath,"utf-8");
        let da = JSON.parse(fr);
        return da;
    } catch (err) {
        console.log('Error', err);
    }
}


(async function () {
    let browser =await puppeteer.launch({
        headless:true,
        orgs:["--no-sandbox"]
    });
    let page =await browser.newPage();


     let result =await run("../data/url.json");
    for(var i=26;i<result.length;i++) {
        var item = result[i];
        await page.goto(item.url, {awaitUntil: "networkidle2"});

            await page.click(".text_over");

        await page.waitFor(200);

        let ss = await page.evaluate(() => {
            return {
                companyName:$(".hovertips").attr("title"),
                companyAvatar:$(".top_info_wrap>img").attr("src"),
                companyDetail:$(".company_intro_text").html()
            }
        });
        console.log(ss);
        let record = new model(ss);
        await record.save();

    }








})();

process.on("unhandledRejection",(err) => {
    console.log(err.message);
});
