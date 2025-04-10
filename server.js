const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const bcrypt = require('bcryptjs');
const saltRounds = 10;

const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();

const mailjet = require('node-mailjet').connect( // Use connect for version 6.0.8
  process.env.MAILJET_API_KEY, 
  process.env.MAILJET_SECRET_KEY
);

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
      income: 0,
      currentBalance: 0,
      expenses:[],
      goals:[],
      debt:[]
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
  const { userId, expenseName, expenseCost, expenseDate, expenseCategory } = req.body;

  // Log the incoming data for debugging
  console.log("Received expense data:", { userId, expenseName, expenseCost, expenseDate, expenseCategory });

  let error = '';
  let success = false;

  const db = client.db('777Finances');

  const existingExpense = await db.collection('Data').findOne(
    { userId: userId, "expenses.name": expenseName }
  );

  if (existingExpense) {
    error = 'Expense with this name already exists';
  } else {
    try {
      const result = await db.collection('Data').updateOne(
        { userId: userId },
        {
          $push: {
            expenses: { name: expenseName, cost: expenseCost, date: expenseDate, category: expenseCategory }  // This is the key part
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
// GET Data ENDPOINT
// ------------------------------------
app.post('/api/getdata', async (req, res) => {
  const { userId } = req.body;
  let error = '';
  let userData = {};

  try {
    const db = client.db('777Finances');

    const user = await db.collection('Data').findOne({ userId: userId });

    if (user) {
      userData = user; 
    } else {
      error = 'User not found';
    }
  } catch (e) {
    error = e.toString();
  }

  res.status(200).json({ userData, error });
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
// EDIT BALANCE
// ------------------------------------

app.post('/api/editbalance', async (req, res) => {
  const { userId, newBalance } = req.body;

  // Log the incoming data for debugging
  console.log("Received request to edit balance:", { userId, newBalance });

  let error = '';
  let success = false;

  const db = client.db('777Finances');

  try {
    // Update the balance field for the user
    const result = await db.collection('Data').updateOne(
      { userId: userId },  // Match the user by their userId
      {
        $set: { currentBalance: newBalance }  // Set the new balance amount
      }
    );

    // Check if the document was modified
    if (result.modifiedCount > 0) {
      success = true;
    } else {
      error = 'Failed to update balance, user not found or no change made';
    }
  } catch (e) {
    error = e.toString();
  }

  res.status(200).json({ success, error });
});

// ------------------------------------
// ADD GOAL
// ------------------------------------
app.post('/api/addgoal', async (req, res) => {
  const { userId, goalName, cost, paymentAmount, payDate, paymentProgress } = req.body;

  // Log the incoming data for debugging
  console.log("Received goal data:", { userId, goalName, cost, paymentAmount, payDate, paymentProgress });

  let error = '';
  let success = false;

  const db = client.db('777Finances');

  // Check if goal with the same name already exists for the user
  const existingExpense = await db.collection('Data').findOne(
    { userId: userId, "goals.name": goalName }
  );

  if (existingExpense) {
    error = 'Goal with this name already exists';
  } else {
    try {
      // Update the Data collection by pushing the new goal
      const result = await db.collection('Data').updateOne(
        { userId: userId },
        {
          $push: {
            goals: { 
              name: goalName, 
              cost: cost,              // Use the total cost
              paymentAmount: paymentAmount, // Monthly payment amount
              progress: paymentProgress, 
              date: payDate 
            }
          }
        }
      );

      // Check if the update was successful
      if (result.modifiedCount > 0) {
        success = true;
      } else {
        error = 'Failed to add goal';
      }
    } catch (e) {
      error = e.toString();
    }
  }

  // Send response back to the client
  res.status(200).json({ success, error });
});

// ------------------------------------
// DELETE GOAL
// ------------------------------------

app.post('/api/removegoal', async (req, res) => {
  const { userId, goalName } = req.body;

  // Log the incoming data for debugging
  console.log("Received request to remove goal:", { userId, goalName });

  let error = '';
  let success = false;

  const db = client.db('777Finances');

  // Check if the goal exists for the given user
  const existingGoal = await db.collection('Data').findOne(
    { userId: userId, "goals.name": goalName }
  );

  if (!existingGoal) {
    error = 'Goal not found';
  } else {
    try {
      // Remove the goal from the user's goals array
      const result = await db.collection('Data').updateOne(
        { userId: userId },
        {
          $pull: { 
            goals: { name: goalName }  // Remove goal by name
          }
        }
      );

      if (result.modifiedCount > 0) {
        success = true;
      } else {
        error = 'Failed to remove goal';
      }
    } catch (e) {
      error = e.toString();
    }
  }

  res.status(200).json({ success, error });
});

// ------------------------------------
// ADD DEBT
// ------------------------------------

app.post('/api/adddebt', async (req, res) => {
  const { userId, debtName, debtAmount, paymentDate, paymentProgress } = req.body;

  // Log the incoming data for debugging
  console.log("Received debt data:", { userId, debtName, debtAmount, paymentDate, paymentProgress });

  let error = '';
  let success = false;

  const db = client.db('777Finances');

  // Check if the debt already exists for this user
  const existingDebt = await db.collection('Data').findOne(
    { userId: userId, "debts.name": debtName }
  );

  if (existingDebt) {
    error = 'Debt with this name already exists';
  } else {
    try {
      const result = await db.collection('Data').updateOne(
        { userId: userId },
        {
          $push: {
            debt: { name: debtName, amount: debtAmount, progress: paymentProgress, date: paymentDate } // Add debt to the 'debts' array
          }
        }
      );

      if (result.modifiedCount > 0) {
        success = true;
      } else {
        error = 'Failed to add debt';
      }
    } catch (e) {
      error = e.toString();
    }
  }

  res.status(200).json({ success, error });
});

// ------------------------------------
// DELETE DEBT
// ------------------------------------

app.post('/api/deletedebt', async (req, res) => {
  const { userId, debtName } = req.body;

  // Log the incoming data for debugging
  console.log("Received request to remove debt:", { userId, debtName });

  let error = '';
  let success = false;

  const db = client.db('777Finances');

  // Check if the debt exists for the given user
  const existingDebt = await db.collection('Data').findOne(
    { userId: userId, "debts.name": debtName }
  );

  if (!existingDebt) {
    error = 'Debt not found';
  } else {
    try {
      // Remove the debt from the user's debts array
      const result = await db.collection('Data').updateOne(
        { userId: userId },
        {
          $pull: { 
            debts: { name: debtName }  // Remove debt by name
          }
        }
      );

      if (result.modifiedCount > 0) {
        success = true;
      } else {
        error = 'Failed to remove debt';
      }
    } catch (e) {
      error = e.toString();
    }
  }

  res.status(200).json({ success, error });
});

// ------------------------------------
// ADD INCOME
// ------------------------------------

app.post('/api/addincome', async (req, res) => {
  const { userId, incomeAmount } = req.body;

  // Log the incoming data for debugging
  console.log("Received income data:", { userId, incomeAmount });

  let error = '';
  let success = false;

  const db = client.db('777Finances');

  try {
    // Ensure income is initialized if it doesn't exist
    const result = await db.collection('Data').updateOne(
      { userId: userId },
      {
        $setOnInsert: { income: 0 },  // Initialize income to 0 if it doesn't exist
        $inc: { income: incomeAmount }  // Increment income by incomeAmount
      },
      { upsert: true }  // If the user doesn't exist, insert a new document with the default values
    );

    if (result.modifiedCount > 0 || result.upsertedCount > 0) {
      success = true;
    } else {
      error = 'Failed to add income';
    }
  } catch (e) {
    error = e.toString();
  }

  res.status(200).json({ success, error });
});

// ------------------------------------
// EDIT INCOME
// ------------------------------------

app.post('/api/editincome', async (req, res) => {
  const { userId, newIncomeAmount } = req.body;

  // Log the incoming data for debugging
  console.log("Received request to edit income:", { userId, newIncomeAmount });

  let error = '';
  let success = false;

  const db = client.db('777Finances');

  try {
    // Log the current user data before updating
    const currentUser = await db.collection('Data').findOne({ userId: userId });
    console.log("Current user data:", currentUser);

    // Update the income for the user
    const result = await db.collection('Data').updateOne(
      { userId: userId },  // Match the user by their userId
      {
        $set: { income: newIncomeAmount }  // Set the new income amount
      }
    );

    // Log the result of the update operation
    console.log("Update result:", result);

    if (result.modifiedCount > 0) {
      success = true;
      console.log("Income updated successfully for userId:", userId);
    } else {
      error = 'Failed to update income, user not found or no change made';
      console.log("No changes made or user not found for userId:", userId);
    }
  } catch (e) {
    error = e.toString();
    console.error("Error updating income:", error);
  }

  // Log the final response being sent back to the client
  console.log("Response being sent:", { success, error });

  res.status(200).json({ success, error });
});

// ------------------------------------
// SEND EMAIL ENDPOINT
// ------------------------------------

app.post('/api/send-email', async (req, res) => {
  console.log("trying to send email...");

  const { recipientEmail, subject, message } = req.body;

  let error = '';
  let success = false;
  let mailjetResponse = null;
  let result = null;  // Define 'result' outside of the try-catch block

  try {
    // Sending the email using Mailjet API v3.1
    const request = mailjet
      .post('send', { version: 'v3.1' })
      .request({
        Messages: [
          {
            From: {
              Email: 'noreply@777finances.com', // Replace with your email
              Name: '777finances' // Replace with your name
            },
            To: [
              {
                Email: recipientEmail // Use recipientEmail from the request body
              }
            ],
            Subject: subject, // Use the subject from the request body
            TextPart: message // Use the message from the request body
          }
        ]
      });

    // Wait for the result of the email send
    result = await request;  // Store the result here
    
    // Log Mailjet's full response for better debugging
    console.log('Mailjet Response:', result.body);

    if (result.status === 200 && result.body && result.body.Messages && result.body.Messages.length > 0) {
      const messageStatus = result.body.Messages[0].Status;
      if (messageStatus === 'success') {
        success = true;
      } else {
        error = `Failed to send email: ${result.body.Messages[0].Errors[0]?.Text || 'Unknown error'}`;
      }
    } else {
      error = `Failed to send email: No response or message received from Mailjet.`;
    }
  } catch (e) {
    console.error('Error during Mailjet API request:', e);
    error = e.toString();
  }

  // Log the result after the try-catch block
  mailjetResponse = result ? result.body : null;

  // Return the result back to the client with more info
  res.status(200).json({ success, error, mailjetResponse });
});

// ------------------------------------
// CORS SETUP & START SERVER
// ------------------------------------
// No need for manual CORS setup anymore, `cors` middleware handles it
app.listen(5000, () => {
  console.log('Server listening on port 5000');
});
