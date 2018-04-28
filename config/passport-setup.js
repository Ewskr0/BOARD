let passport = require('passport')
let googleStrategy = require('passport-google-oauth20')
let LocalStrategy = require('passport-local')
let keys = require('./keys')
let User = require('../models/user')
let sha1 = require('sha1')


passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    done(null, user)
  })
})

passport.use(
  new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    session: false
  },
 (email, password, done) => {
    console.log('email '+email)
    User.findOne({email:email}).then( (user, err) => {
            if (err) {
                return done(err);
            }
            if (!user) {
                return done(null, false);
            }
            if (user.password !== sha1(password)) {
                return done(null, false)
            }
            return done(null, user)
        })
}))
passport.use(
  new googleStrategy({
    //options for google strat
    callbackURL:'/auth/google/redirect',
    clientID: keys.google.clientID,
    clientSecret: keys.google.clientSecret

  }, (accesToken, refreshToken, profile, done) => {
    //check if user exists
    User.findOne({googleid:profile.id}).then((currentUser) => {
      if(currentUser){
        console.log('user is ' + currentUser)
        done(null, currentUser)

      }else{

        new User({
          firstname: profile.name.givenName,
          lastname: profile.name.familyName,
          email: "",
          password: "",
          about:"",
          hobbies: "",
          skills: ['none'],
          soundcloud: "",
          avatarurl:profile._json.image.url,
          username: profile.displayName,
          googleid: profile.id,

        }).save().then((newUser) => {
          console.log('new user created ' + newUser)
          done(null, newUser)
        })
      }
    })

    })
)
