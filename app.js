const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const path = require('path'); //For public to access   vitra ko images and css

const passport = require('passport');


const app = express();



// Load Routes
const idz = require('./routes/ideas');

const usrz = require('./routes/users');




// Passport COnfig loading
require('./config/passport')(passport);


// DB config loading
const db = require('./config/database');






// Map global promise - get rid of warning
mongoose.Promise = global.Promise;
// Connect to mongoose
mongoose.connect(db.mongoURI, { useNewUrlParser: true }, {
    useMongoClient: true})
    .then( function() {console.log('MongoDb connected')} )      //Promise
    .catch( function(err) {console.log(err)} );






// Middlewares--------------------------------------------------------------------------------------->

// Handlebars Middleware
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');




// Body Parser middleware
app.use(bodyParser.urlencoded({extended: false }))
app.use(bodyParser.json());




//Method Override Middleware 
app.use(methodOverride('_method'))



// Express-session middleware
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

// Use this middleware of Passport after Express-session middleware. Always.
// Passport-session middleware
app.use(passport.initialize());
  app.use(passport.session());


// Connect-flash middleware
app.use(flash());
// Global Variables
app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg');   //For success
    res.locals.error_msg = req.flash('error_msg');       //For error
    res.locals.error = req.flash('error');               //Actually for passport.User not found. Password incorrect

    // When you are logged in you have access to request object called user. What I like to do is create a global variable for that object and then we can use it anywhere. we can use it in the template and you can say if there is user(logged in): hide login and register. if there is no user logged in hide video ideas and ideas
    res.locals.user = req.user || null;   //(req.user(if logged in by user)   OR   null(if its not there))


    next();

});//To output msg or error. create a partial for that.  _msg.handlebars

// Static folders     i.e. public folder vitra ko images and css
app.use(express.static(path.join(__dirname, 'public')));   //Public folder is express static folder


// Middlewares ends---------------------------------------------------------------------------------->



// Index Route
app.get('/', (req, res) => {
    res.render('index');  
});


// About Route
app.get('/about', (req, res) => {
    res.render('about');
});





// Use Routes
app.use('/ideas', idz);     // /ideas for initial route. And idz for the ideas.js file inside router 

app.use('/users', usrz);





const port = process.env.PORT || 5000 ;

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});

