let router = require('express').Router()
let User = require('../models/user')


let authCheck = (req, res, next) => {
  if (!req.user) {
    res.redirect('/auth/login')
  } else {
    next()
  }
}

router.get('/', authCheck,  (req, res) => {
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
    if (!/^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/.test(req.body.url)) {
    } else {
      req.user.avatarurl = req.body.url
      User.update({email: req.user.email}, {
        avatarurl: req.body.url
      }, (err, numberAffected, rawResponse) => {
      })
    }
  }

  //skills
  if(req.body.skill){
    req.user.skills.push(req.body.skill)
    User.update({email: req.user.email}, {
      skills: req.user.skills
    }, (err, numberAffected, rawResponse) => {
    })
  }

  res.render('pages/board-profile', {
    user: req.user,
    error: error
  })

})


module.exports = router
