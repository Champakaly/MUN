
require('dotenv').config();
const express = require('express');
//const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
var session= require('express-session')
const multer = require('multer');
const Grid = require('gridfs-stream');
const GridFsStorage = require('multer-gridfs-storage').GridFsStorage;



app.use(express.json())
app.use(cors());


//const source = process.env.ATLAS_CONNECTION;
mongoose.connect('mongodb+srv://aishwarya:aishwaryapass@cluster0.fah4o06.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

// const profileRouter = require('./routes/profile');
// app.use('/', profileRouter);
//app.use(express.static('public'));


const { Pdf } = require('./controllers/user.controller');
const { userRoutes, router } = require('./controllers/user.controller');
app.use('/users', router);
const connection = mongoose.connection;
connection.once('open', () => {
  console.log("DB Connected")
})
const PORT = process.env.PORT || 5500;


app.post('/attend', async (req, res) => {
  console.log("request received");
  const { email, username, password} = req.body;
  console.log(email);
  console.log(password);
  console.log(username);
  try {
    let data = await userRoutes.findOne({ email: email });
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
  const { usn, password } = req.body;
  
  try {
    const user = await userRoutes.findOne({ usn: usn });
    if (!user) {
      // User with the provided USN not found 
      console.log('User not found');  
      return res.send('User not found');
     
    }

    if (user.password !== password) {
      // Incorrect password
      console.log('Incorrect password');
      return res.send('Incorrect password');
      
    }
    // User found and password matched
    return res.send('Login successful');
  } catch (error) {
    console.log('Error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});
//app.use(express.static('html'));
app.get('/user/:_id', async (req, res) => {
  const _id = req.params._id;

  try {
    const user = await User.findById(_id);

    if (!user) {
      return res.status(404).send('User not found');
    }

    // Send the user details as JSON response
    return res.json(user);
  } catch (error) {
    console.error('Error fetching user details:', error);
    return res.status(500).send('Internal Server Error');
  }
});

let gfs;
connection.once('open', () => {
  gfs = Grid(connection.db, mongoose.mongo);
  gfs.collection('uploads');
});

// Create storage engine for multer
const storage = new GridFsStorage({
  url: 'mongodb+srv://aishwarya:aishwaryapass@cluster0.fah4o06.mongodb.net/?retryWrites=true&w=majority',
  file: (req, file) => {
    return {
      filename: file.originalname,
      bucketName: 'uploads'
    };
  }
});
const upload = multer({ storage });

// API endpoint to upload a PDF
app.post('/upload', upload.single('pdf'), async (req, res) => {
  console.log("henlu");
  try {
    const newPdf = new Pdf({
      filename: req.file.originalname,
      fileId: req.file.id,
    });

    await newPdf.save();

    res.json({ message: 'PDF uploaded successfully!', pdfId: newPdf._id });
  } catch (error) {
    console.error('Error uploading PDF:', error);
    res.status(500).json({ message: 'Server error while uploading PDF' });
  }
});

// API endpoint to get a specific PDF by filename
app.get('/pdf/:filename', (req, res) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    if (!file || file.length === 0) {
      return res.status(404).json({ message: 'PDF not found' });
    }
    const readstream = gfs.createReadStream(file.filename);
    readstream.pipe(res);
  });
});

app.get('/pdfs', async (req, res) => {
  try {
    const pdfs = await Pdf.find({}, 'filename');
    res.json(pdfs);
  } catch (error) {
    console.error('Error fetching PDFs:', error);
    res.status(500).json({ message: 'Server error while fetching PDFs' });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening at port ${PORT}`);
});

