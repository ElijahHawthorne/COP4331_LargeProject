const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const bcrypt = require('bcryptjs');
const saltRounds = 10;

const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();

// Load your MongoDB URI from environment variables (.env file)
const url = process.env.MONGODB_URI;
const client = new MongoClient(url);

// Connect to MongoDB once at server start
client.connect();

// Enable CORS and JSON parsing using the cors package
app.use(cors());
app.use(bodyParser.json());

// ------------------------------------
// ADD CARD ENDPOINT
// ------------------------------------
app.post('/api/addcard', async (req, res) => {
  const { userId, card } = req.body;
  const newCard = { Card: card, UserId: userId };
  let error = '';

  try {
    const db = client.db('COP4331Cards');
    // Insert into MongoDB
    await db.collection('Cards').insertOne(newCard);
  } catch (e) {
    error = e.toString();
  }

  res.status(200).json({ error });
});

// ------------------------------------
// SIGNUP ENDPOINT
// ------------------------------------
app.post('/api/signup', async (req, res) => {
  let error = '';
  let success = false;
  let userId = null; // Declare a variable to store the newly created userId

  const { login, password, firstName, lastName, email } = req.body;

  try {
    const db = client.db('777Finances');

    // Check if user with this login already exists
    const existingUser = await db.collection('Users').findOne({ Login: login });
    if (existingUser) {
      error = 'User already exists';
      return res.status(400).json({ success, error });
    }

    // Generate a simple numeric userId (or use any unique method you want)
    userId = Date.now(); // or UUID for better uniqueness

    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert new user with hashed password
    const newUser = {
      UserId: userId,
      Login: login,
      Password: hashedPassword,  // Store the hashed password
      FirstName: firstName,
      LastName: lastName,
      Email: email
    };

    const result = await db.collection('Users').insertOne(newUser);

    // Check if insertion was successful
    if (result.insertedId) {
      success = true;
      return res.status(201).json({ success, userId, error });
    } else {
      error = 'Failed to insert user';
      return res.status(500).json({ success, error });
    }

  } catch (e) {
    console.error(e);
    error = 'An unexpected error occurred';
    return res.status(500).json({ success, error });
  }
});

// ------------------------------------
// LOGIN ENDPOINT
// ------------------------------------


app.post('/api/login', async (req, res) => {
  let error = '';
  let id = -1;
  let fn = '';
  let ln = '';

  const { login, password } = req.body;

  try {
    const db = client.db('777Finances');

    // Find user by login
    const results = await db.collection('Users').find({ Login: login }).toArray();

    if (results.length > 0) {
      const user = results[0];

      // Compare provided password with the hashed password
      const match = await bcrypt.compare(password, user.Password);

      if (match) {
        // Passwords match, proceed with login
        id = user.UserId;
        fn = user.FirstName;
        ln = user.LastName;
      } else {
        error = 'Invalid password';
      }
    } else {
      error = 'User not found';
    }
  } catch (e) {
    error = e.toString();
  }

  res.status(200).json({ id, firstName: fn, lastName: ln, error });
});

// ------------------------------------
// initialize data endpoint
// ------------------------------------
app.post('/api/datainit', async (req, res) => {
  const { userId } = req.body;
  let error = '';
  let success = false;

  try {
    const db = client.db('777Finances');

    const userData = {
      userId: userId,
      income: null,
      expenseCost: [],
      expenseNames: []
    };

    const result = await db.collection('Data').insertOne(userData);

    if (result.insertedId) {
      success = true;
    } else {
      error = 'Failed to initialize user';
    }
  } catch (e) {
    error = e.toString();
  }

  res.status(200).json({ success, error });
});

// ------------------------------------
// ADD EXPENSE ENDPOINT
// ------------------------------------
app.post('/api/addexpense', async (req, res) => {
  const { userId, expenseName, expenseCost } = req.body;

  // Log the incoming data for debugging
  console.log("Received expense data:", { userId, expenseName, expenseCost });

  let error = '';
  let success = false;

  const db = client.db('777Finances');


  const existingExpense = await db.collection('Data').findOne(
    { userId: userId, "expenses.name": expenseName }
  );


  if (existingExpense) {
    error = 'Expense with this name already exists';
  } else{

//
  try {
    
    const result = await db.collection('Data').updateOne(
      { userId: userId },
      {
        $push: {
          expenses: { name: expenseName, cost: expenseCost }  // This is the key part
        }
      }
    );

    if (result.modifiedCount > 0) {
      success = true;
    } else {
      error = 'Failed to add expense';
    }
  } catch (e) {
    error = e.toString();
  }
//
  }
  res.status(200).json({ success, error });
});
// ------------------------------------
// EDIT EXPENSE ENDPOINT
// ------------------------------------

app.post('/api/updateexpense', async (req, res) => {
  const { userId, expenseName, newExpenseCost } = req.body;

  let error = '';
  let success = false;

  try {
    const db = client.db('777Finances');

    // Update the expense cost based on the userId and expenseName
    const result = await db.collection('Data').updateOne(
      {
        userId: userId,  // Matching userId
        "expenses.name": expenseName  // Matching expenseName in the expenses array
      },
      {
        $set: { 
          "expenses.$.cost": newExpenseCost  // Update the cost field of the matched expense object
        }
      }
    );

    if (result.modifiedCount > 0) {
      success = true;
    } else {
      error = 'Failed to update expense or expense not found';
    }
  } catch (e) {
    error = e.toString();
  }

  res.status(200).json({ success, error });
});
// ------------------------------------
// GET EXPENSES ENDPOINT
// ------------------------------------
app.post('/api/getexpenses', async (req, res) => {
  const { userId } = req.body;
  let error = '';
  let expenses = [];

  try {
    const db = client.db('777Finances');

    
    const user = await db.collection('Data').findOne({ userId: userId });

    if (user) {
      expenses = user.expenses; 
    } else {
      error = 'User not found';
    }
  } catch (e) {
    error = e.toString();
  }

  res.status(200).json({ expenses, error });
});
// ------------------------------------
// REMOVE EXPENSES ENDPOINT
// ------------------------------------


app.post('/api/removeexpense', async (req, res) => {
  const { userId, expenseName } = req.body;
  let error = '';
  let success = false;

  try {
    const db = client.db('777Finances');
    
    // Use $pull to remove the expense object with the given expenseName from the expenses array
    const result = await db.collection('Data').updateOne(
      { userId: userId },  // Find the user by userId
      { 
        $pull: { 
          expenses: { name: expenseName }  // Remove the object with the matching expenseName
        }
      }
    );

    if (result.modifiedCount > 0) {
      success = true;
    } else {
      error = 'Failed to remove expense or expense not found';
    }
  } catch (e) {
    error = e.toString();
  }

  res.status(200).json({ success, error });
});




// ------------------------------------
// CORS SETUP & START SERVER
// ------------------------------------
// No need for manual CORS setup anymore, `cors` middleware handles it
app.listen(5000, () => {
  console.log('Server listening on port 5000');
});
