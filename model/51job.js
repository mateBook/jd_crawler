const mongoose = require("mongoose");
const schema = require("../schema/51job")

module.exports = mongoose.model("job_list",schema)