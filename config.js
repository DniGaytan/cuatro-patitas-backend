exports.DATABASE_URL = process.env.DATABASE_URL || "mongodb://localhost/cuatro-patitas-backend";
exports.PORT = process.env.PORT || 8080;
exports.JWTTOKEN = process.env.JWTTOKEN || "secret";
exports.JWTEXPIRATION = process.env.JWTEXPIRATION || 60;