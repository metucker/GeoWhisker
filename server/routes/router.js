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
  const userID = await getSessionUserID(req.cookies.geowhisker);

  console.log('Favorite about to be added!!! catID:', catID, ' & userID:', userID);

  try {
    // Get a connection from the pool
    const connection = await oracledb.getConnection(dbConfig);

    // Execute the query to check if the cat is favorited
    const result = await connection.execute(
      `INSERT INTO Favorites (catID, userID) VALUES (:catID, :userID)`,
      {
        catID,
        userID: userID 
      }, { autoCommit: true }
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
  const  { catID } = req.params;
  const  userID = await getSessionUserID(req.cookies.geowhisker);

  try {
    // Get a connection from the pool
    const connection = await oracledb.getConnection(dbConfig);

    // Execute the query to check if the cat is favorited
    const result = await connection.execute(
      `SELECT COUNT(*) AS count FROM Favorites WHERE catID = :catID AND userID = :userID`,
      {
        catID,
        userID: userID 
      }
    );

    const count = result.rows[0][0];

    const isFavorited = count > 0;

    // Send the response
    res.json({ isFavorited });

    // Release the connection
    await connection.close();
  } catch (error) {
    console.error('Error retrieving favorites:', error);
    res.status(500).json({ error: 'An internal server error occurred' });
  }
});

router.get('/userfavorites', async (req, res) => {
  const  userID = await getSessionUserID(req.cookies.geowhisker);

  try {
    // Get a connection from the pool
    const connection = await oracledb.getConnection(dbConfig);

    // Execute the query to check if the cat is favorited
    const result = await connection.execute(
      `SELECT catID FROM Favorites WHERE userID = :userID`,
      {
        userID: userID
      }
    );

    // Check for result
    const favoriteCats = result.rows;

    if (favoriteCats) {
    
    } else {
      console.log('User is not currently following any cats');
    }

    // Send the response
    res.json({ favoriteCats });

    // Release the connection
    await connection.close();
  } catch (error) {
    console.error('Error retrieving favorites:', error);
    res.status(500).json({ error: 'An internal server error occurred' });
  }
});

router.get('/favoritelist', async (req, res) => {
  const userID = await getSessionUserID(req.cookies.geowhisker);

  try {
    const connection = await oracledb.getConnection(dbConfig);

    const result = await connection.execute(
      `SELECT catID FROM Favorites WHERE userID = :userID`,
      {
        userID: userID
      }
    );

    if (result.rows.length > 0) {
      const catIDs = result.rows.map(row => row[0]);
      console.log('Favorites exist:', catIDs);

      const cats = [];

      // Fetch details of each cat asynchronously
      await Promise.all(catIDs.map(async catID => {

        const sql = `
          SELECT c.catID, c.cname, c.age, c.aliases, c.geographical_area, c.microchipped, c.chipID, c.hlength, c.gender, c.feral, p.photo
          FROM Cats c
          LEFT JOIN ProfilePhotos pp ON c.catID = pp.catID
          LEFT JOIN CatPhotos p ON pp.photoID = p.photoID
          WHERE c.catID = :catID
        `;
    
        const catResult = await connection.execute(sql, { catID: parseInt(catID) });
    
        if (catResult.rows.length > 0) {
          const row = catResult.rows[0];
          const photoBuffer = row[10] ? await row[10].getData() : null;
          const base64String = photoBuffer ? photoBuffer.toString('base64') : null;

          const cat = {
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

          cats.push(cat);
          console.log('Cat added to favorites:', cat.catID);
        } else {
          console.log('No favorite cats found for ID:', catID);
        }
         
      }));

      await connection.close();
      
      res.status(200).json(cats);

    } else {
      console.log('No favorite cats found');
      res.json({ cats: [] }); // Send an empty array if no cats found
    }

  } catch (error) {
    console.error('Error retrieving favorites:', error);
    res.status(500).json({ error: 'An internal server error occurred' });
  }
});

// Gated endpoint
router.get('/session', authenticateUser, (req, res) => {
  // If the execution reaches here, it means the user is authenticated
  res.json({ message: 'Welcome to the gated page!' });
});

async function createSession(userID, token) {
  let connection;

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
      console.log("User ID retrieved successfully via Session!", result.rows[0][0]);
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
        
        // Save the user data to the database if they don't already exist
        if (await userExists(email)) {
          console.log('User already exists. Please log in or use a different email.');
          throw error('User already exists. Please log in or use a different email.');
        } else {
          await saveUserToDatabase(email, await hashPassword(pw));
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
  console.log('USER ID RECEIVED from AddCat.js: ', await getSessionUserID(req.cookies.geowhisker));

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

    const catID = await createCat(req);
     
    // Send a success response
    console.log('catID to be sent back: ', catID);
    res.status(200).json({ catID, message: 'Cat added successfully!' });
  } catch (error) {
      console.error('Error adding cat:', error.message);
      // Send an error response
      res.status(500).json({ error: 'Failed to add cat. Please try again.' });
    }
});

async function createCat(req) {
  let connection;
  console.log("reqBody:", req.body.photo);
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
    }  = req.body;
    console.log("Correct data:", cname, age, cat_aliases, geographical_area, microchipped);
    console.log("ID of user creating this kitty cat: ", await getSessionUserID(req.cookies.geowhisker))
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
      feral,
      userID) 
      VALUES (
        :cname, 
        :age, 
        :cat_aliases, 
        :geographical_area, 
        :microchipped, 
        :chipID, 
        :hlength, 
        :gender, 
        :feral,
        :userID) 
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
      userID: await getSessionUserID(req.cookies.geowhisker),
      catID: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
    }; 

    const result = await connection.execute(sql, binds, { autoCommit: true });

    if (result.rowsAffected > 0) {
      console.log('\nCat saved to the database:', result.rowsAffected + ' row(s) inserted');
      
      if (result.outBinds && result.outBinds.catID) {
        const newCatID = result.outBinds.catID[0]; // Extract the catID from the output bind variable
        console.log('\nCat saved to the database with catID:', newCatID);
        // Now you have the new catID, you can use it for further processing
        return newCatID;
      }
    
      //call addCatHealth function
    }

    if (connection) {
      try {
        await connection.close();
      } catch (error) {
        console.error('Error closing database connection:', error.message);
      }
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

    if (connection) {
      try {
        await connection.close();
      } catch (error) {
        console.error('Error closing database connection:', error.message);
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
      const photoBuffer = row[10] ? await row[10].getData() : null;
      const base64String = photoBuffer ? photoBuffer.toString('base64') : null;
    
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
      LEFT JOIN ProfilePhotos pp ON c.catID = pp.catID
      LEFT JOIN CatPhotos p ON pp.photoID = p.photoID
      WHERE c.catID = :catID
    `;

    const result = await connection.execute(sql, { catID: parseInt(catID) });

    const cat = await Promise.all(result.rows.map(async row => {
      const photoBuffer = row[10] ? await row[10].getData() : null;
      const base64String = photoBuffer ? photoBuffer.toString('base64') : null;
    
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

    //console.log("RETRIEVED PHOTOS:", cat[0].photo)

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

async function updateUndefinedData(userID, updatedUserData) {
  try {
    // Fetch the original user data from the database
    const connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(
      `SELECT * FROM users WHERE ID = :userID`,
      [userID]
    );
    const row = result.rows[0];
    const originalUserData = ({
      ID: row[0],
      dateCreated: row[1],
      dateModified: row[2],
      email: row[3],
      uname: row[4],
      pw: row[5],
      feeder: row[6],
      trapper: row[7],
      catAdmin: row[8],
      blurb: row[9],
      displayPersonalInfo: row[10]
  });


    // Update updatedUserData with any undefined fields from the original user data
    for (let key in originalUserData) {
      if (originalUserData[key] !== null && !updatedUserData.hasOwnProperty(key)) {
        updatedUserData[key] = originalUserData[key];
      }
    }
  } catch (error) {
    console.error('Error updating undefined data:', error);
    // Handle error
  }
}

router.put('/users/:userID', async (req, res) => {
  const userID = req.params.userID;
  let updatedUserData = req.body;
  console.log("data ot update:", updatedUserData);

  await updateUndefinedData(userID, updatedUserData);

  //update dateModified
  updatedUserData.dateModified = new Date();

  console.log("complete data to update:", updatedUserData.uname);

  try {
    connection = await oracledb.getConnection(dbConfig);
    const binds = 
      { ID: userID, 
      uname: updatedUserData.uname, 
      email: updatedUserData.email, 
      feeder: updatedUserData.feeder, 
      trapper: updatedUserData.trapper, 
      catadmin: updatedUserData.catAdmin, 
      blurb: updatedUserData.blurb,
      displayPersonalInfo: updatedUserData.displayPersonalInfo
    };
    const sql = 
    `
    UPDATE users
    SET
        uname = :uname,
        email = :email,
        feeder = :feeder,
        trapper = :trapper,
        catAdmin = :catAdmin,
        blurb = :blurb,
        displayPersonalInfo = :displayPersonalInfo
    WHERE
        ID = :ID`;
    const result = await connection.execute(sql, binds, { autoCommit: true });
    console.log(result.rowsAffected + ' row(s) updated');
    res.status(200).json({ message: 'User data updated successfully' });
    console.log('User data updated successfully:', result.rowsAffected + ' row(s) updated');
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

router.post('/logout', (req, res) => {
  // Clear session data or invalidate token
  // For example, if using Express and express-session:
  try {
    // Extract user ID from the session cookie
    const userID = getSessionUserID(req.cookies.geowhisker);

    // Set the expiration time of the cookie to now
    res.cookie('geowhisker', '', { expires: new Date() });

    // Respond with a success message
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Error during logout:', error);
    res.status(500).json({ error: 'An internal server error occurred' });
  }
  
});

router.post('/cats/:catID/comments', async (req, res) => {

  try {
    const { catID } = req.params;
    const { ctitle, text, statusUpdate, question, urgent, helpNeeded } = req.body;
    const userID = await getSessionUserID(req.cookies.geowhisker);

    // Insert the new comment into the database
    const connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(
      `INSERT INTO comments (catID, userID, ctitle, cbody, statusUpdate, question, urgent, helpNeeded) 
      VALUES (:catID, :userID, :ctitle, :text, :statusUpdate, :question, :urgent, :helpNeeded)`,
     [catID, userID, ctitle, text, statusUpdate, question, urgent, helpNeeded],
      { autoCommit: true } // Commit the transaction immediately
    );

    // Check if the comment was successfully added
    if (result.rowsAffected !== 1) {
      return res.status(500).json({ error: 'Failed to add comment' });
    }

    res.status(201).json({ message: 'Comment added successfully' });

    await closeDbConnection(connection);

  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ error: 'An internal server error occurred' });
  }
});

router.get('/cats/:catID/comments', async (req, res) => {

  try {
    const { catID } = req.params;

    // Fetch the comments for the given cat ID
    const connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(
      `SELECT c.cbody, c.ctitle, c.statusUpdate, c.question, c.urgent, c.helpNeeded, c.dateCreated,
      u.ID AS userID, u.uname 
      FROM Comments c
      INNER JOIN Users u ON c.userID = u.id
      WHERE c.catID = :catID
      ORDER BY c.dateCreated DESC`,
      [catID]
    );

    // Send the comments in the response
    if (result.rows.length > 0) {
      const comments = result.rows.map(row => ({
        cbody: row[0],
        ctitle: row[1],
        statusUpdate: row[2],
        question: row[3],
        urgent: row[4],
        helpNeeded: row[5],
        dateCreated: row[6],
        userID: row[7],
        uname: row[8]
      }));
      res.json(comments);
    } else {
      res.json({ comments: [] });
    }

    await closeDbConnection(connection);

  }
  catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ error: 'An internal server error occurred' });
  }
});

router.get('/user/:userID', async (req, res) => { 

  try {
    const { userID } = req.params;

    // Fetch the user data for the given user ID
    const connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(
      `SELECT * FROM Users WHERE ID = :userID`,
      [userID]
    );

    // Send the user data in the response
    if (result.rows.length > 0) {
      const row = result.rows[0];
      const user = ({
        ID: row[0],
        dateCreated: row[1],
        dateModified: row[2],
        email: row[3],
        uname: row[4],
        pw: row[5],
        feeder: row[6],
        trapper: row[7],
        catAdmin: row[8],
        blurb: row[9],
        displayPersonalInfo: row[10]
    });
      res.json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }

    await closeDbConnection(connection);
    
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'An internal server error occurred' });
  }
});

async function closeDbConnection(connection) {
  if (connection) {
    try {
      await connection.close();
    } catch (error) {
      console.error('Error closing database connection:', error.message);
    }
  }
}
  
module.exports = router;