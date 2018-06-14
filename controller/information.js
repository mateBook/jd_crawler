const information = require("../model/m_information");
const user = require("../model/m_user");

exports.getInformation = async function (ctx) {
    let pageSize = parseInt(ctx.request.query.pageSize);
    let page = ctx.request.query.page;
    let skip = (page - 1) * pageSize;
    var data = await information.find().sort({"meta.creteTime": 1}).skip(skip).limit(pageSize);
    let count = await information.find().count();

    let result = [];

    data.map(function (item) {
        result.push({
            _id: item._id,
            img: item.img,
            title: item.title,
            brief: item.brief
        })
    });
    ctx.body = {
        status: 0,
        msg: "获取数据成功",
        count: count,
        result: result
    }
};

/*
 *@ 资讯详情
 * @ 必带参数 informationId
 */
exports.getInformationDetail = async  function(ctx){
    let informationId = ctx.request.query._id;
    let data = await information.findOne({"_id":informationId});


    if(data){
        data.views++;
        let result = {
            source:"琴断留声",
            views:data.views,
            time:data.meta.createTime,
            title:data.detail.title,
            praise:data.praise.sum,
            content:data.detail.content,
        };
        ctx.body = {
            status:0,
            msg:"获取数据成功",
            result:result
        };
        await data.save();
    }else {
        ctx.body = {
            status:1,
            msg:"不存在该数据！",
            result:""
        }
    }
};

/*
 *@ 添加评论
 *  必带参数 informationId、fatherId、towWho、content
 */

exports.addComment = async function(ctx){
    let data = ctx.request.query;
    let userId = ctx.cookies.get("userId");

    if(userId){

        if(!data.fatherId){   //fatherId为空的情况下

            if(data._id || data.content ){
                let result =  await information.findOne({"_id":data._id});
                let subData = {
                    userId:userId,
                    fatherId:0,
                    content:data.content,
                    toWho:0,
                    createTime:Date.now(),
                    son:[]
                };
                result.comments.push(subData);
                await result.save();
                ctx.body = {
                    status:0,
                    msg:"添加成功",
                    result:""
                }
            }else {
                ctx.body = {
                    status:1,
                    msg:"参数不全，请检查！",
                    result:""
                }
            }

        }else {   //fatherId 不为空的情况

            let result =  await information.findOne({"_id":data._id});
            let i =-1;
            result.comments.map(async function(item){
                i++;
                if(item._id == data.fatherId){
                    let subData = {
                        userId:userId,
                        fatherId:data.fatherId,
                        content:data.content,
                        toWho:data.toWho,
                        createTime:Date.now()
                    };
                    result.comments[i].son.push(subData);
                    ctx.body = {
                        status:0,
                        msg:"添加成功",
                        result:""
                    };
                    await result.save();

                    return;
                }
            })
        }
    }else{
        ctx.body = {
            status:1,
            msg:"未登录，没有该权限",
            result:""
        }
    }
};

/*
 *@ 查看评论
 *  必带参数 informationId
 */

exports.getInformationComment = async function(ctx){
    let informationId = ctx.request.query._id;
    let data = await information.findOne({"_id":informationId});


    for(let i=0;i<data.comments.length;i++){
        let item = data.comments[i];
        let userMessage = await user.findOne({"_id":item.userId});
        item.userMessage ={
            userName:userMessage.userName,
            avatar:userMessage.avatar
        };
        if(item.son.length>0){
            console.log("大于零")
            for(let i=0;i<item.son.length;i++){
                let it = item.son[i];
                let userMessage = await user.findOne({"_id":it.userId});
                it.userMessage ={
                    userName:userMessage.userName,
                    avatar:userMessage.avatar
                };
            }
        }
        await data.save()
    }
    // const sleep = time => new Promise(resolve => {
    //     setTimeout(resolve, time)
    // })
    // await sleep(3000)

    if(data){
        console.log(3);
        ctx.body = {
            status:0,
            msg:"获取数据成功",
            result:data.comments
        };
    }else {
        ctx.body = {
            status:1,
            msg:"不存在该数据！",
            result:""
        }
    }
}

/*
 * @ 点赞和取消点赞
 *   必带参数 informationId
 */

exports.praise = async function(ctx){
    let userId = ctx.cookies.get("userId");
    let data = ctx.request.query;
    if(userId){
        let result = await information.findOne({"_id":data.informationId});
        let i=true; //判断是否已经点赞


        if(result.praise.suData.length>0){

            result.praise.suData.map(function(item){
                if(item === userId){
                    i=false;
                    result.praise.suData.remove(item);
                }
            });
        }

        if(i){  //未点赞
            result.praise.sum++;
            result.praise.suData.push(userId)
        }else {
            result.praise.sum--;
        }
        await result.save();
        ctx.body = {
            status:0,
            msg:"success",
            result:""
        }
    }else{
        ctx.body = {
            status:1,
            msg:"未登录，没有操作权限",
            result:""
        }
    }
};

