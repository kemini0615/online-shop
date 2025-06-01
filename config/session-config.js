const session = require("express-session");
const connectMongoDBSession = require("connect-mongodb-session"); // 세션 데이터를 MongoDB에 저장할 수 있게 해주는 라이브러리입니다.

function createStore() {
  const MongoDBStore = connectMongoDBSession(session);

  const store = new MongoDBStore({
    uri: "mongodb://127.0.0.1:27017",
    databaseName: "online-shop",
    collection: "sessions",
  });

  return store;
}

module.exports = {
  // 세션 쿠키(세션 ID)를 해싱하는 데 사용되는 비밀 키입니다.
  secret: "password",
  // 세션 데이터(req.session)에 변경 사항이 없더라도, 매 요청마다 세션 데이터를 강제로 세션 저장소에 다시 저장할지 여부를 결정합니다. 보통 false로 설정합니다.
  resave: false,
  // 초기화되지 않은 세션 데이터(req.session)를 세션 저장소에 저장할지 여부를 결정합니다. 보통 false로 설정합니다.
  saveUninitialized: false,
  // 세션 데이터를 저장할 저장소입니다. 위에서 만든 MongoDB 저장소를 사용합니다.
  store: createStore(),
  cookie: {
    maxAge: 2 * 24 * 60 * 60 * 1000,
  },
};
