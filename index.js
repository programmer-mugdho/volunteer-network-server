const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()

const app = express()
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wv7ly.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
app.use(cors())
app.use(bodyParser.json())

app.get('/', (req, res) => {
    res.send('Volunteer Network Server')
})

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const worksCollection = client.db(process.env.DB_NAME).collection("works");
    const registersCollection = client.db(process.env.DB_NAME).collection("registers");

    console.log("Connected")

    app.get('/works', (req, res) => {
        worksCollection.find({})
            .toArray((err, documents) => {
                res.send(documents)
            })
    })

    app.get('/register/:title', (req, res) => {
        worksCollection.find({ title: req.params.title })
            .toArray((err, documents) => {
                res.send(documents[0])
            })
    })
    app.post('/register', (req, res) => {
        const register = req.body
        registersCollection.insertOne(register)
            .then(result => {
                console.log(result)
                res.send(result)
            })
            .catch(error => {
                console.log(".....ERROR.....",error)
            })
    })
});

app.listen(5000)
