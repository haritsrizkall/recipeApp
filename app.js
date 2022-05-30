const express = require('express');
const app = express();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const async = require('async');
const morgan = require('morgan');
const cors = require('cors');
const userRouter = require('./src/router/user');
const authRouter = require ('./src/router/auth');
const recipeRouter = require('./src/router/recipe');
const dbInit = require('./src/database');
const { userModel } = require('./src/database/model/user');
const cogservController = require('./src/controller/cogservController');

const checkFile = (req, file, cb) => {
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if(mimetype && extname){
    return cb(null,true);
  } else {
    cb('Error: Images Only!');
  }
}

const diskStorage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, "uploads"));
    },
    filename: function (req, file, cb) {
      cb(
        null,
        file.originalname
      );
    },
  });

  
const upload = multer({ 
  storage: diskStorage, 
  limits: {
    fileSize: 2000000
  },
  fileFilter: checkFile
});

dbInit();

app.use(express.json());
app.use(morgan('combined'));
app.use(cors());
app.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    next()
})
app.use('/ping', (req,res) => {
    res.send('pong')
})
app.use('/users', userRouter);
app.use('/auth', authRouter);
app.use('/recipes', recipeRouter)
app.post('/cogserv', upload.single('photo'), cogservController.imageToTextHandler)

app.listen(3000, () => {
    console.log('Start on port sipp iyak 3000')
})