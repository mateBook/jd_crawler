const Schema = require("../schema/schema.js");
const mongoose = require("mongoose");

const Movie = mongoose.model('jd',Schema);

module.exports = Movie;