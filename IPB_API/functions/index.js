const functions = require("firebase-functions");
const admin = require("firebase-admin");
var serviceAccount = require("./permissions.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});
const express = require("express");
const cors = require("cors");
const db = admin.firestore();
const app = express();
app.use(cors({ origin: true }));

//Create przedmiot
app.post('/api/create-przedmiot', (req, res) => {

    (async () => {
        try {
            await db.collection('przedmiot').doc('/' + req.body.id + '/')
                .create({
                    nazwa: req.body.nazwa,
                    opis: req.body.opis,
                    doPrzyjecia: req.body.doPrzyjecia
                })
            return res.status(200).send();
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }

    })();
})
//Create umowa
app.post('/api/create-umowa', (req, res) => {

    (async () => {
        try {
            await db.collection('umowa').doc('/' + req.body.id + '/')
                .create({
                    dataZawarcia: req.body.dataZawarcia,
                    tresc: req.body.tresc,
                })
            return res.status(200).send();
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }

    })();
})


//Read przedmiot specific ID
app.get('/api/read-przedmiot/:id', (req, res) => {

    (async () => {
        try {
            const document = db.collection('przedmiot').doc(req.params.id);
            let przedmiot = await document.get();
            let response = przedmiot.data();
            return res.status(200).send(response);
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }

    })();
})
//Read umowa specific ID
app.get('/api/read-umowa/:id', (req, res) => {

    (async () => {
        try {
            const document = db.collection('umowa').doc(req.params.id);
            let umowa = await document.get();
            let response = przedmiot.data();
            return res.status(200).send(response);
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }

    })();
})


//Read GET all przedmiots
app.get('/api/read-przedmiot', (req, res) => {
    (async () => {
        try {
            let query = db.collection('przedmiot');
            let response = [];
            await query.get().then(querySnaphot => {
                let docs = querySnaphot.docs;
                for (let doc of docs) {
                    const selectedItem = {
                        id: doc.id,
                        nazwa: doc.data().nazwa,
                        opis: doc.data().opis,
                        doPrzyjecia: doc.data().doPrzyjecia
                    }
                    response.push(selectedItem);
                }
                return res.status(200).send(response);
            })
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    })();
})
//Read GET all przedmiots sorted
app.get('/api/read-przedmiot-sorted', (req, res) => {
    (async () => {
        try {
            let query = db.collection('przedmiot');
            let response = [];
            await query.get().then(querySnaphot => {
                let docs = querySnaphot.docs;
                for (let doc of docs) {
                    const selectedItem = {
                        id: doc.id,
                        nazwa: doc.data().nazwa,
                        opis: doc.data().opis,
                        doPrzyjecia: doc.data().doPrzyjecia
                    }
                    response.push(selectedItem);
                }
                response.sort(function (a, b) {
                    return compareStrings(a.nazwa, b.nazwa);
                })
                return res.status(200).send(response);
            })
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    })();
})
//Read GET all umowas
app.get('/api/read-umowa', (req, res) => {
    (async () => {
        try {
            let query = db.collection('umowa');
            let response = [];
            await query.get().then(querySnaphot => {
                let docs = querySnaphot.docs;
                for (let doc of docs) {
                    const selectedItem = {
                        id: doc.id,
                        dataZawarcia: doc.data().dataZawarcia,
                        tresc: doc.data().tresc,
                    }
                    response.push(selectedItem);
                }
                return res.status(200).send(response);
            })
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    })();
})


//Export api to Firebase Cloud Functions
exports.app = functions.https.onRequest(app);


function compareStrings(a, b) {
    // Assuming you want case-insensitive comparison
    a = a.toLowerCase();
    b = b.toLowerCase();

    return (a < b) ? -1 : (a > b) ? 1 : 0;
}