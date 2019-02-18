'use strict'

//these are the dependencies
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
var Comment = require('./model/comments')

//now we need some instances
var app = express();
var router = express.Router();

//set up the port
var port = process.env.API_PORT || 3001

//db config
mongoose.connect('mongodb://testUser:password01@ds147118.mlab.com:47118/comments')

//configure the API to look for the body parser and JSON data in the request body
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//to prevent errors, from cross origin resource sharing, set the headers to allow cors with middleware
app.use(function(req,res,next){
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods','GET,HEAD,OPTIONS,POST,PUT,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin, Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');


//remove the caching so we can get most recent commments
res.setHeader('Cache-Control', 'no-cache');
next();

});

//set route path and get the API
router.get('/', function(req,res){
res.json({message: 'API is initiliazed!'});
});

//adding the /comments route to our api router
router.route('/comments')
.get(function(req,res){
    Comment.find(function(err, comments) {
        if (err)
        res.send(err);
        res.json(comments)
    });
})
//post a new comment to the database
.post(function(req,res){
    var comment = new Comment();
    //body parser lets use the req.body
    comment.author = req.body.author;
    comment.text = req.body.text;

    comment.save(function(err) {
        if (err)
        res.send(err);
        res.json({message: 'Comment Successfully Added'})
    })
})

//adding a route to a specific comment based on the DBID
router.route('/comments/:comment_id')
//put mtehod gives us he chance to update our comment based on the id
.put(function(req,res) {
    Comment.findById(req.params.comment_id, function(err, comment) {
        if (err)
        res.send(err)
        //setting the enw aithor and text to whatever was changed. if nothing is chanedd we will not alter the field
        (req.body.author) ? comment.author = req.body.author : null;
        (req.body.text) ? comment.text = req.body.text : null;
        //save comment
        comment.save(function(err) {
            if (err)
            res.send(err)
            res.json({ message: 'Comment has been updated' })
        })
    })
})
        //delete method
.delete(function(req, res) {
    Comment.remove({ _id: req.params.comment_id }, function(err, comment) {
        if (err)
        res.send(err)
        res.json({ message: 'Comment has been deleted' })
    })
})

//use the router config when the api is called
app.use('/api', router);

//start server and listen
app.listen(port, function() {
    console.log(`api running on port ${port}`);
});
