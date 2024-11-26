const mongodb = require("mongodb");

let database;

async function connectToDatabase() {
  const client = await mongodb.MongoClient.connect(process.env.MONGODB_URL);
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
  getDatabase: getDatabase,
};
