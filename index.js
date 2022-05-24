const express = require('express');
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
const app = express()
const port = process.env.PORT || 5000;
require('dotenv').config()


app.use(express.json())
app.use(cors())
// mobarakdb
// ZLCt55voRj6DVf6X
// 3ff1fc9c0c7240abc5816fe444ccee098ad021aa518cb2bd8002d11f353797141f033e3853960a56bd16be3a607e94db4aec9f32eac9d4f9f561dd2d5b827021



const uri = `mongodb+srv://${process.env.BD_USER}:${process.env.BD_PASS}@cluster0.csuyw.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
        await client.connect();
        const productCollection = client.db('car-manufacture').collection('products')
        const userCollection = client.db('allUser').collection('userOrder')
        const allUserCollection = client.db('allUser').collection('users')


        app.put('/user/:email', async (req, res) => {
            const email = req.params.email;
            const user = req.body
            const filter = { email: email }
            const options = { upsert: true }
            const updateDoc = {
                $set: user,
            }
            const result = await allUserCollection.updateOne(filter, updateDoc, options);
            const token = jwt.sign({ email: email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '7d' })
            res.send({ result, token })

        })


        app.post('/user', async (req, res) => {
            const data = req.body;
            const result = await userCollection.insertOne(data)
            res.send(result)
        })

        app.get('/order', async (req, res) => {
            const email = req.query.email
            const query = { email: email }
            const result = await userCollection.find(query).toArray()
            res.send(result)
        })


        app.get('/product', async (req, res) => {
            const result = await productCollection.find().toArray()
            res.send(result)
        })

        app.get('/product/:id', async (req, res) => {
            const id = req.params.id
            const filter = { _id: ObjectId(id) }
            const result = await productCollection.findOne(filter)
            res.send(result)
        })

        app.put('/product/:id', async (req, res) => {
            const id = req.params.id;
            const updateInfo = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true }
            const updateDoc = {
                $set: {
                    orderQuantity: updateInfo.orderQuantity
                }
            }
            const result = await productCollection.updateOne(filter, updateDoc, options);
            res.send(result)
        })

    }
    finally {

    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})