const mongoose = require("mongoose");
const Schema = mongoose.Scheme;


const schema =new mongoose.Schema({
    url:String,
    title:String,
    company:String,
    wage:String,
    target:String
});

module.exports = schema