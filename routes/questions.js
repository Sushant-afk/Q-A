const mongoose = require('mongoose');
const { User } = require('../models/user');
const { Profile } = require('../models/profile');
const { Question } = require('../models/question');
const { check, validationResult } = require('express-validator');
const auth = require('../middlewares/auth');
const express = require('express');

const router = express.Router();

// POST ** CREATE QUESTION ** AUTH

router.post('/', [
      check('question', 'Invalid entry').trim().not().isEmpty(),
      check('tags', 'Please provide some tags for better experience').not().isEmpty()
    ], 
    auth, 
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
      }

      let { question, tags } = req.body;

      const user = await User.findById(req.user.id).select('-password');

      try {
            question = new Question({
                name: user.name,
                user: req.user.id,
                question,
                tags
            });
            
            const profile = await Profile.findOneAndUpdate(
                { user: req.user.id }, 
                { $push: { notifications: 'You added a question!' }},
                { new: true, upsert: true }
            );
    
            question = await question.save();
            return res.status(200).send(question) 
      } catch (err) {
            console.error(err.message);
            return res.status(500).send('Server Error');
      }
});

// GET ** GET QUESTIONS ** AUTH

router.get('/', auth, async (req, res) => {
   
    
    try {

        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);

        const startIndex = (page-1)*limit;
        const endIndex = page*limit;

        var results = {}
    
        var max = await Question.count();
        // console.log(startIndex, endIndex, max);
        if(endIndex<max)
        {
            results.next = {
                page: page+1,
                limit: limit
            }
        }

        if(startIndex>0)
        {
            results.previous = {
                page: page-1,
                limit: limit
            }
        }

        results.page = page;
        results.totalPages = Math.ceil(max/limit);

        let questions = await Question.find().limit(limit).skip(startIndex).sort({ date: -1 });

         results.questions = questions;
         if(!questions) {
             return res.status(200).send({
                 msg: 'No qustions found'
             })
         }

         return res.status(200).send(results);

    } catch (err) {
             return res.status(500).send({
                 msg: 'server error'
             })
    }
});

// GET ** GET SINGLE QUESTION ** AUTH

router.get('/:id', auth, async (req, res) => {
    try {
         let question = await Question.findOne({ _id: req.params.id });
         if(!question)
         {
             res.status(400).send({
                 msg: 'Sorry! question not found!'
             })
         }
    
         res.status(200).send(question);


    } catch (err) {
        console.log(err);
        res.status(500).send({
            msg: 'server error'
        })
    }
});

// PUT **UPDATE/EDIT THE QUESTION** PRIVATE-AUTH

router.put('/:id', auth, async (req, res) => {
     
    try {
         let question = await Question.findOne({ _id: req.params.id });
        
         if(question.user.toString() !== req.user.id) {
            return res.status(400).send({
                msg: 'sorry! you are not authorised to edit the question.'
            }) 
         }

         question.question = req.body.question

         // DON'T EDITING tAgSSSSSSSSS
         //question.tags = req.body.tags

         await question.save();
         res.status(200).send(question);

    } catch (err) {
        console.log(err);
        return res.status(400).send({
            msg: 'server error!'
        })
    }
}); 

// PUT ** UPVOTE THE QUESTION ** PRIVATE

router.put('/upvote/:id', auth,  async (req, res) => {
    try {
        let question = await Question.findOne({ _id: req.params.id });
        let user = await User.findOne({ _id: req.user.id });
        let name;

        user._id == question.user.toString() ? name = 'You' : name = user.name;
        
        if(!question) {
            res.status(400).send({
                msg: "Question doesn't exist"
            });
        }

        if(question.upvotes.length === 0 && question.downvotes.length === 0)
        {
            question.upvotes.unshift({ user: req.user.id });
            await question.save();
            const profile = await Profile.findOneAndUpdate(
                { user: question.user }, 
                { $push: { notifications: `${name} upvoted your question!` }},
                { new: true, upsert: true }
            );
            return res.status(200).send(question) 
        }

        else if(question.upvotes.some( upvote => upvote.user.toString() === req.user.id) )   // user is in upvote list
        {
           question.upvotes = question.upvotes.filter((upvote) => upvote.user.toString() !== req.user.id );
           await question.save();
           res.status(200).send(question)
        }
        else if(question.downvotes.some( downvote => downvote.user.toString() === req.user.id)) // user is in downvote list
        {
           question.downvotes = question.downvotes.filter((downvote) => downvote.user.toString() !== req.user.id);
           question.upvotes.unshift({ user: req.user.id});
           await question.save();
           const profile = await Profile.findOneAndUpdate(
            { user: question.user }, 
            { $push: { notifications: `${name} upvoted your question!` }},
            { new: true, upsert: true }
           );
           res.status(200).send(question)
        }
        // user neither in upvote nor in downvote list
        else if(!question.upvotes.some( upvote => upvote.user.toString() === req.user.id) && !question.downvotes.some( downvote => downvote.user.toString() === req.user.id))
        {         
          question.upvotes.unshift({ user: req.user.id})
          await question.save();
          const profile = await Profile.findOneAndUpdate(
            { user: question.user }, 
            { $push: { notifications: `${name} upvoted your question!` }},
            { new: true, upsert: true }
          );
          res.status(200).send(question)
        }
   
    } catch (err) {
        console.log(err);
        return res.status(400).send({
            msg: 'server error!'
        }) 
    }
});

// PUT ** DOWNVOTE THE QUESTION ** PRIVATE

router.put('/downvote/:id', auth,  async (req, res) => {
    try {
        let question = await Question.findOne({ _id: req.params.id });
        let user = await User.findOne({ _id: req.user.id });
        let name;

        user._id == question.user.toString() ? name = 'You' : name = user.name;

        if(!question) {
            res.status(400).send({
                msg: "Question doesn't exist"
            });
        }
        if(question.downvotes.length === 0 && question.upvotes.length === 0)
        {
            question.downvotes.unshift({ user: req.user.id });
            await question.save();
            const profile = await Profile.findOneAndUpdate(
                { user: question.user }, 
                { $push: { notifications: `${name} downvoted your question!` }},
                { new: true, upsert: true }
            );
            return res.status(200).send(question) ;
        }

        if(question.upvotes.some( upvote => upvote.user.toString() === req.user.id))    // user in upvote list
        {

           question.upvotes = question.upvotes.filter((upvote) => upvote.user.toString() !== req.user.id );
           question.downvotes.unshift({ user: req.user.id });
           await question.save();
           const profile = await Profile.findOneAndUpdate(
            { user: question.user }, 
            { $push: { notifications: `${name} downvoted your question!` }},
            { new: true, upsert: true }
        );
           res.status(200).send(question)
        }

        else if(question.downvotes.some( downvote => downvote.user.toString() === req.user.id))   // user in downvote list
        {    
           question.downvotes = question.downvotes.filter((downvote) => downvote.user.toString() !== req.user.id );
           await question.save();
           res.status(200).send(question);
        }
        else if(!question.upvotes.some( upvote => upvote.user.toString() === req.user.id) && !question.downvotes.some( downvote => downvote.user.toString() === req.user.id)){
           
          question.downvotes.unshift({ user: req.user.id })
          await question.save();
          const profile = await Profile.findOneAndUpdate(
            { user: question.user }, 
            { $push: { notifications: `${name} downvoted your question!` }},
            { new: true, upsert: true }
        );
          res.status(200).send(question)
        }
        
    } catch (err) {
        console.log(err);
        return res.status(400).send({
            msg: 'server error!'
        }) 
    }
})


// DELETE ** DELETE THE QUESTION ** PRIVATE-AUTH

router.delete('/:id', auth, async (req, res) => {

    try {
        let question = await Question.findOne({ _id: req.params.id });
       
        if(question.user.toString() !== req.user.id) {
           return res.status(400).send({
               msg: 'sorry! you are not authorised to delete the question.'
           }) 
        }

        await question.remove();

        return res.json({ msg: 'Question removed' });

   } catch (err) {
       console.log(err);
       return res.status(400).send({
           msg: 'server error!'
       })
   }
})

// PUT ** ANSWER THE QUESTION ** PRIVATE

router.put('/answer/:id', auth, async (req, res) => {
     try {
      
       let question = await Question.findById(req.params.id);
       let name;

       if(!question) {
           return res.status(400).send({
               msg: "Question doesn't exist"
           })
       }

       const user = await User.findById(req.user.id).select('-password');

       user._id == question.user.toString() ? name = 'You' : name = user.name;
      
       const newAnswer = {
           user: req.user.id,
           name: user.name,
           answer: req.body.answer,
           upvote: [],
           downvotes: []
       }
      
       question.answers.unshift(newAnswer);
      
       await question.save();

       const profile = await Profile.findOneAndUpdate(
          { user: question.user }, 
          { $push: { notifications: `${name} answered your question!` }},
          { new: true, upsert: true }
        );
      
       return res.status(200).send(question)


     } catch (err) {
        console.log(err);
        return res.status(400).send({
            msg: 'server error!'
        }) 
     }
});

// PUT ** UPVOTE THE ANSWERS ** PRIVATE

  // ******** NO NEED TO INCLUDE /answer IN PATH BUT STILL GIVEN *********

router.put('/answer/upvote/:ques_id/:ans_id', auth, async (req, res) => {
      
    try {
        let question = await Question.findOne({_id: req.params.ques_id });
        let user = await User.findOne({ _id: req.user.id });
        let name;
        if(!question)
        {
            return res.status(400).send({
                msg: 'Not found!'
            });
        }
   
        let answer = question.answers.find((ans) => ans._id.toString() === req.params.ans_id);
        if(!answer) return res.status(400).send({
               msg: 'Not found!'
        });

        user._id == answer.user.toString() ? name = 'You' : name = user.name;
       
         if(answer.upvotes.length === 0 && answer.downvotes.length === 0)
         {
            answer.upvotes.unshift({ user:req.user.id });
            question.save();
            const profile = await Profile.findOneAndUpdate(
            { user: answer.user }, 
            { $push: { notifications: `${name} upvoted your answer!` }},
            { new: true, upsert: true }
          );
           return res.status(200).send(question);
         }
   
         else if(answer.upvotes.some( upvote => upvote.user.toString() === req.user.id))
         {
           answer.upvotes = answer.upvotes.filter((upvote) => upvote.user.toString() !== req.user.id);
           await question.save();
           return res.status(200).send(question)
         }
         else if(answer.downvotes.some( downvote => downvote.user.toString() === req.user.id))
         {
           answer.downvotes = answer.downvotes.filter((downvote) => downvote.user.toString() !== req.user.id);
           answer.upvotes.unshift({ user: req.user.id});
           await question.save();
           const profile = await Profile.findOneAndUpdate(
            { user: answer.user }, 
            { $push: { notifications: `${name} upvoted your answer!` }},
            { new: true, upsert: true }
          );
           return res.status(200).send(question) 
         }
         else if(!answer.upvotes.some( upvote => upvote.user.toString() === req.user.id) && !answer.downvotes.some( downvote => downvote.user.toString() === req.user.id))
        {   
          answer.upvotes.unshift({ user: req.user.id})
          await question.save();
          const profile = await Profile.findOneAndUpdate(
            { user: answer.user }, 
            { $push: { notifications: `${name} upvoted your answer!` }},
            { new: true, upsert: true }
          );
          return res.status(200).send(question)
        }
        else {
            return res.status(404).send({
                msg: 'error bro!'
            })
         }
    } catch (err) {
        console.log(err);
        res.status(500).send({
            msg: 'server error'
        })
    }

});

// PUT ** DOWNVOTE THE ANSWERS ** PRIVATE

router.put('/answer/downvote/:ques_id/:ans_id', auth, async (req, res) => {
    try {
     let question = await Question.findOne({_id: req.params.ques_id });
     let user = await User.findOne({ _id: req.user.id });
     let name;

     if(!question)
     {
         return res.status(400).send({
             msg: 'Not found!'
         });
     }

     let answer = question.answers.find((ans) => ans._id.toString() === req.params.ans_id );
     if(!answer) return res.status(400).send({
            msg: 'Not found!!'
        });

     user._id == answer.user.toString() ? name = 'You' : name = user.name;   
    
      if(answer.downvotes.length === 0 && answer.upvotes.length === 0)
      {
        answer.downvotes.unshift({ user:req.user.id });
        question.save();
        const profile = await Profile.findOneAndUpdate(
        { user: answer.user }, 
        { $push: { notifications: `${name} downvoted your answer!` }},
        { new: true, upsert: true }
        );
        return res.status(200).send(question);
      }

      else if(answer.downvotes.some( downvote => downvote.user.toString() === req.user.id))
      {
        answer.downvotes = answer.downvotes.filter((downvote) => downvote.user.toString() !== req.user.id);
        await question.save();
        return res.status(200).send(question)
      }
      else if(answer.upvotes.some( upvote => upvote.user.toString() === req.user.id))
      {
        answer.upvotes = answer.upvotes.filter((upvote) => upvote.user.toString() !== req.user.id);
        answer.downvotes.unshift({ user: req.user.id});
        await question.save();
        const profile = await Profile.findOneAndUpdate(
        { user: answer.user }, 
        { $push: { notifications: `${name} downvoted your answer!` }},
        { new: true, upsert: true }
        );
        return res.status(200).send(question) 
      }
      else if(!answer.upvotes.some( upvote => upvote.user.toString() === req.user.id) && !answer.downvotes.some( downvote => downvote.user.toString() === req.user.id))
     {   
       answer.downvotes.unshift({ user: req.user.id})
       await question.save();
       const profile = await Profile.findOneAndUpdate(
        { user: answer.user }, 
        { $push: { notifications: `${name} downvoted your answer!` }},
        { new: true, upsert: true }
       );
       return res.status(200).send(question)
     }
     else {
        return res.status(400).send({
            msg: 'error bro!'
        })
     }
    } catch (err) {
        console.log(err);
        res.status(500).send({
            msg: 'server error'
        })
    }
});

// EDIT THE ANSWER

router.put('/answer/:ques_id/:ans_id', auth, async (req, res) => {

   try
    {
        let question = await Question.findOne({_id: req.params.ques_id });

        if(!question)
        {
            return res.status(400).send({
                msg: 'Not found!'
            });
        }

        let answer = question.answers.find((ans) => ans._id.toString() === req.params.ans_id );
        if(!answer) return res.status(400).send({
            msg: 'Not found!!'
        });
    
        answer.answer = req.body.answer;
        await question.save();


        // SENDING ENTIRE QUESTION DOCUMENT ---- NOT A GOOD IDEA


        return res.status(200).send(question);
    }
    catch (err) {
        console.log(err);
        res.status(500).send({
            msg: 'server error'
        })
    }

});

// DELETE ** DELETE THE ANSWER ** PRIVATE

router.delete('/answer/:ques_id/:ans_id', auth, async (req, res) => {

    try {
        let question = await Question.findOne({_id: req.params.ques_id });

        if(!question)
        {
            return res.status(400).send({
                msg: 'Not found!'
            });
        }

        let answer = question.answers.find((ans) => ans._id.toString() === req.params.ans_id );
        if(!answer) return res.status(400).send({
            msg: 'Not found!!'
        });
        // console.log(question.answers);
        // question.answers.pop(answer);
        question.answers = question.answers.filter((ans) => ans._id.toString() !=  req.params.ans_id);
        // console.log(question.answers);
        await question.save()
        return res.status(200).send(question);

   } catch (err) {
       console.log(err);
       return res.status(400).send({
           msg: 'server error!'
       })
   }
})

module.exports = router;