
require('dotenv').config();
const express = require('express');
//const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const MongoClient = require('mongodb').MongoClient

const passport = require("passport")
const initialisepassport = require("./passport-config")
const flash = require("express-flash")
const session = require("express-session")


app.use(express.json())
app.use(cors());
app.use(flash())
app.use(session({
  secret:process.env.session_secret,
  resave:false,
  saveUninitialized:false
}))
app.use()


//const source = process.env.ATLAS_CONNECTION;
mongoose.connect('mongodb+srv://aishwarya:aishwaryapass@cluster0.fah4o06.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})



const { userRoutes, router } = require('./controllers/user.controller');
app.use('/users', router);
const connection = mongoose.connection;
connection.once('open', () => {
  console.log("DB Connected")
})
const PORT = process.env.PORT || 5500;

app.get("/", (req, res) => {
  res.send("Hello world");
})

app.post('/attend', async (req, res) => {
  console.log("request received");
  const { email, username, password} = req.body;
  console.log(email);
  console.log(password);
  console.log(username);
  try {
    const hashedpassword = await bcrypt.hash(req.body.password);
    let data = await userRoutes.findOne({ email: email }).exec();
    if (data) {
      return res
        .status(400)
        .json({ errors: [{ msg: 'User exists' }] });
    }
    const Data = await userRoutes.save(req);
    console.log(Data);
    
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server Error');
  }
  return res.json({ msg: "success" })
  
});

app.post('/login', async (req, res) => {
  console.log("request received");
  const { username, password } = req.body;

  try {
    let user = await userRoutes.findOne({ username:username }).exec();
    if (err) {
      return res
        .status(400)
        .json({ errors: [{ msg: 'Error finding user' }] });
    }}catch (err) {
      console.error(err.message);
      return res.status(500).send('Server Error');
    }

  /*userRoutes.findOne({ username }, (err, user) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error finding user.');
    }*/

    if (!user) {
      return res.status(401).send('Invalid username or password.');
    }
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Error comparing passwords.');
      }

      if (!isMatch) {
        return res.status(401).send('Invalid username or password.');
      }
      res.send('Login successful!');
    });
  });


initialisepassport(
  passport,
  email => userRoutes.findOne(user.email === email)
)

app.listen(PORT, () => {
  console.log(`Server listening at port ${PORT}`);
});

