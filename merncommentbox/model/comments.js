'use srict';

//import the dependencies
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//create new instance of mongoose.schema
var CommentsSchema = new Schema({
    author: String,
    text: String,
    comment: String,
})

//export it so it can be used in Server.js
module.exports = mongoose.model('Comment', CommentsSchema);