const mongoose = require("mongoose");
const good = require("../model/m_goods");
const Segment = require("segment");

exports.goods = async function(ctx){
    let pageSize = parseInt(ctx.request.query.pageSize);
    let page = ctx.request.query.page;
    let skip = (page-1)*pageSize;

    const data = await good.find().sort({"salePrice":1}).skip(skip).limit(pageSize);
    let count = await good.find().count();

    let res={
        count:count,
        status:0,
        data:data,
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