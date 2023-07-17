const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
  
    email: { type: String, required: true, unique: true},
    username: { type: String, required: true, unique: true },
   password:{ type: String, required: true },
  // college: {type: String, required: true},
  // identity: {type: String, required: true}
})

//const User = mongoose.model('User', userSchema)

module.exports = User = mongoose.model('users', userSchema);