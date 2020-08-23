const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const {keys} = require('../../config');
const {errorHandler} = require('../../errors');
const User = require('../../models/User');

module.exports = {
  login: async (req, res) => {
    const candidate = await User.findOne({
      email: req.body.email
    });
    if (candidate){
      const passwordResult = bcrypt.compareSync(req.body.password, candidate.password);
      if (passwordResult){

        const token = jwt.sign({
          email: candidate.email,
          userId: candidate._id
        }, keys.JWT, {expiresIn: 60 * 60});

        res.status(200).json({
          token: `Bearer ${token}`
        });

      } else {
        res.status(401).json({
          message: 'Wrong password'
        });
      }

    } else {
      res.status(404).json({
        message: 'User not found'
      });
    }

  },

  register: async (req, res) => {
    const candidate = await User.findOne({
      email: req.body.email
    });

    if (candidate) {
      res.status(409).json({
        message: 'User has been created.'
      });
    } else {
      const salt = bcrypt.genSaltSync(10);
      const password = req.body.password;

      const user = new User({
        email: req.body.email,
        password: bcrypt.hashSync(password, salt)
      });
      try {
        await user.save();
        res.status(201).json(user);
      } catch (e) {
        errorHandler(res, e);

      }
    }
  }

};
