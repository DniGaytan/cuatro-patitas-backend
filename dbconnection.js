const { DATABASE_URL, PORT } = require("./config");
const mongoose = require('mongoose');

class DBConnection {

  constructor(server){
    this.server = server;
  }

  runServer(app) {
    return new Promise((resolve, reject) => {
      mongoose.connect(DATABASE_URL, (response) => {
        if (response) {
          return reject(response);
        } else {
          this.server = app
            .listen(PORT, () => {
              console.log("App is running on port " + PORT);
              resolve();
            })
            .on("error", (err) => {
              mongoose.disconnect();
              return reject(err);
            });
          this.server.timeout = 1000000;
        }
      });
    });
  }

  closeServer(server) {
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
}

module.exports = {
    DBConnection,
}