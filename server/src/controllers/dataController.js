import { getUsers, createUser } from '../models/User.js';

export const getData = async (req, res) => {
  try {
    const users = await getUsers();
    res.json({ message: 'Data from MongoDB', users });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createUserController = async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = await createUser({ name, email });
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};