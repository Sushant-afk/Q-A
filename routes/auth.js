const express = require('express');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const { User } = require('../models/user');
const auth = require('../middlewares/auth');
const jwt = require('jsonwebtoken');
const config = require('config');

const router = express.Router();

router.get('/', auth, async (req, res) => {
    
    try {
        const user = await User.findOne({ _id: req.user.id }).select('-password');
      //  console.log(user);
        return res.json(user);
    } catch (error) {
        return res.status(400).send('server error');  
    }
});

router.post('/', async (req, res) => {
    const { email, password } = req.body;
    try {
 
        let user = await User.findOne({ email:email });
        console.log('here in routes')
    
        if(!user){
            return res.status(400).json({
                errors: [{ msg: 'Invalid Credentials' }] 
            })
        }

        const userMatched = await bcrypt.compare(password, user.password);

        if(!userMatched)
        {
            return res.status(401).json({
                errors: [{ msg: 'Invalid Credentials' }] 
            })
        }
        const payload = {
            user: {
              id: user.id
            }
          };
    
          jwt.sign(
            payload,
            config.get('jwtSecret'),
            { expiresIn: 360000 },
            (err, token) => {
              if (err) throw err;
              res.json({ token });
            }
          );


    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
})

module.exports = router;