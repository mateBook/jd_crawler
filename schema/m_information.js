const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Mixed = Schema.Types.Mixed;

let scheme =new mongoose.Schema({
    url:String,
    img:String,
    title:String,
    brief:String,
    praise: {
        sum:{
            type: Number,
            default: 0
        },
        suData: Array,
    },
    detail:{
        title:String,
        content:String
    },
    views:{
      type:Number,
      default:0
    },
    comments:[
        {
            userId:String,
            userMessage:{
                userName:String,
                avatar:String,
            },
            fatherId:String,
            content:String,
            toWho:String,
            createTime:Date,
            son:[
                {
                    userId:String,
                    userMessage:{
                        userName:String,
                        avatar:String,
                    },
                    fatherId:String,
                    content:String,
                    toWho:String,
                    createTime:Date
                }
            ]
        }
    ],
    meta:{
        createTime:{
            type:Date,
            default:Date.now()
        },
        updateTime:{
            type:Date,
            default:Date.now()
        }
    }
});

scheme.pre("save",function(next){
    if(this.isNew){
        this.meta.createTime = Date.now();
        this.meta.updateTime = Date.now();
    }else {
        this.meta.updateTime = Date.now();
    }
    next();
});

module.exports = scheme;