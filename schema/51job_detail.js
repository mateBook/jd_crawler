const mongoose = require("mongoose");
const Schema = mongoose.Scheme;
// const Mixed = Schema.Types.Mixed;

const schema =new mongoose.Schema({
    title:String,
    yq:String,
    fl:String,
    gw:String
});

module.exports = schema;