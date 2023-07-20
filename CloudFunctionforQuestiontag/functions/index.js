const functions = require("firebase-functions");
const { LanguageServiceClient } = require('@google-cloud/language');

// const admin = require("firebase-admin");
// const serviceAccount = require("./databaseKey.json");

// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
// });

const express = require("express");
const cors = require("cors");


// //Main database reference
// const db = admin.firestore();

// Main App
const applicationQuestionTag = express();
const port = process.env.PORT || 8080;


// Middleware to parse incoming JSON data
applicationQuestionTag.use(express.json());

applicationQuestionTag.use(cors({ origin: true }));

// Initialize the Natural Language API client
const languageClient = new LanguageServiceClient()

// Routes
applicationQuestionTag.get("/", (req, res) => {
    res.status(200).send("Hello Bhailog");
});


applicationQuestionTag.post('/processQuestions', async (req, res) => {
    try {
        const { question } = req.body;

        // Call the Natural Language API to analyze the content and generate tags
        const tags = await generateTags(question);
        res.status(200).json({ tags });
    } catch (error) {
       // console.error('Error processing the trivia question:', error);
        res.status(500).json({ tags: 'unclassified' });
    }
});

// Function to generate tags using the Natural Language API
async function generateTags(question) {
    const document = {
        content: question,
        type: 'PLAIN_TEXT',
    };

    const [classification] = await languageClient.classifyText({ document });
    let topTag = null;

    try {
        // Extract relevant categories from the classification result
        const tags = classification.categories;

        if (tags.length > 0) {
            topTag = tags[0].name;
            return topTag;
        }
    } catch (error) {
        console.error("Error classifying question:", error);
    }

    // Assign "unclassified" to the tag attribute in case of an error or no tags found
    topTag = "unclassified";
    return topTag;
}


exports.applicationQuestionTag = functions.https.onRequest(applicationQuestionTag);
