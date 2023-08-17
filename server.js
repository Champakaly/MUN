
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
var session= require('express-session')
const multer = require('multer');
const Grid = require('gridfs-stream');
const GridFsStorage  = require('multer-gridfs-storage').GridFsStorage;
const crypto = require('crypto');
const path = require('path');
const ejs = require('ejs');
const expressEjsLayout = require('express-ejs-layouts')
const flash = require('connect-flash');
const passport = require('passport');
require("./config/passport")(passport)
const {ensureAuthenticated} = require("./config/auth.js")

app.use(express.json())
app.use(cors());
//app.use(express.json({ limit: '50mb' }));
// app.use(express.urlencoded({ extended: true, limit: '50mb' }));

//const source = process.env.ATLAS_CONNECTION;
mongoose.connect('mongodb+srv://aishwarya:aishwaryapass@cluster0.fah4o06.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
//app.use(expressEjsLayout);

 app.use(express.urlencoded({extended : false}));
 app.use(bodyParser.urlencoded({ extended: false }));
 app.use(session({
      secret : 'secret',
      resave : true,
      saveUninitialized : true
    }));
    app.use(passport.initialize());
app.use(passport.session());
 //use flash
 app.use(flash());
 app.use((req,res,next)=> {
      res.locals.success_msg = req.flash('success_msg');
      res.locals.error_msg = req.flash('error_msg');
      res.locals.error  = req.flash('error');
 next();
 })
const router  = require('./controllers/user.controller');
const User = require('./models/user.model');


//app.use(express.static('public'));
app.set("view engine", "ejs");
app.get("/", (req, res) => {
  res.render("signuppage")
 })
 app.get("/index", ensureAuthenticated, (req, res) => {
    res.render('index', {user: req.user});
  
 })
 app.get("/pdfsphy1001", (req, res) => {
  res.render("pdfsphy1001")
 })
 app.get('/home', ensureAuthenticated, (req,res)=>{
  res.render('home');
})

app.get('/loginpage',(req,res)=>{
  res.render('loginpage');
})
app.get('/signuppage',(req,res)=>{
  res.render('signuppage')
  })
  app.get('/municon.png', function(req,res){
    res.sendFile(__dirname + "/public/" + "municon.png")
  });
  app.get('/acc.png', function(req,res){
    res.sendFile(__dirname + "/public/" + "acc.png")
  });
  app.get('/scrolltotop.css', function(req,res){
    res.sendFile(__dirname + "/public/" + "scrolltotop.css")
  });
  app.get('/scrolltotop.js', function(req,res){
    res.sendFile(__dirname + "/public/" + "scrolltotop.js")
  });
  app.get('/bookshelves.png', function(req,res){
    res.sendFile(__dirname + "/public/" + "bookshelves.png")
  });
  // app.use('/static', express.static(path.join(__dirname, 'public')))
  app.post('/signuppage',async (req,res)=>{
    const {username,email, password, password2} = req.body;
let errors = [];
console.log(' username ' + username+ ' email :' + email+ ' pass:' + password);
if(!username || !email || !password || !password2) {
    errors.push({msg : "Please fill in all fields"})
}
//check if match
if(password !== password2) {
    errors.push({msg : "passwords dont match"});
}

//check if password is more than 6 characters
if(password.length < 6 ) {
    errors.push({msg : 'password atleast 6 characters'})
}
if(errors.length > 0 ) {
res.render('signuppage', {
    errors : errors,
    username : username,
    email : email,
    password : password,
    password2 : password2})
} else {
    //validation passed
    try{
    let data =  await User.findOne({email : email});
    console.log(data);   
    if(data) {
      console.log("this user exists");
        errors.push({msg: 'email already registered'});
        res.render('signuppage',{errors,username,email,password,password2}) ;
        
       } else {
        const newUser = new User({
            username : username,
            email : email,
            password : password
        });
        bcrypt.genSalt(10,(err,salt)=> 
            bcrypt.hash(newUser.password,salt,
                (err,hash)=> {
                    if(err) throw err;
                        //save pass to hash
                        newUser.password = hash;
                    //save user
                    newUser.save()
                    .then((value)=>{
                        console.log(value)
                        req.flash('success_msg','You have now registered!')
                    res.redirect('/loginpage');
                    })
                    .catch(value=> console.log(value));
                      
                }));
      }
    }catch (err) {
           console.error(err.message);
           return res.status(500).send('Server Error');
         }
    
  }
  })

  app.post('/loginpage',(req,res,next)=>{
    passport.authenticate('local',{
      successRedirect : '/home',
      failureRedirect : '/loginpage',
      failureFlash : true,
      })(req,res,next);
    })
  
  //logout
  app.get('/logout',(req,res)=>{
    req.logout((err) => {
      if (err) {
        // Handle error
        console.error('Logout error:', err);
        return res.status(500).json({ message: 'An error occurred during logout' });
      }
req.flash('success_msg','Now logged out');
res.redirect('/loginpage');
});
   })

app.use('/users', router);
const connection = mongoose.connection;
connection.once('open', () => {
  console.log("DB Connected")
})
const PORT = process.env.PORT || 5500;


// app.post('/attend', async (req, res) => {
//   console.log("request received");
//   const { email, username, password} = req.body;
//   console.log(email);
//   console.log(password);
//   console.log(username);
//   try {
//     let data = await userRoutes.findOne({ email: email });
//     if (data) {
//       return res
//         .status(400)
//         .json({ errors: [{ msg: 'User exists' }] });
//     }
//     const Data = await userRoutes.save(req);
//     console.log(Data);
    
//   } catch (err) {
//     console.error(err.message);
//     return res.status(500).send('Server Error');
//   }
//   return res.json({ msg: "success" })
// });

// app.post('/login', async (req, res) => {
//   console.log("request received");
//   const { usn, password } = req.body;
  
//   try {
//     const user = await userRoutes.findOne({ usn: usn });
//     if (!user) {
//       // User with the provided USN not found 
//       console.log('User not found');  
//       return res.send('User not found');
     
//     }

//     if (user.password !== password) {
//       // Incorrect password
//       console.log('Incorrect password');
//       return res.send('Incorrect password');
      
//     }
//     // User found and password matched
//     return res.send('Login successful');
//   } catch (error) {
//     console.log('Error:', error);
//     return res.status(500).json({ message: 'Server error' });
//   }
// });

//app.use(express.static('public'));













 let gfs;
 connection.once('open', () => {
   gfs = new mongoose.mongo.GridFSBucket(connection.db, { bucketName: "uploads" });
 });
const storage = new GridFsStorage({
  url: 'mongodb+srv://aishwarya:aishwaryapass@cluster0.fah4o06.mongodb.net/?retryWrites=true&w=majority',
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: 'uploads',
        };
        resolve(fileInfo);
      });
    });
  },
});
const upload = multer({
  storage,
});
app.post("/upload", upload.single("file"), (req, res) => {
  res.redirect("/index");
});

// app.get("/pdf/:filename", (req, res) => {
//   // console.log('id', req.params.id)
//   const file = gfs
//     .find({
//       filename: req.params.filename
//     })
//     .toArray((err, files) => {
//       if (!files || files.length === 0) {
//         return res.status(404).json({
//           err: "no files exist"
//         });
//       }
//       gfs.openDownloadStreamByName(req.params.filename).pipe(res);
//     });
// });



app.get('/api/pdf', async (req, res) => {
  if (!gfs) {
    return res.status(500).send('GridFS is not initialized');
  }

  const pdfId = '664ddd5e428d9cfdb18bb40aa';
  const pdfStream = gfs.openDownloadStream(pdfId);

 
  pdfStream.pipe(res);
  pdfStream.on('error', (err) => {
    console.error('Error streaming PDF:', err);
    res.status(404).send('PDF not found');
  });

  res.setHeader('Content-Type', 'application/pdf');
});





app.get("/", (req, res) => {
  if (!gfs) {
    console.log("Some error occurred, check connection to the database");
    res.send("Some error occurred, check connection to the database");
    process.exit(0);
  }

  gfs.find({ contentType: "application/pdf" }).toArray((err, files) => {
    if (err) {
      console.error("Error fetching files from GridFS:", err);
      res.status(500).send("An error occurred while fetching files");
      return;
    }

    if (!files || files.length === 0) {
      return res.render("index", {
        files: false,
      });
    } else {
      const pdfFiles = files.sort((a, b) => {
        return (
          new Date(b["uploadDate"]).getTime() -
          new Date(a["uploadDate"]).getTime()
        );
      });

      return res.render("index", {
        files: pdfFiles,
      });
    }
  });
});


app.listen(PORT, () => {
  console.log(`Server listening at port ${PORT}`);
});
