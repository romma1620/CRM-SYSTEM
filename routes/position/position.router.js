const passport = require('passport');

const express = require('express');
const positionRouter = express.Router();

const controller = require('../../controllers/position/position.controller');

positionRouter.get(
  '/:categoryId',
  passport.authenticate('jwt', {session: false}),
  controller.getByCategoryId);
positionRouter.post(
  '/',
  passport.authenticate('jwt', {session: false}),
  controller.create);
positionRouter.patch(
  '/:id',
  passport.authenticate('jwt', {session: false}),
  controller.update);
positionRouter.delete(
  '/:id',
  passport.authenticate('jwt', {session: false}),
  controller.remove);

module.exports = positionRouter;
