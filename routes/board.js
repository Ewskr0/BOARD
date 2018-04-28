let router = require('express').Router()

let authCheck = (req, res, next) => {
  if(!req.user){
    res.redirect('/auth/login')
  }else{
    next()
  }
}

router.get('/',authCheck, (req, res) => {
  //handle with passport
  res.render('pages/board',{user: req.user})
})

router.get('/profile',authCheck, (req, res) => {
  //handle with passport
  res.render('pages/board-profile',{user: req.user})
})

module.exports = router
