let express = require('express')
let User = require('../models/user')
let router = express.Router()
let passport = require('passport')
let bodyParser = require("body-parser")
let sha1 = require('sha1')

router.use(bodyParser.urlencoded({extended : false}))
router.use(bodyParser.json())

//auth login
router.get('/login', (req, res) => {
  res.render('pages/auth/login',{msg: ""})
})

router.post('/login', passport.authenticate('local', {failureRedirect: '/auth/login'}), function (req, res) {
  res.redirect('/board')
})

//auth Register
router.get('/register', (req, res) => {
  res.render('pages/auth/register',{error : ''})
})

router.post('/register', function (req, res) {
  let user = req.body
  if(!user || Object.keys(user).length !== 7){
    res.render('pages/auth/register',{error : 'Formulaire incorrect'})
}
  else if(user.username.length < 2 || !/^[a-zA-Z0-9]+([a-zA-Z0-9](_|-| )[a-zA-Z0-9])*[a-zA-Z0-9]*$/.test(user.username)){
    res.render('pages/auth/register',{error : 'le nom d\'utilsateur est incorrect'})
}
else if(user.lastname.length < 2 || !/^[a-zA-Z0-9]+([a-zA-Z0-9](_|-| )[a-zA-Z0-9])*[a-zA-Z0-9]*$/.test(user.lastname)){
  res.render('pages/auth/register',{error : 'le nom  est incorrect'})
}
else if(user.firstname.length < 2 || !/^[a-zA-Z0-9]+([a-zA-Z0-9](_|-| )[a-zA-Z0-9])*[a-zA-Z0-9]*$/.test(user.firstname)){
  res.render('pages/auth/register',{error : 'le prénom est incorrect'})
}
  else if(user.password !== user.password2 || user.password.length < 8){
    res.render('pages/auth/register',{error : 'les mots de passe ne correspondent pas'})
}
else if(user.password !== user.password2 || user.password.length < 8){
  res.render('pages/auth/register',{error : 'les mots de passe ne correspondent pas'})
}
else if(user.email !== user.email2 || !user.email.match(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i)){
  res.render('pages/auth/register',{error : 'les mots de passe ne correspondent pas'})
}
else{
  User.findOne({email:user.email}).then( (email) => {
          if (email) {
            res.render('pages/auth/register',{error : 'Email non disponible'})
          }else{
            User.findOne({username:user.username}).then((username) => {
              if(username){
                res.render('pages/auth/register',{error : 'Username non disponible'})
              }
              else{
                        new User({
                          firstname: user.firstname,
                          lastname: user.lastname,
                          email: user.email,
                          password: sha1(user.password),
                          about:"",
                          hobbies: "",
                          skills: ['none'],
                          soundcloud: "",
                          avatarurl: "",
                          username: user.username,
                          googleid: "",

                        }).save().then((newUser) => {
                          console.log('new user created ' + newUser)
                          res.render("/auth/login", {msg: "le compte a bien été crée"})
                        })
              }
            })
          }
        })
      }
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
