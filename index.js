const express = require("express");
const DBConnection = require('./dbconnection.js');
const user = require('./routes/user');
const { DATABASE_URL, PORT } = require("./config");

const app = express();

app.use('/user', user);

let server;
dbconnection = new DBConnection.DBConnection(server);
dbconnection.runServer(app).catch((err) => {
  console.log(err);
});

module.exports = {app};