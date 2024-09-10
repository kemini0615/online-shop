/**
 * More Information
 * express-session : https://www.npmjs.com/package/express-session
 * connect-mongodb-session : https://www.npmjs.com/package/connect-mongodb-session
 */
const session = require("express-session")
const mongoDBSession = require("connect-mongodb-session");

function createSessionStore() {
  const MongoDBStore = mongoDBSession(session);

  const store = new MongoDBStore({
    uri: "mongodb://127.0.0.1:27017",
    databaseName: "online-shop",
    collection: "sessions"
  });

  return store;
}

function createSessionConfig() {
  return {
    secret: "password",
    resave: false,
    saveUninitialized: false,
    store: createSessionStore(),
    cookie: {
      maxAge: 2 * 24 * 60 * 60 * 1000
    }
  };
}

module.exports = createSessionConfig;