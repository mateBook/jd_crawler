const  mongoose = require("mongoose");
const  Schema = mongoose.Schema;
const Mixed = Schema.Types.Mixed;
let schema = new mongoose.Schema({
    id:String,
    userName:Mixed,
    passWord:Mixed,
    avatar:{
        type:String,
        default:""
    },
    cartList: [
        {
            productId: String,
            productImg: String,
            productName: String,
            productNum: Number,
            productPrice: Number
        }
    ],
    orderList: [],
    addressList: [
        {
            addressId:String,
            userName:String,
            streetName:String,
            tel:String,
            default:Boolean
        }
    ]
});
module.exports = schema;