const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
    res.send('GreenCloth server is running.......')
})





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.SECRET_KEY}@cluster0.nrvy6gz.mongodb.net/?retryWrites=true&w=majority`;


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const clothCollection = client.db("clothDB").collection("cloth");

        app.get('/cloth', async(req, res)=>{
            const cursor = clothCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get('/cloth/:id', async(req, res)=>{
            const id = req.params.id;
            const query = {_id: new ObjectId(id)};
            const result = await clothCollection.findOne(query);
            res.send(result);
        })

        app.post('/cloth', async(req, res)=>{
            const newCloth = req.body;
            console.log(newCloth)

            const result = await clothCollection.insertOne(newCloth);
            res.send(result);
        })

        app.put('/cloth/:id', async(req, res)=>{
            const id = req.params.id;
            const filter = {_id: new ObjectId(id)};
            const options = {upsert: true};
            const updatedCloth = req.body;
            const cloth = {
                $set: {
                    name: updatedCloth.name,
                    model: updatedCloth.model,
                    type: updatedCloth.type,
                    price: updatedCloth.price,
                    producer: updatedCloth.producer,
                    release: updatedCloth.release,
                    photo: updatedCloth.photo
                }
            }
            const result = await  clothCollection.updateOne(filter, cloth,options);
            res.send(result);
        })

        app.delete('/cloth/:id', async(req, res)=>{
            const id = req.params.id;
            const query = {_id: new ObjectId(id)}
            const result = await clothCollection.deleteOne(query);
            res.send(result);
        })


        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
       // await client.close();
    }
}
run().catch(console.dir);





app.listen(port, () => {
    console.log(`GreenCloth server is running on port: ${port}`);
})


