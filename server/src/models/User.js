import { getDB } from '../config/database.js';

const getUsers = async () => {
  const db = getDB();
  return await db.collection('users').find({}).toArray();
};

const createUser = async (userData) => {
  const db = getDB();
  const result = await db.collection('users').insertOne({
    ...userData,
    createdAt: new Date()
  });
  return { _id: result.insertedId, ...userData };
};

export { getUsers, createUser };