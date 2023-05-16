const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// monsuralam

// coffee-master

console.log(process.env.DB_USERNAME);

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASS}@cluster0.kjf5ogd.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
   serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
   },
});

async function run() {
   try {
      // Connect the client to the server	(optional starting in v4.7)
      await client.connect();

      const coffeeCollections = client.db("coffeeDB").collection("coffee");

      app.post("/coffee", async (req, res) => {
         const coffee = req.body;
         const result = await coffeeCollections.insertOne(coffee);
         res.send(result);
         console.log(coffee);
      });

      app.put("/coffee/:id", async (req, res) => {
         const id = req.params.id;
         const filter = { _id: new ObjectId(id) };
         const options = { upsert: true };
         const coffee = req.body;
         const updateCoffee = {
            $set: {
               product: coffee.product,
               taste: coffee.taste,
               cheif: coffee.cheif,
               photo: coffee.photo,
               quantity: coffee.quantity,
               supplier: coffee.supplier,
               category: coffee.category,
               details: coffee.details,
            },
         };
         const result = await coffeeCollections.updateOne(
            filter,
            updateCoffee,
            options
         );
         res.send(result);
      });

      app.get("/coffee", async (req, res) => {
         const cursor = coffeeCollections.find();
         const result = await cursor.toArray();
         res.send(result);
      });
      app.get("/coffee/:id", async (req, res) => {
         const id = req.params.id;
         const query = { _id: new ObjectId(id) };
         const result = await coffeeCollections.findOne(query);
         res.send(result);
      });

      app.delete("/coffee/:id", async (req, res) => {
         const id = req.params.id;
         const query = { _id: new ObjectId(id) };
         const result = await coffeeCollections.deleteOne(query);
         res.send(result);
      });

      // Send a ping to confirm a successful connection
      await client.db("admin").command({ ping: 1 });
      console.log(
         "Pinged your deployment. You successfully connected to MongoDB!"
      );
   } finally {
      // Ensures that the client will close when you finish/error
      //   await client.close();
   }
}
run().catch(console.dir);

app.get("/", (req, res) => {
   res.send("coffee server is running");
});

app.listen(port, () => {
   console.log(`server running on port: ${port}`);
});
