const good = require("../model/m_goods");
const user = require("../model/m_user");
const captchapng = require("captchapng");
const Segment = require("segment"); //中文分词，用于查询
const Promise = require("bluebird");
const request = Promise.promisify(require("request")); //请求百度api

let prefix = "http://api.map.baidu.com/";
let ak = "ZHQuYvPeMpFHwf1bW9iNouG3fTSOOOZe";
let baiDu = {
    search:prefix+"place/v2/search?",//
    locaation:prefix+"location/ip?ak="+ak,//
};

exports.goods = async function(ctx){
    let pageSize = parseInt(ctx.request.query.pageSize);
    let page = ctx.request.query.page;
    let skip = (page-1)*pageSize;

    const data = await good.find().sort({"salePrice":1}).skip(skip).limit(pageSize);
    let count = await good.find().count();

    let result = [];

    data.map(function (item) {
        result.push({
            _id: item._id,
            id: item.id,
            img: item.l_img,
            price: item.price,
            brief: item.info
        })
    });

    let res={
        count:count,
        status:0,
        data:result,
        msg:"that is success"
    };
    ctx.body =res;

};
/*
 *@搜索router
 */

exports.search = async function(ctx){
    let kw = ctx.request.query.kw;

    const segment = new Segment();

    segment.useDefault();
    let kws = segment.doSegment(kw);
    let data=[];

    for (let i=0;i<kws.length;i++){
        let item = kws[i].w;
        const res = await good.find({info:{$regex:item}});
        data.push(res);
    }

    ctx.body={
        status:0,
        data:data,
        msg:"that is success"
    };

};

/*
 *@ 注册
 */

exports.register = async function(ctx){
  const {userName,passWord} = ctx.request.body;
  //判断是否存在该用户
  try{
      let res =await user.findOne({userName});
      if(res){
          ctx.body={
              status:0,
              msg:"该用户已存在！",
              data:[]
          }
      }else {
          await user.insertMany({
              userName:userName,
              passWord:passWord,
              avatar:"http://osc9sqdxe.bkt.clouddn.com/defaultAvatar.jpg",
              cartList: [],
              orderList: [],
              addressList: []
          });
          ctx.body = {
              status:0,
              msg:"账号注册成功",
              data:{}
          }
      }
  }catch (err){
      console(err);
      ctx.body = {
          status:1,
          msg:"服务器异常",
          data:{}
      }
  }

};
/*
 *@登录
 */
exports.login = async function (ctx) {
    let {userName,passWord} = ctx.request.body;

    let doc =await user.findOne({userName,passWord});

    try{
        if(doc){
            const { _id,userName,avatar} = doc;
            ctx.cookies.set("userId", _id,{
                path:"/",
                maxAge:3600*60*60
            });

            ctx.body={
                status: '0',
                msg: '登陆成功',
                result: {
                    userName,
                    avatar
                }
            };
        }else {
            ctx.body={
                status: '1',
                msg: '账号或者密码错误',
                result: ''
            }
        }
    }catch (err){
        ctx.body={
            status: '1',
            msg: err.message,
            result: ''
        }
    }
};

/*
 *@ 退出登录
 */

exports.loginOut = async function (ctx) {
    ctx.cookies.set("userId","",{
        path:"/",
        maxAge:-1
    });
    ctx.body = {
        status: "0",
        msg: '',
        result: ''

    }
    };

/*
 *@ 商品详情
 */
exports.productDel = async function (ctx) {
    let productId = ctx.request.query.id;
    console.log(productId);
    if(productId){
      let data =await good.findOne({"id":productId});
      ctx.body = {
          status:0,
          mag:"",
          result:data
      }
    }else {
        ctx.body = {
            status:1,
            msg:"请检查参数",
            result:""
        }
    }
};

/*
 *@ 加入购物车
 */

exports.addCart = async function(ctx) {
    let userId = ctx.cookies.get("userId");

    let productMsg = ctx.request.query; // 必须带productId

    if(userId){ //说明已经登录
        if(productMsg.productId ){

            let data = await user.findOne({"_id":userId});
            let dataMsg = await good.findOne({"id":productMsg.productId});

            let doc = {
                productId:dataMsg.id,
                productImg: dataMsg.l_img,
                productName: dataMsg.info,
                productNum: 1,
                productPrice: dataMsg.price
            };
            if(data){
                let i = data.cartList;
                // 商品是否存在
                let have = false;


                if(data.cartList.length){
                    i.forEach(async function(item){
                        if(item.productId === productMsg.productId){  // 如果数据库里存在该商品就加一
                            item.productNum++;
                            have = true;
                            return;
                        }
                    });
                }


                if (!data.cartList.length || !have) {
                    data.cartList.push(doc);
                }


                await data.save();
                // 保存成功
                ctx.body={
                    status: 0,
                    msg: '加入成功',
                    result: 'suc'
                };

            }
        }else{
            ctx.body = {
                status:1,
                msg:"参数不全",
                result:""
            }
        }
    }else {
        ctx.body = {
            status:1,
            msg:"您未登录",
            result:""
        }
    }
};

/*
 *@ 获取购物车列表
 */

exports.getCarList = async function (ctx) {
    let userId  = ctx.cookies.get("userId");
    console.log(userId);
    if(userId){
       let data =  await  user.findOne({"_id":userId});

        ctx.body = {
            status:0,
            msg:"获取购物车列表成功",
            result: data.cartList
        }
    }else{
        ctx.body = {
            status:1,
            msg:"您还未登录",
            result:""
        }
    }
};


/*
 * @删除购物车
 *
 */
exports.delCar = async function (ctx) {
    let userId = ctx.cookies.get("userId");
    let data = ctx.request.query.productId;
    if(userId){
        if(data.length>0){

            data.forEach(async function(item){
                await user.update({"_id":userId},{
                    $pull:{
                        "cartList":{
                            "productId":item
                        }
                    }
                });

            });
            ctx.body = {
                status:0,
                msg:"成功删除",
                result:""
            }


        }else {
            ctx.body = {
                status: 1,
                msg: "参数不全",
                result: ""
            }
        }
    }else{
        ctx.body= {
            status:1,
            msg:"未登录，没权限操作",
            result:""
        }
    }
};

/*
 * @ 用来测试查询 用户信息
 */

exports.getUsers  = async function(ctx){

    let data =await user.find();
    ctx.body = {
        status:0,
        msg:"成功获取数据",
        result: data
    }
};

/*
 *@ 图形验证码
 */
exports.captcha = async function(ctx){
    const cap = parseInt(Math.random() * 9000 + 1000);
    const p = new captchapng(80, 30, cap);
    p.color(0, 0, 0, 0);
    p.color(80, 80, 80, 255);
    const base64 = p.getBase64();
    //官网少了这一步
    ctx.cookies.set('captcha', cap, {maxAge: 360000, httpOnly: true});
    ctx.status = 200;
    ctx.body = {
        code: 'data:image/png;base64,' + base64
    }
};

/*
 *@ 上传图片
 */
exports.updateAvatar = async function(ctx){
    console.log("进来");
    let useId  = ctx.cookies.get("userId");
    console.log(useId);
    if(useId){
        ctx.body={
            status:0,
            msg:"上传成功",
            type:ctx.req.file.mimetype,
            result:ctx.req.file.filename
        }
    }else{
        ctx.body={
            status:1,
            msg:"您还没登录",
            result:""
        }
    }
};

/*
 *@ 百度地图api
 */

exports.cities = async function (ctx) {
    let param = ctx.request.query;

        let baidu =await request({url: baiDu.locaation, json: true});
        ctx.body= {
            status: 0,
            msg: "获取成功",
            result: baidu.body
        }
};

/*
 * @ 添加地址
 */

exports.addAddress = async function (ctx) {
    let userId = ctx.cookies.get("userId");
    let params = ctx.request.query;
    let defaults = params.default || false;
    if(userId){
        if(params.userName || params.streetName || params.tel){
            let doc =await user.findOne({"_id":userId});
            console.log(doc);
            let addressList = doc.addressList;
            if(defaults){
                addressList.map(function(item){
                    item.default = false;
                });
            }
            doc.addressList.push({
                addressId:Date.parse(new Date()),
                userName:params.userName,
                streetName:params.streetName,
                tel:params.tel,
                default:defaults
            });
            await doc.save();
            ctx.body = {
                status: 0,
                msg: "添加成功",
                result:""
            }
        }else {
            ctx.body = {
                status: 1,
                msg: "参数不全",
                result:""
            }
        }
    }else{
        ctx.body = {
            status: 1,
            msg: "未登录，没有操作权限",
            result:""
        }
    }
};

/*
 * @ 删除地址
 */

exports.delAddress = async function(ctx){
    let userId = ctx.cookies.get("userId");
    let AddressId = ctx.request.query;
    console.log(AddressId.addressId);
    let data = AddressId.addressId.split(",");
    if(userId){
        if(data.length>0){

            data.forEach(async function(item){
              await user.update({"_id":userId},{
                    $pull:{
                        "addressList":{
                            "addressId":item
                        }
                    }
                });

            });
                ctx.body = {
                    status:0,
                    msg:"成功删除",
                    result:""
                }


        }else{
            ctx.body = {
                status:1,
                msg:"参数不全",
                result:""
            }
        }
    }else{
        ctx.body = {
            status:1,
            msg:"未登录，没操作权限",
            result:""
        }
    }
};