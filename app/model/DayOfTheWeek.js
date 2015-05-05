

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var DayOfTheWeekSchema   = new Schema({
    day: String,
    count: Number
});

module.exports = mongoose.model('DayOfTheWeek', DayOfTheWeekSchema);
