let express = require('express')
let bodyParser = require('body-parser')
let authRoutes = require('./routes/auth')
let boardRoutes = require('./routes/board')
let passportSetup = require('./config/passport-setup')
let mongoose = require('mongoose')
let keys = require('./config/keys')
let cookieSession = require('cookie-session')
let passport = require('passport')
let moment = require('moment')
let app = express()

// template
app.set('view engine','ejs')

// mongoose
mongoose.connect(keys.mongodb.dbURI, () => {
  console.log('connected to mongodb')
})

// Middleware
app.use('/assets', express.static('public'))
app.use(bodyParser.urlencoded({extended : false}))
app.use(bodyParser.json())
app.use(cookieSession({
  maxAge:0.5 * 60 * 60 * 1000,
  keys:[keys.cookieKey.key]
}))
app.use(passport.initialize())
app.use(passport.session())
app.use('/auth',authRoutes)
app.use('/board',boardRoutes)

//app.use(require('./middlewares/flash'))



// Routes
app.get('/', (request, response) =>{
  response.render('pages/auth/index')

})

app.post('/', (request, response) => {

})
app.listen(8080)
