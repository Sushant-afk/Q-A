const mongoose = require('mongoose');
const User = require('./user');

const questionSchema = new mongoose.Schema({
    user: {
        type:  mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    question: {
        type: String,
        required: true
    },
    tags: {
        type: String,
        required: true
    },
    name: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    },
    upvotes: [
        {
          user: {
            type: mongoose.Schema.Types.ObjectId
          }
        }
    ],
    downvotes: [
        {
          user: {
            type: mongoose.Schema.Types.ObjectId
          }
        }
    ],
    answers: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId  
            },
            answer: {
                type: String
            },
            date: {
                type: Date,
                default: Date.now
            },
            name: {
                type: String
            },
            bio: {
                type: String
            },
            upvotes:[
                {
                    user: {
                        type: mongoose.Schema.Types.ObjectId
                    }
                }
            ],
            downvotes: [
                {
                  user: {
                    type: mongoose.Schema.Types.ObjectId
                  }
                }
            ]
        }
    ]
});

const Question = mongoose.model('Qustions', questionSchema);

exports.Question = Question;