const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const cors = require('cors');

const userRouter = require('./routes/userRouter');
const tourRouter = require('./routes/tourRouter');
const viewRouter = require('./routes/viewRouter');
const orderRouter = require('./routes/orderRouter');
const orderController = require('./controllers/orderController');
const globalErrorHandler = require('./controllers/errorController');

const app = express();

app.use(cors());

// To make express understand which one is the static folder loction

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

app.post(
  '/webhook',
  bodyParser.raw({ type: 'application/json' }),
  orderController.webhookCheckout
);

app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// CORS handling
app.use(function (req, res, next) {
  /*var err = new Error('Not Found');
   err.status = 404;
   next(err);*/

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Request methods you wish to allow
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, OPTIONS, PUT, PATCH, DELETE'
  );

  // Request headers you wish to allow
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,X-Access-Token,XKey,Authorization'
  );

  //  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

  // Pass to next layer of middleware
  next();
});

app.use(compression());

app.use('/', viewRouter);
app.use('/api/v2/users', userRouter);
app.use('/api/v2/tours', tourRouter);
app.use('/api/v2/orders', orderRouter);

app.use(globalErrorHandler);

module.exports = app;
