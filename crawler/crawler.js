const puppeteer = require("puppeteer");
const url = "https://www.jd.com/";
(async ()=>{
    const  browser =await puppeteer.launch({
        headless:false,
        orgs:["--no-sandbox"],
        dumpio:false
    });
    const page = await browser.newPage();
    await  page.goto(url,{awaitUntil:"networkidle2"});//表示网络空闲时页面就加载完成了
    await  page.waitFor(3000);
    await page.waitForSelector(".floorhd_tit")[7];
    await page.waitFor(5000);
    console.log("点击更多");
    var result = await page.evaluate(()=>{
        window.scrollTo(0,document.body.scrollHeight);

        var items = document.querySelectorAll(".more_list>li");
        console.log(items.length);
        var links = [];
        if(items.length >= 1){
            //for(var i=0;i<items.length;i++){
                items.forEach(async (item)=>{
                    //var item = items[i];
                    var src = item.firstChild.href;
                    var id=item.firstChild.href; //id
                    var s_img = item.firstChild.firstChild.lastChild.src; //图片
                    var l_img = s_img.replace(/s170x170/,"s670x670");

                    if(id.length>50){
                        id="";
                    }else{
                        var re = /https:\/\/item.jd.com\//;
                        var re1 = /.html/;
                        id = id.replace(re,"");
                        id = id.replace(re1,"");
                        var info =item.firstChild.lastChild.firstChild.innerHTML; //标题
                        var price =item.firstChild.lastChild.lastChild.lastChild.innerHTML; //价格
                        console.log(info);
                        console.log(price);
                        links.push({
                            id,
                            info,
                            price,
                            s_img,
                            l_img,
                            src
                        })
                    }
                });

            //}

        }
        return links;
    });


    browser.close();

    process.send({result});
    process.exit(0)
})();