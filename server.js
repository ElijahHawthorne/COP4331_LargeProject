const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

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

  const { login, password, firstName, lastName, email } = req.body;

  try {
    const db = client.db('777Finances');

    // Check if user with this login already exists
    const existingUser = await db.collection('Users').findOne({ Login: login });
    if (existingUser) {
      error = 'User already exists';
    } else {
      // Generate a simple numeric userId (for demo)
      const userId = Date.now(); // or any unique approach

      // Insert new user
      const newUser = {
        UserId: userId,
        Login: login,
        Password: password, // NOTE: In production, use bcrypt to hash passwords
        FirstName: firstName,
        LastName: lastName,
        Email: email
      };

      const result = await db.collection('Users').insertOne(newUser);

      // Check insertion success by verifying if insertedId exists
      if (result.insertedId) {
        success = true;
      } else {
        error = 'Failed to insert user';
      }
    }
  } catch (e) {
    error = e.toString();
  }

  res.status(200).json({ success, error });
});

// ------------------------------------
// LOGIN ENDPOINT
// ------------------------------------
app.post('/api/login', async (req, res) => {
  const { login, password } = req.body;
  let error = '';
  let id = -1;
  let fn = '';
  let ln = '';

  try {
    const db = client.db('COP4331Cards');

    // Find matching user
    const results = await db
      .collection('Users')
      .find({ Login: login, Password: password })
      .toArray();

    if (results.length > 0) {
      id = results[0].UserId;
      fn = results[0].FirstName;
      ln = results[0].LastName;
    } else {
      error = 'User not found or invalid credentials';
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
