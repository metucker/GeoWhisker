const express = require('express');
const router = express.Router();
const oracledb = require('oracledb');
const { dbConfig } = require('../dbConfig');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const { serialize } = require('cookie');
const multer = require('multer');
const fs = require('fs');
const crypto = require('crypto');
const cookieParser = require('cookie-parser');

//const schemas = require('../models/schemas'); //UNCOMMENT THIS LINE WHEN USING THE SCHEMAS FILE

// Middleware to parse JSON in the request body
router.use(bodyParser.json());
router.use(cookieParser());
// Parse application/x-www-form-urlencoded
router.use(bodyParser.urlencoded({ extended: false }));
const upload = multer({ dest: 'uploads/' });

// Authentication middleware
const authenticateUser = async (req, res, next) => {
  const sessionToken = req.cookies.geowhisker; // Assuming the cookie name is 'geowhisker'
  console.log("sessionToken:", sessionToken);

  if (!sessionToken) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    // Verify session token against database
    const user = await verifySession(sessionToken); // Implement this function to verify the session token

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Attach the user object to the request for further processing if needed
    req.user = user;

    next(); // Continue to the next middleware
  } catch (error) {
    console.error('Error authenticating user:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

router.post('/addfavorites/:catID', async (req, res) => { 
  const { catID } = req.params;
  const { userID }= await getSessionUserID(req.cookies.geowhisker);

  try {
    // Get a connection from the pool
    const connection = await oracledb.getConnection(dbConfig);

    // Execute the query to check if the cat is favorited
    const result = await connection.execute(
      `INSERT INTO Favorites (catID, userID) VALUES (:catID, :userID)`,
      {
        catID,
        userID 
      }
    );
    
    const isFavorited = result.rowsAffected > 0;

    console.log(isFavorited ? 'Cat added to favorites' : 'Cat not added to favorites');

    // Send the response
    res.json({ isFavorited });

    // Release the connection
    await connection.close();
    } catch (error) {
      console.error('Error added cat to favorites:', error);
      res.status(500).json({ error: 'An internal server error occurred' });
    }

});

router.get('/favorites/:catID', async (req, res) => {
  const { catID } = req.params;
  const { userID }= await getSessionUserID(req.cookies.geowhisker);

  try {
    // Get a connection from the pool
    const connection = await oracledb.getConnection(dbConfig);

    // Execute the query to check if the cat is favorited
    const result = await connection.execute(
      `SELECT COUNT(*) AS count FROM Favorites WHERE catID = :catID AND userID = :userID`,
      {
        catID,
        userID 
      }
    );

    // Check if the cat is favorited by the user
    const isFavorited = result.rows[0].count > 0;

    if (isFavorited) {
      console.log('Cat is favorited by the user');
    } else {
      console.log('Cat is not favorited by the user');
    }

    // Send the response
    res.json({ isFavorited });

    // Release the connection
    await connection.close();
  } catch (error) {
    console.error('Error retrieving favorites:', error);
    res.status(500).json({ error: 'An internal server error occurred' });
  }
});


// Example of a gated endpoint
router.get('/session', authenticateUser, (req, res) => {
  // If the execution reaches here, it means the user is authenticated
  res.json({ message: 'Welcome to the gated page!' });
});

async function createSession(userID, token) {
  let connection;

  console.log("\n BEFORE createSession!!!     userID:", userID, " & token:", token)

  try {
    connection = await oracledb.getConnection(dbConfig);

    // Generate a random session token
    // const hashedToken = await bcrypt.hash(token, 10);
    const hashedToken = token;

    // Prepare the SQL query
    const query = `
      INSERT INTO Sessions (userID, token) VALUES (:userID, :token)
    `;

    // Bind parameters for the query
    const bindParams = {
      userID,
      token: hashedToken,
    };

    // Execute the query
    const result = await connection.execute(query, bindParams, { autoCommit: true });
    console.log('\nSession inserted successfully: ', result.lastRowid);
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

async function verifySession(sessionToken) {
  let connection;

  try {
    connection = await oracledb.getConnection(dbConfig);

    // await bcrypt.compare(sessionToken, hashedToken, (err, res) => {});

    // Prepare the SQL query
    const query = `
      SELECT userID FROM Sessions WHERE token = :token
    `;

    // Bind parameters for the query
    const bindParams = {
      token: sessionToken,
    };

    console.log("\n ATTEMPTING TO VERIFY THIS SESSIONS: ", sessionToken);

    // Execute the query
    const result = await connection.execute(query, bindParams);

    // Check if a session was found
    if (result.rows.length === 1) {
      // Session found, return the user ID
      console.log("\nSession verified successfully!");
      return true; // Assuming the first column contains the user ID
    } else {
      // No session found with the given token
      console.log("\nSession unverified; access denied!");

      return false;
    }
  } catch (error) {
    console.error('Error verifying session:', error);
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
      console.log("User ID retrieved successfully via Email!");
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

async function getSessionUserID(token) {
  let connection;

  try {
    connection = await oracledb.getConnection(dbConfig);

    // Prepare the SQL query
    const query = `
    SELECT userID FROM SESSIONS WHERE token = :token
    `;

    // Bind parameters for the query
    const bindParams = {
      token: token,
    };

    // Execute the query
    const result = await connection.execute(query, bindParams);
    // Check if the query returned any rows
    if (result.rows.length > 0) {
      console.log("User ID retrieved successfully via Session!");
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

async function generateRandomToken(length) {
  return crypto.randomBytes(Math.ceil(length / 2)).toString('hex').slice(0, length);
}

async function setCookie(email) {
  try {
    // Generate a random session token
    const userID = await getUserID(email);
    // Create a new session in the database and get the session ID
    const token = await generateRandomToken(16); // Generate a random token of length 16
    //const sessionID = await createSession(userID, token); // Replace 'some_random_token' with an actual token if needed

    // Set the session ID in a cookie
    const cookieOptions = {
      maxAge: 3600, // 1 hour in seconds
      expires: new Date(Date.now() + 3600000), // 1 hour from now
      domain: 'localhost',
      path: '/',
      secure: true,
      httpOnly: true,
      sameSite: 'lax'
    };
    const cookieString = serialize('geowhisker', token, cookieOptions); // Set the session ID in the cookie
    console.log("\nCookie set successfully:", cookieString);

    await createSession(userID, token); // Replace 'some_random_token' with an actual token if needed

    return cookieString;
  } catch (error) {
    console.error('Error setting session token:', error.message);
    throw error;
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
      isUserValid = await authorizeUser(email, pw);
      cookie = await setCookie(email);

      res.setHeader('Set-Cookie', cookie);
      console.log("C00O0o0o0o0o0o0o0OKIE:", cookie);
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
    if (result.rowsAffected > 0) {
      console.log('\nCat saved to the database:', result.rowsAffected + ' row(s) inserted');
      //retrieve catID and send it back in response
      // sqlGetCatID = `
      // SELECT catID FROM Cats WHERE 
      //   cname = :cname AND 
      //   age = :age AND 
      //   aliases = :cat_aliases AND 
      //   geographical_area = :geographical_area AND 
      //   microchipped = :microchipped AND 
      //   chipID = :chipID AND 
      //   hlength = :hlength 
      // `
      if (result.outBinds && result.outBinds.catID) {
        const newCatID = result.outBinds.catID[0]; // Extract the catID from the output bind variable
        console.log('\nCat saved to the database with catID:', newCatID);
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

    console.log('catID:', catID, ' & typeof photoContent and photo:', typeof photoContent, photoContent, ' & path:', path);
    
    const sql = `
    INSERT INTO CatPhotos (photo, path, catID) 
    VALUES (:photo, :path, :catID)
    RETURN photoID INTO :photoID
    `
    const binds = {
      photo: { val: photoContent,  type: oracledb.BUFFER},
      path: path, // Access path from req.file
      catID: catID,// Use catID passed from the request body
      photoID: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
    };
    const result = await connection.execute(sql, binds, { autoCommit: true });
    if (result.rowsAffected > 0) {
      
      if (result.outBinds && result.outBinds.photoID) {
        const newPhotoID = result.outBinds.photoID[0]; // Extract the catID from the output bind variable
        console.log('\nPhoto saved to the database with photoID:', newPhotoID);
        // Now you have the new catID, you can use it for further processing
        await updateProfilePhoto(connection, catID, newPhotoID);
      }
    }
  } catch (error) {
      console.error('Error adding photo in addCatPhotos:', error.message);
      throw error; // You might want to handle the error differently based on your application logic
  }
}

async function updateProfilePhoto(connection, catID, photoID) {
  const sql = `
    SELECT profPhotoID
    FROM ProfilePhotos
    WHERE catID = :catID
  `;
  const binds = { catID };
  const result = await connection.execute(sql, binds);
  if (result.rows.length > 0) {
    // Update existing profile photo entry
    const profPhotoID = result.rows[0].profPhotoID;
    const updateSql = `
      UPDATE ProfilePhotos
      SET photoID = :photoID
      WHERE profPhotoID = :profPhotoID
    `;
    const updateBinds = {
      photoID: photoID, // Assuming you have the photoID of the newly inserted photo
      profPhotoID: profPhotoID
    };
    await connection.execute(updateSql, updateBinds, { autoCommit: true });
  } else {
    // Insert new profile photo entry
    const insertSql = `
      INSERT INTO ProfilePhotos (catID, photoID) VALUES (:catID, :photoID)
    `;
    const insertBinds = {
      catID: catID,
      photoID: photoID
    };
    await connection.execute(insertSql, insertBinds, { autoCommit: true });
  }
}

router.get('/cats/:catID/photo', async (req, res) => {
  try {
    const catID = req.params.catID;

    // Fetch the photo data from the database based on the catID
    const photoData = await getCatPhoto(catID);

    // Check if photo data exists
    if (!photoData) {
      return res.status(404).json({ error: 'Photo not found' });
    }

    // Set the appropriate content type header for the response
    res.setHeader('Content-Type', 'image/jpeg');

    // Send the photo data in the response
    res.send(photoData);
  } catch (error) {
    console.error('Error fetching cat photo:', error.message);
    res.status(500).json({ error: 'Failed to fetch cat photo. Please try again.' });
  }
});

// Function to fetch cat photo data from the database
async function getCatPhoto(catID) {
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);

    // Query to fetch the photo data based on the catID
    const sql = `
      SELECT photo FROM CatPhotos WHERE catID = :catID
    `;
    const binds = { catID };

    // Execute the query
    const result = await connection.execute(sql, binds);

    // Check if photo data exists
    if (result.rows.length === 0) {
      return null;
    }

    // Return the photo data (assuming the photo column contains the binary photo data)
    return result.rows[0][0];
  } catch (error) {
    throw error;
  } finally {
    // Close the connection
    if (connection) {
      try {
        await connection.close();
      } catch (error) {
        console.error('Error closing database connection:', error.message);
      }
    }
  }
}

router.get('/cats', async (req, res) => {
  try {
    const connection = await oracledb.getConnection(dbConfig);

    const sql = `
      SELECT c.catID, c.cname, c.age, c.aliases, c.geographical_area, c.microchipped, c.chipID, c.hlength, c.gender, c.feral, p.photo
      FROM Cats c
      INNER JOIN ProfilePhotos pp ON c.catID = pp.catID
      INNER JOIN CatPhotos p ON pp.photoID = p.photoID
    `;

    const result = await connection.execute(sql);

    const cats = await Promise.all(result.rows.map(async row => {
      const photoBuffer = await row[10].getData();
      const base64String = photoBuffer.toString('base64');
    
      return {
        catID: row[0],
        cname: row[1],
        age: row[2],
        aliases: row[3],
        geographical_area: row[4],
        microchipped: row[5],
        chipID: row[6],
        hlength: row[7],
        gender: row[8],
        feral: row[9],
        photo: base64String
      };
    }));

    //console.log("RETRIEVED PHOTOS:", cats[0].photo)

    res.status(200).json(cats);
  } catch (error) {
    console.error('Error fetching cats:', error.message);
    res.status(500).json({ error: 'Failed to fetch cats. Please try again.' });
  }
});

router.get('/cat/:catID', async (req, res) => {
  try {
    const catID = req.params.catID;
    const connection = await oracledb.getConnection(dbConfig);

    const sql = `
      SELECT c.catID, c.cname, c.age, c.aliases, c.geographical_area, c.microchipped, c.chipID, c.hlength, c.gender, c.feral, p.photo
      FROM Cats c
      INNER JOIN ProfilePhotos pp ON c.catID = pp.catID
      INNER JOIN CatPhotos p ON pp.photoID = p.photoID
      WHERE c.catID = :catID
    `;

    const result = await connection.execute(sql, { catID: parseInt(catID) });

    const cat = await Promise.all(result.rows.map(async row => {
      const photoBuffer = await row[10].getData();
      const base64String = photoBuffer.toString('base64');
    
      return {
        catID: row[0],
        cname: row[1],
        age: row[2],
        aliases: row[3],
        geographical_area: row[4],
        microchipped: row[5],
        chipID: row[6],
        hlength: row[7],
        gender: row[8],
        feral: row[9],
        photo: base64String
      };
    }));

    console.log("RETRIEVED PHOTOS:", cat[0].photo)

    res.status(200).json(cat);
  } catch (error) {
    console.error('Error fetching cat:', error.message);
    res.status(500).json({ error: 'Failed to fetch cat. Please try again.' });
  }
});

// USERS

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

router.get('/user', async (req, res) => {
  let connection;

  try {
    connection = await oracledb.getConnection(dbConfig);

    const userID = await getSessionUserID(req.cookies.geowhisker);

    const binds = { userID };
    const sql = 'SELECT * FROM Users WHERE ID = :userID';

    const result = await connection.execute(sql, binds, { autoCommit: true });

    if (result.rows.length > 0) {
      console.log('\nUser retrieved successfully:', result.rows[0]);
      //res.json({ result });
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error retrieving user:', error);
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

router.put('/users/:userID', async (req, res) => {
  const userID = req.params.userID;
  const updatedUserData = req.body;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const binds = { id: userID, uname: this.name,  };
    const sql = 
    `
    UPDATE users
    SET
        uname = :uname,
        email = :email,
        feeder = :feeder,
        trapper = :trapper,
        catadmin = :catadmin
    WHERE
        id = userID`;
  
    const result = await connection.execute(sql, binds, { autoCommit: true });
    res.status(200).json({ message: 'User data updated successfully' });
  } catch (error) {
    console.error('Error updating user data:', error);
    res.status(500).json({ error: 'Failed to update user data' });
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
      
      console.log('\nUser saved to the database:', result.rowsAffected + ' row(s) inserted');
      
    } catch (error) {
      console.error('\nError saving user to the database:', error.message);
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

async function authorizeUser(email, pw) {
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
    
    if (result.rows.length > 0) {
      // User found
      const user = result.rows[0];
      console.log("hashed pw of user in db:", user.pw)
      if (await passwordsMatch(pw, user[5])) {
        console.log("\nPasswords match!",'Authentication successful:', user[1]);
        return { success: true, userId: user.ID };
      }
    
      
    } else {
      // Authentication failed
      return { success: false, error: 'Invalid email or password' };
    }
  } catch (error) {
    console.error('Error authorizing user:', error.message);
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