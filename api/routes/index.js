const express = require("express");
const router = express.Router();
const User = require('../models/User')
const passport = require('passport')

/*
  ALL YOUR ROUTES HERE!
*/

const checkAuth = (req, res, next)=> {
  if(req.isAuthenticated()) {
  console.log('esta autenticado!!', req.isAuthenticated)
  console.log('req.user', req.user.dataValues.email)
    return next();
  }

  console.log('User is not authenticated');
  res.redirect('/');
}


router.post('/register', (req, res, next) => {
  const {email, password} = req.body;
  User.create(req.body)
  .then(user => {
    console.log("Nuevo usuario creado", user.dataValues);
    res.status(201).send(user)});
});


router.post('/login', passport.authenticate("local"), (req, res)=> {
  res.send(req.user)
})

router.get('/secret', (req, res) => {
  if(req.user) {
    res.send("cake.jpg")
  } else {
    res.sendStatus(401);
  }
});

router.post('/logout', (req, res)=> {
  req.logOut();
  res.sendStatus(200);
})

router.get('/me', (req,res)=> {
  if(!req.user) {
    return res.sendStatus(401);
  }

  res.send(req.user)
})


router.get('/dashboard', checkAuth, (req, res) => {
  res.send(`Welcome to your admin panel ${req.user.dataValues.email}`)
})




// Don´t modify this route, keep it at the bottom.
router.use("/", function (req, res) {
  res.sendStatus(404);
});



module.exports = router;
