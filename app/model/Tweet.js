
var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var TweetSchema   = new Schema({
    id: { type: String, unique: true } ,
    text: { type: String },
    date: Date
});

module.exports = mongoose.model('Tweet', TweetSchema);