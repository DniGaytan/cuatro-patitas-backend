const express = require("express");
const mongoose = require("mongoose");
const user = require('./routes/user');
const { DATABASE_URL, PORT } = require("./config");

const app = express();

app.use(user);

let server;
function runServer(port, DATABASE_URL) {
  return new Promise((resolve, reject) => {
    mongoose.connect(DATABASE_URL, (response) => {
      if (response) {
        return reject(response);
      } else {
        server = app
          .listen(port, () => {
            console.log("App is running on port " + port);
            resolve();
          })
          .on("error", (err) => {
            mongoose.disconnect();
            return reject(err);
          });
        server.timeout = 1000000;
      }
    });
  });
}

function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log("Closing the server");
      server.close((err) => {
        if (err) {
          return reject(err);
        } else {
          resolve();
        }
      });
    });
  });
}

runServer(PORT, DATABASE_URL).catch((err) => {
  console.log(err);
});

module.exports = { app, runServer, closeServer };