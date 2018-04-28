let router = require('express').Router()
let passport = require('passport')

//auth login
router.get('/login', (req, res) => {
  res.render('pages/auth/login')
})

//auth Register
router.get('/register', (req, res) => {
  res.render('pages/auth/register')
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
