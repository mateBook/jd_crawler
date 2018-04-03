const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Mixed = Schema.Types.Mixed;
let schema =new mongoose.Schema({
    id:String,
    info:String,
    price:Mixed,
    s_img:String,
    l_img:String,
    _v:Number,
    src:String,
    detail:{
        s_imge:[String],
        l_image:[String],
        detail_image:[String]
    }
});
module.exports = schema;

