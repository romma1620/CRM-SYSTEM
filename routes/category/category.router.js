const express = require('express');
const categoryRouter = express.Router();
const passport = require('passport');

const controller = require('../../controllers/category/category.controller');
const {category} = require('../../middleware');

categoryRouter.get(
  '/',
  passport.authenticate('jwt', {session: false}),
  controller.getAll
);
categoryRouter.get(
  '/:id',
  passport.authenticate('jwt', {session: false}),
  controller.getById
);

categoryRouter.delete(
  '/:id',
  passport.authenticate('jwt', {session: false}),
  controller.remove
);

categoryRouter.post('/',
  passport.authenticate('jwt', {session: false}),
  category.uploadMiddleware.single('image'),
  controller.create
);
categoryRouter.patch(
  '/:id',
  passport.authenticate('jwt', {session: false}),
  category.uploadMiddleware.single('image'),
  controller.update
);

module.exports = categoryRouter;
