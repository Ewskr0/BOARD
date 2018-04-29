let router = require('express').Router()
let User = require('../models/user')
let sha1 = require('sha1')


let authCheck = (req, res, next) => {
  if (!req.user) {
    res.redirect('/auth/login')
  } else {
    next()
  }
}

router.get('/', authCheck, (req, res) => {
  res.render('pages/board', {
    user: req.user
  })
})

router.get('/profile', authCheck, (req, res) => {
  res.render('pages/board-profile', {
    user: req.user
  })
})

router.post('/profile', (req, res) => {
      let error = ''
      //avatarurl
      if (req.body.url) {
        if (!/^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/.test(req.body.url)
      && req.body.url.match(/\.(jpeg|jpg|gif|png)$/)) {} else {
          req.user.avatarurl = req.body.url
          User.update({
            email: req.user.email
          }, {
            avatarurl: req.body.url
          }, (err, numberAffected, rawResponse) => {})
        }
      }

      //skills
      if (req.body.skill) {
        req.user.skills.push(req.body.skill)
        User.update({
          email: req.user.email
        }, {
          skills: req.user.skills
        }, (err, numberAffected, rawResponse) => {})
      }

      //profile edit
      if (req.body.username) {
        if (req.body.password) {
          if (req.body.password !== req.body.password2 || req.body.password.length < 8) {
            error = 'les mots de passe ne correspondent pas'
          } else if (req.user.password !== sha1(req.body.password)) {
              error = 'Le mot de passe doit etre different'
            } else {
              User.update({
                email: req.user.email
              }, {
                password: sha1(req.body.password)
              }, (err, numbeuserrAffected, rawResponse) => {})
            }
          }
          else {
            if (req.body.username && req.body.username.length > 2 &&  req.body.username.length !== req.user.username &&
            /^[a-zA-Z0-9]+([a-zA-Z0-9](_|-| )[a-zA-Z0-9])*[a-zA-Z0-9]*$/.test(req.body.username)) {
              req.user.username = req.body.username
              User.update({
                email: req.user.email
              }, {
                username: req.body.username
              }, (err, numbeuserrAffected, rawResponse) => {})
            }
            if (req.body.about && req.body.about !== req.user.about) {
              req.user.about = req.body.about
              User.update({
                email: req.user.email
              }, {
                about: req.body.about
              }, (err, numbeuserrAffected, rawResponse) => {})
            }
            if(req.body.hobbies && req.body.hobbies !== req.user.hobbies) {
              req.user.hobbies = req.body.hobbies
              User.update({email: req.user.email}, {
                hobbies: req.body.hobbies
              }, (err, numbeuserrAffected, rawResponse) => {
              })
            }
          }
        }
        res.render('pages/board-profile', {
          user: req.user,
          error: error
        })

      })


    module.exports = router
