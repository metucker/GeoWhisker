const express = require('express');
const router = express.Router();
const oracledb = require('oracledb');
const { dbConfig } = require('../dbConfig');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const { serialize } = require('cookie');
const multer = require('multer');
const fs = require('fs');
//const schemas = require('../models/schemas'); //UNCOMMENT THIS LINE WHEN USING THE SCHEMAS FILE

// Middleware to parse JSON in the request body
router.use(bodyParser.json());
// Parse application/x-www-form-urlencoded
router.use(bodyParser.urlencoded({ extended: false }));
const upload = multer({ dest: 'uploads/' });

async function createSession(userID, token) {
  let connection;

  try {
    connection = await oracledb.getConnection(dbConfig);

    // Generate a random session token
    const hashedToken = await bcrypt.hash(token, 10);

    // Prepare the SQL query
    const query = `
      INSERT INTO Sessions (userID, token) VALUES (:userID, :token)
    `;

    // Bind parameters for the query
    const bindParams = {
      userID,
      token,
    };
    console.log('userID: ', userID, ' & token: ', token);

    // Execute the query
    const result = await connection.execute(query, bindParams);
    console.log('result', result.lastRowid);
    return  result.lastRowid;//TODO is this okay lol
  } catch (error) {
    console.error('Error creating session:', error);
    throw error; // You might want to handle the error differently based on your application logic
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (error) {
        console.error('Error closing database connection:', error.message);
      }
    }
  }

}
async function getUserID(email) {
  let connection;

  try {
    connection = await oracledb.getConnection(dbConfig);

    // Prepare the SQL query
    const query = `
    SELECT id FROM Users WHERE email = :email
    `;

    // Bind parameters for the query
    const bindParams = {
      email,
    };

    // Execute the query
    const result = await connection.execute(query, bindParams);
    // Check if the query returned any rows
    if (result.rows.length > 0) {
      return result.rows[0][0];
    } else {
      return -1;
    }
  } catch (error) {
    console.error('Error retrieving userID:', error);
    throw error; // You might want to handle the error differently based on your application logic
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (error) {
        console.error('Error closing database connection:', error.message);
      }
    }
  }
};

async function setCookie(email) {
  try {
    // Generate a random session token
    const userID = await getUserID(email);
    // Set the session token in the database
    // (Replace 'setSessionTokenInDatabase' with your actual function)
    //await setSessionTokenInDatabase(email, sessionToken);
    // Set the session token in a cookie
    const cookieOptions = {
      maxAge: 3600, // 1 hour in seconds
      expires: new Date(Date.now() + 3600000), // 1 hour from now
      domain: 'localhost:3000',
      path: '/',
      secure: true,
      httpOnly: true,
      sameSite: 'strict'
    };
    const cookieString = serialize('geowhisker', cookieOptions);
    const session = await createSession(userID, serialize('geowhisker', cookieOptions));
    console.log("session:", session);
    return cookieString;
  } catch (error) {
    console.error('Error setting session token:', error.message);
    throw error; // You might want to handle the error differently based on your application logic
  }
};


router.post('/signup', async (req, res) => {
    try {
        // Extract email and password from req.body
        const { email, pw } = req.body;
        // Save the user data to the database
        // (Replacse 'saveUserToDatabase' with your actual function)
       
        if (await userExists(email)) {
          console.log('User already exists. Please log in or use a different email.');
          throw error('User already exists.');
        } else {
          await saveUserToDatabase(email, await hashPassword(pw));
          // Save the user data to the database with schemas
          // const newData = {email: email, pw: await hashPassword(pw)};
          // const newUser = new schemas.Users(newData);
          // await newUser.save();
        }      

        // Send a success response
        res.status(200).json({ message: 'User signed up successfully!' });
      } catch (error) {
        console.error('Error during signup:', error.message);
        // Send an error response
        res.status(500).json({ error: 'Failed to sign up. Please try again.' });
      }
});

router.post('/login', async (req, res) => {
  try {
      // Extract email and password from req.body
     
      const { email, pw } = req.body;
      console.log("email:", email);
  
      // Authenticate the user
      await authenticateUser(email, pw);
      res.setHeader('Set-Cookie', await setCookie(email));

      // Send a success response
      res.status(200).json({ message: 'User logged in successfully!' });
    } catch (error) {
      console.error('Error during login:', error.message);
      // Send an error response
      res.status(500).json({ error: 'Failed to log in. Please try again.' });
    }
});

router.post('/addcat', async (req, res) => {
  try {
     
    const { cname,
      age,
      cat_aliases,
      geographical_area,
      microchipped,
      chipID,
      hlength,
      photo,
      gender,
      feral
    }  = req.body;
    console.log(req.body);

    const catID = await createCat(req.body);
    // Save the user data to the database with schemas
    // const newData = {email: email, pw: await hashPassword(pw)};
    // const newUser = new schemas.Users(newData);
    // await newUser.save();
            

    // Send a success response
    console.log('catID to be sent back: ', catID);
    res.status(200).json({ catID, message: 'Cat added successfully!' });
  } catch (error) {
      console.error('Error adding cat:', error.message);
      // Send an error response
      res.status(500).json({ error: 'Failed to add cat. Please try again.' });
    }
});

async function createCat(reqBody) {
  let connection;
  console.log("reqBody:", reqBody.photo);
  try {
    connection = await oracledb.getConnection(dbConfig);
    const { cname,
      age,
      cat_aliases,
      geographical_area,
      microchipped,
      chipID,
      hlength,
      photo,
      gender,
      feral
    }  = reqBody;
    console.log("Correct data:", cname, age, cat_aliases, geographical_area, microchipped);
    
    let catID;
    const sql = `
    
    INSERT INTO Cats (
      cname, 
      age, 
      aliases, 
      geographical_area, 
      microchipped, 
      chipID, 
      hlength,
      gender, 
      feral) 
      VALUES (
        :cname, 
        :age, 
        :cat_aliases, 
        :geographical_area, 
        :microchipped, 
        :chipID, 
        :hlength, 
        :gender, 
        :feral) 
        RETURN catID INTO :catID
      `
    
    const binds = { 
      cname,
      age, 
      cat_aliases, 
      geographical_area, 
      microchipped, 
      chipID, 
      hlength, 
      gender, 
      feral,
      catID: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
    }; 
    const result = await connection.execute(sql, binds, { autoCommit: true });
    console.log(result.rowsAffected + ' row(s) inserted');
    if (result.rowsAffected > 0) {
      console.log('Cat saved to the database:', result.rowsAffected + ' row(s) inserted');
      //retrieve catID and send it back in response
      sqlGetCatID = `
      SELECT catID FROM Cats WHERE 
        cname = :cname AND 
        age = :age AND 
        aliases = :cat_aliases AND 
        geographical_area = :geographical_area AND 
        microchipped = :microchipped AND 
        chipID = :chipID AND 
        hlength = :hlength 
      `
      if (result.outBinds && result.outBinds.catID) {
        const newCatID = result.outBinds.catID[0]; // Extract the catID from the output bind variable
        console.log('Cat saved to the database with catID:', newCatID);
        // Now you have the new catID, you can use it for further processing
        return newCatID;
      }
    
      //call addCatHealth function
    }
  } catch (error) {
      console.error('Error creating cat:', error.message);
      throw error; // You might want to handle the error differently based on your application logic
  }

}

router.post('/addcat/photo', upload.single('photo'), async (req, res) => {
  try { 

    const { catID } = req.body;
    const uploadedPhoto = req.file;
    const path = uploadedPhoto.path;

    console.log("req.file:", req.file, ' & catID: ', catID, ' & path:', path);

    if (catID && uploadedPhoto) {
      await addCatPhotos(catID, uploadedPhoto, path);    
    } else {
      console.error('Invalid catID or photo');
      res.status(400).json({ error: 'Invalid catID or photo' });
    }
    
    res.status(200).json({ message: 'Photo added successfully!' });

  } catch (error) {
    console.error('Error adding photo in post to /addcat/photo:', error.message);
    // Send an error response
    res.status(500).json({ error: 'Failed to add photo. Please try again.' });
  }
});


async function addCatPhotos(catID, photo, path) {
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);

    const photoContent = fs.readFileSync(photo.path);

    console.log('catID:', catID, ' & photo:', photoContent, ' & path:', path);
    const sql = `
    INSERT INTO CatPhotos (photo, path, catID) VALUES (:photo, :path, :catID)
    `
    const binds = {
      photo: { val: photoContent, type: oracledb.BLOB  },
      path: path, // Access path from req.file
      catID: { val: catID, type: oracledb.NUMBER } // Use catID passed from the request body
    };
    const result = await connection.execute(sql, binds, { autoCommit: true });
    if (result.rowsAffected > 0) {
      console.log('Photo saved to the database:', result.rowsAffected + ' row(s) inserted: ', result.rowsAffected[0]);
    }
  } catch (error) {
      console.error('Error adding photo in addCatPhotos:', error.message);
      throw error; // You might want to handle the error differently based on your application logic
  }
}


router.get('/users', async (req, res) => {
  let connection;

  try {
    connection = await oracledb.getConnection(dbConfig);

    const result = await connection.execute(
      `SELECT * FROM Users`
    );

    const caretakers = result.rows;

    res.json({ caretakers });
  } catch (error) {
    console.error('Error retrieving caretakers:', error);
    res.status(500).send('Internal Server Error');
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (error) {
        console.error('Error closing database connection:', error);
      }
    }
  }
});

async function userExists(email) {
  let connection;

  try {
    connection = await oracledb.getConnection(dbConfig);

    // Prepare the SQL query
    const query = `
      SELECT * FROM Users WHERE email = :email
    `;

    // Bind parameters for the query
    const bindParams = {
      email,
    };

    // Execute the query
    const result = await connection.execute(query, bindParams);
    // Check if the query returned any rows
    if (result.rows.length > 0) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error('Error checking user existence:', error);
    throw error; // You might want to handle the error differently based on your application logic
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (error) {
        console.error('Error closing database connection:', error.message);
      }
    }
  }
}

async function saveUserToDatabase(email, pw) {
    let connection;
  
    try {
      // Establish a connection to the database
      connection = await oracledb.getConnection(dbConfig);

      //TODO: check if user exists (by email)
      
      // Prepare the SQL statement
      

      const sql = 'INSERT INTO Users (email, pw) VALUES (:email, :pw)';
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

async function authenticateUser(email, pw) {
  let connection;
  console.log("password:", pw);
  try {
    // Connect to the Oracle database
    connection = await oracledb.getConnection(dbConfig);
    //Execute a query to find the user with the given email and password
    

    const sql = `SELECT * FROM Users WHERE email = :email`;
    const binds = { email };
    
    // Execute the SQL statement
    const result = await connection.execute(sql, binds, { autoCommit: true });
    
    //const binds = { email, pw};
  
    // Execute the SQL statement
    //const result = await connection.execute(sql, binds, { autoCommit: true });

    // Check if the query returned a user
    
    
    if (result.rows.length > 0) {
      // User found
      const user = result.rows[0];
      if (await passwordsMatch(pw, user[3])) {
        console.log("passwords match");
        console.log('Authentication successful:', user[1]);
        return { success: true, userId: user.ID };
      }
    
      
    } else {
      // Authentication failed
      return { success: false, error: 'Invalid email or password' };
    }
  } catch (error) {
    console.error('Error authenticating user:', error.message);
    return { success: false, message: 'An error occurred during authentication' };
  } finally {
    // Release the database connection
    if (connection) {
      try {
        await connection.close();
      } catch (error) {
        console.error('Error closing database connection:', error.message);
      }
    }
  }
}

async function hashPassword(plainPassword) {
  try {
    // Generate a salt (a random value) and hash the password in one step
    const SALT = 4;
    const pw = await bcrypt.hash(plainPassword, SALT);

    // Return the hashed password along with the user ID
    return pw;
  } catch (err) {
    console.error('Error hashing password:', err);
    // You might want to throw an error or handle it differently based on your application logic
    return null;
  }
}

async function passwordsMatch(candidatePassword, hashedPassword) {
  try {
    const match = await bcrypt.compare(candidatePassword, hashedPassword);
    return match;
  } catch (error) {
    console.error('Error comparing passwords:', error);
    throw error; // You might want to handle the error differently based on your application logic
  }
}

  
module.exports = router;