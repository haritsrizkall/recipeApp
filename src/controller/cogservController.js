const fs = require('fs');
const { createResponse } = require('../utils/helpers');
const key = 'aa97c9776a68460bb75e06ef1199c14f';
const endpoint = 'https://cogserv-recipes.cognitiveservices.azure.com/';
const ComputerVisionClient = require('@azure/cognitiveservices-computervision').ComputerVisionClient;
const ApiKeyCredentials = require('@azure/ms-rest-js').ApiKeyCredentials;
const sleep = require('util').promisify(setTimeout);

const computerVisionClient = new ComputerVisionClient(new ApiKeyCredentials({ inHeader: { 'Ocp-Apim-Subscription-Key': key } }), endpoint);

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

const getResultInArray =  (readResults) => {
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

const imageToText = async (filename) => {
    const printedTextSampleURL = './uploads/'+ filename;
    const imageStream = fs.readFileSync(printedTextSampleURL);
    console.log('Read printed text from URL...', printedTextSampleURL.split('/').pop());

    try {
        const printedResult = await readTextFromURL(computerVisionClient, imageStream);
        fs.unlinkSync(printedTextSampleURL);
        // printText(printedResult);
        const resultInArr = getResultInArray(printedResult);
        return resultInArr;
    } catch (error) {
        throw error;
    }

}

const cogservController = {
    imageToTextHandler: async (req, res) => {
        try {
            const result = await imageToText(req.file.originalname);
            return res.status(200).send({
                message: 'Successfully get text from image',
                data: result
            })
        } catch (error) {
            console.log(error)
            return res.status(500).json(createResponse('Error to get text from image', 500, {
                error: error
            }))
        }
    }
}

module.exports = cogservController;