const mongoose = require("mongoose");
const schema = require("../schema/51job_detail")

module.exports = mongoose.model("job_detail",schema)