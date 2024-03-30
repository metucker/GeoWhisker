const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const router = require('./routes/router');
const oracledb = require('oracledb');
require('dotenv').config();

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended:false}));

const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
    optionSuccessStatus: 200
}

const config = {
    user: process.env.DB_USER, 
    password: process.env.DB_PW, 
    connectString: process.env.DB_URI
}

app.use(cors(corsOptions));
app.use('/', router);

oracledb.getConnection(config, (err, connection) => {
    if (err) {
      console.error('Error connecting to Oracle:', err.message);
      return;
    } else {
        console.log('Connected to Oracle');
    }
  
    // Perform database operations here
  
    connection.close((err) => {
      if (err) {
        console.error('Error closing Oracle connection:', err.message);
      }
    });
  });

const port = process.env.PORT || 4000;
const server = app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});

