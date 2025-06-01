const path = require("path");

const express = require("express");
const session = require("express-session");
const csrf = require("csurf");

const sessionConfig = require("./config/session-config");

const authenticate = require("./middlewares/authenticate");
const createCart = require("./middlewares/createCart");
const updateCart = require("./middlewares/updateCart");
const addToken = require("./middlewares/addToken");

const baseRouter = require("./routes/base-routes");
const authRouter = require("./routes/auth-routes");
const productRouter = require("./routes/product-routes");
const adminRouter = require("./routes/admin-routes");
const cartRouter = require("./routes/cart-routes");
const orderRouter = require("./routes/order-routes");

const handleErrors = require("./middlewares/handleErrors");
const protectResources = require("./middlewares/protectResources");
const handleNotFound = require("./middlewares/handleNotFound");

const mongodb = require("./database/mongodb");

// express() 함수를 호출해서 새로운 Express 앱 객체를 생성한다.
const app = express();

// 뷰 엔진(View Engine)으로 EJS를 설정한다.
app.set("view engine", "ejs");

// 뷰 파일(EJS 파일)들이 모여있는 폴더를 'views'로 설정한다.
app.set("views", path.join(__dirname, "views"));

// 'public' 폴더에 있는 정적 파일(CSS, JavaScript, 이미지 등)을 클라이언트가 직접 접근할 수 있도록 한다.
// 예를 들어, http://example.com/css/style.css 요청이 오면 'public/css/style.css' 파일을 찾아 응답으로 보낸다.
app.use(express.static("public"));

// '/products/assets' 라는 URL 경로로 요청이 올 때, 실제로는 'data' 폴더의 정적 파일을 제공한다다
// 예를 들어, http://example.com/products/assets/image.jpg 요청이 오면 'data/image.jpg' 파일을 찾아 응답으로 보낸다.
app.use("/products/assets", express.static("data"));

// 클라이언트의 'form 데이터'를 파싱할 수 있게 만든다.
app.use(express.urlencoded({ extended: false }));

// 클라이언트의 'json 데이터'를 파싱할 수 있게 만든다.
app.use(express.json());

// 세션을 시작한다.
// req.session 객체를 활성화한다.
app.use(session(sessionConfig));

// 유저의 로그인 상태를 확인한다.
app.use(authenticate);

// 유저의 장바구니를 생성한다.
app.use(createCart);
// 장바구니를 최신 상태로 유지한다.
app.use(updateCart);

// POST, PUT, PATCH, DELETE 등의 요청이 왔을 때, CSRF 토큰이 존재하지 않는다면 에러를 발생시킨다.
app.use(csrf());
// CSRF 토큰을 생성해서 유저에게 전달한다.
app.use(addToken);

app.use(baseRouter);
app.use(authRouter);
app.use(productRouter);
app.use("/cart", cartRouter);
app.use("/orders", protectResources, orderRouter);
app.use("/admin", protectResources, adminRouter);

app.use(handleNotFound);
app.use(handleErrors);

mongodb
  .initDB()
  .then(() => {
    app.listen(process.env.PORT);
  })
  .catch((err) => {
    console.log("DB 연결에 실패했습니다.");
    console.log(err);
  });
