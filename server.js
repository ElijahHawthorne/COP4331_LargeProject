// server.js

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

// Enable CORS and JSON parsing
app.use(cors());
app.use(bodyParser.json());

// ------------------------------------
// EXAMPLE CARD LIST (LOCAL ARRAY)
// ------------------------------------
var cardList = [
  'Roy Campanella',
  'Paul Molitor',
  'Tony Gwynn',
  'Dennis Eckersley',
  'Reggie Jackson',
  'Gaylord Perry',
  'Buck Leonard',
  'Rollie Fingers',
  'Charlie Gehringer',
  'Wade Boggs',
  'Carl Hubbell',
  'Dave Winfield',
  'Jackie Robinson',
  'Ken Griffey, Jr.',
  'Al Simmons',
  'Chuck Klein',
  'Mel Ott',
  'Mark McGwire',
  'Nolan Ryan',
  'Ralph Kiner',
  'Yogi Berra',
  'Goose Goslin',
  'Greg Maddux',
  'Frankie Frisch',
  'Ernie Banks',
  'Ozzie Smith',
  'Hank Greenberg',
  'Kirby Puckett',
  'Bob Feller',
  'Dizzy Dean',
  'Joe Jackson',
  'Sam Crawford',
  'Barry Bonds',
  'Duke Snider',
  'George Sisler',
  'Ed Walsh',
  'Tom Seaver',
  'Willie Stargell',
  'Bob Gibson',
  'Brooks Robinson',
  'Steve Carlton',
  'Joe Medwick',
  'Nap Lajoie',
  'Cal Ripken, Jr.',
  'Mike Schmidt',
  'Eddie Murray',
  'Tris Speaker',
  'Al Kaline',
  'Sandy Koufax',
  'Willie Keeler',
  'Pete Rose',
  'Robin Roberts',
  'Eddie Collins',
  'Lefty Gomez',
  'Lefty Grove',
  'Carl Yastrzemski',
  'Frank Robinson',
  'Juan Marichal',
  'Warren Spahn',
  'Pie Traynor',
  'Roberto Clemente',
  'Harmon Killebrew',
  'Satchel Paige',
  'Eddie Plank',
  'Josh Gibson',
  'Oscar Charleston',
  'Mickey Mantle',
  'Cool Papa Bell',
  'Johnny Bench',
  'Mickey Cochrane',
  'Jimmie Foxx',
  'Jim Palmer',
  'Cy Young',
  'Eddie Mathews',
  'Honus Wagner',
  'Paul Waner',
  'Grover Alexander',
  'Rod Carew',
  'Joe DiMaggio',
  'Joe Morgan',
  'Stan Musial',
  'Bill Terry',
  'Rogers Hornsby',
  'Lou Brock',
  'Ted Williams',
  'Bill Dickey',
  'Christy Mathewson',
  'Willie McCovey',
  'Lou Gehrig',
  'George Brett',
  'Hank Aaron',
  'Harry Heilmann',
  'Walter Johnson',
  'Roger Clemens',
  'Ty Cobb',
  'Whitey Ford',
  'Willie Mays',
  'Rickey Henderson',
  'Babe Ruth'
];

// ------------------------------------
// ADD CARD ENDPOINT
// ------------------------------------
app.post('/api/addcard', async (req, res, next) => {
  // incoming: userId, card
  // outgoing: error
  const { userId, card } = req.body;
  const newCard = { Card: card, UserId: userId };
  let error = '';

  try {
    const db = client.db('COP4331Cards');
    // Insert into MongoDB
    await db.collection('Cards').insertOne(newCard);

    // Also push into local array (if you still want that behavior)
    cardList.push(card);
  } catch (e) {
    error = e.toString();
  }

  const ret = { error: error };
  res.status(200).json(ret);
});

// ------------------------------------
// SIGNUP ENDPOINT
// ------------------------------------
app.post('/api/signup', async (req, res, next) => {
  // incoming: login, password, firstName, lastName
  // outgoing: success, error
  let error = '';
  let success = false;

  const { login, password, firstName, lastName, email } = req.body;

  try {
    const db = client.db('COP4331Cards');

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

  const ret = { success, error };
  res.status(200).json(ret);
});


// ------------------------------------
// LOGIN ENDPOINT
// ------------------------------------
app.post('/api/login', async (req, res, next) => {
  // incoming: login, password
  // outgoing: id, firstName, lastName, error
  let error = '';
  const { login, password } = req.body;

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

  const ret = { id: id, firstName: fn, lastName: ln, error: error };
  res.status(200).json(ret);
});

// ------------------------------------
// SEARCH CARDS ENDPOINT
// ------------------------------------
app.post('/api/searchcards', async (req, res, next) => {
  // incoming: userId, search
  // outgoing: results[], error
  let error = '';
  const { userId, search } = req.body;

  try {
    const _search = search.trim();
    const db = client.db('COP4331Cards');

    // Use case-insensitive regex to find matching cards
    const results = await db
      .collection('Cards')
      .find({ Card: { $regex: _search + '.*', $options: 'i' } })
      .toArray();

    // Collect card names
    const _ret = results.map((item) => item.Card);

    const ret = { results: _ret, error: error };
    res.status(200).json(ret);
  } catch (e) {
    error = e.toString();
    const ret = { results: [], error: error };
    res.status(200).json(ret);
  }
});

// ------------------------------------
// CORS SETUP & START SERVER
// ------------------------------------
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH, DELETE, OPTIONS'
  );
  next();
});

// Start the server on port 5000
app.listen(5000, () => {
  console.log('Server listening on port 5000');
});
