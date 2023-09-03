
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

//const source = process.env.ATLAS_CONNECTION;
mongoose.connect('mongodb+srv://aishwarya:aishwaryapass@cluster0.fah4o06.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

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



app.set("view engine", "ejs");
app.get("/", (req, res) => {
  res.render("signuppage")
 })
 app.get("/index", ensureAuthenticated, (req, res) => {
    res.render('index', {user: req.user});
  
 })
 app.get("/aboutus",  (req, res) => {
  res.render('aboutus');

})
app.get("/contactuspage", (req, res) => {
  res.render('contactuspage');

})
//  app.get("/pdfsphy1001", (req, res) => {
//   res.render("pdfsphy1001")
//  })
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
  app.get('/pdfimg.png', function(req,res){
    res.sendFile(__dirname + "/public/" + "pdfimg.png")
  });
  app.get('/bg_image.jpg', function(req,res){
    res.sendFile(__dirname + "/public/" + "bg_image.jpg")
  });
  app.get('/scrolltotop.css', function(req,res){
    res.sendFile(__dirname + "/public/" + "scrolltotop.css")
  });
  app.get('/chemistry.png', function(req,res){
    res.sendFile(__dirname + "/public/" + "chemistry.png")
  });
  app.get('/civill.png', function(req,res){
    res.sendFile(__dirname + "/public/" + "civill.png")
  });
  app.get('/commentbox.js', function(req,res){
    res.sendFile(__dirname + "/public/" + "commentbox.js")
  });
  app.get('/commentboxstyle.css', function(req,res){
    res.sendFile(__dirname + "/public/" + "commentboxstyle.css")
  });
  app.get('/computer.png', function(req,res){
    res.sendFile(__dirname + "/public/" + "computer.png")
  });
  app.get('/ddddec.png', function(req,res){
    res.sendFile(__dirname + "/public/" + "ddddec.png")
  });
  app.get('/electricall.png', function(req,res){
    res.sendFile(__dirname + "/public/" + "electricall.png")
  });
  app.get('/fivestar.css', function(req,res){
    res.sendFile(__dirname + "/public/" + "fivestar.css")
  });
  app.get('/logo.png', function(req,res){
    res.sendFile(__dirname + "/public/" + "logo.png")
  });
  app.get('/mechanical.png', function(req,res){
    res.sendFile(__dirname + "/public/" + "mechanical.png")
  });
  app.get('/navbar.css', function(req,res){
    res.sendFile(__dirname + "/public/" + "navbar.css")
  });
  app.get('/nextpages.css', function(req,res){
    res.sendFile(__dirname + "/public/" + "nextpages.css")
  });
  app.get('/phyysics.png', function(req,res){
    res.sendFile(__dirname + "/public/" + "phyysics.png")
  });
   app.get('/scrolltotop.js', function(req,res){
    res.sendFile(__dirname + "/public/" + "scrolltotop.js")
  });
  app.get('/stylesheet.css', function(req,res){
    res.sendFile(__dirname + "/public/" + "stylesheet.css")
  });
  app.get('/movepages.js', function(req,res){
    res.sendFile(__dirname + "/public/" + "movepages.js'")
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
    errors.push({msg : 'password must be atleast 6 characters'})
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
    console.log("DEMONSTRATION ON 3RD SEPT")
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
       // const filename = buf.toString('hex') + path.extname(file.originalname);
        const filename =file.originalname
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






const fs = require('fs');
const { ObjectId } = require('mongoose').Types;
//to download to system
// app.get("/xx", (req, res) =>{
//   gfs.openDownloadStreamByName('9c76dfee1b9fb1a15e262d7991a51a4e.pdf')
//     .pipe(fs.createWriteStream('./newpdf.pdf'))
//      .on('finish', () => {
//       console.log('File downloaded successfully.');
//       res.send('File downloaded successfully.');
//     })
//     .on('error', (err) => {
//       console.error('Error downloading file:', err);
//       res.status(500).send('Error downloading file.');
//     });
// })
//to open in browser
// app.get('/xx', (req, res) => {
//   const fileStream = gfs.openDownloadStreamByName('9c76dfee1b9fb1a15e262d7991a51a4e.pdf');

//   res.setHeader('Content-Type', 'application/pdf');
//   res.setHeader('Content-Disposition', 'inline; filename="pdfphy1001.pdf"');

//   fileStream.pipe(res);
// });
app.get('/xx/:filename', (req, res) => {
  const filename = req.params.filename;
  const fileStream = gfs.openDownloadStreamByName(filename);
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `inline; filename="${filename}"`);

  fileStream.pipe(res);
});
app.get("/pdfsphy1001", async(req, res) => {
  console.log("/pdfsphy1001 ");
  if (!gfs) {
    console.log("Some error occurred, check connection to db");
    res.send("Some error occurred, check connection to db");
    process.exit(0);
  }
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db("test"); // Replace with your database name
    const bucket = new GridFSBucket(db, { bucketName: "uploads" }); // Replace with your GridFS bucket name

    const filesCollection = db.collection('uploads.files');
    
    // Retrieve files from GridFS collection
    const files = await filesCollection.find({}).toArray();
  //  console.log("Files in GridFS:", files);
    return res.render("pdfsphy1001", { files: files });
    // Perform further processing with the retrieved files if needed

  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
  } finally {
    client.close();
  }

  // gfs.find({}).toArray((err, files) => {
  //   console.log("entered find ");
  //   if (err) {
  //     console.error("Error retrieving files from MongoDB:", err);
  //     return res.render("pdfsphy1001", { files: false });
  //   }

  //   if (!files || files.length === 0) {
  //     return res.render("pdfsphy1001", { files: false });
  //   }

  //   const f = files
  //     .map((file) => {
  //       if (file.contentType === "application/pdf") {
  //         file.isPDF = true;
  //       } else {
  //         file.isPDF = false;
  //       }
  //       return file;
  //     })
  //     .sort((a, b) => {
  //       return (
  //         new Date(b["uploadDate"]).getTime() -
  //         new Date(a["uploadDate"]).getTime()
  //       );
  //     });

  //   return res.render("pdfsphy1001", { files: f });
  // });
});
const { MongoClient } = require('mongodb');
const { GridFSBucket } = require('mongodb');

const uri = "mongodb+srv://aishwarya:aishwaryapass@cluster0.fah4o06.mongodb.net/?retryWrites=true&w=majority"; // Replace with your MongoDB connection string

async function retrieveFilesFromGridFS() {
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db("test"); // Replace with your database name
    const bucket = new GridFSBucket(db, { bucketName: "uploads" }); // Replace with your GridFS bucket name

    const filesCollection = db.collection('uploads.files');
    
    // Retrieve files from GridFS collection
    const files = await filesCollection.find({}).toArray();
    console.log("Files in GridFS:", files);

    // Perform further processing with the retrieved files if needed

  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
  } finally {
    client.close();
  }
}

retrieveFilesFromGridFS();

// app.get("/pdfsphy1001", (req, res) => {
//   const dummyFiles = [
//     { filename: "9c76dfee1b9fb1a15e262d7991a51a4e.pdf" },
//     { filename: "9c76dfee1b9fb1a15e262d7991a51a4e.pdf" },
//     { filename: "9c76dfee1b9fb1a15e262d7991a51a4e.pdf" },
//     // Add more dummy file objects as needed
//   ];

//   return res.render("pdfsphy1001", {
//     files: dummyFiles,
//   });
// });








app.listen(PORT, () => {
  console.log(`Server listening at port ${PORT}`);
});
