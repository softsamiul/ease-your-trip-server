const express = require('express');
const app = express();
const port = process.env.PORT || 7000;
const { MongoClient, MongoCursorInUseError } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();
const cors = require('cors');

// Middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zsjgq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
  try{
      client.connect();
      const database = client.db("easeYourTrip");
      const tripsCollection = database.collection("trips");
      const ordersCollection = database.collection('orders');

      // GET API 
      app.get('/trips', async(req, res)=>{
        const cursor = tripsCollection.find({});
        const trips = await cursor.toArray();

        res.json(trips)
      })

      // GET API BY SINGLE ID
      app.get('/trips/:id', async(req, res)=>{
        const id = req.params.id;
        const query = ({_id: ObjectId(id)});
        const trip = await tripsCollection.findOne(query);
        res.json(trip)
      })

      // GET API FOR  GETTING ORDERS
      app.get('/orders', async(req, res)=>{
        const cursor = ordersCollection.find({});
        const orders = await cursor.toArray();
        res.json(orders);
      })

      // POST API FOR INSERT ORDERS
      app.post('/orders', async(req, res)=>{
        const query = req.body;
        const orders = await ordersCollection.insertOne(query);
        res.json(orders);
      })

      // POST API FOR INSERT NEW PACKAGE
      app.post('/trips', async(req, res)=>{
        const query = req.body;
        const trips = await tripsCollection.insertOne(query);
        res.json(trips);
      })

      // UPDATE API FOR TRIPS
      // app.put('/orders/:id', async(req, res)=>{
      //   const id = req.params.id;
      //   const query = ({_id: ObjectId(id)});
      //   const updateDoc = {
      //     $set: {
      //       status: "Approved"
      //     }
      //   }
      //   const result = await ordersCollection.updateOne(query, updateDoc);
      //   res.json(result)
      // })
  }finally{
    // client.close()
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Surver running at http://localhost:${port}`)
})