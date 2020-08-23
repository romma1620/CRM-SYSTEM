const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const morgan = require('morgan');
const passport = require('passport');

const {keys} = require('./config');
const {authRoutes, analyticsRoutes, categoryRoutes, orderRoutes, positionRoutes} = require('./routes');

const app = express();
mongoose.connect(keys.mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(()=>console.log('MongoDB connected'))
  .catch((error) => console.log(error));

app.use(passport.initialize());
require('./middleware/passport/passport.middleware')(passport);

app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors());

app.use('/api/auth', authRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/category', categoryRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/position', positionRoutes);

module.exports = app;
