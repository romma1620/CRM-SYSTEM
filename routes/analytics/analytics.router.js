const express = require('express');
const router = express.Router();
const passport = require('passport');

const controller = require('../../controllers/analytics/analytics.controller');

router.get(
  '/overview',
  passport.authenticate('jwt', {session: false}),
  controller.overview
);
router.get(
  '/analytics',
  passport.authenticate('jwt', {session: false}),
  controller.analytic
);

module.exports = router;
