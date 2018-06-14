const mongoose = require("mongoose");
const schema = require("../schema/m_information");

module.exports = mongoose.model("information",schema);