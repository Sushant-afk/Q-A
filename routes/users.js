const express = require('express');
const mongoose = require('mongoose')
const bcrypt = require('bcrypt');
const { check, validationResult } = require('express-validator');
const { User } = require('../models/user');
const config = require('config');
const jwt = require('jsonwebtoken')

const router = express.Router();
// GET *GETING USERS LIST* PRIVATE

router.get('/', async (req, res) => {

   try {
         const users = await User.find();
         if(!users){
           return res.status(200).json({
             msg: 'No users registerd yet'
           })
         }

         return res.status(200).json({
           users
         })

   } catch (err) {
      return res.status(500).json({
        msg: 'server error!'
      })
   }
})


// POST *REGISTERING USERS* PUBLIC

router.post('/',[

  check('name', 'Give a valid name').trim().not().isEmpty(),
  check('email', 'Email is invalid').isEmail(),
  check('password', 'Password length must be atleast 6 characters long').isLength({ min : 6 })

  ], async (req, res) => {
     
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
        
        let user =await User.findOne({ email: email });
        if(user) {
           return res.status(400).json({
             msg: 'This email is not available for registration'
           })
        }

        user = new User({
          name,
          email,
          password
        });

        let salt = await bcrypt.genSalt(10);
        
        user.password = await bcrypt.hash(password, salt);        

        await user.save();
        
        const payload = {
          user: {
            id: user.id
          }
        }

        jwt.sign(
          payload,
          config.get('jwtSecret'),
          (err, token) => {
            if (err) throw err;
            return res.status(200).json({ token });
          }
        );

    } catch (err) {
      console.error(err.message);
      return res.status(500).send('Server Error');
    }

});



module.exports = router;