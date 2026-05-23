require('dotenv').config();
const { MongoClient, ServerApiVersion, Collection, ObjectId } = require('mongodb');
const uri = `mongodb://${process.env.DB_User}:${process.env.DB_Pass}@ac-v3pf2i9-shard-00-00.aic4ezy.mongodb.net:27017,ac-v3pf2i9-shard-00-01.aic4ezy.mongodb.net:27017,ac-v3pf2i9-shard-00-02.aic4ezy.mongodb.net:27017/?ssl=true&replicaSet=atlas-s0bfev-shard-0&authSource=admin&appName=Cluster1`;

let clientPromise;

if(! global._mongoClientPromise) {
    const client = new MongoClient(uri, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    });
    client.connect();
    global._mongoClientPromise = client;
}
clientPromise = global._mongoClientPromise;

module.exports = clientPromise;