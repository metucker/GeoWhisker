const express = require('express');
const router = express.Router();
const oracledb = require('oracledb');
const { dbConfig } = require('../dbConfig');
const bodyParser = require('body-parser');


// Middleware to parse JSON in the request body
router.use(bodyParser.json());

router.post('/signup', async (req, res) => {
    try {
        // Extract email and password from req.body
        const { email, pw } = req.body;
    
        // Save the user data to the database
        // (Replace 'saveUserToDatabase' with your actual function)
        await saveUserToDatabase(email, pw);
    
        // Send a success response
        res.status(200).json({ message: 'User signed up successfully!' });
      } catch (error) {
        console.error('Error during signup:', error.message);
        // Send an error response
        res.status(500).json({ error: 'Failed to sign up. Please try again.' });
      }
});

router.get('/users', (req, res) => {
    const userData = [
        {
            id: 1,
            name: 'John Doe'
        },
        {
            id: 2,
            name: 'Jane Doe'
        }
    ];
    res.send('Hello World');
});

async function saveUserToDatabase(email, pw) {
    let connection;
  
    try {
      // Establish a connection to the database
      connection = await oracledb.getConnection(dbConfig);
  
      // Prepare the SQL statement
      const sql = 'INSERT INTO Caretakers (email, pw) VALUES (:email, :pw)';
      const binds = { email, pw};
  
      // Execute the SQL statement
      const result = await connection.execute(sql, binds, { autoCommit: true });
  
      console.log('User saved to the database:', result.rowsAffected + ' row(s) inserted');
  
    } catch (error) {
      console.error('Error saving user to the database:', error.message);
    } finally {
      // Release the database connection
      if (connection) {
        try {
          await connection.close();
        } catch (error) {
          console.error('Error closing the database connection:', error.message);
        }
      }
    }
  }
  
module.exports = router;