const express = require('express');
const app = express();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const async = require('async');
const sleep = require('util').promisify(setTimeout);
const ComputerVisionClient = require('@azure/cognitiveservices-computervision').ComputerVisionClient;
const ApiKeyCredentials = require('@azure/ms-rest-js').ApiKeyCredentials;
const userRouter = require('./src/router/user');
const authRouter = require ('./src/router/auth');
const recipeRouter = require('./src/router/recipe');
const { testConnect } = require('./src/database');
const key = '28fe6c5ff04f4f1daae18dda5aea2acd';
const endpoint = 'https://cogserv-recipe.cognitiveservices.azure.com/';
const userRepository = require('./src/database/repository/user');

const computerVisionClient = new ComputerVisionClient(new ApiKeyCredentials({ inHeader: { 'Ocp-Apim-Subscription-Key': key } }), endpoint);

async function computerVision() {
    async.series([
      async function () {
  
        /**
         * OCR: READ PRINTED & HANDWRITTEN TEXT WITH THE READ API
         * Extracts text from images using OCR (optical character recognition).
         */
        console.log('-------------------------------------------------');
        console.log('READ PRINTED, HANDWRITTEN TEXT AND PDF');
        console.log();
  
        // URL images containing printed and/or handwritten text. 
        // The URL can point to image files (.jpg/.png/.bmp) or multi-page files (.pdf, .tiff).
        const printedTextSampleURL = 'https://raw.githubusercontent.com/Azure-Samples/cognitive-services-sample-data-files/master/ComputerVision/Images/printed_text.jpg';
  
        // Recognize text in printed image from a URL
        console.log('Read printed text from URL...', printedTextSampleURL.split('/').pop());
        const printedResult = await readTextFromURL(computerVisionClient, printedTextSampleURL);
        printRecText(printedResult);
  
        // Perform read and await the result from URL
        async function readTextFromURL(client, url) {
          // To recognize text in a local image, replace client.read() with readTextInStream() as shown:
          let result = await client.read(url);
          // Operation ID is last path segment of operationLocation (a URL)
          let operation = result.operationLocation.split('/').slice(-1)[0];
  
          // Wait for read recognition to complete
          // result.status is initially undefined, since it's the result of read
          while (result.status !== "succeeded") { await sleep(1000); result = await client.getReadResult(operation); }
          return result.analyzeResult.readResults; // Return the first page of result. Replace [0] with the desired page if this is a multi-page file such as .pdf or .tiff.
        }
  
        // Prints all text from Read result
        function printRecText(readResults) {
          console.log('Recognized text:');
          for (const page in readResults) {
            if (readResults.length > 1) {
              console.log(`==== Page: ${page}`);
            }
            const result = readResults[page];
            if (result.lines.length) {
              for (const line of result.lines) {
                console.log(line.words.map(w => w.text).join(' '));
              }
            }
            else { console.log('No recognized text.'); }
          }
        }
  
        /**
         * END - Recognize Printed & Handwritten Text
         */
        console.log();
        console.log('-------------------------------------------------');
        console.log('End of quickstart.');
  
      },
      function () {
        return new Promise((resolve) => {
          resolve();
        })
      }
    ], (err) => {
      throw (err);
    });
  }
  
const readTextFromURL = async (client, url) => {
    // To recognize text in a local image, replace client.read() with readTextInStream() as shown:
    let result = await client.readInStream(url);
    // Operation ID is last path segment of operationLocation (a URL)
    let operation = result.operationLocation.split('/').slice(-1)[0];

    // Wait for read recognition to complete
    // result.status is initially undefined, since it's the result of read
    while (result.status !== "succeeded") { await sleep(1000); result = await client.getReadResult(operation); }
    return result.analyzeResult.readResults; // Return the first page of result. Replace [0] with the desired page if this is a multi-page file such as .pdf or .tiff.
}

const printText = (readResults) => {
    console.log('Recognized text:');
    for (const page in readResults) {
        if (readResults.length > 1) {
            console.log(`==== Page: ${page}`);
        }
        const result = readResults[page];
        if (result.lines.length) {
            for (const line of result.lines) {
                console.log(line.words.map(w => w.text).join(' '));
            }
        }
        else { console.log('No recognized text.'); }
    }
}

const getResultInArray = (readResults) => {
    for (const page in readResults) {
        if (readResults.length > 1) {
            console.log(`==== Page: ${page}`);
        }
        const result = readResults[page];
        if (result.lines.length) {
            let sentences = [];
            for (const line of result.lines) {
                let sentence = '';
                line.words.map(w => {
                    sentence += w.text + ' ';
                })
                sentences.push(sentence);
            }
            return sentences;
        }
        else { 
            return 'No Recognized Text' 
        }
    }
}

const computerVision2 = async (filename) => {
    const printedTextSampleURL = './uploads/'+ filename;
    const imageStream = fs.readFileSync(printedTextSampleURL);
    console.log('Read printed text from URL...', printedTextSampleURL.split('/').pop());

    const printedResult = await readTextFromURL(computerVisionClient, imageStream);

    // printText(printedResult);
    const resultInArr = getResultInArray(printedResult);
    console.log(resultInArr);

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

  
const upload = multer({ storage: diskStorage });
const testConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
      } catch (error) {
        console.error('Unable to connect to the database:', error);
      }
}
testConnection();
app.use(express.json());
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
app.post('/upload', upload.single('photo'), async (req, res) => {
    console.log(req.file)
    await computerVision2(req.file.originalname)
    return res.send('ok')
})

app.listen(3000, () => {
    console.log('Start on port hahaha 3000')
})