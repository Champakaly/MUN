const User = require('../models/user.model')
const router = require('express').Router()
const { Pdf } = require('../models/user.model');
const multer = require('multer');
const Grid = require('gridfs-stream');
const GridFsStorage = require('multer-gridfs-storage').GridFsStorage;
const storage = new GridFsStorage({
  url: 'mongodb+srv://aishwarya:aishwaryapass@cluster0.fah4o06.mongodb.net/?retryWrites=true&w=majority',
  file: (req, file) => {
    return {
      filename: file.originalname,
      bucketName: 'uploads',
    };
  },
});
const upload = multer({ storage });
// user.controller.js

const userRoutes = {
  findOne: async (query) => {
    try {
      // Find a user based on the provided query
      const user = await User.findOne(query);
      return user;
    } catch (error) {
      console.error(error);
      throw new Error('Database error');
    }
  },
  save: async (req) => {
    {

      // Create a new user object
      const newUser = new User({
        email: req.body.email,
        username: req.body.username,
        password: req.body.password });

      // Save the user to the database
      const savedUser = await newUser.save();

      // Respond with the saved user object
      return (savedUser);
    }
  }
};




//router.route('/new').post()

router.route('/delete/:id').delete()

router.route('/update/:id').put()

module.exports = { userRoutes, router };


router.route('/new').post((req, res) => {
  const newUser = new User(req.body)

  newUser.save()
    .then(user => res.json(user))
    .catch(err => res.status(400).json("Error! " + err))
});
router.route('/').get((req, res) => {
  // using .find() without a parameter will match on all user instances
  User.find()
    .then(allUsers => res.json(allUsers))
    .catch(err => res.status(400).json('Error! ' + err))
});

router.route('/upload').post(upload.single('pdf'), async (req, res) => {
  try {
    // Assuming you have the logged-in user email or username available
    const uploadedBy = 'aditi.raghunandan@gmail.com'; // Replace 'loggedInUserEmail' with the actual variable containing the email/username
    const pdf = new Pdf({
      filename: req.file.originalname,
      fileId: req.file.id,
      uploadedBy: uploadedBy, // Associate the PDF with the user's email/username
    });
    await pdf.save();
    res.json({ message: 'PDF uploaded successfully!', pdfId: pdf._id });
  } catch (error) {
    console.error('Error uploading PDF:', error);
    res.status(500).json({ message: 'Server error while uploading PDF' });
  }
});
router.route('/delete/:id').delete((req, res) => {
  User.deleteOne({ _id: req.params.id })
    .then(success => res.json('Success! User deleted.'))
    .catch(err => res.status(400).json('Error! ' + err))
});

router.route('/update/:id').put((req, res) => {
  User.findByIdAndUpdate(req.params.id, req.body)
    .then(user => res.json('Success! User updated.'))
    .catch(err => res.status(400).json('Error! ' + err))
});
