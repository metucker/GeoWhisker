require('dotenv').config();

module.exports.dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PW,
    connectString: process.env.DB_URI
};
