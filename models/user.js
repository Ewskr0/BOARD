let mongoose = require('mongoose')
let Schema = mongoose.Schema

let userSchema = new Schema({
  username: String,
  firstname: String,
  lastname: String,
  googleid: String,
  avatarurl:String,
  email: String,
  about: String,
  hobbies: String,
  skills: Object,
  soundcloud: String
})

let User = mongoose.model('user', userSchema)

module.exports = User
