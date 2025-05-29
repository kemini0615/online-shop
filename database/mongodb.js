const mongodb = require("mongodb");

let db;

async function initDB() {
  const client = await mongodb.MongoClient.connect(process.env.MONGODB_URL);
  db = client.db("online-shop");
}

function getDB() {
  if (!db) {
    throw new Error();
  }

  return db;
}

module.exports = {
  initDB: initDB,
  getDB: getDB,
};
