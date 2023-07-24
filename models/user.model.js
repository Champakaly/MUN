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

const pdfSchema = new Schema({
  filename: { type: String, required: true },
  fileId: { type: Schema.Types.ObjectId, required: true },
  uploadedBy: { type: String, required: true }, // Add this field to store the email/username of the user
});
const Pdf = mongoose.model('Pdf', pdfSchema);
const User = mongoose.model('User', userSchema);

//module.exports = User = mongoose.model('users', userSchema);
module.exports = { Pdf, User };