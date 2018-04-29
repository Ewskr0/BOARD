let express = require('express')
let User = require('../models/user')
let router = express.Router()
let passport = require('passport')
let bodyParser = require("body-parser")
let sha1 = require('sha1')

router.use(bodyParser.urlencoded({
  extended: false
}))
router.use(bodyParser.json())

//auth login
router.get('/login', (req, res) => {
  res.render('pages/auth/login', {
    success: "",
    error: ""
  })
})

router.get('/login/failure', (req, res) => {
  res.render('pages/auth/login', {
    success: '',
    error: "Email ou mot de passe incorrect"
  })
})

router.post('/login', passport.authenticate('local', {
  failureRedirect: '/auth/login/failure'
}), function(req, res) {
  res.redirect('/board')
})
router.post('/login/failure', passport.authenticate('local', {
  failureRedirect: '/auth/login/failure'
}), function(req, res) {
  res.redirect('/board')
})

//auth Register
router.get('/register', (req, res) => {
  res.render('pages/auth/register', {
    error: ''
  })
})

router.post('/register', (req, res) => {
  let user = req.body
  let error = ''
  if (!user || Object.keys(user).length !== 7) {
    res.render('pages/auth/register', {
      error: 'Formulaire incorrect'
    })
  } else if (user.username.length < 2 || !/^[a-zA-Z0-9]+([a-zA-Z0-9](_|-| )[a-zA-Z0-9])*[a-zA-Z0-9]*$/.test(user.username)) {
      error = 'le nom d\'utilsateur est incorrect'
  } else if (user.lastname.length < 2 || !/^[a-zA-Z0-9]+([a-zA-Z0-9](_|-| )[a-zA-Z0-9])*[a-zA-Z0-9]*$/.test(user.lastname)) {
      error = 'le nom  est incorrect'
  } else if (user.firstname.length < 2 || !/^[a-zA-Z0-9]+([a-zA-Z0-9](_|-| )[a-zA-Z0-9])*[a-zA-Z0-9]*$/.test(user.firstname)) {
      error = 'le prénom est incorrect'
  } else if (user.password !== user.password2 || user.password.length < 8) {
      error = 'les mots de passe ne correspondent pas'
  } else if (user.email !== user.email2 || !user.email.match(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i)) {
      error: 'les mots de passe ne correspondent pas'
  } else {
    User.findOne({
      email: user.email
    }).then((email) => {
      if (email) {
          error = 'Email non disponible'
      } else {

        new User({
          firstname: user.firstname,
          lastname: user.lastname,
          email: user.email,
          password: sha1(user.password),
          about: "",
          hobbies: "",
          skills: [''],
          soundcloud: "",
          avatarurl: "/assets/images/avatarBoy.png",
          username: user.username,
          googleid: "",

        }).save().then((newUser) => {
          console.log('new user created ' + newUser)


        })


      }
    })
  }

  res.render("pages/auth/register", {
    success: "",
    error: error
  })

})


//auth logout
router.get('/logout', (req, res) => {
  //handle with passport
  req.logout()
  res.redirect("/")
})

//auth with google
router.get('/google', passport.authenticate('google', {
  scope: ['profile']
}))

router.get('/google/redirect', passport.authenticate('google'), (req, res) => {
  res.redirect('/board')
})

module.exports = router
