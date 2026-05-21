const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, Collection, ObjectId } = require('mongodb');
const app = express();
const port =process.env.PORT || 2000;


//middle ware
app.use(cors())
app.use(express.json())



const uri = `mongodb://${process.env.DB_User}:${process.env.DB_Pass}@ac-v3pf2i9-shard-00-00.aic4ezy.mongodb.net:27017,ac-v3pf2i9-shard-00-01.aic4ezy.mongodb.net:27017,ac-v3pf2i9-shard-00-02.aic4ezy.mongodb.net:27017/?ssl=true&replicaSet=atlas-s0bfev-shard-0&authSource=admin&appName=Cluster1`;

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

  // const database = client.db('coffessDB');
  // const coffeeCollection = database.collection('coffees')

  const coffeeCollection = client.db('coffeesDB').collection('coffees');
  const usersCollection = client.db('coffeesDB').collection('users');

 // read data or find multiple data
  
  app.get('/coffees', async(req,res) => {
    //  const cursor = coffeeCollection.find();
    //  const result = await cursor.toArray();
     const result = await coffeeCollection.find().toArray();
     res.send(result);
  })

  app.get('/coffees/:id', async(req,res) => {
     const id = req.params.id;
     const query = {_id : new ObjectId(id)};
     const result = await coffeeCollection.findOne(query);
     res.send(result);
  })

  // create data or post data 

  app.post('/coffees', async(req,res) => {
     const newCoffee = req.body;
     console.log(newCoffee);
     const result = await coffeeCollection.insertOne(newCoffee);
     res.send(result);
  })
   
  // update data 
  app.put('/coffees/:id', async(req,res) => {
     const id = req.params.id;
     const query = {_id: new ObjectId(id)};
     const options = {upsert : true};
     const updatedCoffee = req.body;
     const updatedDoc = {
      $set: updatedCoffee
     }
     const result = await coffeeCollection.updateOne(query,updatedDoc,options);
    res.send(result)
  })

  // delete data 
  app.delete('/coffees/:id', async(req,res) => {
    const id = req.params.id;
    const query = {_id : new ObjectId(id)};
    const result = await coffeeCollection.deleteOne(query);
    res.send(result);
  })

  // userProfle related APIs

  //create users
  app.post('/users', async(req,res) => {
    const user = req.body;
    const result = await usersCollection.insertOne(user);
    res.send(result);
  })

  // read / findAll users
  app.get('/users', async(req,res) => {
    const users = await usersCollection.find().toArray();
    res.send(users);
  })


  // update singleUsers
  app.patch('/users', async(req,res) => {
    const {email,lastLogin} = req.body;
    console.log(email,lastLogin)
    const query = {email: email};
    const updatedDoc = {
      $set: {
        lastSignInTime: lastLogin
      }
    };

    const result = await usersCollection.updateOne(query,updatedDoc);
    res.send(result)

  }) 

  // delete users
  app.delete('/user/:id', async(req,res) => {
    const id = req.params.id;
    const query = {_id: new ObjectId(id)};
    const result = await usersCollection.deleteOne(query);
    res.send(result)
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



app.get('/', (req, res) => {
  res.send('Hello World!')
})

if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
}

module.exports = app;