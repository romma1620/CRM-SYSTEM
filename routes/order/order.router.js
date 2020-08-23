const passport = require('passport');

const express = require('express');
const orderRouter = express.Router();

const controller = require('../../controllers/order/order.controller');

orderRouter.post(
  '/',
  passport.authenticate('jwt', {session: false}),
  controller.getAll);

orderRouter.get(
  '/',
  passport.authenticate('jwt', {session: false}),
  controller.create
);

module.exports = orderRouter;
