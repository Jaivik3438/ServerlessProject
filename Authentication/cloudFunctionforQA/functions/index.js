const functions = require("firebase-functions");

const admin = require("firebase-admin");
const serviceAccount = require("./databaseKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const express = require("express");
const cors = require("cors");

//Main database reference
const db = admin.firestore();

// Main App
const app = express();
app.use(cors({ origin: true }));

// Routes
app.get("/", (req, res) => {
    res.status(200).send("Hello World!");
});

// Adding security answer first time
app.post("/createQuestions&Answers", (req, res) => {
    (async () => {
        try {
            await db
                .collection("Questions&Answers")
                .doc("/" + req.body.email + "/")
                .create({
                    Q1: req.body.Q1,
                    Q2: req.body.Q2,
                    Q3: req.body.Q3
                });
            return res.status(200).send({
                status: "success",
                message: "Data added successfully"
            });
        } catch (error) {
            console.log(error);
            return res.status(500).send({
                status: "Failed",
                message: error
            });
        }
    })();
});

// Verifing after login
app.post("/VerifyQuestions&Answers", (req, res) => {
    (async () => {
        try {
            const document = db.collection("Questions&Answers").doc("/" + req.body.email + "/");
            let user = await document.get();
            let response = user.data();
            console.log(response);
            let questionType = req.body.question;
            console.log(questionType);
            if (req.body.answer == response[questionType].answer)
                return res.status(200).send({
                    status: "success",
                    message: "User Verified"
                });
            else
                return res.status(200).send({
                    status: "Failed",
                    message: "Authentication Failed"
                });
        } catch (error) {
            console.log(error);
            return res.status(500).send({
                status: "Failed",
                message: error
            });
        }
    })();
});

// Checking user status (first time user or not)
app.get("/checkUserStatus/:email", (req, res) => {
    (async () => {
        try {
            const document = db.collection("Questions&Answers").doc(req.params.email);
            let user = await document.get();
            let response = user.data();
            if (!response) {
                return res.status(200).send({
                    status: "success",
                    userRegistered: false
                });
            }
            return res.status(200).send({
                status: "success",
                userRegistered: true
            });
        } catch (error) {
            console.log(error);
            return res.status(500).send({
                status: "Failed",
                message: error
            })
        }
    })();
});


//Update - put()



//Delete - delete()


exports.app = functions.https.onRequest(app);
