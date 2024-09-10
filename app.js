const path = require("path");

const express = require("express");
const csrf = require("csurf");
const session = require("express-session");

const authRouter = require("./routes/auth-routes");
const mongodb = require("./database/mongodb");
const addCsrfToken = require("./middlewares/addCsrfToken");
const handleErrors = require("./middlewares/handleErrors");
const createSessionConfig = require("./config/session-config");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views")); // __dirname is a path to this project directory

app.use(express.static("public")); // static middleware handles requrests for static files such as css or js within 'public' directory
app.use(express.urlencoded({ extended: false })); // urlencoded middleware parses request body so that we can use form data

/**
 * If a session cookie is included within the request, the session middleware checks the cookie and retrieves the corresponding session data from the server
 * If there is no session cookie, a new session is created, and a unique session ID is assigned and sent to the client as a cookie
 */
const sessionConfig = createSessionConfig();
app.use(session(sessionConfig)); // session middleware checks a session cookie which is sent along with the request

app.use(csrf()); // csrf middleware denys POST requests which do not have csrf token
app.use(addCsrfToken); // addCsrfToken middleware adds and gives csrf token to clients

app.use(authRouter);

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
