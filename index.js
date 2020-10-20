const express = require('express');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('agency'));
app.use(fileUpload());
// const port = 6700;

app.get('/',(req, res)=>{
    res.send("its working");
    console.log('server is running');
})

const uri = `mongodb+srv://${process.DB_USER}:${process.DB_PASS}@cluster0.ynnkd.mongodb.net/${process.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const collection=client.db(`${process.DB_NAME}`).collection("agency");
    const comment = client.db(`${process.DB_NAME}`).collection("comment");
    const newService = client.db(`${process.DB_NAME}`).collection("newService");
    
    app.post('/uploadService', (req, res) => {

        const file = req.files.file;
        const name = req.body.name;
        const email = req.body.email;
        const projectName = req.body.projectName;
        const projectDetails = req.body.projectDetails;
        const price = req.body.price;
        const newImg = file.data;
        const encImg = newImg.toString('base64');
        var image = {
            contentType: file.mimetype,
            size: file.size,
            img: Buffer.from(encImg, 'base64')
        };
        console.log(name,email,projectName ,projectDetails,price)
        collection.insertOne({ name, email, projectName, projectDetails, price, image })
            .then(result => {
                
                res.send(result.insertedCount > 0);
            })
            
    })


    app.get('/serviceList', (req, res) => {
        collection.find({})
            .toArray((err, agency) => {
                res.send(agency);
            })
    })



    app.post('/comments', (req, res) => {
        const comments = req.body;
        console.log(comments);
        comment.insertOne(comments)

            .then(result => {
                res.send(result.insertedCount > 0)
            })
    })

    app.get('/showComments',(req, res)=>{
        comment.find({})
        .toArray((err, agency) => {
            res.send(agency);
        })

    })
    app.post('/addService', (req, res) => {
        const file = req.files.file;
        const name = req.body.name;
        const description = req.body.description;
        const newImg = file.data;
        const encImg = newImg.toString('base64');
        var image = {
            contentType: file.mimetype,
            size: file.size,
            img: Buffer.from(encImg, 'base64')
        };
        newService.insertOne({ name, description ,image})
            .then(result => {
                res.send(result.insertedCount > 0);
            })
    })
})




app.listen(process.env.PORT || 5000);