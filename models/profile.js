const mongoose = require('mongoose');
const User = require('./user');

const ProfileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    status: {
        type: String
    },
    bio: {
        type: String
    },
    knowsAbout:{
        type: [String]
    },
    location: {
        type: String
    },
    education: {
        type: String
    },
    notifications: {
        type: [String]
    }

});

const Profile = mongoose.model('Profile', ProfileSchema);

exports.Profile = Profile;