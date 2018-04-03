const mongoose = require("mongoose");
const schema = require("../schema/s_goods");
module.exports = mongoose.model("jds",schema);