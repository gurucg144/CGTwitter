
var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var HourOfTheDaySchema   = new Schema({
    hour: Number,
    count: Number
});

module.exports = mongoose.model('HourOfTheDay', HourOfTheDaySchema);