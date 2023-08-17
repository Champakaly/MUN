const mongoose = require('mongoose')
const Schema = mongoose.Schema
const passportLocalMongoose = require("passport-local-mongoose");
const userSchema = new Schema({
  
    email: { type: String, required: true, unique: true},
    username: { type: String, required: true, unique: true },
   password:{ type: String, required: true },
  // college: {type: String, required: true},
  // identity: {type: String, required: true}
  
})




//module.exports = File;
//const User = mongoose.model('User', userSchema)

// const Pdf = mongoose.model('Pdf', pdfSchema);
userSchema.plugin(passportLocalMongoose);

module.exports = User = mongoose.model('users', userSchema);
//module.exports = { File, User };