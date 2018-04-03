const puppeteer = require('puppeteer');


const sleep = (time) => new Promise(resolve => {
    setTimeout(resolve, time)
});

// https://github.com/GoogleChrome/puppeteer/issues/290
//process.on('message', async (movies) => {
//    console.log('开始访问目标页面');
//    const browser = await puppeteer.launch({
//        args: ['--no-sandbox'],
//        dumpio: false
//    });
//    const page = await browser.newPage();
//
//    for (let i = 0; i < movies.length; i++) {
//        let doubanId = movies[i].src;
//
//        await page.goto(doubanId, {
//            waitUntil: 'networkidle2'
//        });
//        await sleep(1000);
//
//        const result = await page.evaluate(() => {
//            let el = document.querySelectorAll(".lh>li");
//            let detail  = [];
//            for(let j=0;j<el.length;j++){
//                var child = el[j];
//                var detail_img=child.firstChild.src;
//                detail.push(detail_img)
//            }
//            return detail;
//
//        });
//
//        let video;
//
//        const data = {
//            video,
//            doubanId,
//            cover: result.cover
//        };
//
//        process.send(data)
//    }
//
//    browser.close();
//    process.exit(0)
//});
