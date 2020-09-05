const express = require('express');
const router = express.Router();
const passport = require('passport');

const controller = require('../../controllers/analytics/analytics.controller');

router.get(
  '/overview',
  controller.overview,
  passport.authenticate('jwt', {session: false})
);
router.get(
  '/analytics',
  controller.analytic,
  passport.authenticate('jwt', {session: false})
);

module.exports = router;
