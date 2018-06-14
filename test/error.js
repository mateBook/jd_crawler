//throw new Error("that http is error");


//const a = {};
//Error.captureStackTrace(a);
//throw a;

//(async()=>{
//    await new Promise((resolve,reject)=>{
//        resolve(undefined.ss())
//    }).catch((err)=>{console.log("caught",err.message)});
//    console.log("132");
//})();


//new Promise((rl,rj)=>{
//    throw new Error('will cause unhandled rejection')
//});
//
//new Promise((rl,rj)=>{
//    throw new Error('will cause unhandled rejection1')
//});
//
//new Promise((rl,rj)=>{
//    throw new Error('will cause unhandled rejection2')
//});
//
//process.on('unhandledRejection',(p,reason)=>{
//
//    new Function();
//});


(async()=>{
    await Promise.reject(new Error("error"))
})();
console.log(1);
process.on("unhandledRejection",(err)=>{
    console.log(err);
});