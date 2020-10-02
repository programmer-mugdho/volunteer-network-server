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
    console.log("Connected")

    app.get('/works', (req, res) => {
        worksCollection.find({})
            .toArray((err, documents) => {
                res.send(documents)
            })
    })
});


app.listen(5000)
