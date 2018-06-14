const mongoose = require("mongoose");
const schema = require("../schema/s_user");
module.exports = mongoose.model("users",schema);