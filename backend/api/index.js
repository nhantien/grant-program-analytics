const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

const app = express();

const whitelist = ["http://localhost:3000"];
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error("Not allowed by CORS"))
    }
  },
  credentials: true,
};
app.use(cors(corsOptions));

const port = 3001;

const connection = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
});

const query = 'SELECT * FROM Projects';

app.get('/', (req, res) => {
    connection.promise().query(query)
        .then(([rows, fields]) => {
            console.log('Query results:', rows);
            res.end(JSON.stringify(rows));
        });
});

app.listen(port, ()=> {
    console.log(`Server is listening at http://localhost:${port}`);
});