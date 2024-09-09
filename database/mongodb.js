const mongodb = require("mongodb");

let database;

async function connectToDatabase() {
  const client = await mongodb.MongoClient.connect("mongodb://127.0.0.1:27017");
  database = client.db("online-shop");
}

function getDatabase() {
  if (!database) {
    throw new Error();
  }

  return database;
}

module.exports = {
  connectToDatabase: connectToDatabase,
  getDatabase: getDatabase
}
