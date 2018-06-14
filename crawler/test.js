const fs = require("fs");
const puppeteer = require("puppeteer");
const readFile = require("util").promisify(fs.readFile);




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
        headless:false,
        orgs:["--no-sandbox"]
    });
    let page =await browser.newPage();


    let result =await run("../data/jj.json");
    console.log(result);
    for(var i=0;i<result.length;i++){
        var item = result[i];
        await page.goto(item.url,{awaitUntil:"networkidle2"});
        await page.click("#job_company a");
        await page.waitFor(1000);

        let ss = await page.evaluate(() => {
            let a = document.querySelector("#job_company dt a").src;
            let b = $(".hovertips").attr("title");
            // return {
            //     companyName:$(".hovertips").attr("title"),
            //     companyAvatar:$(".top_info_wrap>img").attr("src"),
            //     companyDetail:$(".company_intro_text").html()
            // }
            console.log(b);
            alert(b);
            return {
                url:b
            }
        });
        console.log(ss);

    }



})();

process.on("unhandledRejection",(err) => {
    console.log(err.message);
});
