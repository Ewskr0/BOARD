let passport = require('passport')
let googleStrategy = require('passport-google-oauth20')
let keys = require('./keys')
let User = require('../models/user')

passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    done(null, user)
  })
})

passport.use(
  new googleStrategy({
    //options for google strat
    callbackURL:'/auth/google/redirect',
    clientID: keys.google.clientID,
    clientSecret: keys.google.clientSecret

  }, (accesToken, refreshToken, profile, done) => {
    //check if user exists
    console.log(profile)
    User.findOne({googleid:profile.id}).then((currentUser) => {
      if(currentUser){
        console.log('user is ' + currentUser)
        done(null, currentUser)

      }else{

        new User({
          firstname: profile.name.givenName,
          lastname: profile.name.familyName,
          email: "",
          about:"",
          hobbies: "",
          skills: [''],
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
