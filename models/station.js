var mongoose = require("mongoose");

//define Mongoose schema
var StationSchema = new mongoose.Schema({
  number: {
    type: String,
    index: true
  },
  name: {
    type: String,
    index: true
  },
  x: {
    type: String,
    index: false
  },
  y: {
    type: String,
    index: false
  }
});

//instantiate mongoose model from schema
var Station = mongoose.model('Station', StationSchema);

//export model
module.exports = {
  Station : Station
}
