const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const body_parser = require('body-parser');
const mongoose = require('mongoose');
const dotnet = require('dotenv');


const keyConfig = require('./config/key');

//MiddleWare 

const verify_token = require('./middleware/verify-token');



//Router
const booksRouter  = require('./routes/bookRoute');
const usersRouter  = require('./routes/userRoute');
const authorRouter = require('./routes/authorRoute');


const app = express();

dotnet.config()
// view engine setup

//Config
app.set('api_webToken_key' , keyConfig.api_webToken_key);


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(body_parser.json());


mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/yorumladatabase' ,{ useNewUrlParser: true } , { useUnifiedTopology: true })
    .then(() => {
        console.log('Mongo db bağlantısı gerçekleşti.')
    })
    .catch((err) => {
      console.log('Hata gerçekleşti')
    });

app.use('/users',usersRouter);
app.use('/api' , verify_token);
app.use('/api/books',booksRouter);
app.use('/api/author' , authorRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
const port = process.env.PORT || 4000;

app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
//app.listen(port);


module.exports = app;
