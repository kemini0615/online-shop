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
const checkAdminStatus = require("./middlewares/checkAdminStatus");
const createCart = require("./middlewares/createCart");

const createSessionConfig = require("./config/session-config");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views")); // __dirname is a path to this project directory

app.use(express.static("public")); // static middleware handles requrests for static files such as css or js within 'public' directory
app.use("/products/assets", express.static("data")); // can hide project structure from users
app.use(express.urlencoded({ extended: false })); // urlencoded middleware parses request body so that we can use form data
app.use(express.json()); // urlencoded middleware is just for html-based requests, not for ajax requests

/**
 * If a session cookie is included within the request, the session middleware checks the cookie and retrieves the corresponding session data from the server
 * If there is no session cookie, a new session is created, and a unique session ID is assigned and sent to the client as a cookie
 */
const sessionConfig = createSessionConfig();
app.use(session(sessionConfig)); // session middleware checks a session cookie which is sent along with the request

app.use(createCart); // initializeCart middleware creates cart model on sessions


app.use(csrf()); // csrf middleware denys POST requests which do not have csrf token
app.use(addCsrfToken); // addCsrfToken middleware adds and gives csrf token to clients

app.use(baseRouter);
app.use(authRouter);
app.use(productRouter);
app.use("/cart", cartRouter); // filters requests only which have path starting '/cart'

app.use(checkAuthStatus); // checkAuthStatus middleware checks if an user is logged in or not
app.use("/order", orderRouter); // filters requests only which have path starting '/order'

app.use(checkAdminStatus); // checkAminStatus middleware denys if you are not an administrator
app.use("/admin", adminRouter); // filters requests only which have path starting '/admin'

app.use(handleErrors); // handleErrors middleware handles errors

mongodb
  .connectToDatabase()
  .then(() => {
    app.listen(3000);
  })
  .catch((err) => {
    console.log("Failed to connect to DB.");
    console.log(err);
  });
