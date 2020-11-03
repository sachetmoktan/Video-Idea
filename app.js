const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const path = require('path');

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
mongoose.connect(db.mongoURI , { useNewUrlParser: true }, {
    useMongoClient: true})
    .then( function() {console.log('MongoDb connected')} )
    .catch( function(err) {console.log(err)} );





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


// Passport-session middleware
app.use(passport.initialize());
  app.use(passport.session());


// Connect-flash middleware
app.use(flash());
// Global Variables
app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg');   //For success
    res.locals.error_msg = req.flash('error_msg');       //For error
    res.locals.error = req.flash('error');             

    
    res.locals.user = req.user || null;   


    next();

});

// Static folders 
app.use(express.static(path.join(__dirname, 'public')));





// Index Route
app.get('/', (req, res) => {
    res.render('index');  
});


// About Route
app.get('/about', (req, res) => {
    res.render('about');
});





// Use Routes
app.use('/ideas', idz);    

app.use('/users', usrz);





const port = process.env.PORT || 5000 ;

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});

