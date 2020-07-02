const mongoose = require('mongoose');
const express = require('express');
const config = require('config');
const auth_route = require('./routes/auth');
const user_route = require('./routes/users');
const profile_route = require('./routes/profiles');
const question_route = require('./routes/questions');
const db = config.get('MONGO_URI');
const path = require('path');

const app = express();


mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...'));

app.use(express.json());
app.use('/api/auth', auth_route);
app.use('/api/users', user_route);
app.use('/api/profile', profile_route);
app.use('/api/question', question_route);


//serve static assets in production

if(process.env.NODE_ENV === 'production')
{
  // set static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', "build", 'index.html'));
  })
}



const port = process.env.PORT || 3900;

app.listen(port, () => console.log(`Listening on port ${port}...`));