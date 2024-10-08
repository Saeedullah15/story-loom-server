const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require("dotenv").config();
const app = express();
const port = process.env.PORT || 3000;

// middleware
app.use(cors());
app.use(express.json());

// connection string
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.yyrxfdz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
        // await client.connect();

        const storyCollection = client.db("storyLoomDB").collection("storyCollection");

        // API's here
        app.post("/createStory", async (req, res) => {
            const newStoryInfo = req.body;
            const result = await storyCollection.insertOne(newStoryInfo);
            res.send(result);
        })

        app.get("/stories", async (req, res) => {
            const cursor = await storyCollection.find().toArray();
            res.send(cursor);
        })

        app.get("/stories/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await storyCollection.findOne(query);
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

// testing api
app.get("/", (req, res) => {
    res.send("story loom server is running....");
})

app.listen(port, () => {
    console.log(`server is running on port: ${port}`);
})