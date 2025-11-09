import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGO_URI || 'mongodb://localhost:27017';
const client = new MongoClient(uri);

let db;

const connectDB = async () => {
  try {
    await client.connect();
    db = client.db('costco');
    console.log('MongoDB Connected to costco database');
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
};

const getDB = () => db;

export { connectDB, getDB };