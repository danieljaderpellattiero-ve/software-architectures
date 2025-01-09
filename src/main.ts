import 'dotenv/config';
import express from 'express';
import {MongoClient} from 'mongodb';

// Express configuration
const app = express();
const port = process.env.PORT || 3000;

// MongoDB configuration
const client = new MongoClient('mongodb://localhost:27017/');
let db: any;

// API start up
app.listen(port, async () => {
  try {
    const connection = await client.connect();
    db = connection.db('unive-sw-arch');
    console.log(`Server connected to MongoDB at localhost:27017`);
    console.log(`Server listening at http://localhost:${port}`);
  } catch (error) {
    process.exit(1);
  }
});
