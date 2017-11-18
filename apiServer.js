var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
//var connectionString = require('./config');
var connectionString = process.env.conn;

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Begin: APIs
var mongoose = require('mongoose');

// mLab
mongoose.connect(connectionString);

// local db
//mongoose.connect('mongodb://localhost:27017/bookshop');

var db = mongoose.connection;
db.on('error', console.error.bind(console, '# MongoDB - connection error: '));
// Begin: Set up sessions
app.use(session({
    secret: 'mySecretString',
    saveUninitialized: false,
    resave: false,
    cookie: {maxAge: 1000 * 60 * 60 * 24 * 2}, // 2 days in milliseconds
    store: new MongoStore({mongooseConnection: db, ttl: 2 * 24 * 60 * 60}) // 2 days in seconds
}));

// API to save cart to session obj
app.post('/cart', function(req, res) {
  var cart = req.body;
  req.session.cart = cart;
  req.session.save(function(err) {
    if (err) {
      throw err;
    }

    res.json(req.session.cart);
  });
});

// API to get cart from session obj
app.get('/cart', function(req, res) {
  if (typeof req.session.cart !== 'undefined') {
    res.json(req.session.cart);
  }
});

// End: Set up sessions

var Books = require('./models/books');

// post books api
app.post('/books', function(req, res) {
 var book = req.body;

 Books.create(book, function(err, books) {
   if (err) {
     throw err;
   }

   res.json(books);
 });
});

// Get books api
app.get('/books', function(req, res) {
  Books.find(function(err, books) {
    if (err) {
      throw err;
    }

    res.json(books);
  });
});

// delete books api
app.delete('/books/:_id', function(req, res) {
  var query = {_id: req.params._id};

  Books.remove(query, function(err, books) {
    if (err) {
      throw err;
      //console.log('API Delete Books: ', err);
    }

    res.json(books);
  });
});

// update books api
app.put('/books/:_id', function(req, res) {
  var book = req.body;
  var query = req.params._id;

  // if the field doesn't exist, then $set will create that new field
  var update = {
    '$set': {
      title: book.title,
        description: book.description,
        image: book.image,
        price: book.price
    }
  };

  // true means to return the newly updated document
  var options = {new: true};

  Books.findOneAndUpdate(query, update, options, function(err, books) {
    if (err) {
      throw err;
    }

    res.json(books);
  });
});

// GET book images API
app.get('/images', function (req, res) {
  const imageFolder = __dirname + '/public/images/';
  const fs = require('fs');
  fs.readdir(imageFolder, function(err, files) {
    if (err) {
      return console.error(err);
    }

    const filesArray = [];
    files.forEach(function(file) {
      filesArray.push({name: file});
    });

    res.json(filesArray);
  });
});

// End: APIs

app.listen(3001, function (err) {
    if (err) {
      return console.log(err);
    }

    console.log('API Server is listening on http://localhost:3001');
});
