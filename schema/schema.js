const mongoose = require("mongoose");
const schema = mongoose.Schema;
const Mixed = schema.Types.Mixed;
const Schema =new mongoose.Schema({
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
Schema.statics = {
    fetch:function(data){
        return this
            .insert(data)
            .exec()
    }
};


module.exports =Schema;