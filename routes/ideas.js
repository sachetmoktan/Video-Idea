const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');

const {ensureAuthenticated} = require('../helpers/auth');



// Load Idea Model
require('../models/Idea');
const Idea = mongoose.model('ideas');







// Idea Index Route
router.get('/', ensureAuthenticated, (req, res) => {
    Idea.find({user: req.user.id}).lean()    //Take Idea model and use find
        .sort({date:'desc'})    //we will sort data by date in descending order.
        .then(ideas => {   
            res.render('ideas/index', {ideas:ideas});
        });
});


// Add Idea Form
router.get('/add', ensureAuthenticated, (req, res) => {
    res.render('ideas/add');
});
// Process form
router.post('/', ensureAuthenticated, (req, res) => {
    
    let errors = [];

    if(!req.body.title) {
        errors.push( { text:'Please add a title' } );
    }
    if(!req.body.details) {
        errors.push( { text:'Please add some details' } );
    }

    if(errors.length > 0) {
        res.render('ideas/add', { errors:errors, title:req.body.title, details:req.body.details  });
    }
    else {
        // res.send('passed');
        var newUser = {
            title: req.body.title, 
            details: req.body.details,
            user: req.user.id
        }
        new Idea(newUser).save() //Idea comes from model  To save in database.
                         .then( function(idea) {                          //Promise
                            req.flash('success_msg', 'Video Idea added');
                             res.redirect('/ideas');              //Returning promise i.e. idea
                         })
    }
});


// Edit Idea Form
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
    Idea.findOne({
        _id: req.params.id
    }).lean()
      .then(idea => {
        if(idea.user != req.user.id) {   
            req.flash('error_msg', 'Not Authorized ...');
            res.redirect('/ideas');
        }
        else {
            res.render('ideas/edit', {idea:idea});  
        }
        
      });
});
// Edit Form Process
router.put('/:id', ensureAuthenticated, (req, res) => {
    Idea.findOne({
        _id: req.params.id
    })
      .then(ida => {
        //   new values
            ida.title= req.body.title;
            ida.details= req.body.details;
        
        ida.save()
                .then ( ida => {
                    res.redirect('/ideas'); 
                 }) 
      })
      .catch( function(err) {console.log(err)} );
});


// Delete Idea
router.delete('/:id', ensureAuthenticated, (req, res) => {
    Idea.remove({
        _id: req.params.id
    }).lean()
      .then(idea => {
        req.flash('error_msg', 'Video Idea removed');
        res.redirect('/ideas');  
      });
});







module.exports = router;