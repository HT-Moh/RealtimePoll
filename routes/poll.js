const express = require('express');
const router = express.Router();
const Pusher = require('pusher');
const Vote = require('../models/Vote')

var pusher = new Pusher({
  appId: '471112',
  key: 'e4d438c4862b4333efbd',
  secret: '954a6746813a768bf756',
  cluster: 'eu',
  encrypted: true
});


router.get('/', (req, res) => {
    //res.send('POLL');
    Vote.find().then(votes => res.json({success: true, votes: votes}));
})

router.post('/', (req, res) => {
  const newVote ={
    euteam: req.body.euteam,
    points:1
  }
  new Vote(newVote).save().then(vote => {
    pusher.trigger('os-poll', 'os-vote', {
      points: parseInt(vote.points),
      euteam: vote.euteam
    });
    return res.json({ success: true, message: 'Thank you for voting'});
  });
});
module.exports = router;
