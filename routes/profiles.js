const mongoose = require('mongoose');
const auth = require('../middlewares/auth');
const { check, validationResult } = require('express-validator');
const { Profile } = require('../models/profile');
const express = require('express');
const router = express.Router();


// GET ** USER PROFILE ** PUBLIC

router.get('/profile/:id', async (req, res) => {

    try {
          const profile = await Profile.findOne({ user: req.params.id });
          if(!profile) {
              return res.status(404).send({
                  msg: "sorry! requested profile doesn't exist"
              })
          }
        
          return res.status(200).send(profile)

    } catch (err) {
        console.log(err.message);
        res.status(500).send({ 
            msg: 'server error!'
        })
    }
});

// GET **GETTING OWN PROFILE** PRIVATE

router.get('/me', auth, async (req, res) => {

    try {
        
          const profile = await Profile.findOne({ user: req.user.id });
          if(!profile) {
              return res.status(404).send({
                  msg: "sorry! requested profile doesn't exist"
              })
          }

        
          return res.status(200).send(profile)


    } catch (err) {
        console.log(err.message);
        res.status(500).send({ 
            msg: 'server error!'
        })
    }
});



// POST **CREATE PROFILE** PRIVATE

router.post('/:id', auth, async (req, res) => {

   try {
    
    let { knowsAbout } = req.body.profileData;
 
    let array = knowsAbout.split(',');
    let newarray = array.map((elem) => elem.trim());

    req.body.profileData = { ...req.body.profileData, knowsAbout: newarray };

    const profileData = req.body.profileData;
    
    const profile = await Profile.findOneAndUpdate(
        { user: req.user.id }, 
        { $set: profileData },
        { new: true, upsert: true }
    );

    res.status(200).json(profile);
   } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
   }


});

// DELETE **DELETE USER PROFILE** PRIVATE

router.delete('/:id', auth, async (req, res) => {

    try {
        // Remove profile
        await Profile.findOneAndRemove({ user: req.user.id });
        // Remove user
        await User.findOneAndRemove({ _id: req.user.id });

        res.json({ msg: 'User deleted' });

    } catch (err) {
        console.log(err.message);
        res.status(500).send({ 
            msg: 'server error!'
        })
    }
})



module.exports = router;