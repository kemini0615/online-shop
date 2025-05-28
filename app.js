const path = require("path");

const express = require("express");
const csrf = require("csurf");
const session = require("express-session");

const baseRouter = require("./routes/base-routes");
const authRouter = require("./routes/auth-routes");
const productRouter = require("./routes/product-routes");
const adminRouter = require("./routes/admin-routes");
const cartRouter = require("./routes/cart-routes");
const orderRouter = require("./routes/order-routes");

const mongodb = require("./database/mongodb");
const addCsrfToken = require("./middlewares/addCsrfToken");
const handleErrors = require("./middlewares/handleErrors");
const checkAuthStatus = require("./middlewares/checkAuthStatus");
const protectResources = require("./middlewares/protectResources");
const createCart = require("./middlewares/createCart");
const updateCart = require("./middlewares/updateCart");
const handleNotFound = require("./middlewares/handleNotFound");

const createSessionConfig = require("./config/session-config");

// express() 함수를 호출해서 새로운 Express 앱 객체를 생성합니다.
// 이 'app' 객체를 통해 모든 서버 설정을 하게 됩니다.
const app = express();

// 뷰 엔진(View Engine)으로 EJS를 사용하겠다고 설정합니다.
app.set("view engine", "ejs");

// 뷰 파일(EJS 파일)들이 모여있는 폴더를 'views'로 지정합니다.
// path.join(__dirname, "views")는 현재 파일(app.js)이 있는 폴더 안에 있는 'views' 폴더의 절대 경로를 만들어줍니다.
app.set("views", path.join(__dirname, "views"));

// 'public' 폴더에 있는 정적 파일(CSS, JavaScript, 이미지 등)을 클라이언트가 직접 접근할 수 있도록 합니다.
// 예를 들어, http://example.com/css/style.css 요청이 오면 'public/css/style.css' 파일을 찾아 보내줍니다.
app.use(express.static("public"));

// '/products/assets' 라는 URL 경로로 요청이 올 때, 실제로는 'data' 폴더의 정적 파일을 제공합니다.
// 예를 들어, http://example.com/products/assets/image.jpg 요청이 오면 'data/image.jpg' 파일을 찾아 보내줍니다.
app.use("/products/assets", express.static("data"));

// 클라이언트의 'form 데이터'를 파싱할 수 있게 해줍니다.
app.use(express.urlencoded({ extended: false }));

// 클라이언트의 'json 데이터'를 파싱할 수 있게 해줍니다.
app.use(express.json());

// 요청에 세션 쿠키가 포함됐다면 session() 미들웨어가 세션 쿠키를 확인하고 세션 데이터를 가져온다.
// 요청에 세션 쿠키가 포함되지 않았다면 새로운 세션이 생성되고, 세션 ID를 클라이언트에게 전달한다.
const sessionConfig = createSessionConfig();
app.use(session(sessionConfig));

app.use(checkAuthStatus);

app.use(createCart);
app.use(updateCart);

app.use(csrf());
app.use(addCsrfToken);

app.use(baseRouter);
app.use(authRouter);
app.use(productRouter);
app.use("/cart", cartRouter);
app.use("/orders", protectResources, orderRouter);
app.use("/admin", protectResources, adminRouter);

app.use(handleNotFound);
app.use(handleErrors);

mongodb
  .connectToDatabase()
  .then(() => {
    app.listen(process.env.PORT);
  })
  .catch((err) => {
    console.log("Failed to connect to DB.");
    console.log(err);
  });
